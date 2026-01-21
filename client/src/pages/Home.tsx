import { useState } from 'react';
import Hero from "@/components/Hero";
import RecordBox from "@/components/RecordBox";
import Turntable from "@/components/Turntable";
import AudioPlayer from "@/components/AudioPlayer";
import About from "@/components/About";
import Submit from "@/components/Submit";
import Footer from "@/components/Footer";
import type { Artist } from '@/data/artists';

export default function Home() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const handlePlayArtist = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleClosePlayer = () => {
    setSelectedArtist(null);
  };

  return (
    <div className="min-h-screen">
      <Hero />
      <RecordBox onSelectArtist={() => {}} />
      <Turntable onPlayArtist={handlePlayArtist} />
      <About />
      <Submit />
      <Footer />
      <AudioPlayer artist={selectedArtist} onClose={handleClosePlayer} />
    </div>
  );
}
