
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon } from './components/Icons';
import { Product, Page, HeroSlide, Category, AdminOrder, AdminCustomer, Promotion } from './types';
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

const BackButton: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const goBack = () => window.history.length > 1 ? window.history.back() : onNavigate('shop');
  return (
    <motion.button
      onClick={goBack}
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 bg-bg-secondary text-text-primary px-4 py-2 rounded-full shadow-lg border border-border-primary"
      aria-label="Go back"
    >
      <ChevronLeftIcon className="h-5 w-5" />
      <span className="font-medium text-sm">Back</span>
    </motion.button>
  );
};

const getRouteFromHash = (): { page: Page; productId: number | null } => {
    const hash = window.location.hash.slice(1);
    const [path, param] = hash.split('/').filter(Boolean);

    if (path === 'product' && param && !isNaN(parseInt(param, 10))) return { page: 'productDetail', productId: parseInt(param, 10) };
    if (path === 'productReviews' && param && !isNaN(parseInt(param, 10))) return { page: 'productReviews', productId: parseInt(param, 10) };
    
    const pageMap: { [key: string]: Page } = {
        admin: 'admin', affiliate: 'affiliate', cart: 'cart', checkout: 'checkout', 
        searchHistory: 'searchHistory', search: 'search', allProducts: 'allProducts', 
        reportBug: 'reportBug', shop: 'shop', login: 'login', signup: 'signup', 
        forgotPassword: 'forgotPassword', resetPassword: 'resetPassword', myAccount: 'myAccount'
    };

    return { page: pageMap[path] || (hash === '' || hash === '/' ? 'shop' : 'notFound'), productId: null };
};

const ScrollToTop = () => {
    React.useEffect(() => { window.scrollTo(0, 0); }, [window.location.hash]);
    return null;
};

const App: React.FC = () => {
  const { 
      isDarkMode, toggleDarkMode, toasts, addToast, setCart, reviews, uploadImage, 
      user, isAdmin, fetchCategories: fetchContextCategories, categories: contextCategories 
  } = useAppContext();

  const [products, setProducts] = React.useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = React.useState<Category[]>(CATEGORIES);
  const [heroSlides, setHeroSlides] = React.useState<HeroSlide[]>(HERO_SLIDES);
  const [orders, setOrders] = React.useState<AdminOrder[]>(MOCK_ORDERS);
  const [customers, setCustomers] = React.useState<AdminCustomer[]>(MOCK_CUSTOMERS);
  const [promotions, setPromotions] = React.useState<Promotion[]>(MOCK_PROMOTIONS);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchHistory, setSearchHistory] = React.useState<string[]>([]);

  const initialRoute = getRouteFromHash();
  const [currentPage, setCurrentPage] = React.useState<Page>(initialRoute.page);
  const [selectedProductId, setSelectedProductId] = React.useState<number | null>(initialRoute.productId);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [quickViewProduct, setQuickViewProduct] = React.useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);

  // Combine categories from context and local
  React.useEffect(() => {
    const allCats = [...CATEGORIES, ...contextCategories];
    const uniqueCats = Array.from(new Map(allCats.map(cat => [cat.id, cat])).values());
    setCategories(uniqueCats);
  }, [contextCategories]);

  const handleSaveProduct = (productData: Product, imageFile?: File, additionalImageFiles?: File[]) => {
     // This is a placeholder now. In a real app, you'd have an API call.
    addToast('Product changes are not saved in this demo.');
    const newProduct = { ...productData, id: productData.id || Date.now() };
    setProducts(prev => [newProduct, ...prev.filter(p => p.id !== newProduct.id)]);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Delete this product?')) {
        addToast('Product deletion is not saved in this demo.');
        setProducts(products.filter(p => p.id !== productId));
    }
  };
  
  // ... (keep other handlers like save/delete category, hero slide as placeholders) ...

  React.useEffect(() => {
    const handleHashChange = () => {
        const { page, productId } = getRouteFromHash();
        setCurrentPage(page);
        if (productId !== null) setSelectedProductId(productId);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  React.useEffect(() => {
    let newHash = `/${currentPage}`;
    if (currentPage === 'shop') newHash = '/';
    if ((currentPage === 'productDetail' || currentPage === 'productReviews') && selectedProductId) newHash = `/product/${selectedProductId}`;
    if (window.location.hash.slice(1) !== newHash) window.location.hash = newHash;
  }, [currentPage, selectedProductId]);


  const handleProductClick = React.useCallback((product: Product) => { setSelectedProductId(product.id); setCurrentPage('productDetail'); }, []);
  const handleSearch = React.useCallback((query: string) => { setSearchQuery(query); setCurrentPage('search'); }, []);
  const onNavigate = React.useCallback((page: Page) => { setCurrentPage(page); if (page === 'shop') setSelectedProductId(null); }, []);

  const selectedProduct = React.useMemo(() => products.find(p => p.id === selectedProductId), [selectedProductId, products]);
  const filteredProducts = React.useMemo(() => activeCategory === 'All' ? products.filter(p => p.published) : products.filter(p => p.category === activeCategory && p.published), [activeCategory, products]);
  const searchResults = React.useMemo(() => searchQuery ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) : [], [searchQuery, products]);
  
  const renderPage = () => {
    switch(currentPage) {
      case 'cart': return <CartPage products={products} onContinueShopping={() => onNavigate('shop')} onNavigateToCheckout={() => onNavigate('checkout')} />;
      case 'productDetail': return selectedProduct ? <ProductDetailPage product={selectedProduct} relatedProducts={products.slice(0,4)} reviews={[]} onBackToShop={() => onNavigate('shop')} onProductClick={handleProductClick} onNavigateToReviews={() => {}} onQuickView={setQuickViewProduct} /> : <NotFoundPage onNavigate={onNavigate} />;
      case 'checkout': return <CheckoutPage products={products} onBackToCart={() => onNavigate('cart')} onPlaceOrder={() => addToast('Order placed!')} />;
      case 'admin': return <AdminGuard onNavigate={onNavigate}><React.Suspense fallback={<div>Loading...</div>}><AdminDashboard onNavigate={onNavigate} products={products} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct} categories={categories} onSaveCategory={()=>{}} onDeleteCategory={()=>{}} heroSlides={heroSlides} onSaveHeroSlide={()=>{}} onDeleteHeroSlide={()=>{}} orders={orders} customers={customers} promotions={promotions} onSavePromotion={()=>{}} onDeletePromotion={()=>{}} homepageSections={{deals:[],bestsellers:[]}} onSaveHomepageSections={()=>{}} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} fetchCategories={() => fetchContextCategories()} /></React.Suspense></AdminGuard>;
      case 'search': return <SearchResultsPage query={searchQuery} results={searchResults} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />;
      case 'allProducts': return <AllProductsPage products={products} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />;
      case 'login': return <LoginPage onNavigate={onNavigate} />;
      case 'signup': return <SignupPage onNavigate={onNavigate} />;
      case 'myAccount': return <MyAccountPage products={products} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />;
      case 'shop': default: return (<><HeroCarousel slides={heroSlides} /><Features /><CategoryCarousel categories={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} /><ProductGrid products={products.slice(0, 8)} onProductClick={handleProductClick} title="New Arrivals" onQuickView={setQuickViewProduct} /><CTA onShopNowClick={() => onNavigate('allProducts')} /><Bestsellers products={products.slice(8, 16)} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} /></>);
    }
  };

  if (isLoading) return <HomeSkeleton />;

  return (
    <ErrorBoundary>
        <div className={isDarkMode ? 'dark' : ''}>
            <ScrollToTop />
            {currentPage !== 'admin' && currentPage !== 'notFound' && <Navbar onCartClick={() => onNavigate('cart')} onWishlistClick={() => setIsWishlistOpen(true)} onHomeClick={() => onNavigate('shop')} onNavigate={onNavigate} searchHistory={searchHistory} onSearch={handleSearch} products={products} />}
            <AnimatePresence>{currentPage !== 'shop' && currentPage !== 'admin' && <BackButton onNavigate={onNavigate} />}</AnimatePresence>
            <AnimatePresence mode="wait"><motion.div key={currentPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>{renderPage()}</motion.div></AnimatePresence>
            {currentPage !== 'admin' && currentPage !== 'notFound' && <Footer onNavigate={onNavigate} />}
            <AnimatePresence>{quickViewProduct && <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onViewDetails={p => { handleProductClick(p); setQuickViewProduct(null); }} />}{isWishlistOpen && <WishlistSidebar products={products} onClose={() => setIsWishlistOpen(false)} onProductClick={p => { handleProductClick(p); setIsWishlistOpen(false); }} />}</AnimatePresence>
            <GlobalToastContainer toasts={toasts} />
        </div>
    </ErrorBoundary>
  );
};

export default App;
