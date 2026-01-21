import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Scroll indicator desaparece conforme rola
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'Artists', href: '#artists' },
    { label: 'Releases', href: '#releases' },
    { label: 'About', href: '#about' },
    { label: 'Submit Demo', href: '#submit' },
  ];

  return (
    <section
      id="home"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Background: Imagem de DJ mixer com overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/95" />
      </div>

      {/* Background animated grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Menu Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-8 right-8 z-50 p-3 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30 hover:border-primary transition-all glow-box-cyan"
      >
        {menuOpen ? (
          <X className="w-6 h-6 text-primary" />
        ) : (
          <Menu className="w-6 h-6 text-primary" />
        )}
      </motion.button>

      {/* Floating Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-24 right-8 z-40 bg-card/90 backdrop-blur-md border border-primary/30 rounded-lg p-6 min-w-[200px] glow-box-cyan"
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

      {/* Logo solto (sem caixa) com glow effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Logo DVH Records */}
        <img
          src="/images/dvh-logo.png"
          alt="DVH Records"
          className="w-full max-w-3xl mx-auto drop-shadow-[0_0_40px_rgba(0,240,255,0.6)]"
        />
        
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center text-primary text-xl md:text-2xl mt-8 font-body glow-cyan-strong"
        >
          Global sounds. Bass driven.
        </motion.p>
      </motion.div>

      {/* Scroll indicator (desaparece com rolagem) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ opacity: scrollIndicatorOpacity }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
