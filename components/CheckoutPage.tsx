import React from 'react';
import { motion } from 'framer-motion';
import { CartItem, Product } from '../types';

interface CheckoutPageProps {
  cartItems: CartItem[];
  allProducts: Product[];
  onBackToCart: () => void;
  onPlaceOrder: () => void;
}

const FormInput: React.FC<{ label: string; id: string; type?: string; placeholder: string; required?: boolean }> = 
({ label, id, type = 'text', placeholder, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-zinc-700">{label}</label>
        <div className="mt-1">
            <input 
                type={type} 
                name={id} 
                id={id} 
                className="block w-full rounded-md border-zinc-300 bg-zinc-50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3" 
                placeholder={placeholder}
                required={required}
            />
        </div>
    </div>
);

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, allProducts, onBackToCart, onPlaceOrder }) => {
    const cartDetails = cartItems.map(item => {
        const product = allProducts.find(p => p.id === item.productId);
        return { ...item, product };
    }).filter(item => item.product);

    const subtotal = cartDetails.reduce((sum, item) => {
        const price = item.product!.salePrice ?? item.product!.price;
        return sum + price * item.quantity;
    }, 0);

    const total = subtotal;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPlaceOrder();
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
        >
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-800">Checkout</h1>
                <p className="mt-2 text-zinc-600">
                    Already have an account? <a href="#" className="font-medium text-amber-600 hover:text-amber-500">Log in</a> for a faster experience.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                {/* Forms Section */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Contact Info */}
                    <section className="bg-white/60 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-zinc-800">Contact Information</h2>
                        <div className="mt-4 grid grid-cols-1 gap-y-6">
                            <FormInput label="Email address" id="email" type="email" placeholder="you@example.com" />
                        </div>
                    </section>
                    
                    {/* Shipping Info */}
                    <section className="bg-white/60 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-zinc-800">Shipping Address</h2>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            <FormInput label="First name" id="first-name" placeholder="John" />
                            <FormInput label="Last name" id="last-name" placeholder="Doe" />
                            <div className="sm:col-span-2">
                                <FormInput label="Address" id="address" placeholder="123 Main St" />
                            </div>
                            <FormInput label="City" id="city" placeholder="Anytown" />
                            <FormInput label="State / Province" id="region" placeholder="CA" />
                            <FormInput label="Postal code" id="postal-code" placeholder="90210" />
                        </div>
                    </section>

                    {/* Payment Info */}
                    <section className="bg-white/60 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-zinc-800">Payment Details</h2>
                        <div className="mt-4 grid grid-cols-1 gap-y-6">
                            <FormInput label="Card number" id="card-number" placeholder="0000 0000 0000 0000" />
                            <FormInput label="Name on card" id="name-on-card" placeholder="John M Doe" />
                            <div className="grid grid-cols-2 gap-x-4">
                                <FormInput label="Expiration date (MM/YY)" id="expiration-date" placeholder="MM / YY" />
                                <FormInput label="CVC" id="cvc" placeholder="123" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1 bg-white/60 p-6 rounded-lg shadow-md sticky top-28">
                    <h2 className="text-xl font-semibold text-zinc-800 border-b border-pink-200 pb-4">Order Summary</h2>
                    <div className="divide-y divide-pink-200">
                        {cartDetails.map(({ product, quantity }) => product && (
                            <div key={product.id} className="flex items-center gap-4 py-4">
                                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                                <div className="flex-grow">
                                    <h3 className="font-medium text-zinc-800">{product.name}</h3>
                                    <p className="text-sm text-zinc-500">Qty: {quantity}</p>
                                </div>
                                <p className="font-medium text-zinc-700">GH₵{((product.salePrice ?? product.price) * quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4 py-4 border-t border-pink-200">
                        <div className="flex justify-between text-zinc-600">
                            <span>Subtotal</span>
                            <span className="font-medium">GH₵{subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-zinc-800 border-t border-pink-200 pt-4">
                        <span>Total</span>
                        <span>GH₵{total.toFixed(2)}</span>
                    </div>
                    <button type="submit" className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
                        Place Order
                    </button>
                    <button type="button" onClick={onBackToCart} className="w-full mt-2 text-center text-sm font-medium text-amber-600 hover:text-amber-500">
                        Back to Cart
                    </button>
                </div>
            </form>
        </motion.main>
    );
};

export default CheckoutPage;