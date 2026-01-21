import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import type { Artist } from '@/data/artists';

interface AudioPlayerProps {
  artist: Artist | null;
  onClose: () => void;
}

export default function AudioPlayer({ artist, onClose }: AudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (!waveformRef.current || !artist) return;

    // Inicializar WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#00F0FF',
      progressColor: '#00F0FF',
      cursorColor: '#FFFFFF',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 100,
      normalize: true,
      backend: 'WebAudio',
    });

    wavesurferRef.current = wavesurfer;

    // Como não temos áudio real, vamos simular com um tom gerado
    // Em produção, você usaria: wavesurfer.load(artist.tracks[0].audioUrl)
    
    // Gerar waveform simulado
    const peaks = Array.from({ length: 1000 }, () => Math.random() * 2 - 1);
    wavesurfer.load('', [peaks], 180); // 180 segundos de duração simulada

    // Event listeners
    wavesurfer.on('ready', () => {
      setDuration(formatTime(wavesurfer.getDuration()));
      wavesurfer.setVolume(volume);
    });

    wavesurfer.on('audioprocess', () => {
      setCurrentTime(formatTime(wavesurfer.getCurrentTime()));
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [artist]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (wavesurferRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      wavesurferRef.current.setVolume(newMuted ? 0 : volume);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (wavesurferRef.current && !isMuted) {
      wavesurferRef.current.setVolume(newVolume);
    }
  };

  if (!artist) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t-2 border-primary/50 p-6 glow-box-cyan"
      >
        <div className="container max-w-6xl mx-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary/20 transition-colors"
          >
            <X className="w-5 h-5 text-primary" />
          </button>

          {/* Artist Info */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={artist.image}
              alt={artist.name}
              className="w-16 h-16 rounded-lg border-2 border-primary/50"
            />
            <div>
              <h3 className="text-xl font-display text-primary glow-cyan">
                {artist.name}
              </h3>
              <p className="text-sm text-foreground/70">{artist.genre}</p>
            </div>
          </div>

          {/* Waveform Visualizer */}
          <div className="mb-4">
            <div
              ref={waveformRef}
              className="w-full rounded-lg overflow-hidden bg-background/50 border border-primary/30"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary hover:bg-primary/30 transition-all flex items-center justify-center glow-box-cyan"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-primary fill-primary" />
              ) : (
                <Play className="w-6 h-6 text-primary fill-primary ml-1" />
              )}
            </button>

            {/* Time Display */}
            <div className="text-sm text-foreground/70 font-mono">
              {currentTime} / {duration}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-primary/20 rounded transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-primary" />
                ) : (
                  <Volume2 className="w-5 h-5 text-primary" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 accent-primary"
              />
            </div>
          </div>

          {/* Track List */}
          <div className="mt-4 pt-4 border-t border-primary/20">
            <h4 className="text-sm font-display text-primary/70 mb-2">TRACKS</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {artist.tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-2 rounded bg-background/30 hover:bg-background/50 transition-colors cursor-pointer"
                >
                  <span className="text-sm text-foreground">{track.title}</span>
                  <span className="text-xs text-foreground/50">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
