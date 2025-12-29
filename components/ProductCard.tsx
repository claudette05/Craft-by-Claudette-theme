
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { HeartIcon } from './Icons';
import { useAppContext } from '../context/AppContext';
import { getCloudinaryThumbnail } from '../utils/cloudinaryUtils';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
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

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onQuickView }) => {
  const { wishlist, toggleWishlist, addToCart } = useAppContext();
  const [isAdded, setIsAdded] = React.useState(false);
  
  const hasSale = typeof product.salePrice === 'number';
  const isInWishlist = wishlist.includes(product.id);
  
  // Use optimized thumbnail if available
  const displayImageUrl = React.useMemo(() => getCloudinaryThumbnail(product.imageUrl), [product.imageUrl]);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdded) return;
    addToCart(product.id, 1);
    setIsAdded(true);
    setTimeout(() => {
        setIsAdded(false);
    }, 2000);
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
      className="group relative bg-bg-secondary/40 backdrop-blur-lg border border-bg-secondary/50 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-amber-200/40 dark:hover:shadow-accent-primary/20 hover:border-accent-primary/50 cursor-pointer"
    >
      <div className="relative overflow-hidden bg-bg-tertiary">
         <motion.button
            onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
            }}
            className="absolute top-3 left-3 z-10 p-1.5 bg-bg-secondary/70 rounded-full backdrop-blur-sm transition-colors duration-300 hover:bg-bg-secondary flex items-center justify-center"
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
                className={`h-5 w-5 ${isInWishlist ? 'text-red-500' : 'text-text-secondary hover:text-red-500'}`}
                filled={isInWishlist}
              />
            </motion.div>
        </motion.button>
        <motion.img
          src={displayImageUrl}
          alt={product.name}
          loading="lazy"
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
            <h3 className="text-sm sm:text-lg font-semibold text-text-primary truncate transition-colors duration-300 group-hover:text-accent-primary">{product.name}</h3>
            <div className="mt-2">
                {hasSale ? (
                    <div className="flex flex-col sm:flex-row justify-center items-baseline sm:space-x-2">
                        <p className="text-red-600 font-bold text-base sm:text-xl">GH₵{product.salePrice?.toFixed(2)}</p>
                        <p className="text-text-secondary font-medium line-through text-sm">GH₵{product.price.toFixed(2)}</p>
                    </div>
                ) : (
                    <p className="text-accent-primary font-bold text-base sm:text-lg">GH₵{product.price.toFixed(2)}</p>
                )}
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2 sm:gap-3">
          <motion.button
            onClick={handleQuickViewClick}
            className="w-full bg-bg-secondary text-accent-primary border border-accent-primary hover:bg-bg-primary font-bold py-2 px-2 sm:px-4 rounded-full transition-colors text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Quick View
          </motion.button>
          <motion.button
            onClick={handleAddToCartClick}
            className="w-full font-bold py-2 px-2 sm:px-4 rounded-full text-sm overflow-hidden"
            animate={{ 
                backgroundColor: isAdded ? '#22c55e' /* green-500 */ : '#f59e0b' /* amber-500 */,
            }}
            whileHover={{ scale: isAdded ? 1 : 1.05 }}
            whileTap={{ scale: isAdded ? 1 : 0.95 }}
          >
            <span className={`block ${isAdded ? 'text-white' : 'text-accent-text'}`}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={isAdded ? 'added' : 'add'}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block"
                    >
                        {isAdded ? 'Added!' : 'Add to Cart'}
                    </motion.span>
                </AnimatePresence>
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
