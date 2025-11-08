import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Product, CartItem } from './types';
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

type Page = 'shop' | 'cart' | 'login' | 'signup' | 'productDetail' | 'checkout' | 'admin' | 'productReviews' | 'search' | 'searchHistory' | 'affiliate' | 'account' | 'forgotPassword';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<Page>('shop');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Wishlist State & Persistence
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error('Error parsing wishlist from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage', error);
    }
  }, [wishlist]);

  // Cart State & Persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage', error);
    }
  }, [cart]);
  
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


  const handleToggleWishlist = useCallback((productId: number) => {
    setWishlist(prevWishlist => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter(id => id !== productId);
      } else {
        return [...prevWishlist, productId];
      }
    });
  }, []);
  
  const handleAddToCart = useCallback((productId: number, quantity: number) => {
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
    setQuickViewProduct(null); // Close quick view modal on add
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    } else {
      setCart(prevCart => prevCart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  }, []);

  const handleRemoveFromCart = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProductId(product.id);
    setCurrentPage('productDetail');
    setQuickViewProduct(null); // Close quick view modal if open
    setIsWishlistOpen(false); // Close wishlist sidebar if open
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
        return newHistory.slice(0, 10); // Keep only the last 10 searches
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
  
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('shop');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('shop');
  };
  
  const handleSignup = () => {
    setIsAuthenticated(true);
    setCurrentPage('shop');
  };

  const handlePlaceOrder = () => {
    alert('Thank you for your order! (This is a demo)');
    setCart([]);
    setCurrentPage('shop');
  };
  
  const handleForgotPassword = (email: string) => {
    alert(`If an account with the email "${email}" exists, a password reset link has been sent.`);
    setCurrentPage('login');
  };

  const renderPage = () => {
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
        isAuthenticated={isAuthenticated}
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