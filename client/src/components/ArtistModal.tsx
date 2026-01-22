import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ExternalLink } from 'lucide-react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Artist, Track, Release } from '../hooks/useFirestoreArtists';
import SimplePlayer from './SimplePlayer';

interface ArtistModalProps {
  artist: Artist | null;
  releases?: Release[];
  isOpen: boolean;
  onClose: () => void;
  currentTrack?: Track | null;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onTrackChange?: (track: Track) => void;
}

export default function ArtistModal({ 
  artist, 
  releases = [],
  isOpen, 
  onClose, 
  currentTrack,
  isPlaying = false,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onTrackChange,
}: ArtistModalProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

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
      onTrackChange(track);
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
              className="relative bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden glow-box-cyan flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botão Fechar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/80 border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all group"
              >
                <X className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform" />
              </button>

              {/* Conteúdo scrollable com scroll discreto */}
              <div className="overflow-y-auto flex-1 p-6 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                {/* Header com foto e nome */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Foto do artista */}
                  <div className="flex-shrink-0">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/30 shadow-lg shadow-primary/20"
                    />
                  </div>

                  {/* Info do artista */}
                  <div className="flex-1">
                    <h2 className="text-3xl font-display text-primary glow-cyan mb-2">
                      {artist.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-3">{artist.genre}</p>
                    <p className="text-sm text-foreground leading-relaxed mb-3">{artist.bio}</p>
                    
                    {/* Botão Ver Perfil Completo */}
                    <button
                      onClick={() => {
                        setLocation(`/artist/${artist.id}`);
                        onClose();
                      }}
                      className="px-6 py-2 bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20 hover:border-primary transition-all text-primary flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t('viewFullProfile', 'Ver Perfil Completo')}
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-4" />

                {/* Lista de Releases */}
                {releases.filter(r => r.artistId === artist.id).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-display text-primary glow-cyan mb-3">
                      Releases
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {releases.filter(r => r.artistId === artist.id).map((release, index) => (
                        <motion.div
                          key={release.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="group bg-card/30 border border-border hover:border-primary/50 rounded-lg overflow-hidden transition-all hover:bg-card/50"
                        >
                          <img
                            src={release.coverUrl}
                            alt={release.title}
                            className="w-full aspect-square object-cover"
                          />
                          <div className="p-3">
                            <p className="font-medium text-foreground truncate text-sm">
                              {release.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(release.releaseDate).toLocaleDateString('pt-BR')}
                            </p>
                            {(release.links?.spotify || release.links?.appleMusic) && (
                              <div className="flex gap-2 mt-2">
                                {release.links.spotify && (
                                  <a
                                    href={release.links.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Spotify
                                  </a>
                                )}
                                {release.links.appleMusic && (
                                  <a
                                    href={release.links.appleMusic}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Apple
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lista de Tracks */}
                <div>
                  <h3 className="text-xl font-display text-primary glow-cyan mb-3">
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
                        className="group flex items-center gap-3 p-3 bg-card/30 border border-border hover:border-primary/50 rounded-lg cursor-pointer transition-all hover:bg-card/50"
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

              {/* Player fixo no rodapé do modal - sempre visível, sem scroll */}
              {currentTrack && (
                <div className="flex-shrink-0 border-t border-border bg-card/50 backdrop-blur-sm">
                  <SimplePlayer
                    artist={artist}
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    onPlay={onPlay || (() => {})}
                    onPause={onPause || (() => {})}
                    onNext={onNext || (() => {})}
                    onPrevious={onPrevious || (() => {})}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
