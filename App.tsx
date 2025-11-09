
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Product, CartItem } from './types';
import { CATEGORIES, HERO_SLIDES, MOCK_REVIEWS, PRODUCTS } from './constants';
import { getFunctions, httpsCallable } from 'firebase/functions';
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<Page>('shop');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const functions = getFunctions();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const getProducts = httpsCallable(functions, 'getProducts');
        const result = await getProducts();
        const products = result.data as Product[];
        setAllProducts(products.filter(p => p.published));
      } catch (error) {
        setAllProducts(PRODUCTS.filter(p => p.published));
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [functions]);

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) { return []; }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) { return []; }
  });

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);


  const cartItemCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  
  const dealsProducts = useMemo(() => allProducts.filter(p => p.salePrice).slice(0, 3), [allProducts]);
  const trendingProducts = useMemo(() => allProducts.slice(0, 5), [allProducts]);
  const bestsellerProducts = useMemo(() => allProducts.slice(5, 9), [allProducts]);
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return allProducts;
    return allProducts.filter(product => product.category === activeCategory);
  }, [activeCategory, allProducts]);
  const searchedProducts = useMemo(() => {
    if (!searchQuery) return [];
    const lowercasedQuery = searchQuery.toLowerCase();
    return allProducts.filter(product => 
        product.name.toLowerCase().includes(lowercasedQuery) ||
        product.description.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, allProducts]);

  const handleToggleWishlist = useCallback((productId: number) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  }, []);
  
  const handleAddToCart = useCallback((productId: number, quantity: number) => {
    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.productId === productId);
        if (existingItem) {
            return prevCart.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
        }
        return [...prevCart, { productId, quantity }];
    });
    setQuickViewProduct(null);
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    } else {
      setCart(prevCart => prevCart.map(item => item.productId === productId ? { ...item, quantity: newQuantity } : item));
    }
  }, []);

  const handleRemoveFromCart = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProductId(product.id);
    setCurrentPage('productDetail');
    window.scrollTo(0, 0);
  }, []);
  
  const handleSelectCategory = useCallback((category: string) => {
    setActiveCategory(category);
    setCurrentPage('shop');
  }, []);
  
  const handleOpenQuickView = useCallback((product: Product) => setQuickViewProduct(product), []);
  const handleCloseQuickView = useCallback(() => setQuickViewProduct(null), []);
  const handleOpenWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const handleCloseWishlist = useCallback(() => setIsWishlistOpen(false), []);

  const handleSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    setSearchHistory(prev => [trimmedQuery, ...prev.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase())].slice(0, 10));
    setSearchQuery(trimmedQuery);
    setCurrentPage('search');
    window.scrollTo(0, 0);
  }, []);

  const handleClearSearchHistory = useCallback(() => setSearchHistory([]), []);

  const handleNavigateHome = () => {
    setActiveCategory('All');
    setSelectedProductId(null);
    setCurrentPage('shop');
  };
  
  const handleLogin = () => { setIsAuthenticated(true); setCurrentPage('shop'); };
  const handleLogout = () => { setIsAuthenticated(false); setCurrentPage('shop'); };
  const handleSignup = () => { setIsAuthenticated(true); setCurrentPage('shop'); };

  const handlePlaceOrder = () => {
    alert('Thank you for your order! (This is a demo)');
    setCart([]);
    setCurrentPage('shop');
  };
  
  const handleForgotPassword = (email: string) => {
    alert(`Password reset link sent to ${email} (demo).`);
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'admin': return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'affiliate': return <AffiliatePage />;
      case 'account': return <MyAccountPage wishlist={wishlist} allProducts={allProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} onQuickView={handleOpenQuickView} />;
      case 'login': return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'signup': return <SignupPage onSignup={handleSignup} onNavigate={setCurrentPage} />;
      case 'forgotPassword': return <ForgotPasswordPage onSendResetLink={handleForgotPassword} onNavigate={setCurrentPage} />;
      case 'cart': return <CartPage cartItems={cart} allProducts={allProducts} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onContinueShopping={handleNavigateHome} onNavigateToCheckout={() => setCurrentPage('checkout')} />;
      case 'checkout': return <CheckoutPage cartItems={cart} allProducts={allProducts} onBackToCart={() => setCurrentPage('cart')} onPlaceOrder={handlePlaceOrder} />;
      case 'searchHistory': return <SearchPage history={searchHistory} onSearch={handleSearch} onClearHistory={handleClearSearchHistory} />;
      case 'search': return <SearchResultsPage query={searchQuery} results={searchedProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} onQuickView={handleOpenQuickView} />;
      case 'productReviews': {
        const product = allProducts.find(p => p.id === selectedProductId);
        if (!product) { setCurrentPage('shop'); return null; }
        const reviews = MOCK_REVIEWS.filter(r => r.productId === selectedProductId);
        return <ProductReviewsPage product={product} reviews={reviews} onBackToProduct={() => setCurrentPage('productDetail')} />;
      }
      case 'productDetail': {
        const product = allProducts.find(p => p.id === selectedProductId);
        if (!product) { setCurrentPage('shop'); return null; }
        const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
        return <ProductDetailPage product={product} relatedProducts={relatedProducts} onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} onBackToShop={handleNavigateHome} onProductClick={handleProductClick} onNavigateToReviews={() => setCurrentPage('productReviews')} onQuickView={handleOpenQuickView} />;
      }
      case 'shop':
      default:
        return (
          <main className="pt-20">
            <HeroCarousel slides={HERO_SLIDES} />
            <Features />
            <DealsSection products={dealsProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} onQuickView={handleOpenQuickView} />
            <CategoryCarousel categories={CATEGORIES} activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
            <ProductGrid key={activeCategory} title={activeCategory === 'All' ? 'New Arrivals' : activeCategory} products={filteredProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} onQuickView={handleOpenQuickView} />
            <ProductGrid title="Trending Now" products={trendingProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} bgColor="bg-white" wishlist={wishlist} onToggleWishlist={handleToggleWishlist} onQuickView={handleOpenQuickView} />
            <Bestsellers products={bestsellerProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} onQuickView={handleOpenQuickView} />
            <CTA />
            <Newsletter />
            <Footer onNavigate={setCurrentPage} />
          </main>
        );
    }
  };

  return (
    <div className="bg-pink-50 text-zinc-800 min-h-screen selection:bg-amber-200">
      <Navbar cartCount={cartItemCount} wishlistCount={wishlist.length} onCartClick={() => setCurrentPage('cart')} onWishlistClick={handleOpenWishlist} onHomeClick={handleNavigateHome} isAuthenticated={isAuthenticated} onLogout={handleLogout} onNavigate={setCurrentPage} searchHistory={searchHistory} onSearch={handleSearch} />
      {renderPage()}
      <AnimatePresence>
        {isWishlistOpen && <WishlistSidebar onClose={handleCloseWishlist} wishlistProductIds={wishlist} allProducts={allProducts} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} onProductClick={handleProductClick} />}
        {quickViewProduct && <ProductModal product={quickViewProduct} onClose={handleCloseQuickView} onAddToCart={handleAddToCart} onViewDetails={handleProductClick} />}
      </AnimatePresence>
    </div>
  );
};

export default App;
