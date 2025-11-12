

import * as React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import { useAppContext } from '../../context/AppContext';

interface AccountWishlistProps {
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

const AccountWishlist: React.FC<AccountWishlistProps> = (props) => {
    const { wishlist } = useAppContext();
    const { products, onProductClick, onQuickView } = props;
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));

    return (
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">My Wishlist</h2>
            
            {wishlistProducts.length > 0 ? (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {wishlistProducts.map((product) => (
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 px-6 bg-pink-100/50 dark:bg-bg-tertiary rounded-lg"
                >
                    <p className="font-semibold text-text-primary">Your wishlist is empty.</p>
                    <p className="mt-1 text-text-secondary text-sm">Click the heart on any product to save it for later!</p>
                </motion.div>
            )}
        </div>
    );
};

export default AccountWishlist;
