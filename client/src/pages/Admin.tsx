import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getAllArtists, deleteArtist } from '@/lib/firebaseHelpers';
import type { Artist } from '@/hooks/useFirestoreArtists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Admin() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadArtists();
    }
  }, [user]);

  const loadArtists = async () => {
    setLoading(true);
    try {
      const data = await getAllArtists();
      setArtists(data);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const success = await login(email, password);
    if (!success) {
      setLoginError('Email ou senha inválidos');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar ${name}?`)) return;

    try {
      await deleteArtist(id);
      setArtists(artists.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting artist:', error);
      alert('Erro ao deletar artista');
    }
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

        {/* Add Artist Button */}
        <div className="mb-6">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Artista
          </Button>
        </div>

        {/* Artists List */}
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
      </div>
    </div>
  );
}
