import * as React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface SearchResultsPageProps {
  query: string;
  results: Product[];
  onProductClick: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
};

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, results, onProductClick, onQuickView }) => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-800">Search Results</h1>
        <p className="mt-2 text-zinc-600">
          Showing results for: <span className="font-semibold text-amber-700">"{query}"</span>
        </p>
      </div>

      {results.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onProductClick}
              onQuickView={onQuickView}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
        >
          <p className="text-xl font-semibold text-zinc-700">No products found</p>
          <p className="mt-2 text-zinc-500">
            We couldn't find any products matching your search. Please try a different keyword.
          </p>
        </motion.div>
      )}
    </motion.main>
  );
};

export default SearchResultsPage;