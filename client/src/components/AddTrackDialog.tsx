import { useState, useRef } from 'react';
import { X, Upload, Music, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { createTrack, uploadAudio } from '@/lib/firebaseHelpers';
import type { Artist } from '@/hooks/useFirestoreArtists';

interface AddTrackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  artists: Artist[];
  onSuccess: () => void;
}

export default function AddTrackDialog({
  isOpen,
  onClose,
  artists,
  onSuccess,
}: AddTrackDialogProps) {
  const [title, setTitle] = useState('');
  const [artistIds, setArtistIds] = useState<string[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [tag, setTag] = useState<'unreleased' | 'tbd' | 'dubplate' | 'exclusive' | 'premiere' | ''>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav'];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato de arquivo inválido. Use MP3 ou WAV.');
      return;
    }

    // Validar tamanho (máx 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Máximo 50MB.');
      return;
    }

    setAudioFile(file);

    // Calcular duração do áudio
    const audio = new Audio(URL.createObjectURL(file));
    audio.addEventListener('loadedmetadata', () => {
      setDuration(Math.floor(audio.duration));
      URL.revokeObjectURL(audio.src);
    });

    toast.success(`Arquivo selecionado: ${file.name}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!title.trim()) {
      toast.error('Digite o título da track');
      return;
    }

    if (artistIds.length === 0) {
      toast.error('Selecione pelo menos um artista');
      return;
    }

    if (!audioFile) {
      toast.error('Selecione um arquivo de áudio');
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading('Fazendo upload do áudio...');

    try {
      // 1. Upload do áudio para B2
      const audioUrl = await uploadAudio(audioFile, 'audio');
      toast.dismiss(uploadToast);
      toast.loading('Salvando track no banco de dados...');

      // 2. Criar track no Firestore
      await createTrack({
        title: title.trim(),
        artistIds,
        audioUrl,
        duration,
        tag: tag || undefined,
      });

      toast.dismiss(uploadToast);
      toast.success(`Track "${title}" adicionada com sucesso!`);

      // Resetar formulário
      setTitle('');
      setArtistIds([]);
      setTag('');
      setAudioFile(null);
      setDuration(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating track:', error);
      toast.dismiss(uploadToast);
      toast.error('Erro ao adicionar track. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                  Adicionar Track
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
                    Título da Track *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Bass Revolution"
                    disabled={uploading}
                    required
                  />
                </div>

                {/* Artistas */}
                <div className="space-y-2">
                  <Label htmlFor="artist" className="text-primary/70">
                    Artistas *
                  </Label>
                  <div className="space-y-3">
                    {artistIds.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {artistIds.map(artistId => {
                          const artist = artists.find(a => a.id === artistId);
                          return (
                            <Badge key={artistId} variant="secondary" className="flex items-center gap-1">
                              {artist?.name}
                              <button
                                type="button"
                                onClick={() => setArtistIds(artistIds.filter(id => id !== artistId))}
                                className="ml-1 hover:text-destructive"
                                disabled={uploading}
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
                        if (value && !artistIds.includes(value)) {
                          setArtistIds([...artistIds, value]);
                        }
                      }}
                      disabled={uploading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Adicionar artista..." />
                      </SelectTrigger>
                      <SelectContent>
                        {artists
                          .filter(artist => !artistIds.includes(artist.id))
                          .map((artist) => (
                            <SelectItem key={artist.id} value={artist.id}>
                              {artist.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tag */}
                <div className="space-y-2">
                  <Label htmlFor="tag" className="text-primary/70">
                    Tag (opcional)
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={tag || undefined}
                      onValueChange={(value) => setTag(value as any)}
                      disabled={uploading}
                    >
                      <SelectTrigger className="flex-1">
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
                    {tag && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setTag('')}
                        disabled={uploading}
                        className="px-3"
                      >
                        Limpar
                      </Button>
                    )}
                  </div>
                </div>

                {/* Upload de Áudio */}
                <div className="space-y-2">
                  <Label className="text-primary/70">Arquivo de Áudio *</Label>
                  
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/mpeg,audio/mp3,audio/wav"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="hidden"
                      id="audio-upload"
                    />
                    
                    {audioFile ? (
                      <div className="space-y-3">
                        <Music className="w-12 h-12 text-primary mx-auto" />
                        <div>
                          <p className="text-primary font-display">
                            {audioFile.name}
                          </p>
                          <p className="text-sm text-foreground/50 mt-1">
                            Tamanho: {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {duration > 0 && (
                            <p className="text-sm text-primary/70 mt-1">
                              Duração: {formatDuration(duration)}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          Trocar arquivo
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="audio-upload"
                        className="cursor-pointer block"
                      >
                        <Upload className="w-12 h-12 text-primary/50 mx-auto mb-3" />
                        <p className="text-foreground/70 mb-2">
                          Clique para selecionar o arquivo de áudio
                        </p>
                        <p className="text-xs text-foreground/50">
                          MP3 ou WAV • Máximo 50MB
                        </p>
                      </label>
                    )}
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={uploading}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading || !audioFile}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Adicionar Track'
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
