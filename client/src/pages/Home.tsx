import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from "@/components/Hero";
import ArtistsSidebar from "@/components/ArtistsSidebar";
import TurntableNew from "@/components/TurntableNew";
import Releases from "@/components/Releases";
import About from "@/components/About";
import Submit from "@/components/Submit";
import Footer from "@/components/Footer";
import SimplePlayer from "@/components/SimplePlayer";
import { mockArtists, type Artist, type Track } from '@/data/artists';

export default function Home() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { scrollYProgress } = useScroll();

  // Parallax effects para diferentes seções
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const artistsY = useTransform(scrollYProgress, [0.2, 0.5], [50, -50]);
  const aboutY = useTransform(scrollYProgress, [0.5, 0.7], [50, -30]);
  const submitY = useTransform(scrollYProgress, [0.7, 0.9], [30, -20]);

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleTrackChange = (track: Track, playing: boolean) => {
    setCurrentTrack(track);
    setIsPlaying(playing);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleNext = () => {
    if (!selectedArtist || !currentTrack) return;
    const currentIndex = selectedArtist.tracks.findIndex(t => t.title === currentTrack.title);
    const nextIndex = (currentIndex + 1) % selectedArtist.tracks.length;
    setCurrentTrack(selectedArtist.tracks[nextIndex]);
    setIsPlaying(true);
  };
  const handlePrevious = () => {
    if (!selectedArtist || !currentTrack) return;
    const currentIndex = selectedArtist.tracks.findIndex(t => t.title === currentTrack.title);
    const prevIndex = currentIndex === 0 ? selectedArtist.tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(selectedArtist.tracks[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen snap-y snap-mandatory overflow-y-scroll h-screen pb-20">
      {/* Hero com parallax */}
      <section className="snap-start h-screen">
        <motion.div style={{ y: heroY }}>
          <Hero />
        </motion.div>
      </section>

      {/* Artists Section com Sidebar + Bio + Releases */}
      <section className="snap-start min-h-screen flex flex-col">
        <ArtistsSidebar
          artists={mockArtists}
          selectedArtist={selectedArtist}
          onSelectArtist={handleSelectArtist}
        />

        <div 
          id="artists" 
          className="relative flex-1 flex items-center bg-background/50 lg:pl-64"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay escuro para melhor legibilidade */}
          <div className="absolute inset-0 bg-black/70" />
          
          <div className="container relative z-10">
            <motion.div style={{ y: artistsY }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bio e Tracks (2 colunas) */}
                <div className="lg:col-span-2">
                  <TurntableNew 
                    artist={selectedArtist}
                    onTrackChange={handleTrackChange}
                  />
                </div>

                {/* Releases (1 coluna) */}
                <div className="lg:col-span-1">
                  <Releases />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About (Label Bio + About unificados) */}
      <section className="snap-start h-screen flex items-center">
        <motion.div style={{ y: aboutY }} className="w-full">
          <About />
        </motion.div>
      </section>

      {/* Submit com parallax */}
      <section className="snap-start h-screen flex items-center">
        <motion.div style={{ y: submitY }} className="w-full">
          <Submit />
        </motion.div>
      </section>

      {/* Simple Player */}
      <SimplePlayer
        artist={selectedArtist}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      {/* Footer estático */}
      <Footer />
    </div>
  );
}
