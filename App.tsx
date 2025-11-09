import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Product, CartItem, Page } from './types';
import { PRODUCTS, CATEGORIES, HERO_SLIDES, TRENDING_PRODUCTS, DEALS_PRODUCTS, BESTSELLER_PRODUCTS, MOCK_REVIEWS } from './constants';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import Features from './components/Features';
import CategoryCarousel from './components/CategoryCarousel';
import ProductGrid from './components/ProductGrid';
import CTA from './components/CTA';
import Footer from './components/Footer';
import DealsSection from './components/DealsSection';
import Newsletter from './components/Newsletter';
import Bestsellers from './components/Bestsellers';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import AdminDashboard from './components/AdminDashboard';
import ProductReviewsPage from './components/ProductReviewsPage';
import SearchResultsPage from './components/SearchResultsPage';
import SearchPage from './components/SearchPage';
import ProductModal from './components/ProductModal';
import AffiliatePage from './components/AffiliatePage';
import MyAccountPage from './components/MyAccountPage';
import WishlistSidebar from './components/WishlistSidebar';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';

import { auth, db } from './firebase';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<Page>('shop');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setIsAuthLoading(true);
        if (currentUser) {
            setUser(currentUser);
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            let firestoreWishlist: number[] = [];
            let firestoreCart: CartItem[] = [];

            if (userDocSnap.exists()) {
                const data = userDocSnap.data();
                firestoreWishlist = data.wishlist || [];
                firestoreCart = data.cart || [];
            }

            const localWishlist: number[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
            const localCart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

            const mergedWishlist = [...new Set([...firestoreWishlist, ...localWishlist])];
            
            const mergedCartMap = new Map<number, CartItem>();
            [...firestoreCart, ...localCart].forEach(item => {
                const existing = mergedCartMap.get(item.productId);
                if (existing) {
                    existing.quantity += item.quantity;
                } else {
                    mergedCartMap.set(item.productId, { ...item });
                }
            });
            const mergedCart = Array.from(mergedCartMap.values());

            setWishlist(mergedWishlist);
            setCart(mergedCart);

            await setDoc(userDocRef, { wishlist: mergedWishlist, cart: mergedCart }, { merge: true });
            localStorage.removeItem('wishlist');
            localStorage.removeItem('cart');

        } else {
            setUser(null);
            const savedWishlist = localStorage.getItem('wishlist');
            setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
            const savedCart = localStorage.getItem('cart');
            setCart(savedCart ? JSON.parse(savedCart) : []);
        }
        setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Guest persistence for Wishlist & Cart
  useEffect(() => {
    if (!user && !isAuthLoading) {
      try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      } catch (error) {
        console.error('Error saving guest wishlist to localStorage', error);
      }
    }
  }, [wishlist, user, isAuthLoading]);

  useEffect(() => {
    if (!user && !isAuthLoading) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving guest cart to localStorage', error);
      }
    }
  }, [cart, user, isAuthLoading]);
  
  // Search History State & Persistence
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error('Error parsing search history from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch (error) {
      console.error('Error saving search history to localStorage', error);
    }
  }, [searchHistory]);


  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);


  const handleToggleWishlist = useCallback(async (productId: number) => {
    const newWishlist = wishlist.includes(productId)
        ? wishlist.filter(id => id !== productId)
        : [...wishlist, productId];
    
    setWishlist(newWishlist);

    if (user) {
        await setDoc(doc(db, 'users', user.uid), { wishlist: newWishlist }, { merge: true });
    } else {
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  }, [wishlist, user]);
  
  const handleAddToCart = useCallback(async (productId: number, quantity: number) => {
    let newCart: CartItem[];
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        newCart = cart.map(item =>
            item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
        );
    } else {
      newCart = [...cart, { productId, quantity }];
    }
    setCart(newCart);
    setQuickViewProduct(null);

    if (user) {
      await setDoc(doc(db, 'users', user.uid), { cart: newCart }, { merge: true });
    } else {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  }, [cart, user]);

  const handleUpdateCartQuantity = useCallback(async (productId: number, newQuantity: number) => {
    let newCart: CartItem[];
    if (newQuantity < 1) {
      newCart = cart.filter(item => item.productId !== productId);
    } else {
      newCart = cart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
    }
    setCart(newCart);

    if (user) {
      await setDoc(doc(db, 'users', user.uid), { cart: newCart }, { merge: true });
    } else {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  }, [cart, user]);

  const handleRemoveFromCart = useCallback(async (productId: number) => {
    const newCart = cart.filter(item => item.productId !== productId);
    setCart(newCart);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { cart: newCart }, { merge: true });
    } else {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  }, [cart, user]);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProductId(product.id);
    setCurrentPage('productDetail');
    setQuickViewProduct(null);
    setIsWishlistOpen(false);
    window.scrollTo(0, 0);
  }, []);
  
  const handleSelectCategory = useCallback((category: string) => {
    setActiveCategory(category);
    setCurrentPage('shop');
  }, []);
  
  const handleOpenQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);
  
  const handleOpenWishlist = useCallback(() => {
    setIsWishlistOpen(true);
  }, []);
  
  const handleCloseWishlist = useCallback(() => {
    setIsWishlistOpen(false);
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') {
      return PRODUCTS;
    }
    return PRODUCTS.filter(product => product.category === activeCategory);
  }, [activeCategory]);
  
  const searchedProducts = useMemo(() => {
    if (!searchQuery) return [];
    const lowercasedQuery = searchQuery.toLowerCase();
    return PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(lowercasedQuery) ||
        product.description.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  const handleSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    
    setSearchHistory(prev => {
        const newHistory = [trimmedQuery, ...prev.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase())];
        return newHistory.slice(0, 10);
    });

    setSearchQuery(trimmedQuery);
    setCurrentPage('search');
    window.scrollTo(0, 0);
  }, []);

  const handleClearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const handleNavigateHome = () => {
    setActiveCategory('All');
    setSelectedProductId(null);
    setCurrentPage('shop');
  };
  
  const handleLogin = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        setCurrentPage('shop');
    } catch (error) {
        console.error("Login error:", error);
        alert((error as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        setCurrentPage('shop');
    } catch (error) {
        console.error("Logout error:", error);
        alert((error as Error).message);
    }
  };
  
  const handleSignup = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: userCredential.user.email,
            createdAt: new Date(),
            wishlist: [],
            cart: [],
        });
        setCurrentPage('shop');
    } catch (error) {
        console.error("Signup error:", error);
        alert((error as Error).message);
    }
  };

  const handlePlaceOrder = async () => {
    alert('Thank you for your order! (This is a demo)');
    setCart([]);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { cart: [] }, { merge: true });
    }
    setCurrentPage('shop');
  };
  
  const handleForgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert(`If an account with the email "${email}" exists, a password reset link has been sent.`);
      setCurrentPage('login');
    } catch (error) {
      console.error("Forgot password error:", error);
      alert((error as Error).message);
    }
  };

  const handleResetPassword = () => {
    alert('Password has been successfully reset! You can now log in with your new password.');
    setCurrentPage('login');
  };

  const renderPage = () => {
    if (isAuthLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    switch (currentPage) {
      case 'admin':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'affiliate':
        return <AffiliatePage />;
      case 'account':
        return <MyAccountPage 
                 wishlist={wishlist}
                 allProducts={PRODUCTS}
                 onProductClick={handleProductClick}
                 onAddToCart={handleAddToCart}
                 onToggleWishlist={handleToggleWishlist}
                 onQuickView={handleOpenQuickView}
               />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignupPage onSignup={handleSignup} onNavigate={setCurrentPage} />;
      case 'forgotPassword':
        return <ForgotPasswordPage onSendResetLink={handleForgotPassword} onNavigate={setCurrentPage} />;
      case 'resetPassword':
        return <ResetPasswordPage onResetPassword={handleResetPassword} onNavigate={setCurrentPage} />;
      case 'cart':
        return (
          <CartPage
            cartItems={cart}
            allProducts={PRODUCTS}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onContinueShopping={handleNavigateHome}
            onNavigateToCheckout={() => setCurrentPage('checkout')}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            cartItems={cart}
            allProducts={PRODUCTS}
            onBackToCart={() => setCurrentPage('cart')}
            onPlaceOrder={handlePlaceOrder}
          />
        );
       case 'searchHistory':
        return (
            <SearchPage
                history={searchHistory}
                onSearch={handleSearch}
                onClearHistory={handleClearSearchHistory}
            />
        );
      case 'search':
        return (
            <SearchResultsPage
                query={searchQuery}
                results={searchedProducts}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={handleOpenQuickView}
            />
        );
      case 'productReviews': {
        const product = PRODUCTS.find(p => p.id === selectedProductId);
        if (!product) {
            setCurrentPage('shop');
            return null;
        }
        const reviews = MOCK_REVIEWS.filter(r => r.productId === selectedProductId);
        return <ProductReviewsPage product={product} reviews={reviews} onBackToProduct={() => setCurrentPage('productDetail')} />;
      }
      case 'productDetail': {
        const product = PRODUCTS.find(p => p.id === selectedProductId);
        if (!product) {
            setCurrentPage('shop');
            return null;
        }
        const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
        return (
            <ProductDetailPage
                product={product}
                relatedProducts={relatedProducts}
                onAddToCart={handleAddToCart}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onBackToShop={handleNavigateHome}
                onProductClick={handleProductClick}
                onNavigateToReviews={() => setCurrentPage('productReviews')}
                onQuickView={handleOpenQuickView}
            />
        );
      }
      case 'shop':
      default:
        return (
          <main className="pt-20">
            <HeroCarousel slides={HERO_SLIDES} />
            <Features />
            <DealsSection 
              products={DEALS_PRODUCTS} 
              onProductClick={handleProductClick} 
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onQuickView={handleOpenQuickView}
            />
            <CategoryCarousel 
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />
            <ProductGrid 
              key={activeCategory} // Force re-render for animation
              title={activeCategory === 'All' ? 'New Arrivals' : activeCategory}
              products={filteredProducts} 
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onQuickView={handleOpenQuickView}
            />
            <ProductGrid 
              title="Trending Now"
              products={TRENDING_PRODUCTS} 
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              bgColor="bg-white"
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onQuickView={handleOpenQuickView}
            />
            <Bestsellers 
              products={BESTSELLER_PRODUCTS}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onQuickView={handleOpenQuickView}
            />
            <CTA />
            <Newsletter />
            <Footer onNavigate={setCurrentPage} />
          </main>
        );
    }
  };


  return (
    <div className="bg-pink-50 text-zinc-800 min-h-screen selection:bg-amber-200">
      <Navbar 
        cartCount={cartItemCount}
        wishlistCount={wishlist.length}
        onCartClick={() => setCurrentPage('cart')}
        onWishlistClick={handleOpenWishlist}
        onHomeClick={handleNavigateHome}
        isAuthenticated={user !== null}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        searchHistory={searchHistory}
        onSearch={handleSearch}
      />

      {renderPage()}

      <AnimatePresence>
        {isWishlistOpen && (
           <WishlistSidebar
              onClose={handleCloseWishlist}
              wishlistProductIds={wishlist}
              allProducts={PRODUCTS}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onProductClick={handleProductClick}
            />
        )}
        {quickViewProduct && (
            <ProductModal 
                product={quickViewProduct}
                onClose={handleCloseQuickView}
                onAddToCart={handleAddToCart}
                onViewDetails={handleProductClick}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;