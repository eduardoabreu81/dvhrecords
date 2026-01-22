import { motion } from 'framer-motion';

export default function ArtistsGridSkeleton() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <div className="h-12 w-64 mx-auto bg-primary/20 rounded animate-pulse mb-4" />
        <div className="h-4 w-96 mx-auto bg-primary/10 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Foto circular skeleton */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/20 animate-pulse border-4 border-primary/30" />
            
            {/* Nome skeleton */}
            <div className="h-6 w-24 bg-primary/20 rounded animate-pulse" />
            
            {/* Gênero skeleton */}
            <div className="h-4 w-16 bg-primary/10 rounded animate-pulse" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
