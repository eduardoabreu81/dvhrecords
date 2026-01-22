import { motion } from 'framer-motion';

export default function ArtistsGridSkeleton() {
  return (
    <div className="py-12">
      <div className="h-12 w-48 mx-auto bg-primary/20 rounded animate-pulse mb-12" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group"
          >
            {/* Foto quadrada skeleton */}
            <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-primary/20 animate-pulse" />
            
            {/* Nome skeleton */}
            <div className="h-5 w-3/4 bg-primary/20 rounded animate-pulse mb-2" />
            
            {/* Gênero skeleton */}
            <div className="h-3 w-1/2 bg-primary/10 rounded animate-pulse" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
