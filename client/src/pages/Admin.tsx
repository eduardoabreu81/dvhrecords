import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { mockArtists, type Artist } from '@/data/artists';
import { Button } from '@/components/ui/button';
import { getLoginUrl } from '@/lib/auth';

/**
 * Painel Admin - DVH Records
 * 
 * NOTA: Este painel usa dados mock. Para produção, integrar com tRPC procedures
 * que manipulam artistas no banco de dados TiDB via Drizzle ORM.
 * 
 * Autenticação: Manus OAuth (não Firebase)
 */
export default function Admin() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadArtists();
    }
  }, [isAuthenticated]);

  const loadArtists = async () => {
    setLoading(true);
    try {
      // TODO: Substituir por trpc.artists.getAll.useQuery()
      setArtists(mockArtists);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar ${name}?`)) return;

    try {
      // TODO: Implementar trpc.artists.delete.useMutation()
      setArtists(prev => prev.filter(a => a.id !== id));
      alert(`${name} deletado com sucesso!`);
    } catch (error) {
      console.error('Error deleting artist:', error);
      alert('Erro ao deletar artista');
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  // Login screen (não autenticado)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-8 rounded-lg border border-cyan-500/30 max-w-md w-full"
        >
          <h1 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
            DVH Records Admin
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Faça login para acessar o painel administrativo
          </p>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
          >
            Login com Manus OAuth
          </Button>
        </motion.div>
      </div>
    );
  }

  // Admin panel (autenticado)
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400 mb-2">
              Painel Admin
            </h1>
            <p className="text-gray-400">
              Bem-vindo, {user?.name || user?.email || 'Admin'}
            </p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <Button
            onClick={() => alert('Funcionalidade em desenvolvimento: Adicionar Artista')}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Artista
          </Button>
        </div>

        {/* Artists List */}
        <div className="bg-gray-900 rounded-lg border border-cyan-500/30 p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            Artistas ({artists.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : artists.length === 0 ? (
            <p className="text-gray-400 text-center py-12">
              Nenhum artista cadastrado
            </p>
          ) : (
            <div className="space-y-4">
              {artists.map((artist) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {artist.genre} • {artist.tracks.length} tracks
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => alert('Funcionalidade em desenvolvimento: Editar Artista')}
                      variant="outline"
                      size="sm"
                      className="border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(artist.id, artist.name)}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-500 text-sm">
            <strong>Nota:</strong> Este painel usa dados mock. Para produção, implementar procedures tRPC para CRUD de artistas no banco TiDB.
          </p>
        </div>
      </div>
    </div>
  );
}
