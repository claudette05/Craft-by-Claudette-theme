
import * as React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface AllProductsPageProps {
  products: Product[];
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

const AllProductsPage: React.FC<AllProductsPageProps> = ({ products, onProductClick, onQuickView }) => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">All Products</h1>
        <p className="mt-2 text-text-secondary">Explore our full collection of handmade treasures.</p>
      </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onProductClick}
              onQuickView={onQuickView}
            />
          ))}
        </motion.div>
    </motion.main>
  );
};

export default AllProductsPage;