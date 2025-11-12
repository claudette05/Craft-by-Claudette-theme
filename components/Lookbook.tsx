import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import { LookbookPost } from '../types';

interface LookbookProps {
  posts: LookbookPost[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100 }
  },
};

const Lookbook: React.FC<LookbookProps> = ({ posts }) => {
  return (
    <section className="py-12 md:py-16 bg-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
        >
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-800">Shop Our Instagram</h2>
            <p className="text-zinc-600 mt-2">Tag <span className="font-semibold text-amber-600">@CraftByClaudette</span> to be featured!</p>
        </motion.div>
        <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
        >
            {posts.map(post => (
                <motion.div 
                    key={post.id}
                    className="group relative rounded-lg overflow-hidden cursor-pointer"
                    variants={itemVariants}
                >
                    <img 
                        src={post.imageUrl}
                        alt={post.caption}
                        className="w-full h-full object-cover aspect-square"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                        <p className="text-white text-center text-sm font-semibold">{post.caption}</p>
                    </div>
                </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Lookbook;