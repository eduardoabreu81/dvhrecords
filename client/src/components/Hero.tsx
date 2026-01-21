import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Logo acompanha scroll (parallax)
  const logoY = useTransform(scrollY, [0, 500], [0, 150]);
  const logoOpacity = useTransform(scrollY, [0, 300], [1, 0]);

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
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background: Multidão em show/festival (VISÍVEL, sem overlay pesado) */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        {/* Overlay LEVE apenas para legibilidade */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Background animated grid (sutil) */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Header fixo no topo */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-8">
        {/* Logo no topo esquerdo (com parallax) */}
        <motion.div
          style={{ y: logoY, opacity: logoOpacity }}
          className="relative z-50"
        >
          <img
            src="/images/dvh-logo-waveform.png"
            alt="DVH Records"
            className="h-12 md:h-20 w-auto drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]"
          />
        </motion.div>

        {/* Menu Button no topo direito */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
      </header>

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

      {/* Conteúdo Hero (centralizado verticalmente) */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-7xl font-display text-white glow-cyan-strong mb-6">
            GLOBAL SOUNDS
          </h2>
          <h3 className="text-3xl md:text-5xl font-display text-primary glow-cyan-strong">
            BASS DRIVEN
          </h3>
        </motion.div>
      </div>
    </section>
  );
}
