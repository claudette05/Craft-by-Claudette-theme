
import * as React from 'react';
import { CartItem, ToastMessage } from '../types';

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
    isDarkMode: boolean;
    toasts: ToastMessage[];
    cartItemCount: number;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    sendResetLink: (email: string) => Promise<void>;
    addToCart: (productId: number, quantity: number) => void;
    updateCartQuantity: (productId: number, newQuantity: number) => void;
    removeFromCart: (productId: number) => void;
    toggleWishlist: (productId: number) => void;
    addToast: (message: string, type?: ToastMessage['type']) => void;
    toggleDarkMode: () => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = React.useState(false); // No longer loading from Firebase
    const [cart, setCart] = React.useState<CartItem[]>([]);
    const [wishlist, setWishlist] = React.useState<number[]>([]);
    const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
    const [isDarkMode, setIsDarkMode] = React.useState(() => {
        return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
        user, isAuthLoading, cart, setCart, wishlist, isDarkMode, toasts, cartItemCount,
        login, signup, logout, sendResetLink, addToCart, updateCartQuantity, removeFromCart, toggleWishlist, addToast, toggleDarkMode
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
