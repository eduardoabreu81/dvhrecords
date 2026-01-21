import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArtistsGrid from "@/components/ArtistsGrid";
import ArtistModal from "@/components/ArtistModal";
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
  const artistsY = useTransform(scrollYProgress, [0.2, 0.4], [0, -30]);
  const aboutY = useTransform(scrollYProgress, [0.4, 0.6], [0, -30]);
  const submitY = useTransform(scrollYProgress, [0.6, 0.8], [0, -30]);

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const handleTrackChange = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleNext = () => {
    if (!selectedArtist || !currentTrack) return;
    const currentIndex = selectedArtist.tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % selectedArtist.tracks.length;
    setCurrentTrack(selectedArtist.tracks[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (!selectedArtist || !currentTrack) return;
    const currentIndex = selectedArtist.tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? selectedArtist.tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(selectedArtist.tracks[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <>
      {/* Header fixo global (aparece em todas as seções) */}
      <Header />
      
      <div className="min-h-screen snap-y snap-mandatory overflow-y-scroll h-screen pb-20">
      {/* Hero com parallax */}
      <section className="snap-start h-screen">
        <motion.div style={{ y: heroY }}>
          <Hero />
        </motion.div>
      </section>

      {/* Artists Section */}
      <section 
        id="artists"
        className="snap-start min-h-screen flex flex-col relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay escuro para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="container relative z-10 py-12">
          <motion.div style={{ y: artistsY }}>
            {/* Grid de artistas sempre visível */}
            <ArtistsGrid 
              artists={mockArtists}
              selectedArtist={selectedArtist}
              onSelectArtist={handleSelectArtist}
            />
          </motion.div>
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

      {/* Modal de Artista */}
      <ArtistModal 
        artist={selectedArtist}
        isOpen={!!selectedArtist}
        onClose={() => setSelectedArtist(null)}
        onTrackChange={handleTrackChange}
      />
    </>
  );
}
