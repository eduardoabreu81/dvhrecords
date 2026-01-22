import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, LogOut, Loader2, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getAllArtists, deleteArtist, getAllTracks, deleteTrack } from '@/lib/firebaseHelpers';
import type { Artist, Track } from '@/hooks/useFirestoreArtists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddTrackDialog from '@/components/AddTrackDialog';

export default function Admin() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddTrackDialog, setShowAddTrackDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [artistsData, tracksData] = await Promise.all([
        getAllArtists(),
        getAllTracks(),
      ]);
      setArtists(artistsData);
      setTracks(tracksData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const loadingToast = toast.loading('Fazendo login...');
    const success = await login(email, password);
    toast.dismiss(loadingToast);
    
    if (!success) {
      setLoginError('Email ou senha inválidos');
      toast.error('Email ou senha inválidos');
    } else {
      toast.success('Login realizado com sucesso!');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar ${name}?`)) return;

    const loadingToast = toast.loading(`Deletando ${name}...`);
    
    try {
      await deleteArtist(id);
      setArtists(artists.filter((a) => a.id !== id));
      toast.dismiss(loadingToast);
      toast.success(`${name} deletado com sucesso!`);
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast.dismiss(loadingToast);
      toast.error('Erro ao deletar artista');
    }
  };

  const handleDeleteTrack = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${title}"?`)) return;

    const loadingToast = toast.loading(`Deletando track...`);
    
    try {
      await deleteTrack(id);
      setTracks(tracks.filter((t) => t.id !== id));
      toast.dismiss(loadingToast);
      toast.success(`Track "${title}" deletada com sucesso!`);
    } catch (error) {
      console.error('Error deleting track:', error);
      toast.dismiss(loadingToast);
      toast.error('Erro ao deletar track');
    }
  };

  const getArtistName = (artistId?: string) => {
    if (!artistId) return 'Unknown Artist';
    const artist = artists.find(a => a.id === artistId);
    return artist?.name || 'Unknown Artist';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Login Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-8 glow-box-cyan"
        >
          <h1 className="text-3xl font-display text-primary glow-cyan-strong mb-6 text-center">
            DVH RECORDS ADMIN
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-display text-primary/70 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-display text-primary/70 mb-2">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display text-primary glow-cyan-strong">
            ADMIN PANEL
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-foreground/70">{user.email}</span>
            <Button
              variant="outline"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="artists" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="artists">Artistas ({artists.length})</TabsTrigger>
            <TabsTrigger value="tracks">Tracks ({tracks.length})</TabsTrigger>
          </TabsList>

          {/* Tab: Artists */}
          <TabsContent value="artists">
            <div className="mb-6">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Artista
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : artists.length === 0 ? (
              <div className="text-center py-12 text-foreground/50">
                Nenhum artista cadastrado. Clique em "Adicionar Artista" para começar.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.map((artist) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-4 glow-box-cyan"
                  >
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full aspect-square object-cover rounded-lg mb-4 border-2 border-primary/50"
                    />
                    
                    <h3 className="text-xl font-display text-primary glow-cyan mb-1">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4">{artist.genre}</p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(artist.id, artist.name)}
                        className="flex items-center justify-center gap-2 border-red-500/50 text-red-500 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Tracks */}
          <TabsContent value="tracks">
            <div className="mb-6">
              <Button 
                onClick={() => setShowAddTrackDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Track
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : tracks.length === 0 ? (
              <div className="text-center py-12 text-foreground/50">
                Nenhuma track cadastrada. Clique em "Adicionar Track" para começar.
              </div>
            ) : (
              <div className="space-y-3">
                {tracks.map((track) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-4 flex items-center gap-4 glow-box-cyan hover:border-primary/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-primary glow-cyan truncate">
                        {track.title}
                      </h3>
                      <p className="text-sm text-foreground/70">
                        {getArtistName(track.artistId)} • {formatDuration(track.duration || 0)}
                      </p>
                      {track.releaseDate && (
                        <p className="text-xs text-foreground/50">
                          Lançamento: {new Date(track.releaseDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>

                    {track.audioUrl && (
                      <a
                        href={track.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary/70 hover:text-primary text-xs"
                      >
                        Ver arquivo
                      </a>
                    )}

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTrack(track.id, track.title)}
                        className="flex items-center gap-2 border-red-500/50 text-red-500 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add Track Dialog */}
        <AddTrackDialog
          isOpen={showAddTrackDialog}
          onClose={() => setShowAddTrackDialog(false)}
          artists={artists}
          onSuccess={loadData}
        />
      </div>
    </div>
  );
}
