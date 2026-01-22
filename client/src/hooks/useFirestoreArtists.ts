import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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

  useEffect(() => {
    async function fetchData() {
      if (!db) {
        setError('Firebase not initialized');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Buscar artistas
        const artistsSnapshot = await getDocs(collection(db, 'artists'));
        const artistsRaw = artistsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Buscar tracks (sem orderBy para pegar todas, independente dos campos)
        const tracksSnapshot = await getDocs(collection(db, 'tracks'));
        const tracksData = tracksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Track[];
        
        // Buscar releases
        const releasesSnapshot = await getDocs(
          query(collection(db, 'releases'), orderBy('releaseDate', 'desc'))
        );
        const releasesData = releasesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Release[];
        
        // Otimização: Criar maps para lookups O(1) em vez de filter/find O(n)
        
        // Map de tracks por artistId - O(n) - suporta artistId (antigo) e artistIds (novo)
        const tracksByArtist = tracksData.reduce((acc, track) => {
          // Suportar tanto artistIds (novo) quanto artistId (antigo)
          const artistIds = track.artistIds || (track.artistId ? [track.artistId] : []);
          
          artistIds.forEach(artistId => {
            if (!acc[artistId]) {
              acc[artistId] = [];
            }
            acc[artistId].push(track);
          });
          
          return acc;
        }, {} as Record<string, Track[]>);
        
        // Map de artistas por ID - O(n)
        const artistsById = artistsRaw.reduce((acc, artist: any) => {
          acc[artist.id] = artist;
          return acc;
        }, {} as Record<string, any>);
        
        // Aninhar tracks nos artistas com lookup O(1) - total O(n)
        const artistsData = artistsRaw.map((artist: any) => ({
          ...artist,
          image: artist.imageUrl || artist.image || '',
          tracks: tracksByArtist[artist.id] || []
        })) as Artist[];
        
        // Enriquecer releases com artistName usando lookup O(1) - total O(n)
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
      } catch (err) {
        console.error('Error fetching Firestore data:', err);
        setError('Failed to load data from database');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { artists, tracks, releases, loading, error };
}
