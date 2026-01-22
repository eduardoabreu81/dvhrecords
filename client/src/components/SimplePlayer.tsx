import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Artist, Track } from '@/hooks/useFirestoreArtists';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Inicializar/trocar áudio quando currentTrack mudar
  useEffect(() => {
    if (currentTrack?.audioUrl) {
      // Criar novo elemento de áudio
      const audio = new Audio(currentTrack.audioUrl);
      audioRef.current = audio;
      
      // Event listeners
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setIsReady(true);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleEnded = () => {
        onNext();
      };
      
      const handleError = (e: ErrorEvent) => {
        console.error('Audio playback error:', e);
        console.error('Failed to load audio from:', currentTrack.audioUrl);
        console.error('Audio element:', audio);
        setIsReady(false);
        toast.error(`Erro ao carregar áudio: ${currentTrack.title}`);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError as any);
      
      // Aplicar volume inicial
      audio.volume = volume / 100;
      
      return () => {
        audio.pause();
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError as any);
        audioRef.current = null;
      };
    } else {
      // Fallback: usar duração do objeto track se não houver audioUrl
      if (currentTrack?.duration) {
        setDuration(currentTrack.duration);
        setIsReady(true);
      }
    }
  }, [currentTrack, onNext, volume]);

  // Controlar play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && isReady) {
      audio.play().catch(err => {
        console.error('Failed to play audio:', err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isReady]);

  // Controlar volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = x / bounds.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
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
              <div 
                className="h-1 bg-gray-700 rounded-full overflow-hidden mb-1 cursor-pointer"
                onClick={handleProgressClick}
              >
                <motion.div
                  className="h-full bg-primary"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-foreground/50">
                <span>{formatTime(Math.floor(currentTime))}</span>
                <span>{formatTime(Math.floor(duration))}</span>
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
