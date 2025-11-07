import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { XIcon } from '../constants';

// Simple icons for quantity controls
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
  onAddToCart: (quantity: number) => void;
}

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: 'easeIn' } }
};

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const hasSale = typeof product.salePrice === 'number';
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm p-4"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-3xl max-h-[90vh] overflow-y-auto"
        variants={modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <XIcon />
        </button>
        <div className="md:flex">
          <div className="md:w-1/2">
            <img src={product.imageUrl} alt={product.name} className="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none" />
          </div>
          <div className="md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
            <span className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</span>
            <h2 className="text-2xl md:text-3xl font-bold my-2 text-zinc-800">{product.name}</h2>
            
            {hasSale ? (
                <div className="flex items-baseline space-x-3 mb-4">
                    <p className="text-2xl md:text-3xl font-light text-red-600">${product.salePrice?.toFixed(2)}</p>
                    <p className="text-lg md:text-xl font-light text-gray-500 line-through">${product.price.toFixed(2)}</p>
                </div>
            ) : (
                <p className="text-2xl md:text-3xl font-light text-amber-600 mb-4">${product.price.toFixed(2)}</p>
            )}

            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold text-zinc-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-full">
                    <button 
                        onClick={() => handleQuantityChange(-1)} 
                        className="p-2 text-zinc-600 hover:text-amber-600 disabled:opacity-50"
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                    >
                        <MinusIcon />
                    </button>
                    <span className="px-4 font-semibold text-lg text-zinc-800 tabular-nums">{quantity}</span>
                    <button 
                        onClick={() => handleQuantityChange(1)} 
                        className="p-2 text-zinc-600 hover:text-amber-600"
                        aria-label="Increase quantity"
                    >
                        <PlusIcon />
                    </button>
                </div>
            </div>

            <button
              onClick={() => {
                onAddToCart(quantity);
                onClose();
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-full transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductModal;