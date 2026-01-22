import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { uploadToB2, deleteFromB2 } from './b2Storage';
import type { Artist, Track } from '@/hooks/useFirestoreArtists';

// Helper to ensure Firebase is initialized
function ensureFirebaseInitialized() {
  if (!db) {
    throw new Error('Firebase not initialized. Please configure Firebase credentials.');
  }
  return { db };
}

// ==================== ARTISTS ====================

export interface FirebaseArtist extends Omit<Artist, 'id'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Get all artists from Firestore
 */
export async function getAllArtists(): Promise<Artist[]> {
  try {
    const { db: firestore } = ensureFirebaseInitialized();
    const artistsRef = collection(firestore, 'artists');
    const q = query(artistsRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Artist[];
  } catch (error) {
    console.error('Error fetching artists:', error);
    throw error;
  }
}

/**
 * Get single artist by ID
 */
export async function getArtistById(id: string): Promise<Artist | null> {
  try {
    const { db: firestore } = ensureFirebaseInitialized();
    const artistRef = doc(firestore, 'artists', id);
    const snapshot = await getDoc(artistRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Artist;
  } catch (error) {
    console.error('Error fetching artist:', error);
    throw error;
  }
}

/**
 * Create new artist
 */
export async function createArtist(artistData: Omit<Artist, 'id'>): Promise<string> {
  try {
    const { db: firestore } = ensureFirebaseInitialized();
    const artistsRef = collection(firestore, 'artists');
    const docRef = await addDoc(artistsRef, {
      ...artistData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating artist:', error);
    throw error;
  }
}

/**
 * Update existing artist
 */
export async function updateArtist(id: string, artistData: Partial<Artist>): Promise<void> {
  try {
    const { db: firestore } = ensureFirebaseInitialized();
    const artistRef = doc(firestore, 'artists', id);
    await updateDoc(artistRef, {
      ...artistData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating artist:', error);
    throw error;
  }
}

/**
 * Delete artist
 */
export async function deleteArtist(id: string): Promise<void> {
  try {
    const { db: firestore } = ensureFirebaseInitialized();
    const artistRef = doc(firestore, 'artists', id);
    await deleteDoc(artistRef);
  } catch (error) {
    console.error('Error deleting artist:', error);
    throw error;
  }
}

// ==================== TRACKS ====================

export interface FirebaseTrack extends Omit<Track, 'id'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Get all tracks from Firestore
 */
export async function getAllTracks(): Promise<Track[]> {
  try {
    const { db: firestore } = ensureFirebaseInitialized();
    const tracksRef = collection(firestore, 'tracks');
    const q = query(tracksRef, orderBy('releaseDate', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Track[];
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  }
}

/**
 * Get tracks by artist ID
 */
export async function getTracksByArtist(artistId: string): Promise<Track[]> {
  try {
    const allTracks = await getAllTracks();
    return allTracks.filter(track => track.artistId === artistId);
  } catch (error) {
    console.error('Error fetching artist tracks:', error);
    throw error;
  }
}

/**
 * Create new track
 */
export async function createTrack(trackData: Omit<Track, 'id'>): Promise<string> {
  try {
    const { db: firestore } = ensureFirebaseInitialized();
    const tracksRef = collection(firestore, 'tracks');
    const docRef = await addDoc(tracksRef, {
      ...trackData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating track:', error);
    throw error;
  }
}

/**
 * Update existing track
 */
export async function updateTrack(id: string, trackData: Partial<Track>): Promise<void> {
  try {
    const { db: firestore } = ensureFirebaseInitialized();
    const trackRef = doc(firestore, 'tracks', id);
    await updateDoc(trackRef, {
      ...trackData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating track:', error);
    throw error;
  }
}

/**
 * Delete track
 */
export async function deleteTrack(id: string): Promise<void> {
  try {
    const { db: firestore } = ensureFirebaseInitialized();
    const trackRef = doc(firestore, 'tracks', id);
    await deleteDoc(trackRef);
  } catch (error) {
    console.error('Error deleting track:', error);
    throw error;
  }
}

// ==================== STORAGE ====================

/**
 * Upload image to Backblaze B2
 * @param file - File to upload
 * @param folder - Folder name (e.g., 'images', 'covers')
 * @returns Download URL
 */
export async function uploadImage(file: File, folder: 'images' | 'covers' = 'images'): Promise<string> {
  try {
    return await uploadToB2(file, folder);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Upload audio file to Backblaze B2
 * @param file - Audio file to upload
 * @param folder - Folder name (e.g., 'audio')
 * @returns Download URL
 */
export async function uploadAudio(file: File, folder: 'audio' = 'audio'): Promise<string> {
  try {
    return await uploadToB2(file, folder);
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error;
  }
}

/**
 * Delete file from Backblaze B2
 * @param fileUrl - Full URL of file to delete
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    await deleteFromB2(fileUrl);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomStr}.${extension}`;
}
