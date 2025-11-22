
import * as React from 'react';
import { CartItem, ToastMessage, ProductReview, PopupConfig } from '../types';
import { MOCK_REVIEWS } from '../constants';

// Define a local User type since Firebase is removed
export type User = {
    uid: string;
    email: string | null;
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
    updatePopupConfig: (config: PopupConfig) => void;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    sendResetLink: (email: string) => Promise<void>;
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
    const [isAuthLoading, setIsAuthLoading] = React.useState(false); // No longer loading from Firebase
    const [cart, setCart] = React.useState<CartItem[]>([]);
    const [wishlist, setWishlist] = React.useState<number[]>([]);
    const [reviews, setReviews] = React.useState<ProductReview[]>(MOCK_REVIEWS);
    const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
    const [isDarkMode, setIsDarkMode] = React.useState(() => {
        return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
    
    // Load cart and wishlist from localStorage on initial load
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
            const savedPopupConfig = localStorage.getItem('popupConfig');
            if (savedPopupConfig) {
                const parsed = JSON.parse(savedPopupConfig);
                // Simple migration check: ensure new fields exist
                if (!parsed.type) parsed.type = 'standard';
                if (!parsed.style.entranceAnimation) parsed.style.entranceAnimation = 'scale';
                if (!parsed.spinnerSegments) parsed.spinnerSegments = popupConfig.spinnerSegments;
                
                setPopupConfig(prev => ({ ...prev, ...parsed }));
            }
        } catch (e) {
            console.error("Failed to load data from localStorage", e);
            setWishlist([]);
            setCart([]);
        }
    }, []);

    // Persist wishlist to localStorage whenever it changes
    React.useEffect(() => {
        try {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch (error) {
            console.error('Error saving wishlist to localStorage', error);
        }
    }, [wishlist]);

    // Persist cart to localStorage whenever it changes
    React.useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        catch (error) {
            console.error('Error saving cart to localStorage', error);
        }
    }, [cart]);
    
    // Persist custom reviews
    React.useEffect(() => {
         try {
             const newReviews = reviews.filter(r => !MOCK_REVIEWS.find(mr => mr.id === r.id));
             localStorage.setItem('reviews', JSON.stringify(newReviews));
        } catch (error) {
            console.error('Error saving reviews to localStorage', error);
        }
    }, [reviews]);

    // Persist popup config
    React.useEffect(() => {
        try {
            localStorage.setItem('popupConfig', JSON.stringify(popupConfig));
        } catch (error) {
            console.error('Error saving popup config to localStorage', error);
        }
    }, [popupConfig]);

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

    const toggleWishlist = (productId: number) => {
        setWishlist(prevWishlist =>
            prevWishlist.includes(productId)
                ? prevWishlist.filter(id => id !== productId)
                : [...prevWishlist, productId]
        );
    };

    const addToCart = (productId: number, quantity: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === productId);
            if (existingItem) {
                return prevCart.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { productId, quantity }];
        });
    };

    const updateCartQuantity = (productId: number, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.productId !== productId);
            }
            return prevCart.map(item =>
                item.productId === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    };

    const addReview = (reviewData: Omit<ProductReview, 'id' | 'date' | 'verifiedPurchase'>) => {
        const newReview: ProductReview = {
            ...reviewData,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            verifiedPurchase: true // Simulating verified purchase for now
        };
        setReviews(prev => [newReview, ...prev]);
        addToast('Review submitted successfully!', 'success');
    };

    const updatePopupConfig = (config: PopupConfig) => {
        setPopupConfig(config);
        addToast("Popup settings updated!", "success");
    };

    const login = async (email: string, password: string) => {
        if (email === 'admin@test.com' && password === 'password') {
            const mockUser: User = { uid: 'mock-admin-uid', email: 'admin@test.com' };
            setUser(mockUser);
            addToast('Login successful!', 'success');
        } else {
            addToast('Invalid credentials (use admin@test.com / password)', 'error');
            throw new Error('Invalid credentials');
        }
    };

    const signup = async (email: string, password: string) => {
        const mockUser: User = { uid: `mock-user-${Date.now()}`, email };
        setUser(mockUser);
        addToast('Account created successfully!', 'success');
    };

    const logout = async () => {
        setUser(null);
        addToast('You have been logged out.', 'info');
    };

    const sendResetLink = async (email: string) => {
        addToast(`Password reset link sent to ${email}! (This is a demo)`, 'success');
    };

    const toggleDarkMode = React.useCallback(() => setIsDarkMode(prev => !prev), []);

    const cartItemCount = React.useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

    const value = {
        user, isAuthLoading, cart, setCart, wishlist, reviews, isDarkMode, toasts, cartItemCount,
        login, signup, logout, sendResetLink, addToCart, updateCartQuantity, removeFromCart, toggleWishlist, addReview, addToast, toggleDarkMode,
        popupConfig, updatePopupConfig
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
