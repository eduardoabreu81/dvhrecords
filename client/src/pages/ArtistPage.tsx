import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimplePlayer from '@/components/SimplePlayer';
import { useFirestoreArtists, type Artist, type Track } from '@/hooks/useFirestoreArtists';

export default function ArtistPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { artists, loading, error } = useFirestoreArtists();
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
      <section className="relative pt-32 pb-20 px-4">
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

          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Artist Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-80 h-80 rounded-full object-cover border-4 border-primary/30 shadow-lg shadow-primary/20 glow-box-cyan"
              />
            </motion.div>

            {/* Artist Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <h1 className="text-6xl font-bold text-primary glow-cyan mb-4">
                {artist.name}
              </h1>
              <p className="text-2xl text-muted-foreground mb-6">
                {artist.genre}
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                {artist.bio}
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4">
                {artist.socialLinks.spotify && (
                  <a
                    href={artist.socialLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-lg hover:bg-[#1DB954]/20 transition-all text-[#1DB954] flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Spotify
                  </a>
                )}
                {artist.socialLinks.soundcloud && (
                  <a
                    href={artist.socialLinks.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#FF5500]/10 border border-[#FF5500]/30 rounded-lg hover:bg-[#FF5500]/20 transition-all text-[#FF5500] flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    SoundCloud
                  </a>
                )}
                {artist.socialLinks.instagram && (
                  <a
                    href={artist.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#E1306C]/10 border border-[#E1306C]/30 rounded-lg hover:bg-[#E1306C]/20 transition-all text-[#E1306C] flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Instagram
                  </a>
                )}
                {artist.socialLinks.appleMusic && (
                  <a
                    href={artist.socialLinks.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#FA243C]/10 border border-[#FA243C]/30 rounded-lg hover:bg-[#FA243C]/20 transition-all text-[#FA243C] flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Apple Music
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-primary glow-cyan mb-12"
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
                className={`group flex items-center gap-6 p-6 bg-card/30 border rounded-lg cursor-pointer transition-all ${
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
                    {track.duration}
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
