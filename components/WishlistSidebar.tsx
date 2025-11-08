import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { XIcon, HeartIcon, ShoppingCartIcon } from '../constants';

interface WishlistSidebarProps {
  onClose: () => void;
  wishlistProductIds: number[];
  allProducts: Product[];
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (productId: number, quantity: number) => void;
  onProductClick: (product: Product) => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sidebarVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const WishlistSidebar: React.FC<WishlistSidebarProps> = ({
  onClose,
  wishlistProductIds,
  allProducts,
  onToggleWishlist,
  onAddToCart,
  onProductClick,
}) => {
  const wishlistProducts = allProducts.filter(p => wishlistProductIds.includes(p.id));

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
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-pink-50 shadow-lg flex flex-col"
        variants={sidebarVariants}
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-pink-200">
          <h2 className="text-xl font-bold text-amber-700">My Wishlist</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-500 hover:text-zinc-800 hover:bg-pink-100 transition-colors"
            aria-label="Close wishlist"
          >
            <XIcon />
          </button>
        </header>

        {wishlistProducts.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <HeartIcon className="w-16 h-16 text-amber-300 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-700">Your Wishlist is Empty</h3>
            <p className="text-zinc-500 mt-2">Looks like you haven't added any favorites yet. Explore our collections to find something you'll love!</p>
            <button
              onClick={onClose}
              className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {wishlistProducts.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-start gap-4 p-3 bg-white rounded-lg shadow-sm"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md cursor-pointer"
                  onClick={() => onProductClick(product)}
                />
                <div className="flex-grow">
                  <h4
                    className="font-semibold text-zinc-800 hover:text-amber-600 transition-colors cursor-pointer"
                    onClick={() => onProductClick(product)}
                  >
                    {product.name}
                  </h4>
                  <p className="text-amber-600 font-medium mt-1">
                    GH₵{(product.salePrice ?? product.price).toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onAddToCart(product.id, 1);
                        onToggleWishlist(product.id); // Optionally remove from wishlist after adding to cart
                      }}
                      className="text-xs flex items-center gap-1.5 text-amber-600 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded-full transition-colors"
                    >
                      <ShoppingCartIcon />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="p-1 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <XIcon />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WishlistSidebar;