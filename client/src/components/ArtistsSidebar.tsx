import { motion } from 'framer-motion';
import type { Artist } from '@/data/artists';

interface ArtistsSidebarProps {
  artists: Artist[];
  selectedArtist: Artist | null;
  onSelectArtist: (artist: Artist) => void;
}

export default function ArtistsSidebar({
  artists,
  selectedArtist,
  onSelectArtist,
}: ArtistsSidebarProps) {
  return (
    <>
      {/* Desktop: Sidebar esquerda */}
      <div className="hidden lg:block fixed left-0 top-20 bottom-20 w-72 overflow-y-auto scrollbar-hide z-30 bg-background/30 backdrop-blur-sm border-r border-border">
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-display text-primary glow-cyan mb-6">
            ARTISTS
          </h3>
          {artists.map((artist) => (
            <motion.button
              key={artist.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectArtist(artist)}
              className={`w-full flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                selectedArtist?.id === artist.id
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-card/30 border-2 border-transparent hover:border-primary/50'
              }`}
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-32 h-32 rounded object-cover"
              />
              <p className={`text-sm font-medium text-center ${
                selectedArtist?.id === artist.id
                  ? 'text-primary glow-cyan'
                  : 'text-foreground'
              }`}>
                {artist.name}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mobile: Barra horizontal no topo */}
      <div className="lg:hidden w-full overflow-x-auto scrollbar-hide bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex gap-3 p-4">
          {artists.map((artist) => (
            <motion.button
              key={artist.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectArtist(artist)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                selectedArtist?.id === artist.id
                  ? 'bg-primary/20 border border-primary'
                  : 'bg-card/30 border border-border'
              }`}
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-16 h-16 rounded object-cover"
              />
              <p className={`text-xs font-medium text-center w-20 truncate ${
                selectedArtist?.id === artist.id
                  ? 'text-primary glow-cyan'
                  : 'text-foreground'
              }`}>
                {artist.name}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
}
