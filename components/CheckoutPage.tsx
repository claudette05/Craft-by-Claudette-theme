
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Product, AdminOrder } from '../types';

interface CheckoutPageProps {
  products: Product[];
  onBackToCart: () => void;
  onPlaceOrder: (order: AdminOrder) => Promise<void>;
}

const FormInput: React.FC<{ 
    label: string; 
    id: string; 
    name: string;
    type?: string; 
    placeholder: string; 
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isTextArea?: boolean;
}> = 
({ label, id, name, type = 'text', placeholder, required = true, value, onChange, isTextArea = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-text-primary mb-1">{label}</label>
        <div className="mt-1">
            {isTextArea ? (
                <textarea 
                    name={name} 
                    id={id} 
                    rows={3}
                    className="block w-full rounded-xl border-zinc-200 dark:border-zinc-700 bg-bg-tertiary text-text-primary shadow-sm focus:border-accent-primary focus:ring-accent-primary sm:text-sm p-4 transition-all resize-none" 
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            ) : (
                <input 
                    type={type} 
                    name={name} 
                    id={id} 
                    className="block w-full rounded-xl border-zinc-200 dark:border-zinc-700 bg-bg-tertiary text-text-primary shadow-sm focus:border-accent-primary focus:ring-accent-primary sm:text-sm p-4 transition-all" 
                    placeholder={placeholder}
                    required={required}
                    value={value}
                    onChange={onChange}
                />
            )}
        </div>
    </div>
);

const CheckoutPage: React.FC<CheckoutPageProps> = ({ products, onBackToCart, onPlaceOrder }) => {
    const { cart, addToast, shopInfo, user } = useAppContext();
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);
    
    // Generate a professional Order ID: CBC-YYMM-XXXX
    const [orderId] = React.useState(() => {
        const now = new Date();
        const yearMonth = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `CBC-${yearMonth}-${random}`;
    });

    const [formData, setFormData] = React.useState({
        fullName: user?.name || '',
        phone: '',
        location: '',
        note: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const cartDetails = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return { ...item, product };
    }).filter(item => item.product);

    const total = cartDetails.reduce((sum, item) => {
        const price = item.product!.salePrice ?? item.product!.price;
        return sum + price * item.quantity;
    }, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        
        try {
            // 1. Create the AdminOrder object for Bookkeeping
            const newOrder: AdminOrder = {
                id: orderId,
                customerName: formData.fullName,
                customerEmail: user?.email || 'Guest',
                date: new Date().toISOString().split('T')[0],
                total: total,
                status: 'Pending',
                trackingHistory: [
                    { 
                        status: 'Order Placed', 
                        date: new Date().toLocaleString(), 
                        location: formData.location || 'Online' 
                    }
                ]
            };

            // 2. Synchronize to Firestore and Local Cache
            await onPlaceOrder(newOrder);

            // 3. Construct the WhatsApp message with requested template
            const productNamesList = cartDetails
                .map(item => `${item.quantity}x ${item.product?.name}`)
                .filter(Boolean)
                .join(', ');
            
            const message = `Hello 👋🏽\n` +
                `I’d like to complete my order from ${shopInfo.name}.\n\n` +
                `Order ID: ${orderId}\n` +
                `Product(s): ${productNamesList}\n` +
                `Subtotal: GHS ${total.toFixed(2)}\n\n` +
                `Delivery Details:\n` +
                `Name: ${formData.fullName}\n` +
                `Phone: ${formData.phone}\n` +
                `Location: ${formData.location}\n` +
                `${formData.note ? `Note: ${formData.note}\n` : ''}\n` +
                `Payment Method: Mobile Money\n` +
                `MoMo Number: ${shopInfo.whatsapp}\n` +
                `MoMo Name: Claudette Cobbah\n\n` +
                `Delivery fee will be calculated and communicated once the order is ready.\n\n` +
                `I’ll make payment now and send proof.\n` +
                `Thank you ✨`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${shopInfo.whatsapp}?text=${encodedMessage}`;

            // 4. Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // 5. Show success state
            setIsSuccess(true);
        } catch (error) {
            console.error("Order processing error:", error);
            addToast("Failed to record order. Please try again.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="container mx-auto px-4 pt-32 pb-20 text-center max-w-lg"
            >
                <div className="bg-bg-secondary p-8 rounded-3xl shadow-xl border border-border-primary">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Order Initiated!</h1>
                    <p className="text-text-secondary mb-6">Your order details have been prepared for WhatsApp.</p>
                    
                    <div className="bg-bg-tertiary p-4 rounded-xl mb-8 border border-border-primary">
                        <p className="text-xs uppercase tracking-widest text-text-secondary mb-1">Your Order ID</p>
                        <p className="text-2xl font-mono font-bold text-accent-primary">{orderId}</p>
                    </div>

                    <div className="text-left space-y-4 text-sm text-text-secondary bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
                        <p className="font-bold text-amber-800 dark:text-amber-200">What happens next?</p>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Check your WhatsApp tab to send the message.</li>
                            <li>{shopInfo.name.split(' ').pop()} will reply to confirm delivery costs.</li>
                            <li>You can then complete payment via Mobile Money.</li>
                        </ol>
                    </div>

                    <button 
                        onClick={() => window.location.hash = '#/'}
                        className="mt-8 text-accent-primary font-bold hover:underline"
                    >
                        Back to Shop
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
        >
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Complete Your Order</h1>
                    <button onClick={onBackToCart} className="text-sm text-accent-primary hover:opacity-80 font-medium">
                        &larr; Back to Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-bg-secondary p-6 sm:p-8 rounded-3xl shadow-lg border border-border-primary space-y-6 order-2 lg:order-1">
                        <h2 className="text-xl font-bold text-text-primary border-b border-border-primary pb-4 mb-2">Your Details</h2>
                        
                        <FormInput 
                            label="Full Name" 
                            id="fullName" 
                            name="fullName" 
                            placeholder="e.g. Ama Serwaa" 
                            value={formData.fullName} 
                            onChange={handleInputChange} 
                        />
                        
                        <FormInput 
                            label="WhatsApp Phone Number" 
                            id="phone" 
                            name="phone" 
                            type="tel" 
                            placeholder="e.g. 024XXXXXXX" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                        />

                        <FormInput 
                            label="Delivery Area / Location" 
                            id="location" 
                            name="location" 
                            placeholder="e.g. East Legon, near the Shell station" 
                            value={formData.location} 
                            onChange={handleInputChange} 
                        />

                        <FormInput 
                            label={`Note to ${shopInfo.name.split(' ').pop()} (Optional)`}
                            id="note" 
                            name="note" 
                            placeholder="Any special requests or color preferences?" 
                            value={formData.note} 
                            onChange={handleInputChange} 
                            isTextArea
                        />

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                ) : (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                )}
                                {isProcessing ? 'Processing Order...' : 'Pay via WhatsApp'}
                            </button>
                            <p className="text-center text-[10px] text-text-secondary mt-3 uppercase tracking-widest">Order ID: {orderId}</p>
                        </div>
                    </form>

                    {/* Order Summary */}
                    <div className="bg-bg-secondary p-6 sm:p-8 rounded-3xl shadow-lg border border-border-primary sticky top-28 order-1 lg:order-2">
                        <h2 className="text-xl font-bold text-text-primary border-b border-border-primary pb-4 mb-4">Your Order</h2>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-6 hide-scrollbar">
                            {cartDetails.map(({ product, quantity }) => product && (
                                <div key={product.id} className="flex items-center gap-4">
                                    <img src={product.imageUrl} alt={product.name} className="w-14 h-14 object-cover rounded-xl" />
                                    <div className="flex-grow">
                                        <p className="font-bold text-text-primary text-sm leading-tight">{product.name}</p>
                                        <p className="text-text-secondary text-xs">Qty: {quantity}</p>
                                    </div>
                                    <p className="font-bold text-accent-primary text-sm">GH₵{((product.salePrice ?? product.price) * quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border-primary pt-4 space-y-2">
                            <div className="flex justify-between text-text-secondary text-sm">
                                <span>Subtotal</span>
                                <span className="font-bold">GH₵{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-text-secondary text-xs italic">
                                <span>Delivery Fee</span>
                                <span>Calculated on WhatsApp</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-text-primary border-t border-border-primary pt-4 mt-2">
                                <span>Total</span>
                                <span>GH₵{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.main>
    );
};

export default CheckoutPage;
