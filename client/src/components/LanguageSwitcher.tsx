import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[1];

  const handleChangeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg hover:border-primary transition-all glow-box-cyan"
      >
        <Globe className="w-5 h-5 text-primary" />
        <span className="text-primary font-display text-sm">{currentLanguage.flag}</span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 z-50 bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-lg overflow-hidden glow-box-cyan min-w-[180px]"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleChangeLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors ${
                    lang.code === i18n.language ? 'bg-primary/20' : ''
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className={`text-sm font-display ${
                    lang.code === i18n.language ? 'text-primary glow-cyan' : 'text-foreground/70'
                  }`}>
                    {lang.name}
                  </span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
