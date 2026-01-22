import { motion } from 'framer-motion';

export default function Greeting() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed top-20 right-6 z-50"
    >
      <div className="bg-black/80 backdrop-blur-sm border border-primary/30 rounded-lg px-4 py-2 shadow-lg shadow-primary/20">
        <p className="text-primary text-lg font-display glow-cyan">
          Olá!
        </p>
      </div>
    </motion.div>
  );
}
