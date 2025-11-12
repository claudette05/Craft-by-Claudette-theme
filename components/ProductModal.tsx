import * as React from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { XIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onViewDetails: (product: Product) => void;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } },
};

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onViewDetails }) => {
    const { addToCart } = useAppContext();
    const [quantity, setQuantity] = React.useState(1);
    const [isAdded, setIsAdded] = React.useState(false);
    const hasSale = typeof product.salePrice === 'number';

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const handleAddToCartClick = () => {
        if (isAdded) return;
        addToCart(product.id, quantity);
        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            onClose(); 
        }, 1500);
    };

    const handleViewDetailsClick = () => {
        onViewDetails(product);
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.div
                className="absolute inset-0 bg-black/60"
                variants={backdropVariants}
                onClick={onClose}
            />
            <motion.div
                className="relative w-full max-w-4xl bg-pink-50 dark:bg-zinc-900 rounded-xl shadow-lg flex flex-col md:flex-row max-h-[90vh]"
                variants={modalVariants}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-1 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-pink-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Close quick view"
                >
                    <XIcon />
                </button>
                <div className="w-full md:w-1/2 p-4">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg aspect-square"/>
                </div>
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center overflow-y-auto">
                    <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{product.category}</span>
                    <h2 className="text-2xl md:text-3xl font-bold my-2 text-zinc-800 dark:text-zinc-100">{product.name}</h2>
                    
                    {hasSale ? (
                        <div className="flex items-baseline space-x-3 mb-4">
                            <p className="text-2xl font-light text-red-600">GH₵{product.salePrice?.toFixed(2)}</p>
                            <p className="text-lg font-light text-gray-500 dark:text-gray-400 line-through">GH₵{product.price.toFixed(2)}</p>
                        </div>
                    ) : (
                        <p className="text-2xl font-light text-amber-600 dark:text-amber-500 mb-4">GH₵{product.price.toFixed(2)}</p>
                    )}

                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-sm h-24 overflow-y-auto">{product.description}</p>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-200">Quantity:</span>
                        <div className="flex items-center border border-gray-300 dark:border-zinc-600 rounded-full bg-white dark:bg-zinc-800">
                            <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-2.5 text-zinc-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 disabled:opacity-50" aria-label="Decrease quantity">
                                <MinusIcon />
                            </button>
                            <span className="px-5 font-semibold text-lg text-zinc-800 dark:text-zinc-100 tabular-nums">{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} className="p-2.5 text-zinc-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400" aria-label="Increase quantity">
                                <PlusIcon />
                            </button>
                        </div>
                    </div>

                    <motion.button
                        onClick={handleAddToCartClick}
                        className="w-full font-bold py-3 px-4 rounded-full overflow-hidden"
                        animate={{ 
                            backgroundColor: isAdded ? '#22c55e' : '#f59e0b',
                        }}
                        whileHover={{ scale: isAdded ? 1 : 1.05 }}
                        whileTap={{ scale: isAdded ? 1 : 0.95 }}
                    >
                         <span className={`block ${isAdded ? 'text-white' : 'text-white dark:text-zinc-900'}`}>
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
                    <button 
                        onClick={handleViewDetailsClick}
                        className="mt-3 text-center text-sm font-medium text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 hover:underline"
                    >
                        View Full Details
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProductModal;