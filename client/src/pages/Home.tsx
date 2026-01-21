import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from "@/components/Hero";
import ArtistsBar from "@/components/ArtistsBar";
import TurntableNew from "@/components/TurntableNew";
import About from "@/components/About";
import LabelBio from "@/components/LabelBio";
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
    <div className="min-h-screen">
      {/* Hero com parallax */}
      <motion.div style={{ y: heroY }}>
        <Hero />
      </motion.div>

      {/* Barra de Artistas (scroll horizontal) */}
      <ArtistsBar 
        artists={mockArtists}
        selectedArtist={selectedArtist}
        onSelectArtist={handleSelectArtist}
      />

      {/* Toca-discos + Bio do Artista */}
      <section id="artists" className="relative py-20 bg-background/50">
        <div className="container">
          <motion.div style={{ y: turntableY }}>
            <TurntableNew 
              artist={selectedArtist}
              onTrackChange={handleTrackChange}
            />
          </motion.div>
        </div>
      </section>

      {/* Label Bio */}
      <LabelBio />

      {/* About com parallax */}
      <motion.div style={{ y: aboutY }}>
        <About />
      </motion.div>

      {/* Submit com parallax */}
      <motion.div style={{ y: submitY }}>
        <Submit />
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
