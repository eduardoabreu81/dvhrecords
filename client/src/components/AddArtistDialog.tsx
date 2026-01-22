import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createArtist, updateArtist } from '@/lib/firebaseHelpers';
import { uploadToB2 } from '@/lib/b2Storage';
import type { Artist, SocialLink } from '@/hooks/useFirestoreArtists';

interface AddArtistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingArtist?: Artist | null;
}

export default function AddArtistDialog({ isOpen, onClose, onSuccess, editingArtist }: AddArtistDialogProps) {
  const [name, setName] = useState(editingArtist?.name || '');
  const [genre, setGenre] = useState(editingArtist?.genre || '');
  const [bio, setBio] = useState(editingArtist?.bio || '');
  const [bioEn, setBioEn] = useState(editingArtist?.bioEn || '');
  const [bioEs, setBioEs] = useState(editingArtist?.bioEs || '');
  const [country, setCountry] = useState(editingArtist?.country || '');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(editingArtist?.socialLinks || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(editingArtist?.image || null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(editingArtist?.gallery || []);
  const [uploading, setUploading] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Limitar a 15 fotos
    if (galleryPreviews.length + fileArray.length > 15) {
      toast.error('Máximo de 15 fotos na galeria');
      return;
    }

    const validFiles: File[] = [];
    const previews: string[] = [];

    fileArray.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} não é uma imagem válida`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} excede 10MB`);
        return;
      }

      validFiles.push(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === validFiles.length) {
          setGalleryFiles([...galleryFiles, ...validFiles]);
          setGalleryPreviews([...galleryPreviews, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
    setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { name: '', url: '' }]);
  };

  const updateSocialLink = (index: number, field: 'name' | 'url', value: string) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !genre.trim() || !bio.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!editingArtist && !imageFile) {
      toast.error('Selecione uma imagem de perfil');
      return;
    }

    // Validar links sociais (remover vazios)
    const validSocialLinks = socialLinks.filter(link => link.name.trim() && link.url.trim());

    setUploading(true);
    const uploadToast = toast.loading(editingArtist ? 'Atualizando artista...' : 'Criando artista...');

    try {
      let imageUrl = editingArtist?.image || '';
      const galleryUrls = [...(editingArtist?.gallery || [])];

      // Upload de nova imagem se selecionada
      if (imageFile) {
        toast.loading('Fazendo upload da imagem de perfil...', { id: uploadToast });
        imageUrl = await uploadToB2(imageFile, 'images');
      }

      // Upload de novas fotos da galeria
      if (galleryFiles.length > 0) {
        toast.loading(`Fazendo upload de ${galleryFiles.length} fotos da galeria...`, { id: uploadToast });
        for (const file of galleryFiles) {
          const url = await uploadToB2(file, 'images');
          galleryUrls.push(url);
        }
      }

      const artistData = {
        name: name.trim(),
        genre: genre.trim(),
        bio: bio.trim(),
        bioEn: bioEn.trim() || bio.trim(),
        bioEs: bioEs.trim() || bio.trim(),
        country: country.trim(),
        image: imageUrl,
        gallery: galleryUrls,
        socialLinks: validSocialLinks,
      };

      if (editingArtist) {
        await updateArtist(editingArtist.id, artistData);
        toast.success('Artista atualizado com sucesso!', { id: uploadToast });
      } else {
        await createArtist(artistData as any);
        toast.success('Artista criado com sucesso!', { id: uploadToast });
      }

      // Resetar formulário
      setName('');
      setGenre('');
      setBio('');
      setBioEn('');
      setBioEs('');
      setCountry('');
      setInstagram('');
      setSoundcloud('');
      setSocialLinks([]);
      setImageFile(null);
      setGalleryFiles([]);
      setImagePreview(null);
      setGalleryPreviews([]);
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (galleryInputRef.current) gallery
      onClose();
    } catch (error) {
      console.error('Error saving artist:', error);
      toast.error('Erro ao salvar artista. Tente novamente.', { id: uploadToast });
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
              className="relative bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto glow-box-cyan"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-primary/30 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-display text-primary glow-cyan">
                  {editingArtist ? 'Editar Artista' : 'Adicionar Artista'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-primary/70">
                      Nome do Artista *
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: DJ Producer"
                      disabled={uploading}
                      required
                    />
                  </div>

                  {/* Gênero */}
                  <div className="space-y-2">
                    <Label htmlFor="genre" className="text-primary/70">
                      Gênero Musical *
                    </Label>
                    <Input
                      id="genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      placeholder="Ex: Drum & Bass"
                      disabled={uploading}
                      required
                    />
                  </div>

                  {/* País */}
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-primary/70">
                      País
                    </Label>
                    <Input
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Ex: Brasil"
                      disabled={uploading}
                    />
                  </div>
                </div>

                {/* Bio PT */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-primary/70">
                    Bio (Português) *
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Biografia do artista em português..."
                    rows={4}
                    disabled={uploading}
                    required
                  />
                </div>

                {/* Bio EN */}
                <div className="space-y-2">
                  <Label htmlFor="bioEn" className="text-primary/70">
                    Bio (English)
                  </Label>
                  <Textarea
                    id="bioEn"
                    value={bioEn}
                    onChange={(e) => setBioEn(e.target.value)}
                    placeholder="Artist bio in English..."
                    rows={4}
                    disabled={uploading}
                  />
                </div>

                {/* Bio ES */}
                <div className="space-y-2">
                  <Label htmlFor="bioEs" className="text-primary/70">
                    Bio (Español)
                  </Label>
                  <Textarea
                    id="bioEs"
                    value={bioEs}
                    onChange={(e) => setBioEs(e.target.value)}
                    placeholder="Biografía del artista en español..."
                    rows={4}
                    disabled={uploading}
                  />
                </div>

                <div className="border-t border-primary/20 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-display text-primary">Links Sociais</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSocialLink}
                      disabled={uploading}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Link
                    </Button>
                  </div>

                  {socialLinks.length === 0 ? (
                    <p className="text-sm text-foreground/50 text-center py-4">
                      Nenhum link social adicionado. Clique em "Adicionar Link" para começar.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {socialLinks.map((link, index) => (
                        <div key={index} className="flex gap-3 items-start p-3 bg-card/30 rounded-lg border border-primary/20">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <Input
                              value={link.name}
                              onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                              placeholder="Nome (ex: Instagram, SoundCloud)"
                              disabled={uploading}
                            />
                            <Input
                              value={link.url}
                              onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                              placeholder="URL completa"
                              disabled={uploading}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeSocialLink(index)}
                            disabled={uploading}
                            className="border-red-500/50 text-red-500 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-primary/20 pt-6">
                  <h3 className="text-lg font-display text-primary mb-4">Imagens</h3>
                  <div className="space-y-6">
                    {/* Imagem de Perfil */}
                    <div className="space-y-2">
                      <Label className="text-primary/70">
                        Imagem de Perfil {!editingArtist && '*'}
                      </Label>
                      
                      {imagePreview && (
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-3 border-2 border-primary/30">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageChange}
                          disabled={uploading}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
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

                    {/* Galeria */}
                    <div className="space-y-2">
                      <Label className="text-primary/70">
                        Galeria de Fotos (até 15 fotos)
                      </Label>
                      <p className="text-xs text-foreground/50">
                        Essas fotos aparecerão na página completa do artista
                      </p>
                      
                      {galleryPreviews.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                          {galleryPreviews.map((preview, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary/30 group">
                              <img
                                src={preview}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={uploading}
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {galleryPreviews.length < 15 && (
                        <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleCoverChange}
                            disabled={uploading}
                            multiple
                            className="hidden"
                            id="gallery-upload"
                          />
                          <label htmlFor="gallery-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 text-primary/50 mx-auto mb-2" />
                            <p className="text-sm text-foreground/70">
                              Clique para adicionar fotos
                            </p>
                            <p className="text-xs text-foreground/50 mt-1">
                              JPG, PNG ou WEBP (máx. 10MB cada)<br />
                              {galleryPreviews.length}/15 fotos
                            </p>
                          </label>
                        </div>
                      )}
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
                        {editingArtist ? 'Atualizando...' : 'Criando...'}
                      </>
                    ) : (
                      editingArtist ? 'Atualizar Artista' : 'Criar Artista'
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
