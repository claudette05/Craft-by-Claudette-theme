
import * as React from 'react';
import { CartItem, ToastMessage, ProductReview, PopupConfig, EmailLog, FreeGiftConfig, User, CloudinaryConfig, ShopInfo } from '../types';
import { MOCK_REVIEWS } from '../constants';
import { databaseService } from '../services/databaseService';

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
    updatePopupConfig: (config: PopupConfig) => void;
    updateFreeGiftConfig: (config: FreeGiftConfig) => Promise<void>;
    updateCloudinaryConfig: (config: CloudinaryConfig) => Promise<void>;
    updateShopInfo: (info: ShopInfo) => Promise<void>;
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
    login: (email: string, pass: string) => Promise<void>;
    signup: (email: string, pass: string, name: string) => Promise<void>;
    logout: () => void;
    sendResetLink: (email: string) => Promise<void>;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = React.useState<CartItem[]>([]);
    const [wishlist, setWishlist] = React.useState<number[]>([]);
    const [reviews, setReviews] = React.useState<ProductReview[]>(MOCK_REVIEWS);
    const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
    const [emailLogs, setEmailLogs] = React.useState<EmailLog[]>([]);
    const [isDarkMode, setIsDarkMode] = React.useState(() => {
        return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const [user, setUser] = React.useState<User | null>(null);

    // Initial default states
    const [shopInfo, setShopInfo] = React.useState<ShopInfo>({ 
        name: 'Craft by Claudette', 
        email: 'hello@craftbyclaudette.com',
        whatsapp: '0509680962',
        momoNumber: '0509680962',
        momoName: 'Claudette Cobbah',
        logoUrl: ''
    });

    const [cloudinaryConfig, setCloudinaryConfig] = React.useState<CloudinaryConfig>({ 
        cloudName: '', 
        uploadPreset: '' 
    });

    const [freeGiftConfig, setFreeGiftConfig] = React.useState<FreeGiftConfig>({
        enabled: true,
        threshold: 200,
        message: "Spend {amount} more to get a Mystery Gift!",
        successMessage: "🎉 You've unlocked a Free Gift!",
    });

    const [popupConfig, setPopupConfig] = React.useState<PopupConfig>({
        enabled: false,
        type: 'standard',
        content: {
            title: "Get 10% Off",
            description: "Join the Craft by Claudette family!",
            imageUrl: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop",
            buttonText: "Unlock My 10% Off",
            successTitle: "You're In!",
            successMessage: "Use code below.",
            discountCode: "WELCOME10",
            placeholderText: "Enter email",
            disclaimerText: "Unsubscribe anytime."
        },
        style: {
            layout: 'image-left', width: 'md', backgroundColor: '#ffffff', textColor: '#18181b',
            buttonColor: '#F59E0B', buttonTextColor: '#ffffff', overlayColor: 'rgba(0,0,0,0.6)',
            borderRadius: 'lg', fontFamily: 'sans', position: 'center', entranceAnimation: 'scale', exitAnimation: 'fade',
        },
        behavior: { delay: 5, showOnExit: true, showOnScroll: false, scrollPercentage: 50 },
        spinnerSegments: [
            { id: '1', label: '10% OFF', value: 'SPIN10', color: '#F59E0B', textColor: '#ffffff', probability: 20 },
            { id: '2', label: 'Free Ship', value: 'FREESHIP', color: '#18181b', textColor: '#ffffff', probability: 20 },
            { id: '3', label: '5% OFF', value: 'SPIN5', color: '#F59E0B', textColor: '#ffffff', probability: 40 },
            { id: '4', label: 'No Luck', value: 'TRYAGAIN', color: '#71717a', textColor: '#ffffff', probability: 10 },
            { id: '5', label: '20% OFF', value: 'JACKPOT20', color: '#18181b', textColor: '#F59E0B', probability: 5 },
            { id: '6', label: 'Free Gift', value: 'GIFT', color: '#F59E0B', textColor: '#ffffff', probability: 5 },
        ]
    });

    // FETCH SETTINGS ON LOAD
    React.useEffect(() => {
        const loadSettings = async () => {
            const data = await databaseService.getSettings();
            if (data) {
                if (data.shopInfo) setShopInfo(data.shopInfo);
                if (data.cloudinaryConfig) setCloudinaryConfig(data.cloudinaryConfig);
                if (data.freeGiftConfig) setFreeGiftConfig(data.freeGiftConfig);
                if (data.popupConfig) setPopupConfig(data.popupConfig);
            }
        };
        loadSettings();
    }, []);

    const addToast = React.useCallback((message: string, type: ToastMessage['type'] = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    }, []);
    
    // Load local-only data
    React.useEffect(() => {
        try {
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
            const savedCart = localStorage.getItem('cart');
            if (savedCart) setCart(JSON.parse(savedCart));
            const savedReviews = localStorage.getItem('reviews');
            if (savedReviews) setReviews([...MOCK_REVIEWS, ...JSON.parse(savedReviews)]);
            const savedEmails = localStorage.getItem('emailLogs');
            if (savedEmails) setEmailLogs(JSON.parse(savedEmails));
            const savedUser = localStorage.getItem('user');
            if (savedUser) setUser(JSON.parse(savedUser));
        } catch (e) {
            console.error("Local load failed", e);
        }
    }, []);

    // Persist local-only data
    React.useEffect(() => { try { localStorage.setItem('wishlist', JSON.stringify(wishlist)); } catch {} }, [wishlist]);
    React.useEffect(() => { try { localStorage.setItem('cart', JSON.stringify(cart)); } catch {} }, [cart]);
    React.useEffect(() => { try { if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user'); } catch {} }, [user]);
    
    React.useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
        else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
    }, [isDarkMode]);

    const uploadImage = async (file: File): Promise<string> => {
        if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
            throw new Error("Cloudinary not configured in Admin Settings.");
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, { method: 'POST', body: formData });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || "Cloudinary upload failed");
        }
        const data = await response.json();
        return data.secure_url;
    };

    const login = async (email: string, pass: string) => {
        await new Promise(res => setTimeout(res, 800));
        const mockUser: User = { id: Date.now().toString(), email, name: 'Demo User' };
        setUser(mockUser);
        addToast('Logged in successfully!');
    };

    const signup = async (email: string, pass: string, name: string) => {
        await new Promise(res => setTimeout(res, 1000));
        const mockUser: User = { id: Date.now().toString(), email, name };
        setUser(mockUser);
        addToast('Account created successfully!');
    };

    const logout = () => { setUser(null); addToast('Logged out.', 'info'); };

    const sendResetLink = async (email: string) => {
        await new Promise(res => setTimeout(res, 800));
        addToast('Reset link sent to ' + email, 'info');
    };

    const toggleWishlist = (productId: number) => {
        setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };

    const addToCart = (productId: number, quantity: number) => {
        setCart(prev => {
            const existing = prev.find(item => item.productId === productId);
            if (existing) return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
            return [...prev, { productId, quantity }];
        });
    };

    const updateCartQuantity = (productId: number, newQuantity: number) => {
        setCart(prev => newQuantity <= 0 ? prev.filter(i => i.productId !== productId) : prev.map(i => i.productId === productId ? { ...i, quantity: newQuantity } : i));
    };

    const removeFromCart = (productId: number) => setCart(prev => prev.filter(i => i.productId !== productId));

    const addReview = (reviewData: Omit<ProductReview, 'id' | 'date' | 'verifiedPurchase'>) => {
        const newReview: ProductReview = { ...reviewData, id: Date.now(), date: new Date().toISOString().split('T')[0], verifiedPurchase: false };
        setReviews(prev => [newReview, ...prev]);
        addToast('Review submitted!');
    };

    // SYNCED CONFIGURATIONS
    const updatePopupConfig = async (config: PopupConfig) => {
        setPopupConfig(config);
        await databaseService.saveSettings({ popupConfig: config });
        addToast("Popup published!");
    };

    const updateFreeGiftConfig = async (config: FreeGiftConfig) => {
        setFreeGiftConfig(config);
        await databaseService.saveSettings({ freeGiftConfig: config });
        addToast("Gift settings saved!");
    };

    const updateCloudinaryConfig = async (config: CloudinaryConfig) => {
        setCloudinaryConfig(config);
        await databaseService.saveSettings({ cloudinaryConfig: config });
        addToast("Cloudinary linked!");
    };

    const updateShopInfo = async (info: ShopInfo) => {
        setShopInfo(info);
        await databaseService.saveSettings({ shopInfo: info });
        addToast("Shop info synced!");
    };

    const toggleDarkMode = React.useCallback(() => setIsDarkMode(prev => !prev), []);
    const cartItemCount = React.useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

    return (
        <AppContext.Provider value={{ 
            cart, setCart, wishlist, reviews, isDarkMode, toasts, cartItemCount, 
            addToCart, updateCartQuantity, removeFromCart, toggleWishlist, addReview, addToast, 
            toggleDarkMode, popupConfig, updatePopupConfig, emailLogs, sendFakeEmail: () => {}, 
            freeGiftConfig, updateFreeGiftConfig, user, login, signup, logout, sendResetLink, 
            cloudinaryConfig, updateCloudinaryConfig, uploadImage, shopInfo, updateShopInfo 
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
