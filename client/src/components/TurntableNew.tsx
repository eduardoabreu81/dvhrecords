import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Artist, Track } from '../data/artists';

interface TurntableNewProps {
  artist: Artist | null;
  onTrackChange?: (track: Track, isPlaying: boolean) => void;
}

export default function TurntableNew({ artist, onTrackChange }: TurntableNewProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = artist?.tracks[currentTrackIndex] || null;

  // Reset ao trocar de artista
  useEffect(() => {
    setCurrentTrackIndex(0);
    setIsPlaying(false);
  }, [artist?.id]);

  // Notificar mudança de track
  useEffect(() => {
    if (currentTrack && onTrackChange) {
      onTrackChange(currentTrack, isPlaying);
    }
  }, [currentTrack, isPlaying, onTrackChange]);

  const handlePlayTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!artist) return;
    const nextIndex = (currentTrackIndex + 1) % artist.tracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (!artist) return;
    const prevIndex = currentTrackIndex === 0 ? artist.tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-full py-20 text-muted-foreground">
        <p className="text-lg">Selecione um artista para começar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start py-12">
      {/* Toca-discos */}
      <div className="relative">
        <h3 className="text-xl font-display text-primary glow-cyan mb-4">
          NOW PLAYING
        </h3>
        
        {/* Imagem do toca-discos */}
        <div className="relative w-full aspect-square max-w-md mx-auto">
          {/* Base do toca-discos */}
          <img
            src="/images/turntable/technics-turntable.png"
            alt="Technics Turntable"
            className="w-full h-full object-contain"
          />
          
          {/* Vinil girando (CENTRALIZADO no prato) */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: 360 
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  rotate: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5"
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover rounded-full border-4 border-black shadow-2xl"
                />
                {/* Centro do vinil */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 bg-black rounded-full border-2 border-primary/50" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="p-3 rounded-full bg-card border border-primary/30 hover:border-primary transition-all glow-box-cyan"
          >
            <SkipBack className="w-5 h-5 text-primary" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleTogglePlay}
            className="p-4 rounded-full bg-primary text-background hover:bg-primary/80 transition-all shadow-lg shadow-primary/50"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="p-3 rounded-full bg-card border border-primary/30 hover:border-primary transition-all glow-box-cyan"
          >
            <SkipForward className="w-5 h-5 text-primary" />
          </motion.button>
        </div>

        {/* Track atual */}
        {currentTrack && (
          <div className="text-center mt-4">
            <p className="text-lg font-semibold text-primary glow-cyan">
              {currentTrack.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {artist.name} · {currentTrack.duration}
            </p>
          </div>
        )}
      </div>

      {/* Bio e Tracks do Artista */}
      <div className="space-y-6">
        {/* Bio */}
        <div>
          <h3 className="text-2xl font-display text-primary glow-cyan mb-2">
            {artist.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{artist.genre}</p>
          <p className="text-foreground leading-relaxed">{artist.bio}</p>
        </div>

        {/* Lista de Tracks */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3">TRACKS</h4>
          <div className="space-y-2">
            {artist.tracks.map((track, index) => (
              <motion.button
                key={track.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlayTrack(index)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  currentTrackIndex === index && isPlaying
                    ? 'bg-primary/20 border border-primary'
                    : 'bg-card/50 border border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-6">
                    {index + 1}
                  </span>
                  <span className={`font-medium ${
                    currentTrackIndex === index && isPlaying
                      ? 'text-primary glow-cyan'
                      : 'text-foreground'
                  }`}>
                    {track.title}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {track.duration}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Links Sociais */}
        {Object.keys(artist.socialLinks).length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">LINKS</h4>
            <div className="flex flex-wrap gap-3">
              {artist.socialLinks.spotify && (
                <a
                  href={artist.socialLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-card border border-primary/30 hover:border-primary rounded-lg text-sm font-medium text-foreground hover:text-primary transition-all glow-box-cyan"
                >
                  Spotify
                </a>
              )}
              {artist.socialLinks.soundcloud && (
                <a
                  href={artist.socialLinks.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-card border border-primary/30 hover:border-primary rounded-lg text-sm font-medium text-foreground hover:text-primary transition-all glow-box-cyan"
                >
                  SoundCloud
                </a>
              )}
              {artist.socialLinks.appleMusic && (
                <a
                  href={artist.socialLinks.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-card border border-primary/30 hover:border-primary rounded-lg text-sm font-medium text-foreground hover:text-primary transition-all glow-box-cyan"
                >
                  Apple Music
                </a>
              )}
              {artist.socialLinks.instagram && (
                <a
                  href={artist.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-card border border-primary/30 hover:border-primary rounded-lg text-sm font-medium text-foreground hover:text-primary transition-all glow-box-cyan"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
