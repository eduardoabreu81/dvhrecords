import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Submit() {
  const { t } = useTranslation();
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
    <section 
      id="submit" 
      className="min-h-screen bg-background flex items-center justify-center py-20 px-4 relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/80" />
      <div className="container max-w-3xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-display text-center text-primary glow-cyan-strong mb-6"
        >
          {t('submit.title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-foreground/70 mb-12 text-lg"
        >
          {t('submit.subtitle')}
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
                {t('submit.success.title')}
              </h3>
              <p className="text-foreground/70">
                {t('submit.success.message')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-display text-primary/70 mb-2">
                    {t('submit.form.artistName')} {t('submit.form.required')}
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t('submit.form.artistNamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-display text-primary/70 mb-2">
                    {t('submit.form.email')} {t('submit.form.required')}
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t('submit.form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-display text-primary/70 mb-2">
                  {t('submit.form.genre')} {t('submit.form.required')}
                </label>
                <Input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  placeholder={t('submit.form.genrePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-display text-primary/70 mb-2">
                  {t('submit.form.demoLink')} {t('submit.form.required')}
                </label>
                <Input
                  type="url"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleChange}
                  required
                  placeholder={t('submit.form.demoLinkPlaceholder')}
                />
                <p className="text-xs text-foreground/50 mt-1">
                  {t('submit.form.demoLinkHint')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-display text-primary/70 mb-2">
                  {t('submit.form.message')}
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t('submit.form.messagePlaceholder')}
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
                    {t('submit.form.sending')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t('submit.form.submit')}
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
            {t('submit.disclaimer')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
