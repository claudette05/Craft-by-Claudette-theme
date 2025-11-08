import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import ProductCard from '../ProductCard';

interface AccountWishlistProps {
    wishlist: number[];
    allProducts: Product[];
    onProductClick: (product: Product) => void;
    onAddToCart: (productId: number, quantity: number) => void;
    onToggleWishlist: (productId: number) => void;
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

const AccountWishlist: React.FC<AccountWishlistProps> = (props) => {
    const { wishlist, allProducts, onProductClick, onAddToCart, onToggleWishlist, onQuickView } = props;
    const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));

    return (
        <div>
            <h2 className="text-2xl font-bold text-zinc-800 mb-6">My Wishlist</h2>
            
            {wishlistProducts.length > 0 ? (
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {wishlistProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={onProductClick}
                            onAddToCart={onAddToCart}
                            wishlist={wishlist}
                            onToggleWishlist={onToggleWishlist}
                            onQuickView={onQuickView}
                        />
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 px-6 bg-pink-100/50 rounded-lg"
                >
                    <p className="font-semibold text-zinc-700">Your wishlist is empty.</p>
                    <p className="mt-1 text-zinc-500 text-sm">Click the heart on any product to save it for later!</p>
                </motion.div>
            )}
        </div>
    );
};

export default AccountWishlist;