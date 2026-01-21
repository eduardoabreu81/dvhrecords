import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-full py-20 text-muted-foreground">
        <p className="text-lg">Selecione um artista para começar</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-12">
      {/* Bio */}
      <div>
        <h3 className="text-3xl font-display text-primary glow-cyan mb-2">
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
  );
}
