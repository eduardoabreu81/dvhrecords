import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from "@/components/Hero";
import RecordBox from "@/components/RecordBox";
import Turntable from "@/components/Turntable";
import AudioPlayer from "@/components/AudioPlayer";
import About from "@/components/About";
import LabelBio from "@/components/LabelBio";
import Submit from "@/components/Submit";
import Footer from "@/components/Footer";
import type { Artist } from '@/data/artists';

export default function Home() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const { scrollYProgress } = useScroll();

  // Parallax effects para diferentes seções
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const turntableY = useTransform(scrollYProgress, [0.2, 0.5], [50, -50]);
  const aboutY = useTransform(scrollYProgress, [0.5, 0.7], [50, -30]);
  const submitY = useTransform(scrollYProgress, [0.7, 0.9], [30, -20]);

  const handlePlayArtist = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleClosePlayer = () => {
    setSelectedArtist(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero com parallax */}
      <motion.div style={{ y: heroY }}>
        <Hero />
      </motion.div>

      {/* RecordBox (fixo, sem parallax) */}
      <RecordBox onSelectArtist={() => {}} />

      {/* Turntable com parallax */}
      <motion.div style={{ y: turntableY }}>
        <Turntable onPlayArtist={handlePlayArtist} />
      </motion.div>

      {/* Label Bio (nova seção) */}
      <LabelBio />

      {/* About com parallax */}
      <motion.div style={{ y: aboutY }}>
        <About />
      </motion.div>

      {/* Submit com parallax */}
      <motion.div style={{ y: submitY }}>
        <Submit />
      </motion.div>

      {/* Footer (sem parallax) */}
      <Footer />

      {/* Audio Player (fixo) */}
      <AudioPlayer artist={selectedArtist} onClose={handleClosePlayer} />
    </div>
  );
}
