import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Music } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Artist } from '@/hooks/useFirestoreArtists';

interface ArtistProfileProps {
  artist: Artist | null;
}

export default function ArtistProfile({ artist }: ArtistProfileProps) {
  const { t } = useTranslation();
  if (!artist) return null;

  // Formatar duração de segundos para mm:ss
  const formatDuration = (duration: number | string) => {
    if (typeof duration === 'string') return duration;
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const socialIcons = {
    spotify: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    soundcloud: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.051 0-.09.04-.099.09l-.27 1.335.27 1.304c0 .047.048.09.099.09.05 0 .09-.043.09-.09l.255-1.304-.27-1.335c0-.05-.04-.09-.09-.09m1.8-1.275c-.058 0-.1.047-.1.105l-.234 2.379.234 2.332c0 .058.042.105.1.105.055 0 .1-.047.1-.105l.255-2.332-.255-2.379c0-.058-.045-.105-.1-.105m.899-.551c-.06 0-.105.047-.105.106l-.234 2.93.234 2.865c0 .06.045.106.105.106.06 0 .106-.046.106-.106l.254-2.865-.254-2.93c0-.06-.046-.106-.106-.106m.9-.539c-.06 0-.106.048-.106.107l-.233 3.469.233 3.394c0 .06.046.106.106.106.06 0 .106-.046.106-.106l.255-3.394-.255-3.469c0-.06-.046-.107-.106-.107m.899-.585c-.06 0-.106.047-.106.106l-.234 4.054.234 3.948c0 .06.046.106.106.106.06 0 .106-.046.106-.106l.255-3.948-.255-4.054c0-.06-.046-.106-.106-.106m.9-.592c-.061 0-.106.047-.106.106l-.234 4.646.234 4.542c0 .06.045.106.106.106.06 0 .106-.046.106-.106l.254-4.542-.254-4.646c0-.06-.046-.106-.106-.106m.899-.569c-.06 0-.106.048-.106.107l-.233 5.215.233 5.092c0 .06.046.106.106.106.061 0 .106-.046.106-.106l.255-5.092-.255-5.215c0-.06-.045-.107-.106-.107m.899-.5c-.06 0-.106.048-.106.107l-.234 5.715.234 5.583c0 .06.046.106.106.106.06 0 .106-.046.106-.106l.255-5.583-.255-5.715c0-.06-.046-.107-.106-.107m.9-.5c-.061 0-.106.047-.106.106l-.234 6.216.234 6.074c0 .06.045.107.106.107.06 0 .106-.047.106-.107l.254-6.074-.254-6.216c0-.06-.046-.106-.106-.106m.899-.585c-.06 0-.106.047-.106.106l-.233 6.801.233 6.66c0 .06.046.106.106.106.061 0 .106-.046.106-.106l.255-6.66-.255-6.801c0-.06-.045-.106-.106-.106m.9-.539c-.061 0-.106.047-.106.106l-.234 7.34.234 7.195c0 .06.045.107.106.107.06 0 .106-.047.106-.107l.254-7.195-.254-7.34c0-.06-.046-.106-.106-.106m.899-.585c-.06 0-.106.047-.106.106l-.233 7.925.233 7.781c0 .06.046.106.106.106.06 0 .106-.046.106-.106l.255-7.781-.255-7.925c0-.06-.046-.106-.106-.106m.9-.569c-.061 0-.106.048-.106.107l-.234 8.494.234 8.34c0 .06.045.106.106.106.06 0 .106-.046.106-.106l.254-8.34-.254-8.494c0-.06-.046-.107-.106-.107m.899-.5c-.06 0-.106.047-.106.106l-.233 8.994.233 8.84c0 .06.046.106.106.106.061 0 .106-.046.106-.106l.255-8.84-.255-8.994c0-.06-.045-.106-.106-.106m.9-.5c-.061 0-.106.047-.106.106l-.234 9.494.234 9.34c0 .06.045.107.106.107.06 0 .106-.047.106-.107l.254-9.34-.254-9.494c0-.06-.046-.106-.106-.106m.899-.585c-.06 0-.106.047-.106.106l-.233 10.079.233 9.926c0 .06.046.106.106.106.06 0 .106-.046.106-.106l.255-9.926-.255-10.079c0-.06-.046-.106-.106-.106m.9-.539c-.061 0-.106.047-.106.106l-.234 10.618.234 10.465c0 .06.045.106.106.106.06 0 .106-.046.106-.106l.254-10.465-.254-10.618c0-.06-.046-.106-.106-.106m.899-.569c-.06 0-.106.048-.106.107l-.233 11.187.233 11.034c0 .06.046.106.106.106.061 0 .106-.046.106-.106l.255-11.034-.255-11.187c0-.06-.045-.107-.106-.107m.9-.5c-.061 0-.106.047-.106.106l-.234 11.687.234 11.534c0 .06.045.106.106.106.06 0 .106-.046.106-.106l.254-11.534-.254-11.687c0-.06-.046-.106-.106-.106m.899-.5c-.06 0-.106.047-.106.106l-.233 12.187.233 12.034c0 .06.046.107.106.107.06 0 .106-.047.106-.107l.255-12.034-.255-12.187c0-.06-.046-.106-.106-.106m.9-.585c-.061 0-.106.047-.106.106l-.234 12.772.234 12.619c0 .06.045.106.106.106.06 0 .106-.046.106-.106l.254-12.619-.254-12.772c0-.06-.046-.106-.106-.106m.899-.539c-.06 0-.106.047-.106.106l-.233 13.311.233 13.158c0 .06.046.106.106.106.061 0 .106-.046.106-.106l.255-13.158-.255-13.311c0-.06-.045-.106-.106-.106m.9-.569c-.061 0-.106.048-.106.107l-.234 13.88.234 13.727c0 .06.045.106.106.106.06 0 .106-.046.106-.106l.254-13.727-.254-13.88c0-.06-.046-.107-.106-.107m.899-.5c-.06 0-.106.047-.106.106l-.233 14.38.233 14.227c0 .06.046.106.106.106.06 0 .106-.046.106-.106l.255-14.227-.255-14.38c0-.06-.046-.106-.106-.106m.9-.5c-.061 0-.106.047-.106.106l-.234 14.88.234 14.727c0 .06.045.107.106.107.06 0 .106-.047.106-.107l.254-14.727-.254-14.88c0-.06-.046-.106-.106-.106"/>
      </svg>
    ),
    appleMusic: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208c-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03c.525 0 1.048-.034 1.57-.1.823-.106 1.597-.35 2.296-.81a5.28 5.28 0 0 0 1.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76 1.035-1.435 1.18-.96.207-1.93-.195-2.276-1.015-.46-1.088.207-2.36 1.37-2.604.088-.018.18-.024.27-.035l.426-.05V9.23c0-.08-.012-.102-.097-.088-.893.146-1.787.290-2.682.437-.068.01-.104.044-.104.113-.003 1.443-.002 2.884-.002 4.325v.734c-.004.39-.05.778-.224 1.14-.29.605-.77 1.06-1.462 1.188-.618.114-1.213.04-1.764-.3-.83-.51-1.293-1.45-.99-2.38.285-.872 1.054-1.433 1.95-1.434.09 0 .18.006.27.01.18.008.36.02.54.03l.232.017V6.892c0-.106.028-.14.136-.127.877.09 1.755.18 2.632.27l2.632.27c.248.026.495.054.743.08.05.006.08.03.08.082-.002 1.04-.002 2.08 0 3.12z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-6 glow-box-cyan"
      >
        {/* Artist Photo */}
        <div className="mb-6">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full aspect-square object-cover rounded-lg border-2 border-primary/50 glow-box-cyan"
          />
        </div>

        {/* Artist Name & Genre */}
        <div className="mb-6">
          <h2 className="text-3xl font-display text-primary glow-cyan-strong mb-2">
            {artist.name}
          </h2>
          <p className="text-lg text-foreground/70 font-body">{artist.genre}</p>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h3 className="text-sm font-display text-primary/70 mb-2 uppercase tracking-wider">
            {t('artistProfile.bio')}
          </h3>
          <p className="text-foreground/90 leading-relaxed">{artist.bio}</p>
        </div>

        {/* Tracks */}
        <div className="mb-6">
          <h3 className="text-sm font-display text-primary/70 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Music className="w-4 h-4" />
            {t('artistProfile.tracks')}
          </h3>
          <div className="space-y-2">
            {artist.tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-3 rounded bg-background/30 hover:bg-background/50 transition-colors"
              >
                <span className="text-sm text-foreground">{track.title}</span>
                <span className="text-xs text-foreground/50 font-mono">{formatDuration(track.duration)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-sm font-display text-primary/70 mb-3 uppercase tracking-wider flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            {t('artistProfile.socialLinks')}
          </h3>
          <div className="flex flex-wrap gap-3">
            {artist.socialLinks.spotify && (
              <a
                href={artist.socialLinks.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary hover:bg-primary/20 transition-all glow-box-cyan"
              >
                {socialIcons.spotify}
                <span className="text-sm">Spotify</span>
              </a>
            )}
            {artist.socialLinks.soundcloud && (
              <a
                href={artist.socialLinks.soundcloud}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary hover:bg-primary/20 transition-all glow-box-cyan"
              >
                {socialIcons.soundcloud}
                <span className="text-sm">SoundCloud</span>
              </a>
            )}
            {artist.socialLinks.appleMusic && (
              <a
                href={artist.socialLinks.appleMusic}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary hover:bg-primary/20 transition-all glow-box-cyan"
              >
                {socialIcons.appleMusic}
                <span className="text-sm">Apple Music</span>
              </a>
            )}
            {artist.socialLinks.instagram && (
              <a
                href={artist.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary hover:bg-primary/20 transition-all glow-box-cyan"
              >
                {socialIcons.instagram}
                <span className="text-sm">Instagram</span>
              </a>
            )}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
