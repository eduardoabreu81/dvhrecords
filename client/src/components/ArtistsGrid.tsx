import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Artist } from '../data/artists';

interface ArtistsGridProps {
  artists: Artist[];
  selectedArtist: Artist | null;
  onSelectArtist: (artist: Artist) => void;
}

export default function ArtistsGrid({ artists, selectedArtist, onSelectArtist }: ArtistsGridProps) {
  const { t } = useTranslation();
  
  return (
    <div className="py-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-display text-primary glow-cyan mb-12 text-center"
      >
        {t('artists.title')}
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {artists.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelectArtist(artist)}
            className={`group cursor-pointer ${
              selectedArtist?.id === artist.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            {/* Foto do Artista (quadrada grande) */}
            <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              {/* Overlay com glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Nome sobreposto (aparece no hover) */}
              <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-primary font-display text-lg glow-cyan">
                  {artist.name}
                </p>
              </div>
            </div>
            
            {/* Nome abaixo da foto (sempre visível) */}
            <div className="text-center">
              <h3 className={`font-display text-lg transition-colors ${
                selectedArtist?.id === artist.id 
                  ? 'text-primary glow-cyan' 
                  : 'text-foreground group-hover:text-primary'
              }`}>
                {artist.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{artist.genre}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
