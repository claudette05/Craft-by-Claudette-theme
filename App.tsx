
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon } from './components/Icons';
import { Product, Page, HeroSlide, HomepageSections, Category, AdminOrder, AdminCustomer, Promotion } from './types';
import { HERO_SLIDES, CATEGORIES } from './constants';
import MOCK_PRODUCTS from './mockProducts';
import { MOCK_ORDERS, MOCK_CUSTOMERS, MOCK_PROMOTIONS } from './adminConstants';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import Features from './components/Features';
import CategoryCarousel from './components/CategoryCarousel';
import ProductGrid from './components/ProductGrid';
import CTA from './components/CTA';
import Footer from './components/Footer';
import DealsSection from './components/DealsSection';
import Bestsellers from './components/Bestsellers';
import CartPage from './components/CartPage';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import AdminGuard from './components/AdminGuard';
// Lazy load AdminDashboard
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
import ProductReviewsPage from './components/ProductReviewsPage';
import SearchResultsPage from './components/SearchResultsPage';
import SearchPage from './components/SearchPage';
import ProductModal from './components/ProductModal';
import AffiliatePage from './components/AffiliatePage';
import WishlistSidebar from './components/WishlistSidebar';
import GlobalToastContainer from './components/GlobalToastContainer';
import { useAppContext } from './context/AppContext';
import AllProductsPage from './components/AllProductsPage';
import { HomeSkeleton } from './components/Skeleton';
import ReportBugPage from './components/ReportBugPage';
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './components/NotFoundPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import MyAccountPage from './components/MyAccountPage';
import { databaseService } from './services/databaseService';

const BackButton: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      onNavigate('shop');
    }
  };

  return (
    <motion.button
      onClick={goBack}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 bg-bg-secondary text-text-primary px-4 py-2 rounded-full shadow-lg border border-border-primary"
      aria-label="Go back to the previous page"
    >
      <ChevronLeftIcon className="h-5 w-5" />
      <span className="font-medium text-sm">Back</span>
    </motion.button>
  );
};

const getRouteFromHash = (): { page: Page; productId: number | null } => {
    const hash = window.location.hash.slice(1);
    const [path, param] = hash.split('/').filter(Boolean);

    if (path === 'product' && param) {
        const productId = parseInt(param, 10);
        if (!isNaN(productId)) return { page: 'productDetail', productId };
    }
    
    if (path === 'productReviews' && param) {
        const productId = parseInt(param, 10);
        if (!isNaN(productId)) return { page: 'productReviews', productId };
    }
    
    const pageMap: { [key: string]: Page } = {
        admin: 'admin', affiliate: 'affiliate',
        cart: 'cart', checkout: 'checkout', searchHistory: 'searchHistory',
        search: 'search', productReviews: 'productReviews',
        allProducts: 'allProducts', reportBug: 'reportBug',
        shop: 'shop',
        login: 'login', signup: 'signup',
        forgotPassword: 'forgotPassword', resetPassword: 'resetPassword',
        myAccount: 'myAccount'
    };

    if (hash === '' || hash === '/') return { page: 'shop', productId: null };

    return path in pageMap ? { page: pageMap[path], productId: null } : { page: 'notFound', productId: null };
};

const ScrollToTop = () => {
    const { hash } = window.location;
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [hash]);
    return null;
};

const App: React.FC = () => {
  const { isDarkMode, toggleDarkMode, toasts, addToast, setCart, reviews, uploadImage, user, isAdmin } = useAppContext();
  
  const STORAGE_KEYS = { HOMEPAGE: 'craft_data_homepage', HISTORY: 'searchHistory' };

  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = React.useState<HeroSlide[]>([]);
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [customers, setCustomers] = React.useState<AdminCustomer[]>([]);
  const [promotions, setPromotions] = React.useState<Promotion[]>([]);
  const [homepageSections, setHomepageSections] = React.useState<HomepageSections>({ deals: [], bestsellers: [] });
  const [isLoading, setIsLoading] = React.useState(true);

  const initialRoute = getRouteFromHash();
  const [currentPage, setCurrentPage] = React.useState<Page>(initialRoute.page);
  const [selectedProductId, setSelectedProductId] = React.useState<number | null>(() => {
    if ((initialRoute.page === 'productDetail' || initialRoute.page === 'productReviews') && initialRoute.productId) {
        return initialRoute.productId;
    }
    const savedId = sessionStorage.getItem('selectedProductId');
    return savedId ? JSON.parse(savedId) : null;
  });
  const [searchQuery, setSearchQuery] = React.useState<string>(() => sessionStorage.getItem('searchQuery') || '');
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  
  const [quickViewProduct, setQuickViewProduct] = React.useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);

  const [searchHistory, setSearchHistory] = React.useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]'); } catch { return []; }
  });

  React.useEffect(() => {
    const loadAppData = async () => {
        setIsLoading(true);
        try {
            const unsub = await databaseService.getProducts(setProducts);

            const [c, h, o] = await Promise.all([
                databaseService.getCategories().then(res => res.length ? res : CATEGORIES).catch(() => CATEGORIES),
                databaseService.getHeroSlides().then(res => res.length ? res : HERO_SLIDES).catch(() => HERO_SLIDES),
                databaseService.getOrders().then(res => res.length ? res : MOCK_ORDERS).catch(() => MOCK_ORDERS)
            ]);

            setCategories(c); setHeroSlides(h); setOrders(o); setCustomers(MOCK_CUSTOMERS); setPromotions(MOCK_PROMOTIONS);
            
            const savedHomepage = localStorage.getItem(STORAGE_KEYS.HOMEPAGE);
            if(savedHomepage) setHomepageSections(JSON.parse(savedHomepage));

            return unsub;
        } catch (e) {
            console.error("Error loading app data", e);
        } finally {
            setTimeout(() => setIsLoading(false), 500);
        }
    };
    
    let unsubscribe: (() => void) | undefined;
    loadAppData().then(unsub => { unsubscribe = unsub; });

    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const handleSaveProduct = async (productData: Product, imageFile?: File, additionalImageFiles?: File[]) => {
    let finalImageUrl = productData.imageUrl;
    let finalGalleryUrls = Array.isArray(productData.images) ? [...productData.images] : [];
    try {
        if (imageFile) { finalImageUrl = await uploadImage(imageFile); }
        if (additionalImageFiles?.length) {
            const urls = await Promise.all(additionalImageFiles.map(file => uploadImage(file)));
            finalGalleryUrls.push(...urls);
        }
        const updatedProduct = { ...productData, imageUrl: finalImageUrl, images: finalGalleryUrls };
        if (!updatedProduct.id) updatedProduct.id = Date.now();
        await databaseService.saveProduct(updatedProduct);
        setProducts(prev => [updatedProduct, ...prev.filter(p => p.id !== updatedProduct.id)]);
        addToast('Product saved');
    } catch (e: any) { addToast(e.message, 'error'); }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Delete this product?')) {
        try {
            await databaseService.deleteProduct(productId);
            setProducts(products.filter(p => p.id !== productId));
            addToast('Product deleted');
        } catch (err: any) { addToast('Delete failed', 'error'); }
    }
  };

  const handleSaveCategory = async (catData: Category, imageFile?: File) => {
    let finalImageUrl = catData.imageUrl;
    if (imageFile) { try { finalImageUrl = await uploadImage(imageFile); } catch (e:any) { addToast(e.message, 'error'); return; } }
    const updated = { ...catData, imageUrl: finalImageUrl };
    if (!updated.id) updated.id = Date.now();
    await databaseService.saveCategory(updated);
    setCategories(prev => [updated, ...prev.filter(c => c.id !== updated.id)]);
    addToast('Category saved');
  };

  const handleDeleteCategory = async (catId: number) => {
    if (window.confirm('Delete category?')) {
      await databaseService.deleteCategory(catId);
      setCategories(categories.filter(c => c.id !== catId));
      addToast('Category deleted');
    }
  };

  const handleSaveHeroSlide = async (slideData: HeroSlide, imageFile?: File) => {
    let finalImageUrl = slideData.imageUrl;
    if (imageFile) { try { finalImageUrl = await uploadImage(imageFile); } catch (e:any) { addToast(e.message, 'error'); return; } }
    const updated = { ...slideData, imageUrl: finalImageUrl };
    if (!updated.id) updated.id = Date.now();
    await databaseService.saveHeroSlide(updated);
    setHeroSlides(prev => [updated, ...prev.filter(s => s.id !== updated.id)]);
    addToast('Slide saved');
  };

  const handleDeleteHeroSlide = async (slideId: number) => {
    if(window.confirm('Delete slide?')){
      await databaseService.deleteHeroSlide(slideId);
      setHeroSlides(heroSlides.filter(s => s.id !== slideId));
      addToast('Slide deleted');
    }
  };

  const handleCreateOrder = async (orderData: AdminOrder) => {
    await databaseService.saveOrder(orderData);
    setOrders([orderData, ...orders]);
    setCart([]);
    addToast('Order placed!');
  };

  React.useEffect(() => { localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(searchHistory)); }, [searchHistory]);
  React.useEffect(() => { localStorage.setItem(STORAGE_KEYS.HOMEPAGE, JSON.stringify(homepageSections)); }, [homepageSections]);
  React.useEffect(() => { if (selectedProductId) sessionStorage.setItem('selectedProductId', JSON.stringify(selectedProductId)); }, [selectedProductId]);
  React.useEffect(() => { sessionStorage.setItem('searchQuery', searchQuery); }, [searchQuery]);

  React.useEffect(() => {
    let newHash = currentPage === 'shop' ? '/' : `/${currentPage}`;
    if (currentPage === 'productDetail' && selectedProductId) newHash = `/product/${selectedProductId}`;
    else if (currentPage === 'productReviews' && selectedProductId) newHash = `/productReviews/${selectedProductId}`;
    if (window.location.hash.slice(1) !== newHash) window.location.hash = newHash;
  }, [currentPage, selectedProductId]);

  React.useEffect(() => {
    const handleHashChange = () => {
        const { page, productId } = getRouteFromHash();
        if (productId !== null) setSelectedProductId(productId);
        setCurrentPage(page);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // This is the corrected navigation effect
  React.useEffect(() => {
    if (user && currentPage === 'login') {
      if (isAdmin) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('myAccount');
      }
    }
  }, [user, isAdmin, currentPage]);

  React.useEffect(() => {
    document.body.className = currentPage === 'admin' ? 'bg-bg-tertiary' : 'bg-bg-primary';
  }, [currentPage]);

  const handleProductClick = React.useCallback((product: Product) => { setSelectedProductId(product.id); setCurrentPage('productDetail'); }, []);
  const handleSearch = React.useCallback((query: string) => { setSearchQuery(query); setCurrentPage('search'); if (query && !searchHistory.includes(query)) setSearchHistory([query, ...searchHistory.slice(0, 9)]); }, [searchHistory]);
  const onNavigate = React.useCallback((page: Page) => { setCurrentPage(page); if (page === 'shop') setSelectedProductId(null); }, []);

  const selectedProduct = React.useMemo(() => products.find(p => p.id === selectedProductId), [selectedProductId, products]);
  const filteredProducts = React.useMemo(() => activeCategory === 'All' ? products.filter(p => p.published) : products.filter(p => p.category === activeCategory && p.published), [activeCategory, products]);
  const newArrivals = React.useMemo(() => [...products].filter(p => p.published).sort((a, b) => b.id - a.id).slice(0, 8), [products]);
  const searchResults = React.useMemo(() => searchQuery ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) : [], [searchQuery, products]);
  const dealsProducts = React.useMemo(() => products.filter(p => homepageSections?.deals?.includes(p.id)), [homepageSections, products]);
  const bestsellerProducts = React.useMemo(() => products.filter(p => homepageSections?.bestsellers?.includes(p.id)), [homepageSections, products]);
  const resinProducts = React.useMemo(() => products.filter(p => p.category === 'Resin' && p.published).slice(0, 8), [products]);
  const giftProducts = React.useMemo(() => products.filter(p => (p.salePrice ?? p.price) <= 50 && p.published).slice(0, 8), [products]);

  const renderPage = () => {
    switch(currentPage) {
      case 'cart': return <CartPage products={products} onContinueShopping={() => onNavigate('shop')} onNavigateToCheckout={() => onNavigate('checkout')} />;
      case 'productDetail': return selectedProduct ? <ProductDetailPage product={selectedProduct} relatedProducts={products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4)} reviews={reviews.filter(r => r.productId === selectedProduct.id)} onBackToShop={() => onNavigate('shop')} onProductClick={handleProductClick} onNavigateToReviews={() => setCurrentPage('productReviews')} onQuickView={setQuickViewProduct} /> : <NotFoundPage onNavigate={onNavigate} />;
      case 'checkout': return <CheckoutPage products={products} onBackToCart={() => onNavigate('cart')} onPlaceOrder={handleCreateOrder} />;
      case 'admin': return <AdminGuard onNavigate={onNavigate}><React.Suspense fallback={<div>Loading...</div>}><AdminDashboard onNavigate={onNavigate} products={products} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct} categories={categories} onSaveCategory={handleSaveCategory} onDeleteCategory={handleDeleteCategory} heroSlides={heroSlides} onSaveHeroSlide={handleSaveHeroSlide} onDeleteHeroSlide={handleDeleteHeroSlide} orders={orders} customers={customers} promotions={promotions} onSavePromotion={(pr) => setPromotions([pr, ...promotions])} onDeletePromotion={(id) => setPromotions(promotions.filter(p=>p.id!==id))} homepageSections={homepageSections} onSaveHomepageSections={setHomepageSections} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} /></React.Suspense></AdminGuard>;
      case 'productReviews': return selectedProduct ? <ProductReviewsPage product={selectedProduct} reviews={reviews.filter(r => r.productId === selectedProduct.id)} onBackToProduct={() => setCurrentPage('productDetail')} /> : <NotFoundPage onNavigate={onNavigate} />;
      case 'search': return <SearchResultsPage query={searchQuery} results={searchResults} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />;
      case 'searchHistory': return <SearchPage history={searchHistory} onSearch={handleSearch} onClearHistory={() => setSearchHistory([])} />;
      case 'affiliate': return <AffiliatePage />;
      case 'allProducts': return <AllProductsPage products={products.filter(p => p.published)} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />;
      case 'reportBug': return <ReportBugPage onNavigate={onNavigate} />;
      case 'login': return <LoginPage onNavigate={onNavigate} />;
      case 'signup': return <SignupPage onNavigate={onNavigate} />;
      case 'forgotPassword': return <ForgotPasswordPage onNavigate={onNavigate} />;
      case 'resetPassword': return <ResetPasswordPage onResetPassword={() => { addToast('Password reset!'); onNavigate('login'); }} onNavigate={onNavigate} />;
      case 'myAccount': return <MyAccountPage products={products} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />;
      case 'shop': default: return (<><HeroCarousel slides={heroSlides} /><Features /><CategoryCarousel categories={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} /><ProductGrid products={newArrivals} onProductClick={handleProductClick} title="New Arrivals" onQuickView={setQuickViewProduct} /><ProductGrid products={filteredProducts} onProductClick={handleProductClick} title="Featured Products" onQuickView={setQuickViewProduct} bgColor="bg-bg-secondary" />{dealsProducts.length > 0 && <DealsSection products={dealsProducts} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />}<CTA onShopNowClick={() => onNavigate('allProducts')} />{bestsellerProducts.length > 0 && <Bestsellers products={bestsellerProducts} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />}<ProductGrid products={resinProducts} onProductClick={handleProductClick} title="Resin Art" onQuickView={setQuickViewProduct} bgColor="bg-bg-secondary" /><ProductGrid products={giftProducts} onProductClick={handleProductClick} title="Gifts Under ₵50" onQuickView={setQuickViewProduct} /></>);
    }
  };

  if (isLoading) return <HomeSkeleton />;

  return (
    <ErrorBoundary>
        <div className={isDarkMode ? 'dark' : ''}>
            <ScrollToTop />
            {currentPage !== 'admin' && currentPage !== 'notFound' && <Navbar onCartClick={() => onNavigate('cart')} onWishlistClick={() => setIsWishlistOpen(true)} onHomeClick={() => onNavigate('shop')} onNavigate={onNavigate} searchHistory={searchHistory} onSearch={handleSearch} products={products} />}
            <AnimatePresence>{currentPage !== 'shop' && currentPage !== 'admin' && currentPage !== 'productDetail' && currentPage !== 'productReviews' && currentPage !== 'notFound' && <BackButton onNavigate={onNavigate} />}</AnimatePresence>
            <AnimatePresence mode="wait"><motion.div key={currentPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>{renderPage()}</motion.div></AnimatePresence>
            {currentPage !== 'admin' && currentPage !== 'notFound' && <Footer onNavigate={onNavigate} />}
            <AnimatePresence>{quickViewProduct && <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onViewDetails={p => { handleProductClick(p); setQuickViewProduct(null); }} />}{isWishlistOpen && <WishlistSidebar products={products} onClose={() => setIsWishlistOpen(false)} onProductClick={p => { handleProductClick(p); setIsWishlistOpen(false); }} />}</AnimatePresence>
            <GlobalToastContainer toasts={toasts} />
        </div>
    </ErrorBoundary>
  );
};

export default App;
