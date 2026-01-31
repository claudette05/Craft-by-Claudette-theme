
import * as React from 'react';
import { CartItem, ToastMessage, ProductReview, PopupConfig, EmailLog, FreeGiftConfig, User, CloudinaryConfig, ShopInfo, Category } from '../types';
import { MOCK_REVIEWS } from '../constants';

// Hardcoded admin email for this example
const ADMIN_EMAIL = 'cobbahclaudette@gmail.com';

const LOCAL_STORAGE_KEYS = {
    WISHLIST: 'wishlist',
    CART: 'cart',
    REVIEWS: 'reviews',
    EMAIL_LOGS: 'emailLogs',
    USER: 'user',
    SETTINGS: 'appSettings', // For all settings
    THEME: 'theme',
};

interface AppContextType {
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
    cloudinaryConfig: CloudinaryConfig;
    shopInfo: ShopInfo;
    categories: Category[];
    updatePopupConfig: (config: PopupConfig) => void;
    updateFreeGiftConfig: (config: FreeGiftConfig) => void;
    updateCloudinaryConfig: (config: CloudinaryConfig) => void;
    updateShopInfo: (info: ShopInfo) => void;
    uploadImage: (file: File) => Promise<string>;
    sendFakeEmail: (recipient: string, subject: string, template: EmailLog['template'], data?: any) => void;
    addToCart: (productId: number, quantity: number) => void;
    updateCartQuantity: (productId: number, newQuantity: number) => void;
    removeFromCart: (productId: number) => void;
    toggleWishlist: (productId: number) => void;
    addReview: (review: Omit<ProductReview, 'id' | 'date' | 'verifiedPurchase'>) => void;
    addToast: (message: string, type?: ToastMessage['type']) => void;
    toggleDarkMode: () => void;
    user: User | null;
    isAdmin: boolean;
    authLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    signup: (email: string, pass: string, name: string) => Promise<void>;
    logout: () => void;
    sendResetLink: (email: string) => Promise<void>;
    fetchCategories: () => Promise<void>;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // === LOCAL STORAGE BASED STATES ===
    const [cart, setCart] = React.useState<CartItem[]>(() => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CART) || '[]'));
    const [wishlist, setWishlist] = React.useState<number[]>(() => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST) || '[]'));
    const [reviews, setReviews] = React.useState<ProductReview[]>(() => [...MOCK_REVIEWS, ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS) || '[]')]);
    const [emailLogs, setEmailLogs] = React.useState<EmailLog[]>(() => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.EMAIL_LOGS) || '[]'));
    const [user, setUser] = React.useState<User | null>(() => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || 'null'));
    const [isDarkMode, setIsDarkMode] = React.useState(() => localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) === 'dark');
    const [categories, setCategories] = React.useState<Category[]>([]); // This might come from a static file or API in the future

    // === SETTINGS (with defaults) ===
    const [settings, setSettings] = React.useState(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
        const defaults = {
            shopInfo: { name: 'Craft by Claudette', email: 'hello@craftbyclaudette.com', whatsapp: '233552130759', logoUrl: '' },
            cloudinaryConfig: { cloudName: '', uploadPreset: '' },
            freeGiftConfig: { enabled: true, threshold: 200, message: "Spend {amount} more for a Mystery Gift!", successMessage: "🎉 Free Gift unlocked!" },
            popupConfig: { enabled: false, type: 'standard', content: {}, style: {}, behavior: {}, spinnerSegments: [] },
        };
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    });
    
    // Individual getters for convenience
    const { shopInfo, cloudinaryConfig, freeGiftConfig, popupConfig } = settings;

    const [authLoading, setAuthLoading] = React.useState(false);
    const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
    const isAdmin = user?.email === ADMIN_EMAIL;

    // === PERSISTENCE EFFECTS ===
    React.useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart)); }, [cart]);
    React.useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist)); }, [wishlist]);
    React.useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(reviews.filter(r => !MOCK_REVIEWS.includes(r)))); }, [reviews]);
    React.useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.EMAIL_LOGS, JSON.stringify(emailLogs)); }, [emailLogs]);
    React.useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);
    React.useEffect(() => { user ? localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user)) : localStorage.removeItem(LOCAL_STORAGE_KEYS.USER); }, [user]);
    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);


    // === ACTIONS ===

    const addToast = React.useCallback((message: string, type: ToastMessage['type'] = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    }, []);

    const uploadImage = async (file: File): Promise<string> => {
        if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
            addToast("Cloudinary isn't set up in your admin settings.", "error");
            throw new Error("Cloudinary not configured.");
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, { method: 'POST', body: formData });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || "Upload failed");
        }
        const data = await res.json();
        return data.secure_url;
    };
    
    const login = async (email: string, pass: string) => {
        await new Promise(res => setTimeout(res, 800));
        const mockUser: User = { id: Date.now().toString(), email, name: email === ADMIN_EMAIL ? 'Admin User' : 'Demo User' };
        setUser(mockUser);
        addToast('Logged in successfully!');
    };

    const signup = async (email: string, pass: string, name: string) => {
        await new Promise(res => setTimeout(res, 1000));
        const mockUser: User = { id: Date.now().toString(), email, name };
        setUser(mockUser);
        addToast('Account created successfully!');
    };

    const logout = () => { 
        setUser(null);
        addToast('Logged out.', 'info');
    };

    const sendResetLink = async (email: string) => {
        await new Promise(res => setTimeout(res, 800));
        addToast('Reset link sent to ' + email, 'info');
    };
    
    // Settings Updaters
    const updateShopInfo = (info: ShopInfo) => setSettings(s => ({...s, shopInfo: info}));
    const updateCloudinaryConfig = (config: CloudinaryConfig) => setSettings(s => ({...s, cloudinaryConfig: config}));
    const updateFreeGiftConfig = (config: FreeGiftConfig) => setSettings(s => ({...s, freeGiftConfig: config}));
    const updatePopupConfig = (config: PopupConfig) => setSettings(s => ({...s, popupConfig: config}));

    const toggleWishlist = (productId: number) => setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    const addToCart = (productId: number, quantity: number) => {
        setCart(prev => {
            const existing = prev.find(item => item.productId === productId);
            if (existing) return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
            return [...prev, { productId, quantity }];
        });
    };
    const updateCartQuantity = (productId: number, newQuantity: number) => setCart(prev => newQuantity <= 0 ? prev.filter(i => i.productId !== productId) : prev.map(i => i.productId === productId ? { ...i, quantity: newQuantity } : i));
    const removeFromCart = (productId: number) => setCart(prev => prev.filter(i => i.productId !== productId));

    const addReview = (reviewData: Omit<ProductReview, 'id' | 'date' | 'verifiedPurchase'>) => {
        const newReview: ProductReview = { ...reviewData, id: Date.now(), date: new Date().toISOString().split('T')[0], verifiedPurchase: false };
        setReviews(prev => [newReview, ...prev]);
        addToast('Review submitted!');
    };

    const sendFakeEmail = (recipient: string, subject: string, template: EmailLog['template'], data: any = {}) => {
        const newLog: EmailLog = {
            id: String(Date.now()),
            date: new Date().toLocaleString(),
            recipient,
            subject,
            template,
            status: 'Sent',
            content: `This is a simulated email for template: <strong>${template}</strong>. Data: ${JSON.stringify(data)}` // Simplified content
        };
        setEmailLogs(prev => [newLog, ...prev]);
    };

    // In a real app, this would fetch from a server. For now, it's a placeholder.
    const fetchCategories = async () => {
        // Mock fetch. In a real scenario, you'd have a separate service for this.
        setCategories([]); 
    };

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <AppContext.Provider value={{
            cart, setCart, wishlist, reviews, isDarkMode, toasts, cartItemCount, 
            addToCart, updateCartQuantity, removeFromCart, toggleWishlist, addReview, addToast, 
            toggleDarkMode, popupConfig, updatePopupConfig, emailLogs, sendFakeEmail, 
            freeGiftConfig, updateFreeGiftConfig, user, isAdmin, authLoading, login, signup, logout, sendResetLink, 
            cloudinaryConfig, updateCloudinaryConfig, uploadImage, shopInfo, updateShopInfo, 
            categories, fetchCategories
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};
