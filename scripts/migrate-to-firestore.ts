import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

// Firebase config (usar mesmas credenciais do projeto)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Dados mock dos artistas
const mockArtists = [
  {
    id: "digital-hunters",
    name: "Digital Hunters",
    bio: "Duo brasileiro especializado em bass music e dubstep. Conhecidos por drops pesados e produção impecável.",
    genre: "Bass Music / Dubstep",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    country: "Brasil",
    socialLinks: {
      spotify: "https://open.spotify.com/artist/digital-hunters",
      soundcloud: "https://soundcloud.com/digital-hunters",
      instagram: "https://instagram.com/digitalhunters",
    },
  },
  {
    id: "eddie-hunter",
    name: "Eddie Hunter",
    bio: "Produtor solo focado em drum & bass e neurofunk. Referência em mixagens técnicas e sound design inovador.",
    genre: "Drum & Bass / Neurofunk",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800",
    country: "Brasil",
    socialLinks: {
      spotify: "https://open.spotify.com/artist/eddie-hunter",
      soundcloud: "https://soundcloud.com/eddie-hunter",
      instagram: "https://instagram.com/eddiehunter",
    },
  },
  {
    id: "neon-pulse",
    name: "Neon Pulse",
    bio: "Projeto experimental que mistura synthwave com bass music. Atmosferas futuristas e grooves contagiantes.",
    genre: "Synthwave / Bass Music",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    country: "Brasil",
    socialLinks: {
      spotify: "https://open.spotify.com/artist/neon-pulse",
      soundcloud: "https://soundcloud.com/neon-pulse",
      instagram: "https://instagram.com/neonpulse",
    },
  },
];

// Tracks mock
const mockTracks = [
  {
    id: "bass-revolution",
    artistId: "digital-hunters",
    title: "Bass Revolution",
    duration: 240,
    releaseDate: "2026-01-15",
    audioUrl: "https://example.com/audio/bass-revolution.mp3",
  },
  {
    id: "midnight-drive",
    artistId: "eddie-hunter",
    title: "Midnight Drive",
    duration: 300,
    releaseDate: "2026-01-10",
    audioUrl: "https://example.com/audio/midnight-drive.mp3",
  },
  {
    id: "neon-lights",
    artistId: "neon-pulse",
    title: "Neon Lights",
    duration: 280,
    releaseDate: "2026-01-05",
    audioUrl: "https://example.com/audio/neon-lights.mp3",
  },
];

// Releases mock
const mockReleases = [
  {
    id: "bass-revolution-release",
    trackId: "bass-revolution",
    artistId: "digital-hunters",
    title: "Bass Revolution",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    releaseDate: "2026-01-15",
    links: {
      spotify: "https://open.spotify.com/track/bass-revolution",
      appleMusic: "https://music.apple.com/track/bass-revolution",
    },
  },
  {
    id: "midnight-drive-release",
    trackId: "midnight-drive",
    artistId: "eddie-hunter",
    title: "Midnight Drive",
    coverUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800",
    releaseDate: "2026-01-10",
    links: {
      spotify: "https://open.spotify.com/track/midnight-drive",
      appleMusic: "https://music.apple.com/track/midnight-drive",
    },
  },
];

async function migrateData() {
  console.log("🚀 Iniciando migração de dados para Firestore...\n");

  try {
    // Migrar artistas
    console.log("📦 Migrando artistas...");
    for (const artist of mockArtists) {
      await setDoc(doc(db, "artists", artist.id), artist);
      console.log(`✅ Artista migrado: ${artist.name}`);
    }

    // Migrar tracks
    console.log("\n🎵 Migrando tracks...");
    for (const track of mockTracks) {
      await setDoc(doc(db, "tracks", track.id), track);
      console.log(`✅ Track migrada: ${track.title}`);
    }

    // Migrar releases
    console.log("\n🎉 Migrando releases...");
    for (const release of mockReleases) {
      await setDoc(doc(db, "releases", release.id), release);
      console.log(`✅ Release migrado: ${release.title}`);
    }

    console.log("\n✨ Migração concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro na migração:", error);
    process.exit(1);
  }
}

migrateData();
