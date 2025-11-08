import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../types';

interface CategoryCarouselProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories, activeCategory, onSelectCategory }) => {
  // 'All' is handled specially and prepended to the list of categories.
  const allCategory: Category = { 
    id: 0, 
    name: 'All', 
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=200&h=200&auto=format&fit=crop'
  };
  const allCategories = [allCategory, ...categories];
  
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className="py-10 md:py-12 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-zinc-800">Shop by Category</h2>
        <div className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4 sm:justify-center hide-scrollbar">
          {allCategories.map((category) => {
            const isActive = activeCategory === category.name;
            return (
              <motion.button
                key={category.id}
                onClick={() => onSelectCategory(category.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 flex flex-col items-center gap-2 w-24 focus:outline-none transition-transform"
                aria-label={`Shop ${category.name}`}
              >
                <div 
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md transition-all duration-300 ${
                    isActive ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-white' : 'ring-2 ring-transparent'
                  }`}
                >
                  <img 
                    src={category.imageUrl} 
                    alt={`A sample of ${category.name} products`}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <span 
                  className={`text-xs sm:text-sm font-medium transition-colors duration-300 mt-1 ${
                    isActive ? 'text-amber-700 font-bold' : 'text-zinc-600'
                  }`}
                >
                  {category.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default CategoryCarousel;