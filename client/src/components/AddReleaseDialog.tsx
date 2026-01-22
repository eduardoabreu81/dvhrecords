import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createRelease, updateRelease } from '@/lib/firebaseHelpers';
import { uploadToB2 } from '@/lib/b2Storage';
import type { Artist, Track } from '@/hooks/useFirestoreArtists';

interface Release {
  id?: string;
  trackId: string;
  artistId: string;
  title: string;
  coverUrl: string;
  releaseDate: string;
  links: {
    spotify?: string;
    appleMusic?: string;
  };
}

interface AddReleaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  artists: Artist[];
  tracks: Track[];
  editingRelease?: Release | null;
}

export default function AddReleaseDialog({ isOpen, onClose, onSuccess, artists, tracks, editingRelease }: AddReleaseDialogProps) {
  const [title, setTitle] = useState(editingRelease?.title || '');
  const [artistId, setArtistId] = useState(editingRelease?.artistId || '');
  const [trackId, setTrackId] = useState(editingRelease?.trackId || '');
  const [releaseDate, setReleaseDate] = useState(editingRelease?.releaseDate || '');
  const [spotify, setSpotify] = useState(editingRelease?.links?.spotify || '');
  const [appleMusic, setAppleMusic] = useState(editingRelease?.links?.appleMusic || '');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(editingRelease?.coverUrl || null);
  const [uploading, setUploading] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Filtrar tracks do artista selecionado
  const filteredTracks = artistId 
    ? tracks.filter(track => {
        const trackArtistIds = track.artistIds || (track.artistId ? [track.artistId] : []);
        return trackArtistIds.includes(artistId);
      })
    : [];

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo deve ser uma imagem');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Imagem deve ter no máximo 10MB');
      return;
    }

    setCoverFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !artistId || !trackId || !releaseDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!editingRelease && !coverFile) {
      toast.error('Selecione uma capa para o release');
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading(editingRelease ? 'Atualizando release...' : 'Criando release...');

    try {
      let coverUrl = editingRelease?.coverUrl || '';

      // Upload de nova capa se selecionada
      if (coverFile) {
        toast.loading('Fazendo upload da capa...', { id: uploadToast });
        coverUrl = await uploadToB2(coverFile, 'covers');
      }

      const releaseData = {
        title: title.trim(),
        artistId,
        trackId,
        coverUrl,
        releaseDate,
        links: {
          spotify: spotify.trim() || undefined,
          appleMusic: appleMusic.trim() || undefined,
        },
      };

      if (editingRelease) {
        await updateRelease(editingRelease.id!, releaseData);
        toast.success('Release atualizado com sucesso!', { id: uploadToast });
      } else {
        await createRelease(releaseData);
        toast.success('Release criado com sucesso!', { id: uploadToast });
      }

      // Resetar formulário
      setTitle('');
      setArtistId('');
      setTrackId('');
      setReleaseDate('');
      setSpotify('');
      setAppleMusic('');
      setCoverFile(null);
      setCoverPreview(null);
      if (coverInputRef.current) coverInputRef.current.value = '';

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving release:', error);
      toast.error('Erro ao salvar release. Tente novamente.', { id: uploadToast });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto glow-box-cyan"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-primary/30 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-display text-primary glow-cyan">
                  {editingRelease ? 'Editar Release' : 'Adicionar Release'}
                </h2>
                <button
                  onClick={onClose}
                  disabled={uploading}
                  className="p-2 rounded-full hover:bg-primary/10 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-primary/70">
                    Título do Release *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Bass Revolution EP"
                    disabled={uploading}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Artista */}
                  <div className="space-y-2">
                    <Label htmlFor="artist" className="text-primary/70">
                      Artista *
                    </Label>
                    <Select
                      value={artistId}
                      onValueChange={(value) => {
                        setArtistId(value);
                        setTrackId(''); // Reset track quando mudar artista
                      }}
                      disabled={uploading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o artista" />
                      </SelectTrigger>
                      <SelectContent>
                        {artists.map((artist) => (
                          <SelectItem key={artist.id} value={artist.id}>
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Track */}
                  <div className="space-y-2">
                    <Label htmlFor="track" className="text-primary/70">
                      Track *
                    </Label>
                    <Select
                      value={trackId}
                      onValueChange={setTrackId}
                      disabled={uploading || !artistId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={artistId ? "Selecione a track" : "Selecione um artista primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTracks.map((track) => (
                          <SelectItem key={track.id} value={track.id}>
                            {track.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Data de Lançamento */}
                <div className="space-y-2">
                  <Label htmlFor="releaseDate" className="text-primary/70">
                    Data de Lançamento *
                  </Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    disabled={uploading}
                    required
                  />
                </div>

                {/* Links */}
                <div className="border-t border-primary/20 pt-6">
                  <h3 className="text-lg font-display text-primary mb-4">Links de Streaming</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Spotify */}
                    <div className="space-y-2">
                      <Label htmlFor="spotify" className="text-primary/70">
                        Spotify
                      </Label>
                      <Input
                        id="spotify"
                        value={spotify}
                        onChange={(e) => setSpotify(e.target.value)}
                        placeholder="URL completa"
                        disabled={uploading}
                      />
                    </div>

                    {/* Apple Music */}
                    <div className="space-y-2">
                      <Label htmlFor="appleMusic" className="text-primary/70">
                        Apple Music
                      </Label>
                      <Input
                        id="appleMusic"
                        value={appleMusic}
                        onChange={(e) => setAppleMusic(e.target.value)}
                        placeholder="URL completa"
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </div>

                {/* Capa */}
                <div className="border-t border-primary/20 pt-6">
                  <h3 className="text-lg font-display text-primary mb-4">Capa do Release</h3>
                  <div className="space-y-2">
                    <Label className="text-primary/70">
                      Imagem da Capa {!editingRelease && '*'}
                    </Label>
                    
                    {coverPreview && (
                      <div className="relative aspect-square max-w-xs rounded-lg overflow-hidden mb-3 border-2 border-primary/30">
                        <img
                          src={coverPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleCoverChange}
                        disabled={uploading}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-primary/50 mx-auto mb-2" />
                        <p className="text-sm text-foreground/70">
                          Clique para selecionar
                        </p>
                        <p className="text-xs text-foreground/50 mt-1">
                          JPG, PNG ou WEBP (máx. 10MB)
                        </p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 justify-end pt-6 border-t border-primary/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={uploading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingRelease ? 'Atualizando...' : 'Criando...'}
                      </>
                    ) : (
                      editingRelease ? 'Atualizar Release' : 'Criar Release'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
