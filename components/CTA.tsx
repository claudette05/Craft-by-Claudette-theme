
import React from 'react';
import { motion } from 'framer-motion';

const CTA: React.FC = () => {
  return (
    <motion.section 
      className="relative py-20 md:py-24 bg-orange-100 bg-cover bg-center"
      style={{ backgroundImage: `url('https://picsum.photos/1200/400?random=42')` }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7 }}
    >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover What's New</h2>
            <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto">Freshly crafted pieces have just arrived. Find your next favorite handmade treasure today.</p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-base md:text-lg"
            >
                Shop New Arrivals
            </motion.button>
        </div>
    </motion.section>
  );
};

export default CTA;
