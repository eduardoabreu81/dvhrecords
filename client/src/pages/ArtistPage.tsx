import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimplePlayer from '@/components/SimplePlayer';
import { useFirestoreArtists, type Artist, type Track, type Release } from '@/hooks/useFirestoreArtists';

export default function ArtistPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { artists, releases, loading, error } = useFirestoreArtists();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (artists.length > 0 && id) {
      const foundArtist = artists.find(a => a.id === id);
      setArtist(foundArtist || null);
      if (foundArtist && foundArtist.tracks.length > 0) {
        setCurrentTrack(foundArtist.tracks[0]);
      }
    }
  }, [artists, id]);

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleNext = () => {
    if (!artist || !currentTrack) return;
    const currentIndex = artist.tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % artist.tracks.length;
    setCurrentTrack(artist.tracks[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (!artist || !currentTrack) return;
    const currentIndex = artist.tracks.findIndex(t => t.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + artist.tracks.length) % artist.tracks.length;
    setCurrentTrack(artist.tracks[previousIndex]);
    setIsPlaying(true);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl glow-cyan">Loading...</div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary glow-cyan mb-4">
              {t('artistNotFound', 'Artist Not Found')}
            </h1>
            <button
              onClick={() => setLocation('/')}
              className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20 transition-all text-primary"
            >
              <ArrowLeft className="inline w-5 h-5 mr-2" />
              {t('backToHome', 'Back to Home')}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4">
        <div className="container mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setLocation('/')}
            className="mb-8 px-4 py-2 bg-card/30 border border-primary/30 rounded-lg hover:bg-card/50 hover:border-primary transition-all text-primary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToArtists', 'Back to Artists')}
          </motion.button>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Artist Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-primary/30 shadow-lg shadow-primary/20 glow-box-cyan"
              />
            </motion.div>

            {/* Artist Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-primary glow-cyan mb-3">
                {artist.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {artist.genre}
              </p>
              <p className="text-base text-foreground/80 leading-relaxed mb-6">
                {artist.bio}
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4">
                {artist.socialLinks && artist.socialLinks.length > 0 && artist.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20 transition-all text-primary flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Releases Section */}
      {releases.filter(r => r.artistId === id).length > 0 && (
        <section className="py-12 px-4 border-t border-border/30">
          <div className="container mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-primary glow-cyan mb-6"
            >
              Releases
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl">
              {releases.filter(r => r.artistId === id).map((release, index) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-card/30 border-2 border-primary/30 rounded-lg overflow-hidden transition-all hover:border-primary hover:bg-card/50 glow-box-cyan"
                >
                  <img
                    src={release.coverUrl}
                    alt={release.title}
                    className="w-full aspect-square object-cover border-b-2 border-primary/30 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <p className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                      {release.title}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {new Date(release.releaseDate).toLocaleDateString('pt-BR')}
                    </p>
                    {(release.links?.spotify || release.links?.appleMusic) && (
                      <div className="flex flex-col gap-2">
                        {release.links.spotify && (
                          <a
                            href={release.links.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm px-4 py-2 bg-primary/10 border border-primary/30 rounded hover:bg-primary/20 text-primary flex items-center justify-center gap-2 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Spotify
                          </a>
                        )}
                        {release.links.appleMusic && (
                          <a
                            href={release.links.appleMusic}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm px-4 py-2 bg-primary/10 border border-primary/30 rounded hover:bg-primary/20 text-primary flex items-center justify-center gap-2 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Apple Music
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tracks Section */}
      <section className="py-12 px-4 border-t border-border/30 pb-48">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-primary glow-cyan mb-6"
          >
            {t('tracks', 'Tracks')}
          </motion.h2>

          <div className="grid gap-4 max-w-4xl">
            {artist.tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handlePlayTrack(track)}
                className={`group flex items-center gap-4 p-4 bg-card/30 border rounded-lg cursor-pointer transition-all ${
                  currentTrack?.id === track.id
                    ? 'border-primary bg-card/50'
                    : 'border-border hover:border-primary/50 hover:bg-card/40'
                }`}
              >
                {/* Play Button */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 border border-primary/30 group-hover:bg-primary/20 group-hover:border-primary flex items-center justify-center transition-all">
                  <Play className="w-6 h-6 text-primary fill-primary" />
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                    {track.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {typeof track.duration === 'number' ? formatDuration(track.duration) : track.duration}
                  </p>
                </div>

                {/* Track Number */}
                <div className="flex-shrink-0 text-2xl font-bold text-primary/30 group-hover:text-primary/50 transition-colors">
                  #{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gallery Section */}
        {artist.gallery && artist.gallery.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-display text-primary glow-cyan mb-8">
              Galeria
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {artist.gallery.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-primary/30 hover:border-primary cursor-pointer group"
                >
                  <img
                    src={imageUrl}
                    alt={`${artist.name} gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Player Fixo */}
      {currentTrack && (
        <SimplePlayer
          artist={artist}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      <Footer />
    </div>
  );
}
