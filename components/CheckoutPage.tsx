import * as React from 'react';
import { motion } from 'framer-motion';
import { usePaystackPayment } from 'react-paystack';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';
import { PAYSTACK_PUBLIC_KEY } from '../config';

interface CheckoutPageProps {
  products: Product[];
  onBackToCart: () => void;
  onPlaceOrder: () => void;
}

const FormInput: React.FC<{ 
    label: string; 
    id: string; 
    name: string;
    type?: string; 
    placeholder: string; 
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = 
({ label, id, name, type = 'text', placeholder, required = true, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-primary">{label}</label>
        <div className="mt-1">
            <input 
                type={type} 
                name={name} 
                id={id} 
                className="block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-bg-tertiary text-text-primary shadow-sm focus:border-accent-primary focus:ring-accent-primary sm:text-sm p-3" 
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
);

const CheckoutPage: React.FC<CheckoutPageProps> = ({ products, onBackToCart, onPlaceOrder }) => {
    const { cart } = useAppContext();
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        region: '',
        postalCode: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const cartDetails = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return { ...item, product };
    }).filter(item => item.product);

    const subtotal = cartDetails.reduce((sum, item) => {
        const price = item.product!.salePrice ?? item.product!.price;
        return sum + price * item.quantity;
    }, 0);
    
    const total = subtotal; // Assuming no shipping/taxes for now

    const config = {
        reference: (new Date()).getTime().toString(),
        email: formData.email,
        amount: Math.round(total * 100), // Amount in pesewas for GHS
        publicKey: PAYSTACK_PUBLIC_KEY,
        metadata: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
        }
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = () => {
        setIsLoading(false);
        onPlaceOrder();
    };

    const onClose = () => {
        setIsLoading(false);
        console.log('Payment modal closed.');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        initializePayment({onSuccess, onClose});
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
        >
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Checkout</h1>
                <button onClick={onBackToCart} className="text-sm text-accent-primary hover:opacity-80 font-medium">
                    &larr; Back to Cart
                </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Shipping & Payment Details */}
                <div className="bg-bg-secondary/60 p-6 sm:p-8 rounded-lg shadow-md space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary">Contact Information</h2>
                        <div className="mt-4">
                             <FormInput label="Email address" id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} />
                        </div>
                    </div>
                    
                    <div className="border-t border-border-primary pt-6">
                        <h2 className="text-xl font-semibold text-text-primary">Shipping Address</h2>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <FormInput label="First Name" id="firstName" name="firstName" placeholder="Jane" value={formData.firstName} onChange={handleInputChange} />
                           <FormInput label="Last Name" id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} />
                           <div className="sm:col-span-2">
                               <FormInput label="Address" id="address" name="address" placeholder="123 Main St" value={formData.address} onChange={handleInputChange} />
                           </div>
                           <FormInput label="City" id="city" name="city" placeholder="Accra" value={formData.city} onChange={handleInputChange} />
                           <FormInput label="Region" id="region" name="region" placeholder="Greater Accra" value={formData.region} onChange={handleInputChange} />
                           <FormInput label="Postal Code" id="postalCode" name="postalCode" placeholder="GA-123-4567" required={false} value={formData.postalCode} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-bg-secondary/60 p-6 sm:p-8 rounded-lg shadow-md sticky top-28">
                    <h2 className="text-xl font-semibold text-text-primary border-b border-border-primary pb-4">Order Summary</h2>
                    <div className="space-y-4 py-4 max-h-64 overflow-y-auto">
                        {cartDetails.map(({ product, quantity }) => product && (
                            <div key={product.id} className="flex items-center gap-4">
                                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-text-primary text-sm">{product.name}</p>
                                    <p className="text-text-secondary text-xs">Qty: {quantity}</p>
                                </div>
                                <p className="font-medium text-text-primary text-sm">GH₵{((product.salePrice ?? product.price) * quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2 py-4 border-t border-border-primary">
                        <div className="flex justify-between text-text-secondary text-sm">
                            <span>Subtotal</span>
                            <span className="font-medium">GH₵{subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-text-secondary text-sm">
                            <span>Shipping</span>
                            <span className="font-medium">Free</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-text-primary border-t border-border-primary pt-4">
                        <span>Total</span>
                        <span>GH₵{total.toFixed(2)}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 bg-accent-primary hover:opacity-90 text-accent-text font-bold py-3 px-8 rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                         {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </div>
                        ) : `Pay Now (GH₵${total.toFixed(2)})`}
                    </button>
                </div>
            </form>
        </motion.main>
    );
};

export default CheckoutPage;