import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from "@/components/Hero";
import ArtistsBar from "@/components/ArtistsBar";
import TurntableNew from "@/components/TurntableNew";
import About from "@/components/About";

import Submit from "@/components/Submit";
import Footer from "@/components/Footer";
import { mockArtists, type Artist, type Track } from '@/data/artists';

export default function Home() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const { scrollYProgress } = useScroll();

  // Parallax effects para diferentes seções
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const turntableY = useTransform(scrollYProgress, [0.2, 0.5], [50, -50]);
  const aboutY = useTransform(scrollYProgress, [0.5, 0.7], [50, -30]);
  const submitY = useTransform(scrollYProgress, [0.7, 0.9], [30, -20]);

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleTrackChange = (track: Track, isPlaying: boolean) => {
    console.log('Track changed:', track.title, 'Playing:', isPlaying);
    // Aqui você pode integrar com AudioPlayer se necessário
  };

  return (
    <div className="min-h-screen snap-y snap-mandatory overflow-y-scroll h-screen">
      {/* Hero com parallax */}
      <section className="snap-start h-screen">
        <motion.div style={{ y: heroY }}>
          <Hero />
        </motion.div>
      </section>

      {/* Barra de Artistas (scroll horizontal) */}
      <section className="snap-start min-h-screen flex flex-col">
        <ArtistsBar 
        artists={mockArtists}
        selectedArtist={selectedArtist}
        onSelectArtist={handleSelectArtist}
      />

        {/* Toca-discos + Bio do Artista */}
        <div 
          id="artists" 
          className="relative flex-1 flex items-center bg-background/50"
          style={{
            backgroundImage: 'url(/images/turntable/technics-turntable.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay escuro para melhor legibilidade */}
          <div className="absolute inset-0 bg-black/70" />
          <div className="container relative z-10">
            <motion.div style={{ y: turntableY }}>
              <TurntableNew 
                artist={selectedArtist}
                onTrackChange={handleTrackChange}
              />
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

      {/* Footer estático */}
      <Footer />
    </div>
  );
}
