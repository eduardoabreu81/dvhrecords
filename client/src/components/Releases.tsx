import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useFirestoreArtists } from '../hooks/useFirestoreArtists';

export default function Releases() {
  const { t } = useTranslation();
  const { releases, loading } = useFirestoreArtists();
  
  if (loading) {
    return (
      <div className="bg-black/60 backdrop-blur-md rounded-lg border border-primary/30 p-6">
        <h2 className="text-3xl md:text-4xl font-display text-primary glow-cyan mb-6">
          {t('releases.title')}
        </h2>
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }
  
  // Ordenar releases por data (mais recentes primeiro)
  const sortedReleases = [...releases].sort((a, b) => 
    new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  ).slice(0, 2); // Mostrar apenas os 2 mais recentes
  
  return (
    <div className="bg-black/60 backdrop-blur-md rounded-lg border border-primary/30 p-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-display text-primary glow-cyan mb-6"
      >
        {t('releases.title')}
      </motion.h2>
      
      {sortedReleases.length === 0 ? (
        <p className="text-muted-foreground">{t('releases.noReleases')}</p>
      ) : (
        <div className="space-y-4">
          {sortedReleases.map((release, index) => (
            <motion.div
              key={release.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex gap-4 bg-card/30 border border-border hover:border-primary/50 rounded-lg p-4 transition-all"
            >
              {/* Capa */}
              <div className="flex-shrink-0">
                <img
                  src={release.coverUrl}
                  alt={release.title}
                  className="w-24 h-24 rounded object-cover"
                />
              </div>

              {/* Dados do Lançamento */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-xl font-display text-primary glow-cyan truncate">
                    {release.title}
                  </h3>
                  <p className="text-sm text-foreground truncate">
                    {release.artistName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(release.releaseDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                {/* Links */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {release.links?.spotify && (
                    <a
                      href={release.links.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary rounded text-xs font-medium text-primary transition-all"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      Spotify
                    </a>
                  )}
                  {release.links?.appleMusic && (
                    <a
                      href={release.links.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary rounded text-xs font-medium text-primary transition-all"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408a10.61 10.61 0 0 0-.1 1.18c0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 0 0 1.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 0 0 1.88-2.207c.186-.42.293-.87.344-1.326.077-.685.097-1.373.097-2.062V6.124zM12.866 3.667c.34 0 .678.01 1.018.03.687.04 1.368.116 2.042.243.868.164 1.67.463 2.378 1.015.878.684 1.43 1.557 1.638 2.637.11.573.138 1.157.138 1.74 0 .14-.007.28-.01.42v4.95c-.003.12-.01.24-.013.36-.023.81-.113 1.607-.463 2.347-.463 1.003-1.183 1.717-2.187 2.137-.623.26-1.277.357-1.947.357h-8.65c-.67 0-1.324-.097-1.947-.357-1.004-.42-1.724-1.134-2.187-2.137-.35-.74-.44-1.537-.463-2.347-.003-.12-.01-.24-.013-.36V9.752c-.003-.14-.01-.28-.01-.42 0-.583.027-1.167.138-1.74.208-1.08.76-1.953 1.638-2.637.708-.552 1.51-.85 2.378-1.015.674-.127 1.355-.203 2.042-.243.34-.02.678-.03 1.018-.03h3.134z"/>
                      </svg>
                      Apple
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
