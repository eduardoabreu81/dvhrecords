import { motion } from 'framer-motion';
import { Artist } from '../hooks/useFirestoreArtists';

interface ArtistsBarProps {
  artists: Artist[];
  selectedArtist: Artist | null;
  onSelectArtist: (artist: Artist) => void;
}

export default function ArtistsBar({ artists, selectedArtist, onSelectArtist }: ArtistsBarProps) {
  return (
    <div className="w-full bg-card/50 backdrop-blur-md border-y border-primary/30 py-6">
      <div className="container">
        <h2 className="text-2xl font-display text-primary glow-cyan mb-4">
          ARTISTS
        </h2>
        
        {/* Scroll horizontal de artistas */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
            {artists.map((artist, index) => (
              <motion.button
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectArtist(artist)}
                className={`flex-shrink-0 w-40 group ${
                  selectedArtist?.id === artist.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                {/* Capa do artista */}
                <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Overlay ao hover */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                {/* Nome do artista */}
                <h3 className={`text-sm font-semibold text-center transition-colors ${
                  selectedArtist?.id === artist.id 
                    ? 'text-primary glow-cyan' 
                    : 'text-foreground group-hover:text-primary'
                }`}>
                  {artist.name}
                </h3>
                
                {/* Gênero */}
                <p className="text-xs text-muted-foreground text-center">
                  {artist.genre}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
