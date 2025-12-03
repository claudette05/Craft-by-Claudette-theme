
import * as React from 'react';
import { CartItem, ToastMessage, ProductReview, PopupConfig, EmailLog, FreeGiftConfig } from '../types';
import { MOCK_REVIEWS } from '../constants';

// Define a local User type since Firebase is removed
export type User = {
    uid: string;
    email: string | null;
    displayName?: string;
};

interface AppContextType {
    user: User | null;
    isAuthLoading: boolean;
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    wishlist: number[];
    reviews: ProductReview[];
    isDarkMode: boolean;
    toasts: ToastMessage[];
    cartItemCount: number;
    popupConfig: PopupConfig;
    emailLogs: EmailLog[];
    freeGiftConfig: FreeGiftConfig;
    updatePopupConfig: (config: PopupConfig) => void;
    updateFreeGiftConfig: (config: FreeGiftConfig) => void;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => Promise<void>;
    sendResetLink: (email: string) => Promise<void>;
    sendFakeEmail: (recipient: string, subject: string, template: EmailLog['template'], data?: any) => void;
    addToCart: (productId: number, quantity: number) => void;
    updateCartQuantity: (productId: number, newQuantity: number) => void;
    removeFromCart: (productId: number) => void;
    toggleWishlist: (productId: number) => void;
    addReview: (review: Omit<ProductReview, 'id' | 'date' | 'verifiedPurchase'>) => void;
    addToast: (message: string, type?: ToastMessage['type']) => void;
    toggleDarkMode: () => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = React.useState(false); 
    const [cart, setCart] = React.useState<CartItem[]>([]);
    const [wishlist, setWishlist] = React.useState<number[]>([]);
    const [reviews, setReviews] = React.useState<ProductReview[]>(MOCK_REVIEWS);
    const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
    const [emailLogs, setEmailLogs] = React.useState<EmailLog[]>([]);
    const [isDarkMode, setIsDarkMode] = React.useState(() => {
        return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    // Free Gift Configuration
    const [freeGiftConfig, setFreeGiftConfig] = React.useState<FreeGiftConfig>({
        enabled: true,
        threshold: 200,
        message: "Spend {amount} more to get a Mystery Gift!",
        successMessage: "🎉 You've unlocked a Free Gift!",
    });

    // Initial Popup Configuration
    const [popupConfig, setPopupConfig] = React.useState<PopupConfig>({
        enabled: true,
        type: 'standard',
        content: {
            title: "Get 10% Off",
            description: "Join the Craft by Claudette family! Subscribe to our newsletter and receive a special discount code for your first order.",
            imageUrl: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop",
            buttonText: "Unlock My 10% Off",
            successTitle: "You're In!",
            successMessage: "Use the code below at checkout to save on your first order.",
            discountCode: "WELCOME10",
            placeholderText: "Enter your email address",
            disclaimerText: "No spam, unsubscribe anytime."
        },
        style: {
            layout: 'image-left',
            width: 'md',
            backgroundColor: '#ffffff',
            textColor: '#18181b',
            buttonColor: '#F59E0B',
            buttonTextColor: '#ffffff',
            overlayColor: 'rgba(0,0,0,0.6)',
            borderRadius: 'lg',
            fontFamily: 'sans',
            position: 'center',
            entranceAnimation: 'scale',
            exitAnimation: 'fade',
        },
        behavior: {
            delay: 5,
            showOnExit: true,
            showOnScroll: false,
            scrollPercentage: 50,
        },
        spinnerSegments: [
            { id: '1', label: '10% OFF', value: 'SPIN10', color: '#F59E0B', textColor: '#ffffff', probability: 20 },
            { id: '2', label: 'Free Shipping', value: 'FREESHIP', color: '#18181b', textColor: '#ffffff', probability: 20 },
            { id: '3', label: '5% OFF', value: 'SPIN5', color: '#F59E0B', textColor: '#ffffff', probability: 40 },
            { id: '4', label: 'No Luck', value: 'TRYAGAIN', color: '#71717a', textColor: '#ffffff', probability: 10 },
            { id: '5', label: '20% OFF', value: 'JACKPOT20', color: '#18181b', textColor: '#F59E0B', probability: 5 },
            { id: '6', label: 'Free Gift', value: 'GIFT', color: '#F59E0B', textColor: '#ffffff', probability: 5 },
        ]
    });

    const addToast = React.useCallback((message: string, type: ToastMessage['type'] = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);
    
    // Load data from localStorage
    React.useEffect(() => {
        try {
            const savedWishlist = localStorage.getItem('wishlist');
            setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
            const savedCart = localStorage.getItem('cart');
            setCart(savedCart ? JSON.parse(savedCart) : []);
            const savedReviews = localStorage.getItem('reviews');
            if (savedReviews) {
                setReviews([...MOCK_REVIEWS, ...JSON.parse(savedReviews)]);
            }
            const savedEmails = localStorage.getItem('emailLogs');
            if (savedEmails) {
                setEmailLogs(JSON.parse(savedEmails));
            }
            const savedPopupConfig = localStorage.getItem('popupConfig');
            if (savedPopupConfig) {
                const parsed = JSON.parse(savedPopupConfig);
                if (!parsed.type) parsed.type = 'standard';
                if (!parsed.style.entranceAnimation) parsed.style.entranceAnimation = 'scale';
                if (!parsed.spinnerSegments) parsed.spinnerSegments = popupConfig.spinnerSegments;
                setPopupConfig(prev => ({ ...prev, ...parsed }));
            }
            const savedFreeGiftConfig = localStorage.getItem('freeGiftConfig');
            if (savedFreeGiftConfig) {
                setFreeGiftConfig(JSON.parse(savedFreeGiftConfig));
            }
        } catch (e) {
            console.error("Failed to load data from localStorage", e);
            setWishlist([]);
            setCart([]);
        }
    }, []);

    // Persist data
    React.useEffect(() => { try { localStorage.setItem('wishlist', JSON.stringify(wishlist)); } catch {} }, [wishlist]);
    React.useEffect(() => { try { localStorage.setItem('cart', JSON.stringify(cart)); } catch {} }, [cart]);
    React.useEffect(() => { try { localStorage.setItem('popupConfig', JSON.stringify(popupConfig)); } catch {} }, [popupConfig]);
    React.useEffect(() => { try { localStorage.setItem('emailLogs', JSON.stringify(emailLogs)); } catch {} }, [emailLogs]);
    React.useEffect(() => { try { localStorage.setItem('freeGiftConfig', JSON.stringify(freeGiftConfig)); } catch {} }, [freeGiftConfig]);
    
    // Persist custom reviews
    React.useEffect(() => {
         try {
             const newReviews = reviews.filter(r => !MOCK_REVIEWS.find(mr => mr.id === r.id));
             localStorage.setItem('reviews', JSON.stringify(newReviews));
        } catch {}
    }, [reviews]);

    React.useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const sendFakeEmail = (recipient: string, subject: string, template: EmailLog['template'], data: any = {}) => {
        let content = '';
        if (template === 'welcome') {
            content = `<div style="font-family: sans-serif; color: #333; padding: 20px;"><h1 style="color: #d97706;">Welcome to Craft by Claudette, ${data.name || 'Friend'}!</h1><p>We are so excited to have you join our community.</p><p>As a thank you, use code <strong>WELCOME10</strong> for 10% off.</p><br/><a href="#" style="background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Shop Now</a></div>`;
        } else if (template === 'password_reset') {
            content = `<div style="font-family: sans-serif; color: #333; padding: 20px;"><h2>Reset Your Password</h2><p>Click the button below to choose a new one:</p><br/><a href="#" style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></div>`;
        } else if (template === 'order_confirmation') {
            content = `<div style="font-family: sans-serif; color: #333; padding: 20px;"><h1 style="color: #d97706;">Order Confirmed!</h1><p>Hi ${data.name}, thanks for your order!</p><p>Total: <strong>GH₵${data.total}</strong></p><h3>Items:</h3><ul>${data.items?.map((item: any) => `<li>${item.quantity}x ${item.name}</li>`).join('')}</ul></div>`;
        } else if (template === 'marketing') {
             content = `<div style="font-family: sans-serif; color: #333; padding: 20px;"><h1 style="color: #d97706;">${subject}</h1><p>Check out our latest collection!</p></div>`;
        }

        const logEntry: EmailLog = {
            id: Date.now().toString(),
            recipient,
            subject,
            template,
            status: 'Sent',
            date: new Date().toLocaleString(),
            content
        };
        setEmailLogs(prev => [logEntry, ...prev]);
    };

    const toggleWishlist = (productId: number) => {
        setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };

    const addToCart = (productId: number, quantity: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === productId);
            if (existingItem) {
                return prevCart.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prevCart, { productId, quantity }];
        });
    };

    const updateCartQuantity = (productId: number, newQuantity: number) => {
        setCart(prevCart => newQuantity <= 0 ? prevCart.filter(item => item.productId !== productId) : prevCart.map(item => item.productId === productId ? { ...item, quantity: newQuantity } : item));
    };

    const removeFromCart = (productId: number) => setCart(prev => prev.filter(item => item.productId !== productId));

    const addReview = (reviewData: Omit<ProductReview, 'id' | 'date' | 'verifiedPurchase'>) => {
        const newReview: ProductReview = { ...reviewData, id: Date.now(), date: new Date().toISOString().split('T')[0], verifiedPurchase: true };
        setReviews(prev => [newReview, ...prev]);
        addToast('Review submitted successfully!', 'success');
    };

    const updatePopupConfig = (config: PopupConfig) => {
        setPopupConfig(config);
        addToast("Popup settings updated!", "success");
    };

    const updateFreeGiftConfig = (config: FreeGiftConfig) => {
        setFreeGiftConfig(config);
        addToast("Free Gift settings updated!", "success");
    };

    const login = async (email: string, password: string) => {
        if (email === 'admin@test.com' && password === 'password') {
            setUser({ uid: 'mock-admin-uid', email: 'admin@test.com', displayName: 'Admin User' });
            addToast('Login successful!', 'success');
        } else {
            addToast('Invalid credentials', 'error');
            throw new Error('Invalid credentials');
        }
    };

    const signup = async (email: string, password: string, name: string = 'User') => {
        setUser({ uid: `mock-user-${Date.now()}`, email, displayName: name });
        sendFakeEmail(email, 'Welcome to Craft by Claudette!', 'welcome', { name });
        addToast('Account created!', 'success');
    };

    const logout = async () => {
        setUser(null);
        addToast('Logged out.', 'info');
    };

    const sendResetLink = async (email: string) => {
        sendFakeEmail(email, 'Reset Your Password', 'password_reset', {});
        addToast(`Reset link sent to ${email}`, 'success');
    };

    const toggleDarkMode = React.useCallback(() => setIsDarkMode(prev => !prev), []);
    const cartItemCount = React.useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

    return <AppContext.Provider value={{ user, isAuthLoading, cart, setCart, wishlist, reviews, isDarkMode, toasts, cartItemCount, login, signup, logout, sendResetLink, addToCart, updateCartQuantity, removeFromCart, toggleWishlist, addReview, addToast, toggleDarkMode, popupConfig, updatePopupConfig, emailLogs, sendFakeEmail, freeGiftConfig, updateFreeGiftConfig }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};
