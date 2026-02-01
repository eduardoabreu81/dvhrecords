import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Artist } from '../hooks/useFirestoreArtists';
import { useState } from 'react';

interface ArtistsGridProps {
  artists: Artist[];
  selectedArtist: Artist | null;
  onSelectArtist: (artist: Artist) => void;
}

export default function ArtistsGrid({ artists, selectedArtist, onSelectArtist }: ArtistsGridProps) {
  const { t } = useTranslation();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (artistId: string) => {
    setImageErrors(prev => new Set(prev).add(artistId));
  };
  
  return (
    <div className="py-8 sm:py-10 md:py-12 pt-24 sm:pt-28 md:pt-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl md:text-5xl font-display text-primary glow-cyan mb-8 sm:mb-10 md:mb-12 text-center px-4"
      >
        {t('artists.title')}
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto px-3 sm:px-4">
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
            <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-primary/10">
              {imageErrors.has(artist.id) ? (
                // Fallback quando imagem falha
                <div className="w-full h-full flex items-center justify-center text-primary/50">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">🎵</div>
                    <div className="text-xs">{artist.name}</div>
                  </div>
                </div>
              ) : (
                <img
                  src={artist.image}
                  alt={artist.name}
                  loading="lazy"
                  onError={() => handleImageError(artist.id)}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              )}
              {/* Overlay com glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Nome sobreposto (aparece no hover) */}
              <div className="absolute inset-0 flex items-end justify-center p-2 sm:p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-primary font-display text-sm sm:text-base md:text-lg glow-cyan">
                  {artist.name}
                </p>
              </div>
            </div>
            
            {/* Nome abaixo da foto (sempre visível) */}
            <div className="text-center">
              <h3 className={`font-display text-sm sm:text-base md:text-lg transition-colors ${
                selectedArtist?.id === artist.id 
                  ? 'text-primary glow-cyan' 
                  : 'text-foreground group-hover:text-primary'
              }`}>
                {artist.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">{artist.genre}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
