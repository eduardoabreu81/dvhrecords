import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface Release {
  id: string;
  title: string;
  artist: string;
  cover: string;
  releaseDate: string;
  spotify?: string;
  appleMusic?: string;
}

// Mock data - substituir por dados reais do Firebase
const mockReleases: Release[] = [
  {
    id: '1',
    title: 'Bass Revolution',
    artist: 'Digital Hunters',
    cover: '/images/artists/digital-hunters.png',
    releaseDate: '2026-01-15',
    spotify: 'https://open.spotify.com',
    appleMusic: 'https://music.apple.com',
  },
  {
    id: '2',
    title: 'Midnight Drive',
    artist: 'Eddie Hunter',
    cover: '/images/artists/eddie-hunter.png',
    releaseDate: '2026-01-10',
    spotify: 'https://open.spotify.com',
    appleMusic: 'https://music.apple.com',
  },
  {
    id: '3',
    title: 'Neon Dreams',
    artist: 'Aion',
    cover: '/images/artists/aion.png',
    releaseDate: '2026-01-05',
    spotify: 'https://open.spotify.com',
    appleMusic: 'https://music.apple.com',
  },
];

export default function Releases() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-display text-primary glow-cyan">
        LATEST RELEASES
      </h3>
      
      <div className="space-y-4">
        {mockReleases.map((release, index) => (
          <motion.div
            key={release.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card/50 border border-border rounded-lg p-4 hover:border-primary/50 transition-all"
          >
            <div className="flex gap-4">
              <img
                src={release.cover}
                alt={release.title}
                className="w-20 h-20 rounded object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  {release.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {release.artist}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {new Date(release.releaseDate).toLocaleDateString('pt-BR')}
                </p>
                
                <div className="flex gap-2">
                  {release.spotify && (
                    <a
                      href={release.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/30 hover:border-primary rounded text-xs font-medium text-primary transition-all"
                    >
                      Spotify
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {release.appleMusic && (
                    <a
                      href={release.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/30 hover:border-primary rounded text-xs font-medium text-primary transition-all"
                    >
                      Apple Music
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
