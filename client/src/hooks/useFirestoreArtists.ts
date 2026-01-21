import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Track {
  id: string;
  title: string;
  duration: number;
  artistId?: string;
  releaseDate?: string;
  audioUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  genre: string;
  image: string; // Renomeado de imageUrl para image
  imageUrl?: string; // Manter compatibilidade
  country: string;
  socialLinks: {
    spotify?: string;
    soundcloud?: string;
    instagram?: string;
    appleMusic?: string;
  };
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
        
        // Buscar tracks
        const tracksSnapshot = await getDocs(
          query(collection(db, 'tracks'), orderBy('releaseDate', 'desc'))
        );
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
        
        // Aninhar tracks nos artistas
        const artistsData = artistsRaw.map((artist: any) => ({
          ...artist,
          image: artist.imageUrl || artist.image || '',
          tracks: tracksData.filter(track => track.artistId === artist.id)
        })) as Artist[];
        
        // Enriquecer releases com artistName
        const enrichedReleases = releasesData.map(release => {
          const artist = artistsRaw.find((a: any) => a.id === release.artistId) as any;
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
