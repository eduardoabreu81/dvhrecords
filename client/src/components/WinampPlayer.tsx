import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Artist, Track } from '@/data/artists';

interface WinampPlayerProps {
  artist: Artist | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function WinampPlayer({
  artist,
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrevious,
}: WinampPlayerProps) {
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Simular progresso de tempo
  useEffect(() => {
    if (isPlaying && currentTrack) {
      // Converter duration string (MM:SS) para segundos
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

  // Visualizador de áudio (simulado)
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        const barCount = 20;
        const barWidth = canvas.width / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const height = Math.random() * canvas.height * 0.8;
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - height);
          gradient.addColorStop(0, '#00F0FF');
          gradient.addColorStop(1, '#0080FF');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(i * barWidth + 2, canvas.height - height, barWidth - 4, height);
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

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
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4"
      >
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-primary/50 rounded-lg shadow-2xl glow-box-cyan overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-2 border-b border-primary/30">
            <div className="flex items-center justify-between">
              <span className="font-display text-primary text-sm glow-cyan">DVH PLAYER</span>
              <span className="text-xs text-foreground/50">v1.0</span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex gap-4">
              {/* Album Art */}
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                  className="w-32 h-32 rounded-lg overflow-hidden border-2 border-primary/30 glow-box-cyan"
                >
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Player Info & Controls */}
              <div className="flex-1 flex flex-col justify-between">
                {/* Track Info */}
                <div className="mb-2">
                  <div className="font-display text-primary text-lg glow-cyan truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-foreground/70 text-sm truncate">{artist.name}</div>
                  <div className="text-foreground/50 text-xs">{artist.genre}</div>
                </div>

                {/* Visualizer */}
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={40}
                  className="w-full h-10 rounded border border-primary/20 mb-2"
                />

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-foreground/50 mb-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary/50"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onPrevious}
                      className="p-2 rounded bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                      title="Previous"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    
                    {isPlaying ? (
                      <button
                        onClick={onPause}
                        className="p-3 rounded-full bg-primary hover:bg-primary/80 text-black transition-colors glow-box-cyan"
                        title="Pause"
                      >
                        <Pause className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={onPlay}
                        className="p-3 rounded-full bg-primary hover:bg-primary/80 text-black transition-colors glow-box-cyan"
                        title="Play"
                      >
                        <Play className="w-5 h-5 ml-0.5" />
                      </button>
                    )}

                    <button
                      onClick={onStop}
                      className="p-2 rounded bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                      title="Stop"
                    >
                      <Square className="w-4 h-4" />
                    </button>

                    <button
                      onClick={onNext}
                      className="p-2 rounded bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                      title="Next"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
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
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
