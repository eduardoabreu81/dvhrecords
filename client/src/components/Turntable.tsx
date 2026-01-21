import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArtistProfile from './ArtistProfile';
import type { Artist } from '@/data/artists';

interface TurntableProps {
  onPlayArtist: (artist: Artist) => void;
}

export default function Turntable({ onPlayArtist }: TurntableProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tonearmDown, setTonearmDown] = useState(false);
  const turntableRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const artistData = e.dataTransfer.getData('artist');
      if (artistData) {
        const artist: Artist = JSON.parse(artistData);
        setCurrentArtist(artist);
        
        // Animação: vinil aparece, depois braço desce, depois começa a girar
        setTimeout(() => {
          setTonearmDown(true);
          setTimeout(() => {
            setIsPlaying(true);
            onPlayArtist(artist);
          }, 800);
        }, 300);
      }
    } catch (error) {
      console.error('Error parsing artist data:', error);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setTonearmDown(false);
    setTimeout(() => {
      setCurrentArtist(null);
    }, 500);
  };

  return (
    <section
      id="artists"
      className="min-h-screen bg-background flex items-center justify-center py-20 px-4"
    >
      <div className="container max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-display text-center text-primary glow-cyan-strong mb-16"
        >
          ARTISTS
        </motion.h2>

        {/* Main Content: Turntable + Artist Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Turntable Container */}
          <div
            ref={turntableRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full max-w-2xl mx-auto aspect-square transition-all duration-300 ${
              isDragOver ? 'scale-105' : 'scale-100'
            }`}
          >
          {/* Turntable Base Image */}
          <div className="relative w-full h-full">
            <img
              src="/images/turntable/technics-turntable.png"
              alt="Technics Turntable"
              className={`w-full h-full object-contain ${
                isDragOver ? 'glow-box-cyan-strong' : ''
              }`}
              draggable={false}
            />

            {/* Vinyl Record (appears when artist is dropped) */}
            <AnimatePresence>
              {currentArtist && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-[45%]"
                  style={{
                    marginTop: '-2%', // Ajuste fino para centralizar no prato
                  }}
                >
                  <motion.div
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={
                      isPlaying
                        ? {
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }
                        : { duration: 0.5 }
                    }
                    className="w-full h-full rounded-full overflow-hidden border-4 border-primary/30"
                  >
                    <img
                      src={currentArtist.image}
                      alt={currentArtist.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tonearm Animation Overlay */}
            <motion.div
              initial={{ rotate: -25, originX: '85%', originY: '15%' }}
              animate={
                tonearmDown
                  ? { rotate: -5, originX: '85%', originY: '15%' }
                  : { rotate: -25, originX: '85%', originY: '15%' }
              }
              transition={{ type: 'spring', damping: 15 }}
              className="absolute top-[15%] right-[15%] w-[35%] h-[35%] pointer-events-none"
            >
              {/* Visual indicator do braço (opcional, pois já temos na imagem) */}
            </motion.div>

            {/* Drop Zone Indicator */}
            {isDragOver && !currentArtist && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-[45%] h-[45%] rounded-full border-4 border-dashed border-primary animate-pulse glow-box-cyan-strong flex items-center justify-center">
                  <span className="text-primary font-display text-xl glow-cyan">
                    SOLTE AQUI
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Now Playing Info */}
          <AnimatePresence>
            {currentArtist && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute -bottom-24 left-0 right-0 text-center"
              >
                <h3 className="text-3xl font-display text-primary glow-cyan mb-2">
                  {isPlaying ? 'NOW PLAYING' : 'LOADING...'}
                </h3>
                <p className="text-xl text-foreground">{currentArtist.name}</p>
                <p className="text-sm text-foreground/70 mb-4">{currentArtist.genre}</p>
                
                {isPlaying && (
                  <button
                    onClick={handleStop}
                    className="px-6 py-2 bg-primary/20 border border-primary rounded-full text-primary hover:bg-primary/30 transition-all glow-box-cyan"
                  >
                    STOP
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Artist Profile Sidebar */}
          <div className="w-full flex justify-center lg:justify-start">
            {currentArtist ? (
              <ArtistProfile artist={currentArtist} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-foreground/50 text-lg p-8"
              >
                <p>Clique na caixa de discos (lado esquerdo)</p>
                <p>e arraste uma capa até o toca-discos</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
