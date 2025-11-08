import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { HeartIcon } from '../constants';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToCart: (productId: number, quantity: number) => void;
  wishlist: number[];
  onToggleWishlist: (productId: number) => void;
  onQuickView: (product: Product) => void;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
  exit: { y: 20, opacity: 0 }
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart, wishlist, onToggleWishlist, onQuickView }) => {
  const hasSale = typeof product.salePrice === 'number';
  const isInWishlist = wishlist.includes(product.id);
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.id, 1);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };
  
  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={() => onClick(product)}
      className="group relative bg-white/40 backdrop-blur-lg border border-white/50 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-amber-200/40 hover:border-amber-300 cursor-pointer"
    >
      <div className="relative overflow-hidden">
         <motion.button
            onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
            }}
            className="absolute top-3 left-3 z-10 p-1.5 bg-white/70 rounded-full backdrop-blur-sm transition-colors duration-300 hover:bg-white flex items-center justify-center"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <motion.div
              key={isInWishlist ? 'filled' : 'empty'}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <HeartIcon 
                className={`h-5 w-5 ${isInWishlist ? 'text-red-500' : 'text-zinc-600 hover:text-red-500'}`}
                filled={isInWishlist}
              />
            </motion.div>
        </motion.button>
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-56 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        {hasSale && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                SALE
            </div>
        )}
      </div>
      <div className="p-3 sm:p-4 text-center flex-grow flex flex-col justify-between">
        <div>
            <h3 className="text-sm sm:text-lg font-semibold text-zinc-800 truncate transition-colors duration-300 group-hover:text-amber-700">{product.name}</h3>
            <div className="mt-2">
                {hasSale ? (
                    <div className="flex flex-col sm:flex-row justify-center items-baseline sm:space-x-2">
                        <p className="text-red-600 font-bold text-base sm:text-xl">GH₵{product.salePrice?.toFixed(2)}</p>
                        <p className="text-gray-500 font-medium line-through text-sm">GH₵{product.price.toFixed(2)}</p>
                    </div>
                ) : (
                    <p className="text-amber-600 font-bold text-base sm:text-lg">GH₵{product.price.toFixed(2)}</p>
                )}
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2 sm:gap-3">
          <motion.button
            onClick={handleQuickViewClick}
            className="w-full bg-white text-amber-600 border border-amber-500 hover:bg-amber-50 font-bold py-2 px-2 sm:px-4 rounded-full transition-colors text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Quick View
          </motion.button>
          <motion.button
            onClick={handleAddToCartClick}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-2 sm:px-4 rounded-full transition-colors text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;