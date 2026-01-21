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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Artist } from '@/data/artists';

// Helper to ensure Firebase is initialized
function ensureFirebaseInitialized() {
  if (!db || !storage) {
    throw new Error('Firebase not initialized. Please configure Firebase credentials.');
  }
  return { db, storage };
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

// ==================== STORAGE ====================

/**
 * Upload image to Firebase Storage
 * @param file - File to upload
 * @param path - Storage path (e.g., 'artists/covers/filename.jpg')
 * @returns Download URL
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    const { storage: firebaseStorage } = ensureFirebaseInitialized();
    const storageRef = ref(firebaseStorage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Upload audio file to Firebase Storage
 * @param file - Audio file to upload
 * @param path - Storage path (e.g., 'artists/tracks/filename.mp3')
 * @returns Download URL
 */
export async function uploadAudio(file: File, path: string): Promise<string> {
  try {
    const { storage: firebaseStorage } = ensureFirebaseInitialized();
    const storageRef = ref(firebaseStorage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error;
  }
}

/**
 * Delete file from Firebase Storage
 * @param path - Storage path to delete
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const { storage: firebaseStorage } = ensureFirebaseInitialized();
    const storageRef = ref(firebaseStorage, path);
    await deleteObject(storageRef);
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
