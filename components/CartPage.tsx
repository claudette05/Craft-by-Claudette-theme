
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrashIcon, GiftIcon } from './Icons';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';

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

const FreeGiftProgress: React.FC<{ subtotal: number, config: any }> = ({ subtotal, config }) => {
    const { enabled, threshold, message, successMessage } = config;
    
    if (!enabled) return null;

    const progress = Math.min((subtotal / threshold) * 100, 100);
    const isUnlocked = subtotal >= threshold;
    const remaining = Math.max(0, threshold - subtotal);
    
    const displayMessage = isUnlocked 
        ? successMessage 
        : message.replace('{amount}', `GH₵${remaining.toFixed(2)}`);

    return (
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2 font-medium text-amber-800 dark:text-amber-200 text-sm">
                <GiftIcon className="w-5 h-5" />
                <span>{displayMessage}</span>
            </div>
            <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2.5 overflow-hidden">
                <motion.div 
                    className="h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};

interface CartPageProps {
  products: Product[];
  onContinueShopping: () => void;
  onNavigateToCheckout: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ products, onContinueShopping, onNavigateToCheckout }) => {
  const { cart, updateCartQuantity, removeFromCart, freeGiftConfig } = useAppContext();

  const cartDetails = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product); // Filter out items where product not found

  const subtotal = cartDetails.reduce((sum, item) => {
    const price = item.product!.salePrice ?? item.product!.price;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (cart.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center"
      >
        <h1 className="text-3xl font-bold text-text-primary">Your Cart is Empty</h1>
        <p className="mt-4 text-text-secondary">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={onContinueShopping}
          className="mt-8 bg-accent-primary hover:opacity-90 text-accent-text font-bold py-3 px-8 rounded-full transition-colors"
        >
          Continue Shopping
        </button>
      </motion.div>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8 text-center">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items */}
        <motion.div 
          className="lg:col-span-2 bg-bg-secondary/60 p-4 sm:p-6 rounded-lg shadow-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <FreeGiftProgress subtotal={subtotal} config={freeGiftConfig} />

          <AnimatePresence>
            {cartDetails.map(({ product, quantity }) => product && (
              <motion.div
                key={product.id}
                layout
                variants={itemVariants}
                exit={{ opacity: 0, x: -50 }}
                className="flex items-center gap-4 py-4 border-b border-border-primary last:border-b-0"
              >
                <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-grow">
                  <h2 className="font-semibold text-text-primary">{product.name}</h2>
                  <p className="text-sm text-text-secondary">{product.category}</p>
                  <p className="text-accent-primary font-bold mt-1">GH₵{(product.salePrice ?? product.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center border border-zinc-300 dark:border-zinc-600 rounded-full bg-bg-secondary">
                  <button onClick={() => updateCartQuantity(product.id, quantity - 1)} className="p-2 text-text-secondary hover:text-accent-primary"><MinusIcon /></button>
                  <span className="px-3 font-semibold text-text-primary">{quantity}</span>
                  <button onClick={() => updateCartQuantity(product.id, quantity + 1)} className="p-2 text-text-secondary hover:text-accent-primary"><PlusIcon /></button>
                </div>
                <p className="font-bold text-text-primary w-20 text-right">GH₵{((product.salePrice ?? product.price) * quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(product.id)} className="text-text-secondary/70 hover:text-red-500 transition-colors p-1"><TrashIcon /></button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          className="lg:col-span-1 bg-bg-secondary/60 p-6 rounded-lg shadow-md sticky top-28"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-text-primary border-b border-border-primary pb-4">Order Summary</h2>
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span className="font-medium">GH₵{subtotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold text-text-primary border-t border-border-primary pt-4">
            <span>Total</span>
            <span>GH₵{total.toFixed(2)}</span>
          </div>
          <button 
            onClick={onNavigateToCheckout}
            className="w-full mt-6 bg-accent-primary hover:opacity-90 text-accent-text font-bold py-3 px-8 rounded-full transition-colors"
          >
            Proceed to Checkout
          </button>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default CartPage;
