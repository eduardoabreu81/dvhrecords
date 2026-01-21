import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { mockArtists, type Artist } from '@/data/artists';

interface RecordBoxProps {
  onSelectArtist: (artist: Artist) => void;
}

export default function RecordBox({ onSelectArtist }: RecordBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mockArtists.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + mockArtists.length) % mockArtists.length);
  };

  const currentArtist = mockArtists[currentIndex];

  return (
    <>
      {/* Record Box Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-8 top-1/2 -translate-y-1/2 z-40 bg-card/80 backdrop-blur-sm border-2 border-primary/50 rounded-lg p-6 hover:border-primary transition-all glow-box-cyan cursor-pointer"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-20 bg-gradient-to-b from-primary/20 to-primary/5 rounded border border-primary/30 relative overflow-hidden">
            {/* Simula discos empilhados */}
            <div className="absolute inset-x-0 top-0 h-1 bg-primary/50" />
            <div className="absolute inset-x-0 top-2 h-1 bg-primary/40" />
            <div className="absolute inset-x-0 top-4 h-1 bg-primary/30" />
            <div className="absolute inset-x-0 top-6 h-1 bg-primary/20" />
          </div>
          <span className="text-primary text-sm font-display glow-cyan">RECORDS</span>
        </div>
      </motion.button>

      {/* Vertical Carousel Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (semi-transparent) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-45 bg-background/50 backdrop-blur-sm"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[400px] bg-background/95 backdrop-blur-md border-r-2 border-primary/30 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary/20">
                <h2 className="text-2xl font-display text-primary glow-cyan">
                  RECORD BOX
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-card/50 border border-primary/30 hover:border-primary transition-all glow-box-cyan"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
              </div>

              {/* Carousel Container */}
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                {/* Navigation Up */}
                <button
                  onClick={handlePrev}
                  className="mb-4 p-3 rounded-full bg-card/50 border border-primary/30 hover:border-primary transition-all glow-box-cyan"
                >
                  <ChevronUp className="w-6 h-6 text-primary" />
                </button>

                {/* Record Cover */}
                <motion.div
                  key={currentIndex}
                  initial={{ y: 50, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -50, opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="relative"
                >
                  <div
                    className="w-72 h-72 rounded-lg overflow-hidden border-4 border-primary/50 glow-box-cyan-strong cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('artist', JSON.stringify(currentArtist));
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                  >
                    <img
                      src={currentArtist.image}
                      alt={currentArtist.name}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>

                  {/* Artist Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-4">
                    <h3 className="text-xl font-display text-primary glow-cyan mb-1">
                      {currentArtist.name}
                    </h3>
                    <p className="text-sm text-foreground/70">{currentArtist.genre}</p>
                  </div>
                </motion.div>

                {/* Navigation Down */}
                <button
                  onClick={handleNext}
                  className="mt-4 p-3 rounded-full bg-card/50 border border-primary/30 hover:border-primary transition-all glow-box-cyan"
                >
                  <ChevronDown className="w-6 h-6 text-primary" />
                </button>

                {/* Instructions */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 text-center text-foreground/50 text-sm px-4"
                >
                  Arraste o disco até o toca-discos para tocar
                </motion.p>

                {/* Counter */}
                <div className="mt-4 text-primary/70 text-sm font-display">
                  {currentIndex + 1} / {mockArtists.length}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
