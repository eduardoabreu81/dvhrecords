import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Artist, Track } from '../data/artists';

interface ArtistModalProps {
  artist: Artist | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackChange?: (track: Track, isPlaying: boolean) => void;
}

export default function ArtistModal({ artist, isOpen, onClose, onTrackChange }: ArtistModalProps) {
  const { t } = useTranslation();

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevenir scroll do body quando modal aberto
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!artist) return null;

  const handlePlayTrack = (track: Track) => {
    if (onTrackChange) {
      onTrackChange(track, true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal centralizado */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden glow-box-cyan"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botão Fechar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/80 border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all group"
              >
                <X className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform" />
              </button>

              {/* Conteúdo scrollable */}
              <div className="overflow-y-auto max-h-[85vh] p-8">
                {/* Header com foto e nome */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  {/* Foto do artista */}
                  <div className="flex-shrink-0">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-48 h-48 rounded-lg object-cover border-2 border-primary/30"
                    />
                  </div>

                  {/* Info do artista */}
                  <div className="flex-1">
                    <h2 className="text-4xl font-display text-primary glow-cyan mb-2">
                      {artist.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">{artist.genre}</p>
                    <p className="text-foreground leading-relaxed">{artist.bio}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-6" />

                {/* Lista de Tracks */}
                <div>
                  <h3 className="text-2xl font-display text-primary glow-cyan mb-4">
                    Tracks
                  </h3>
                  <div className="space-y-2">
                    {artist.tracks.map((track, index) => (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handlePlayTrack(track)}
                        className="group flex items-center gap-4 p-4 bg-card/30 border border-border hover:border-primary/50 rounded-lg cursor-pointer transition-all hover:bg-card/50"
                      >
                        {/* Botão Play */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 group-hover:bg-primary/20 group-hover:border-primary flex items-center justify-center transition-all">
                          <Play className="w-5 h-5 text-primary fill-primary" />
                        </div>

                        {/* Info da track */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {track.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {track.duration}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
