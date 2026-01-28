import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Track {
  id: string;
  title: string;
  duration: number;
  artistId?: string; // Deprecated: mantido para compatibilidade
  artistIds?: string[]; // Novo: suporta múltiplos artistas
  releaseDate?: string;
  audioUrl?: string;
  tag?: 'unreleased' | 'tbd' | 'dubplate' | 'exclusive' | 'premiere' | null;
}

export interface SocialLink {
  name: string; // e.g., "Instagram", "SoundCloud", "Beatport", etc.
  url: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  bioEn?: string; // Bio in English
  bioEs?: string; // Bio in Spanish
  genre: string;
  image: string; // Profile image
  imageUrl?: string; // Manter compatibilidade
  country: string;
  socialLinks: SocialLink[]; // Dynamic unlimited social links
  gallery?: string[]; // Gallery images (up to 15)
  tracks: Track[]; // Tracks aninhadas
}

export interface Release {
  id: string;
  trackId: string;
  artistId: string;
  artistName?: string; // Enriquecido no hook
  title: string;
  coverUrl: string;
  releaseDate: string;
  links: {
    spotify?: string;
    appleMusic?: string;
  };
}

export function useFirestoreArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Expor função de refresh para forçar recarga
  const refresh = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    if (!db) {
      setError('Firebase not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);

    // Listener em tempo real para artistas - atualiza automaticamente
    const unsubscribe = onSnapshot(
      collection(db, 'artists'),
      async (artistsSnapshot) => {
        try {
          const artistsRaw = artistsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Buscar tracks e releases
          const [tracksSnapshot, releasesSnapshot] = await Promise.all([
            getDocs(collection(db, 'tracks')),
            getDocs(query(collection(db, 'releases'), orderBy('releaseDate', 'desc')))
          ]);

          const tracksData = tracksSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Track[];
          
          const releasesData = releasesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Release[];

          // Map de tracks por artistId
          const tracksByArtist = tracksData.reduce((acc, track) => {
            const artistIds = track.artistIds || (track.artistId ? [track.artistId] : []);
            artistIds.forEach(artistId => {
              if (!acc[artistId]) {
                acc[artistId] = [];
              }
              acc[artistId].push(track);
            });
            return acc;
          }, {} as Record<string, Track[]>);

          // Map de artistas por ID
          const artistsById = artistsRaw.reduce((acc, artist: any) => {
            acc[artist.id] = artist;
            return acc;
          }, {} as Record<string, any>);

          // Enriquecer artistas com tracks
          const artistsData = artistsRaw.map((artist: any) => {
            const imageUrl = artist.image || artist.imageUrl || '';
            console.log(`Artist ${artist.name}: image field =`, artist.image, 'imageUrl field =', artist.imageUrl);
            return {
              ...artist,
              image: imageUrl,
              tracks: tracksByArtist[artist.id] || []
            };
          }) as Artist[];

          // Enriquecer releases com artistName
          const enrichedReleases = releasesData.map(release => {
            const artist = artistsById[release.artistId];
            return {
              ...release,
              artistName: artist?.name || 'Unknown Artist'
            };
          });

          setArtists(artistsData);
          setTracks(tracksData);
          setReleases(enrichedReleases);
          setError(null);
          setLoading(false);
        } catch (err) {
          console.error('Error processing Firestore data:', err);
          setError('Failed to process data');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to Firestore:', err);
        setError('Failed to load data from database');
        setLoading(false);
      }
    );

    // Cleanup: desinscrever do listener quando o componente desmontar
    return () => unsubscribe();
  }, [refreshKey]); // Re-executar quando refreshKey mudar

  return { artists, tracks, releases, loading, error, refresh };
}
