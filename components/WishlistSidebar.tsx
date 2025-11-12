import * as React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Product } from '../types';
import { XIcon, HeartIcon, ShoppingCartIcon, CheckIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

interface WishlistSidebarProps {
  products: Product[];
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sidebarVariants: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const WishlistSidebar: React.FC<WishlistSidebarProps> = ({ products, onClose, onProductClick }) => {
  const { wishlist, toggleWishlist, addToCart } = useAppContext();
  const [addedId, setAddedId] = React.useState<number | null>(null);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddToCartFromWishlist = (product: Product) => {
    if (addedId) return;
    addToCart(product.id, 1);
    toggleWishlist(product.id);
    setAddedId(product.id);
    setTimeout(() => {
        setAddedId(null);
    }, 2000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="absolute inset-0 bg-black/50"
        variants={backdropVariants}
        onClick={onClose}
      />
      <motion.div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-bg-primary shadow-lg flex flex-col"
        variants={sidebarVariants}
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-border-primary">
          <h2 className="text-xl font-bold text-accent-primary">My Wishlist</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
            aria-label="Close wishlist"
          >
            <XIcon />
          </button>
        </header>

        {wishlistProducts.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <HeartIcon className="w-16 h-16 text-accent-primary/30 mb-4" />
            <h3 className="text-lg font-semibold text-text-primary">Your Wishlist is Empty</h3>
            <p className="text-text-secondary mt-2">Looks like you haven't added any favorites yet. Explore our collections to find something you'll love!</p>
            <button
              onClick={onClose}
              className="mt-6 bg-accent-primary hover:opacity-90 text-accent-text font-bold py-2 px-6 rounded-full transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {wishlistProducts.map(product => {
              const isAdded = addedId === product.id;
              return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-start gap-4 p-3 bg-bg-secondary rounded-lg shadow-sm"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md cursor-pointer"
                  onClick={() => onProductClick(product)}
                />
                <div className="flex-grow">
                  <h4
                    className="font-semibold text-text-primary hover:text-accent-primary transition-colors cursor-pointer"
                    onClick={() => onProductClick(product)}
                  >
                    {product.name}
                  </h4>
                  <p className="text-accent-primary font-medium mt-1">
                    GH₵{(product.salePrice ?? product.price).toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCartFromWishlist(product)}
                      className={`text-xs flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full transition-colors w-[110px] h-7 overflow-hidden ${
                          isAdded 
                              ? 'bg-green-100 dark:bg-green-500/10'
                              : 'text-accent-primary bg-amber-100/60 dark:bg-accent-primary/20 hover:bg-amber-100 dark:hover:bg-accent-primary/30'
                      }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                              key={isAdded ? 'added' : 'add'}
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -10, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center gap-1.5"
                          >
                              {isAdded ? (
                                  <>
                                      <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                      <span className="font-semibold text-green-600 dark:text-green-400">Added</span>
                                  </>
                              ) : (
                                  <>
                                      <ShoppingCartIcon className="h-4 w-4" />
                                      <span>Add to Cart</span>
                                  </>
                              )}
                          </motion.span>
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-1 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <XIcon />
                </button>
              </motion.div>
            )})}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WishlistSidebar;