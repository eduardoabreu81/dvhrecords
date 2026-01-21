import { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Artist, Track } from '@/data/artists';

interface SimplePlayerProps {
  artist: Artist | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function SimplePlayer({
  artist,
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
}: SimplePlayerProps) {
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Simular progresso de tempo
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const [mins, secs] = currentTrack.duration.split(':').map(Number);
      const totalSeconds = mins * 60 + secs;
      setDuration(totalSeconds);
      
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalSeconds) {
            onNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCurrentTime(0);
    }
  }, [isPlaying, currentTrack, onNext]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!artist || !currentTrack) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-16 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-primary/30"
      >
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Album Art */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
              className="w-14 h-14 rounded overflow-hidden border border-primary/30 flex-shrink-0"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="font-display text-primary text-sm glow-cyan truncate">
                {currentTrack.title}
              </div>
              <div className="text-foreground/70 text-xs truncate">{artist.name}</div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPrevious}
                className="p-2 rounded hover:bg-primary/10 text-primary transition-colors"
                title="Previous"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              
              {isPlaying ? (
                <button
                  onClick={onPause}
                  className="p-2 rounded-full bg-primary hover:bg-primary/80 text-black transition-colors"
                  title="Pause"
                >
                  <Pause className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={onPlay}
                  className="p-2 rounded-full bg-primary hover:bg-primary/80 text-black transition-colors"
                  title="Play"
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </button>
              )}

              <button
                onClick={onNext}
                className="p-2 rounded hover:bg-primary/10 text-primary transition-colors"
                title="Next"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Progress */}
            <div className="hidden md:flex flex-col flex-1 max-w-xs">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-1">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-foreground/50">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 rounded hover:bg-primary/10 text-primary transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
