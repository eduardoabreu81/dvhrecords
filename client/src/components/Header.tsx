import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'Releases', href: '#releases' },
    { label: 'Artists', href: '#artists' },
    { label: 'About', href: '#about' },
    { label: 'Submit Demo', href: '#submit' },
  ];

  return (
    <>
      {/* Header fixo no topo (sempre visível) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-8 bg-black/40 backdrop-blur-sm">
        {/* Logo no topo esquerdo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-50"
        >
          <a href="#home">
            <img
              src="/images/dvh-logo-transparent.png"
              alt="DVH Records"
              className="h-10 md:h-16 w-auto drop-shadow-[0_0_30px_rgba(0,240,255,0.8)] hover:drop-shadow-[0_0_40px_rgba(0,240,255,1)] transition-all"
            />
          </a>
        </motion.div>

        {/* Language Switcher e Menu Button no topo direito */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-50 p-3 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30 hover:border-primary transition-all glow-box-cyan"
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-primary" />
          ) : (
            <Menu className="w-6 h-6 text-primary" />
          )}
        </motion.button>
        </div>
      </header>

      {/* Floating Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-20 md:top-28 right-4 md:right-8 z-40 bg-card/90 backdrop-blur-md border border-primary/30 rounded-lg p-6 min-w-[200px] glow-box-cyan"
          >
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-foreground hover:text-primary transition-colors font-medium text-lg glow-cyan"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
