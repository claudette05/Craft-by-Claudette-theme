import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem, Product } from '../types';
import { TrashIcon } from '../constants';

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


interface CartPageProps {
  cartItems: CartItem[];
  allProducts: Product[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onContinueShopping: () => void;
  onNavigateToCheckout: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, allProducts, onUpdateQuantity, onRemoveItem, onContinueShopping, onNavigateToCheckout }) => {
  const cartDetails = cartItems.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
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

  if (cartItems.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center"
      >
        <h1 className="text-3xl font-bold text-zinc-800">Your Cart is Empty</h1>
        <p className="mt-4 text-zinc-600">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={onContinueShopping}
          className="mt-8 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
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
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-8 text-center">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items */}
        <motion.div 
          className="lg:col-span-2 bg-white/60 p-4 sm:p-6 rounded-lg shadow-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {cartDetails.map(({ product, quantity }) => product && (
              <motion.div
                key={product.id}
                layout
                variants={itemVariants}
                exit={{ opacity: 0, x: -50 }}
                className="flex items-center gap-4 py-4 border-b border-pink-200 last:border-b-0"
              >
                <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-grow">
                  <h2 className="font-semibold text-zinc-800">{product.name}</h2>
                  <p className="text-sm text-zinc-500">{product.category}</p>
                  <p className="text-amber-600 font-bold mt-1">GH₵{(product.salePrice ?? product.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center border border-gray-300 rounded-full">
                  <button onClick={() => onUpdateQuantity(product.id, quantity - 1)} className="p-2 text-zinc-600 hover:text-amber-600"><MinusIcon /></button>
                  <span className="px-3 font-semibold text-zinc-800">{quantity}</span>
                  <button onClick={() => onUpdateQuantity(product.id, quantity + 1)} className="p-2 text-zinc-600 hover:text-amber-600"><PlusIcon /></button>
                </div>
                <p className="font-bold text-zinc-800 w-20 text-right">GH₵{((product.salePrice ?? product.price) * quantity).toFixed(2)}</p>
                <button onClick={() => onRemoveItem(product.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1"><TrashIcon /></button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          className="lg:col-span-1 bg-white/60 p-6 rounded-lg shadow-md sticky top-28"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-zinc-800 border-b border-pink-200 pb-4">Order Summary</h2>
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-medium">GH₵{subtotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold text-zinc-800 border-t border-pink-200 pt-4">
            <span>Total</span>
            <span>GH₵{total.toFixed(2)}</span>
          </div>
          <button 
            onClick={onNavigateToCheckout}
            className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Proceed to Checkout
          </button>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default CartPage;