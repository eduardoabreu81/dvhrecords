import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Submit() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    genre: '',
    demoLink: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular envio (em produção, você enviaria para Firebase ou email)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setSuccess(true);
    setFormData({ name: '', email: '', genre: '', demoLink: '', message: '' });

    setTimeout(() => setSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="submit" className="min-h-screen bg-background flex items-center justify-center py-20 px-4">
      <div className="container max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-display text-center text-primary glow-cyan-strong mb-6"
        >
          SUBMIT YOUR DEMO
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-foreground/70 mb-12 text-lg"
        >
          Envie sua demo e faça parte do roster DVH Records
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-8 glow-box-cyan"
        >
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 glow-box-cyan">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display text-primary glow-cyan mb-2">
                Demo Enviada!
              </h3>
              <p className="text-foreground/70">
                Obrigado pelo envio. Analisaremos sua demo e entraremos em contato em breve.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-display text-primary/70 mb-2">
                    Nome do Artista *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome artístico"
                  />
                </div>

                <div>
                  <label className="block text-sm font-display text-primary/70 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-display text-primary/70 mb-2">
                  Gênero Musical *
                </label>
                <Input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Drum & Bass, House, Bass Music..."
                />
              </div>

              <div>
                <label className="block text-sm font-display text-primary/70 mb-2">
                  Link da Demo *
                </label>
                <Input
                  type="url"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleChange}
                  required
                  placeholder="https://soundcloud.com/seu-link"
                />
                <p className="text-xs text-foreground/50 mt-1">
                  SoundCloud, Dropbox, Google Drive ou similar
                </p>
              </div>

              <div>
                <label className="block text-sm font-display text-primary/70 mb-2">
                  Mensagem (opcional)
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Conte-nos mais sobre você e sua música..."
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Demo
                  </>
                )}
              </Button>
            </form>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-foreground/50 text-sm"
        >
          <p>
            Analisamos todas as demos recebidas. O tempo de resposta pode variar de 2 a 4 semanas.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
