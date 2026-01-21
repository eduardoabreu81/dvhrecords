import { motion } from 'framer-motion';

export default function Hero() {

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
