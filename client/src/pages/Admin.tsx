import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, LogOut, Loader2, Music, AlertTriangle, Play, Pause, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getAllArtists, deleteArtist, getAllTracks, deleteTrack, updateTrack, getAllReleases, deleteRelease, getAboutContent, updateAboutContent, type AboutContent } from '@/lib/firebaseHelpers';
import type { Artist, Track } from '@/hooks/useFirestoreArtists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AddTrackDialog from '@/components/AddTrackDialog';
import AddArtistDialog from '@/components/AddArtistDialog';
import AddReleaseDialog from '@/components/AddReleaseDialog';
import { trpc, trpcClient } from '@/lib/trpc';
import type { Release } from '@/hooks/useFirestoreArtists';
import { Textarea } from '@/components/ui/textarea';

export default function Admin() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddTrackDialog, setShowAddTrackDialog] = useState(false);
  const [showAddArtistDialog, setShowAddArtistDialog] = useState(false);
  const [showAddReleaseDialog, setShowAddReleaseDialog] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtistIds, setEditArtistIds] = useState<string[]>([]);
  const [editTag, setEditTag] = useState<'unreleased' | 'tbd' | 'dubplate' | 'exclusive' | 'premiere' | ''>('');
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [editingAbout, setEditingAbout] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [artistsData, tracksData, releasesData, aboutData] = await Promise.all([
        getAllArtists(),
        getAllTracks(),
        getAllReleases(),
        getAboutContent(),
      ]);
      setArtists(artistsData);
      setTracks(tracksData);
      setReleases(releasesData as Release[]);
      
      // Se não houver about, criar um padrão
      if (!aboutData) {
        setAboutContent({
          title: 'ABOUT DVH',
          paragraphs: [
            'A DVH Records é uma gravadora digital independente nascida da paixão pela música eletrônica e pela cultura bass.',
            'Nossa missão é criar uma ponte entre produtores talentosos e o público global.',
            'Com um roster diversificado, a DVH Records constrói carreiras e cultiva comunidades.',
          ],
          philosophyTitle: 'Nossa Filosofia',
          philosophyItems: [
            { title: 'Qualidade acima de tudo', description: 'Cada lançamento passa por um processo rigoroso de curadoria.' },
            { title: 'Apoio aos artistas', description: 'Fornecemos suporte completo em produção, distribuição e marketing.' },
          ],
          tagline: 'Global sounds. Bass driven.',
          backgroundImage: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1920',
        });
      } else {
        setAboutContent(aboutData);
      }
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

  const handleDeleteRelease = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja deletar o release "${title}"?`)) return;

    const loadingToast = toast.loading(`Deletando release...`);
    
    try {
      await deleteRelease(id);
      setReleases(releases.filter((r) => r.id !== id));
      toast.dismiss(loadingToast);
      toast.success(`Release "${title}" deletado com sucesso!`);
    } catch (error) {
      console.error('Error deleting release:', error);
      toast.dismiss(loadingToast);
      toast.error('Erro ao deletar release');
    }
  };

  const handleVerifyAndCleanTracks = async () => {
    const loadingToast = toast.loading('Verificando arquivos no Backblaze...');
    
    try {
      const orphanedTracks: Track[] = [];
      
      // Verificar cada track
      for (const track of tracks) {
        if (track.audioUrl) {
          try {
            const result = await trpcClient.storage.checkFileExists.query({ fileUrl: track.audioUrl });
            if (!result.exists) {
              orphanedTracks.push(track);
            }
          } catch (error) {
            console.error(`Error checking file for track ${track.id}:`, error);
          }
        }
      }
      
      toast.dismiss(loadingToast);
      
      if (orphanedTracks.length === 0) {
        toast.success('Todas as tracks estão sincronizadas!');
        return;
      }
      
      // Perguntar ao usuário se quer deletar
      const confirmToast = toast.warning(
        `Encontradas ${orphanedTracks.length} track(s) com arquivos ausentes no Backblaze. Deseja removê-las?`,
        {
          duration: Infinity,
          action: {
            label: 'Remover',
            onClick: async () => {
              const deleteToast = toast.loading('Removendo tracks órfãs...');
              try {
                for (const track of orphanedTracks) {
                  await deleteTrack(track.id);
                }
                setTracks(tracks.filter(t => !orphanedTracks.find(ot => ot.id === t.id)));
                toast.dismiss(deleteToast);
                toast.success(`${orphanedTracks.length} track(s) removida(s) com sucesso!`);
              } catch (error) {
                console.error('Error deleting orphaned tracks:', error);
                toast.dismiss(deleteToast);
                toast.error('Erro ao remover tracks órfãs');
              }
            },
          },
        }
      );
    } catch (error) {
      console.error('Error verifying tracks:', error);
      toast.dismiss(loadingToast);
      toast.error('Erro ao verificar tracks');
    }
  };

  const handlePlayPause = (track: Track) => {
    if (!track.audioUrl) return;

    if (playingTrackId === track.id && audioElement) {
      audioElement.pause();
      setPlayingTrackId(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      
      const audio = new Audio(track.audioUrl);
      
      audio.onerror = () => {
        toast.error(`Erro ao carregar áudio: ${track.title}`);
        setPlayingTrackId(null);
      };
      
      audio.onended = () => setPlayingTrackId(null);
      
      audio.play()
        .then(() => {
          setAudioElement(audio);
          setPlayingTrackId(track.id);
        })
        .catch((error) => {
          console.error('Audio play error:', error);
          toast.error(`Não foi possível tocar: ${track.title}`);
        });
    }
  };

  const handleEditTrack = (track: Track) => {
    setEditingTrack(track);
    setEditTitle(track.title);
    // Suportar tanto artistIds (novo) quanto artistId (antigo)
    const ids = track.artistIds || (track.artistId ? [track.artistId] : []);
    setEditArtistIds(ids);
    setEditTag(track.tag || '');
  };

  const handleSaveEdit = async () => {
    if (!editingTrack) return;
    
    if (!editTitle.trim()) {
      toast.error('Digite um título válido');
      return;
    }

    if (editArtistIds.length === 0) {
      toast.error('Selecione pelo menos um artista');
      return;
    }

    const loadingToast = toast.loading('Atualizando track...');

    try {
      await updateTrack(editingTrack.id, {
        title: editTitle.trim(),
        artistIds: editArtistIds,
        tag: editTag || undefined,
      });

      // Atualizar na lista local
      setTracks(tracks.map(t => 
        t.id === editingTrack.id 
          ? { ...t, title: editTitle.trim(), artistIds: editArtistIds, tag: editTag || null, artistId: undefined }
          : t
      ));

      toast.dismiss(loadingToast);
      toast.success('Track atualizada com sucesso!');
      setEditingTrack(null);
    } catch (error) {
      console.error('Error updating track:', error);
      toast.dismiss(loadingToast);
      toast.error('Erro ao atualizar track');
    }
  };

  const getTagStyle = (tag: string | null | undefined) => {
    switch (tag) {
      case 'unreleased':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'tbd':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'dubplate':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'exclusive':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'premiere':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return '';
    }
  };

  const getArtistNames = (track: Track): string => {
    // Suportar tanto artistIds (novo) quanto artistId (antigo)
    const ids = track.artistIds || (track.artistId ? [track.artistId] : []);
    
    if (ids.length === 0) return 'Unknown Artist';
    
    const artistNames = ids
      .map(id => artists.find(a => a.id === id)?.name || 'Unknown')
      .filter(name => name !== 'Unknown');
    
    return artistNames.length > 0 ? artistNames.join(', ') : 'Unknown Artist';
  };

  const handleSaveAbout = async () => {
    if (!aboutContent) return;

    // Validação básica
    if (!aboutContent.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (aboutContent.paragraphs.length === 0 || aboutContent.paragraphs.every(p => !p.trim())) {
      toast.error('Adicione pelo menos um parágrafo');
      return;
    }

    const loadingToast = toast.loading('Salvando About...');
    
    try {
      await updateAboutContent({
        title: aboutContent.title.trim(),
        paragraphs: aboutContent.paragraphs.filter(p => p.trim()),
        philosophyTitle: aboutContent.philosophyTitle.trim(),
        philosophyItems: aboutContent.philosophyItems.filter(item => 
          item.title.trim() && item.description.trim()
        ),
        tagline: aboutContent.tagline.trim(),
        backgroundImage: aboutContent.backgroundImage?.trim(),
      });

      toast.dismiss(loadingToast);
      toast.success('About atualizado com sucesso!');
      setEditingAbout(false);
    } catch (error) {
      console.error('Error updating about:', error);
      toast.dismiss(loadingToast);
      toast.error('Erro ao atualizar About');
    }
  };

  const handleAddPhilosophyItem = () => {
    if (!aboutContent) return;
    setAboutContent({
      ...aboutContent,
      philosophyItems: [
        ...aboutContent.philosophyItems,
        { title: '', description: '' }
      ]
    });
  };

  const handleRemovePhilosophyItem = (index: number) => {
    if (!aboutContent) return;
    setAboutContent({
      ...aboutContent,
      philosophyItems: aboutContent.philosophyItems.filter((_, i) => i !== index)
    });
  };

  const handleAddParagraph = () => {
    if (!aboutContent) return;
    setAboutContent({
      ...aboutContent,
      paragraphs: [...aboutContent.paragraphs, '']
    });
  };

  const handleRemoveParagraph = (index: number) => {
    if (!aboutContent) return;
    setAboutContent({
      ...aboutContent,
      paragraphs: aboutContent.paragraphs.filter((_, i) => i !== index)
    });
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
            <TabsTrigger value="releases">Releases ({releases.length})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Tab: Artists */}
          <TabsContent value="artists">
            <div className="mb-6">
              <Button 
                onClick={() => {
                  setEditingArtist(null);
                  setShowAddArtistDialog(true);
                }}
                className="flex items-center gap-2"
              >
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
                        onClick={() => {
                          setEditingArtist(artist);
                          setShowAddArtistDialog(true);
                        }}
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
            <div className="mb-6 flex gap-3">
              <Button 
                onClick={() => setShowAddTrackDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Track
              </Button>
              
              <Button 
                onClick={handleVerifyAndCleanTracks}
                variant="outline"
                className="flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Verificar Sincronização
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display text-primary glow-cyan truncate">
                          {track.title}
                        </h3>
                        {track.tag && (
                          <Badge variant="outline" className={`text-xs ${getTagStyle(track.tag)}`}>
                            {track.tag.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground/70">
                        {getArtistNames(track)} • {formatDuration(track.duration || 0)}
                      </p>
                      {track.releaseDate && (
                        <p className="text-xs text-foreground/50">
                          Lançamento: {new Date(track.releaseDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {track.audioUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePlayPause(track)}
                          className="flex items-center gap-2"
                        >
                          {playingTrackId === track.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTrack(track)}
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

          {/* Tab: Releases */}
          <TabsContent value="releases">
            <div className="mb-6">
              <Button 
                onClick={() => {
                  setEditingRelease(null);
                  setShowAddReleaseDialog(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Release
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : releases.length === 0 ? (
              <div className="text-center py-12 text-foreground/50">
                Nenhum release cadastrado. Clique em "Adicionar Release" para começar.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {releases.map((release) => {
                  const artist = artists.find(a => a.id === release.artistId);
                  const track = tracks.find(t => t.id === release.trackId);
                  
                  return (
                    <motion.div
                      key={release.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg overflow-hidden glow-box-cyan"
                    >
                      <img
                        src={release.coverUrl}
                        alt={release.title}
                        className="w-full aspect-square object-cover border-b-2 border-primary/50"
                      />
                      
                      <div className="p-4">
                        <h3 className="text-xl font-display text-primary glow-cyan mb-1 truncate">
                          {release.title}
                        </h3>
                        <p className="text-sm text-foreground/70 mb-1 truncate">
                          {artist?.name || 'Unknown Artist'}
                        </p>
                        <p className="text-xs text-foreground/50 mb-3 truncate">
                          {track?.title || 'Unknown Track'}
                        </p>
                        <p className="text-xs text-foreground/50 mb-4">
                          {new Date(release.releaseDate).toLocaleDateString('pt-BR')}
                        </p>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingRelease(release);
                              setShowAddReleaseDialog(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRelease(release.id!, release.title)}
                            className="flex items-center justify-center gap-2 border-red-500/50 text-red-500 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Tab: About */}
          <TabsContent value="about">
            {!aboutContent ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum conteúdo About configurado ainda.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Gerenciar About</h3>
                  {editingAbout ? (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveAbout} variant="default">
                        Salvar
                      </Button>
                      <Button onClick={() => {
                        setEditingAbout(false);
                        loadData(); // Recarregar dados originais
                      }} variant="outline">
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setEditingAbout(true)} variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={aboutContent.title}
                      onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                      disabled={!editingAbout}
                      placeholder="ABOUT DVH"
                    />
                  </div>

                  {/* Paragraphs */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Parágrafos</Label>
                      {editingAbout && (
                        <Button onClick={handleAddParagraph} variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar Parágrafo
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {aboutContent.paragraphs.map((para, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={para}
                            onChange={(e) => {
                              const newParagraphs = [...aboutContent.paragraphs];
                              newParagraphs[index] = e.target.value;
                              setAboutContent({ ...aboutContent, paragraphs: newParagraphs });
                            }}
                            disabled={!editingAbout}
                            placeholder={`Parágrafo ${index + 1}`}
                            rows={3}
                          />
                          {editingAbout && (
                            <Button
                              onClick={() => handleRemoveParagraph(index)}
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Philosophy Section */}
                  <div className="border-t pt-6">
                    <div className="mb-4">
                      <Label>Título da Filosofia</Label>
                      <Input
                        value={aboutContent.philosophyTitle}
                        onChange={(e) => setAboutContent({ ...aboutContent, philosophyTitle: e.target.value })}
                        disabled={!editingAbout}
                        placeholder="Nossa Filosofia"
                      />
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      <Label>Itens da Filosofia</Label>
                      {editingAbout && (
                        <Button onClick={handleAddPhilosophyItem} variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar Item
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {aboutContent.philosophyItems.map((item, index) => (
                        <div key={index} className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <Label>Item {index + 1}</Label>
                            {editingAbout && (
                              <Button
                                onClick={() => handleRemovePhilosophyItem(index)}
                                variant="ghost"
                                size="icon"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Input
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...aboutContent.philosophyItems];
                                newItems[index].title = e.target.value;
                                setAboutContent({ ...aboutContent, philosophyItems: newItems });
                              }}
                              disabled={!editingAbout}
                              placeholder="Título (ex: Qualidade acima de tudo)"
                            />
                            <Textarea
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...aboutContent.philosophyItems];
                                newItems[index].description = e.target.value;
                                setAboutContent({ ...aboutContent, philosophyItems: newItems });
                              }}
                              disabled={!editingAbout}
                              placeholder="Descrição do item"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tagline */}
                  <div className="border-t pt-6">
                    <Label>Tagline</Label>
                    <Input
                      value={aboutContent.tagline}
                      onChange={(e) => setAboutContent({ ...aboutContent, tagline: e.target.value })}
                      disabled={!editingAbout}
                      placeholder="Global sounds. Bass driven."
                    />
                  </div>

                  {/* Background Image */}
                  <div>
                    <Label>URL da Imagem de Fundo</Label>
                    <Input
                      value={aboutContent.backgroundImage || ''}
                      onChange={(e) => setAboutContent({ ...aboutContent, backgroundImage: e.target.value })}
                      disabled={!editingAbout}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
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

        {/* Edit Track Dialog */}
        <Dialog open={!!editingTrack} onOpenChange={(open) => !open && setEditingTrack(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Track</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mb-4">Atualize as informações da track</p>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Nome da track"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-artist">Artistas</Label>
                <div className="space-y-3">
                  {editArtistIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {editArtistIds.map(artistId => {
                        const artist = artists.find(a => a.id === artistId);
                        return (
                          <Badge key={artistId} variant="secondary" className="flex items-center gap-1">
                            {artist?.name}
                            <button
                              onClick={() => setEditArtistIds(editArtistIds.filter(id => id !== artistId))}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                  
                  <Select 
                    value="" 
                    onValueChange={(value) => {
                      if (value && !editArtistIds.includes(value)) {
                        setEditArtistIds([...editArtistIds, value]);
                      }
                    }}
                  >
                    <SelectTrigger id="edit-artist">
                      <SelectValue placeholder="Adicionar artista..." />
                    </SelectTrigger>
                    <SelectContent>
                      {artists
                        .filter(artist => !editArtistIds.includes(artist.id))
                        .map((artist) => (
                          <SelectItem key={artist.id} value={artist.id}>
                            {artist.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tag">Tag</Label>
                <div className="flex gap-2">
                  <Select
                    value={editTag || undefined}
                    onValueChange={(value) => setEditTag(value as any)}
                  >
                    <SelectTrigger id="edit-tag" className="flex-1">
                      <SelectValue placeholder="Nenhuma tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unreleased">Unreleased</SelectItem>
                      <SelectItem value="tbd">TBD</SelectItem>
                      <SelectItem value="dubplate">Dubplate</SelectItem>
                      <SelectItem value="exclusive">Exclusive</SelectItem>
                      <SelectItem value="premiere">Premiere</SelectItem>
                    </SelectContent>
                  </Select>
                  {editTag && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditTag('')}
                      className="px-3"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTrack(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Artist Dialog */}
        <AddArtistDialog
          isOpen={showAddArtistDialog}
          onClose={() => {
            setShowAddArtistDialog(false);
            setEditingArtist(null);
          }}
          onSuccess={loadData}
          editingArtist={editingArtist}
        />

        {/* Add Release Dialog */}
        <AddReleaseDialog
          isOpen={showAddReleaseDialog}
          onClose={() => {
            setShowAddReleaseDialog(false);
            setEditingRelease(null);
          }}
          onSuccess={loadData}
          artists={artists}
          tracks={tracks}
          editingRelease={editingRelease}
        />
      </div>
    </div>
  );
}
