
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
import GlobalToastContainer from './components/GlobalToastContainer';
import { useAppContext } from './context/AppContext';
import AllProductsPage from './components/AllProductsPage';
import PromotionalPopup from './components/PromotionalPopup';

const BackButton: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const goBack = () => {
    // Check if there's a history to go back to
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Otherwise, navigate to the shop as a fallback
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
    
    const pageMap: { [key: string]: Page } = {
        admin: 'admin', affiliate: 'affiliate', account: 'account', login: 'login',
        signup: 'signup', cart: 'cart', checkout: 'checkout', searchHistory: 'searchHistory',
        search: 'search', productReviews: 'productReviews', forgotPassword: 'forgotPassword',
        resetPassword: 'resetPassword', allProducts: 'allProducts'
    };

    return path in pageMap ? { page: pageMap[path], productId: null } : { page: 'shop', productId: null };
};

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-[100]">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent-primary"></div>
  </div>
);

const App: React.FC = () => {
  const { user, isDarkMode, toggleDarkMode, toasts, addToast, setCart, reviews } = useAppContext();
  
  // App-wide data state
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = React.useState<HeroSlide[]>([]);
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [customers, setCustomers] = React.useState<AdminCustomer[]>([]);
  const [promotions, setPromotions] = React.useState<Promotion[]>([]);
  const [homepageSections, setHomepageSections] = React.useState<HomepageSections>({ deals: [], bestsellers: [] });
  const [isLoading, setIsLoading] = React.useState(true);

  // View/Routing State
  const initialRoute = getRouteFromHash();
  const [currentPage, setCurrentPage] = React.useState<Page>(initialRoute.page);
  const [selectedProductId, setSelectedProductId] = React.useState<number | null>(() => {
    if (initialRoute.page === 'productDetail' && initialRoute.productId) return initialRoute.productId;
    const savedId = sessionStorage.getItem('selectedProductId');
    return savedId ? JSON.parse(savedId) : null;
  });
  const [searchQuery, setSearchQuery] = React.useState<string>(() => sessionStorage.getItem('searchQuery') || '');
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  
  // UI Component State
  const [quickViewProduct, setQuickViewProduct] = React.useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);

  // Search History State
  const [searchHistory, setSearchHistory] = React.useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch {
      return [];
    }
  });

  // Load mock data on initial load
  React.useEffect(() => {
    const loadMockData = () => {
        setIsLoading(true);
        // Simulate network delay for a better loading experience
        setTimeout(() => {
            setProducts(MOCK_PRODUCTS);
            setCategories(CATEGORIES);
            setHeroSlides(HERO_SLIDES);
            setOrders(MOCK_ORDERS);
            setCustomers(MOCK_CUSTOMERS);
            setPromotions(MOCK_PROMOTIONS);
            // Setup some initial homepage sections from mock data
            const dealProduct = MOCK_PRODUCTS.find(p => p.salePrice);
            setHomepageSections({
                deals: dealProduct ? [dealProduct.id] : [],
                bestsellers: [1, 3, 5],
            });
            setIsLoading(false);
        }, 500);
    };
    loadMockData();
  }, []);

  // CRUD Handlers (operate on local state)
  const handleSaveProduct = (productData: Product, imageFile?: File) => {
    // Image file is ignored in mock setup
    if ('id' in productData && productData.id) {
        setProducts(products.map(p => p.id === productData.id ? { ...productData } : p));
        addToast('Product updated successfully!');
    } else {
        const newProduct = { ...productData, id: Date.now() }; // Use timestamp for unique ID
        setProducts([newProduct, ...products]);
        addToast('Product added successfully!');
    }
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        setProducts(products.filter(p => p.id !== productId));
        addToast('Product deleted!', 'info');
    }
  };

  const handleSaveCategory = (categoryData: Category, imageFile?: File) => {
    if ('id' in categoryData && categoryData.id) {
        setCategories(categories.map(c => c.id === categoryData.id ? { ...categoryData } : c));
        addToast('Category updated successfully!');
    } else {
        const newCategory = { ...categoryData, id: Date.now() };
        setCategories([newCategory, ...categories]);
        addToast('Category added successfully!');
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
        setCategories(categories.filter(c => c.id !== categoryId));
        addToast('Category deleted!', 'info');
    }
  };

  const handleSaveHeroSlide = (slideData: HeroSlide, imageFile?: File) => {
    if ('id' in slideData && slideData.id) {
        setHeroSlides(heroSlides.map(s => s.id === slideData.id ? { ...slideData } : s));
        addToast('Hero slide updated successfully!');
    } else {
        const newSlide = { ...slideData, id: Date.now() };
        setHeroSlides([newSlide, ...heroSlides]);
        addToast('Hero slide added successfully!');
    }
  };

  const handleDeleteHeroSlide = (slideId: number) => {
    if (window.confirm('Are you sure you want to delete this hero slide?')) {
        setHeroSlides(heroSlides.filter(s => s.id !== slideId));
        addToast('Hero slide deleted!', 'info');
    }
  };

  const handleSavePromotion = (promotion: Promotion) => {
    if (promotion.id) {
        setPromotions(promotions.map(p => p.id === promotion.id ? promotion : p));
        addToast('Promotion updated successfully!');
    } else {
        const newPromo = { ...promotion, id: Date.now(), usageCount: 0 };
        setPromotions([newPromo, ...promotions]);
        addToast('Promotion created successfully!');
    }
  };

  const handleDeletePromotion = (id: number) => {
      if (window.confirm('Delete this promotion?')) {
          setPromotions(promotions.filter(p => p.id !== id));
          addToast('Promotion deleted!', 'info');
      }
  };

  const handleSaveHomepageSections = (sections: HomepageSections) => {
      setHomepageSections(sections);
      addToast("Homepage sections updated successfully!");
  };

  React.useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);
  
  React.useEffect(() => {
    if (selectedProductId) sessionStorage.setItem('selectedProductId', JSON.stringify(selectedProductId));
    else sessionStorage.removeItem('selectedProductId');
  }, [selectedProductId]);

  React.useEffect(() => {
    sessionStorage.setItem('searchQuery', searchQuery);
  }, [searchQuery]);

  React.useEffect(() => {
    let newHash = currentPage === 'shop' ? '/' : `/${currentPage}`;
    if (currentPage === 'productDetail' && selectedProductId) {
        newHash = `/product/${selectedProductId}`;
    }
    const currentHash = window.location.hash.slice(1);
    if (currentHash !== newHash && !(currentHash === '' && newHash === '/')) {
        window.location.hash = newHash;
    }
  }, [currentPage, selectedProductId]);

  React.useEffect(() => {
    const handleHashChange = () => {
        const { page, productId } = getRouteFromHash();
        setSelectedProductId(productId);
        setCurrentPage(page);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  React.useEffect(() => {
    document.body.className = currentPage === 'admin' ? 'bg-bg-tertiary' : 'bg-bg-primary';
  }, [currentPage]);
  
  React.useEffect(() => {
    if(user && (currentPage === 'login' || currentPage === 'signup')) {
      setCurrentPage('shop');
    }
  }, [user, currentPage]);


  const handleProductClick = React.useCallback((product: Product) => {
    setSelectedProductId(product.id);
    setCurrentPage('productDetail');
  }, []);

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage('search');
    if (query && !searchHistory.includes(query)) {
      setSearchHistory([query, ...searchHistory.slice(0, 9)]);
    }
  }, [searchHistory]);

  const onNavigate = React.useCallback((page: Page) => {
    setCurrentPage(page);
    if (page === 'shop') setSelectedProductId(null);
  }, []);

  const selectedProduct = React.useMemo(() => {
    if (currentPage !== 'productDetail' || !selectedProductId) return null;
    return products.find(p => p.id === selectedProductId) ?? null;
  }, [currentPage, selectedProductId, products]);

  const filteredProducts = React.useMemo(() => {
    return activeCategory === 'All'
      ? products.filter(p => p.published)
      : products.filter(p => p.category === activeCategory && p.published);
  }, [activeCategory, products]);
  
  const newArrivals = React.useMemo(() => {
    return [...products]
        .filter(p => p.published)
        .sort((a, b) => b.id - a.id)
        .slice(0, 8);
  }, [products]);

  const searchResults = React.useMemo(() => {
    if (!searchQuery) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, products]);

  const dealsProducts = React.useMemo(() => {
    const dealIds = new Set(homepageSections?.deals || []);
    return products.filter(p => dealIds.has(p.id));
  }, [homepageSections, products]);

  const bestsellerProducts = React.useMemo(() => {
    const bestsellerIds = new Set(homepageSections?.bestsellers || []);
    return products.filter(p => bestsellerIds.has(p.id));
  }, [homepageSections, products]);

  const resinProducts = React.useMemo(() => {
    return products.filter(p => p.category === 'Resin' && p.published).slice(0, 8);
  }, [products]);

  const jewelryProducts = React.useMemo(() => {
    return products.filter(p => ['Earrings', 'Necklaces', 'Bracelets', 'Beads'].includes(p.category) && p.published).slice(0, 8);
  }, [products]);

  const renderPage = () => {
    switch(currentPage) {
      case 'cart': return <CartPage products={products} onContinueShopping={() => setCurrentPage('shop')} onNavigateToCheckout={() => setCurrentPage('checkout')} />;
      case 'login': return <LoginPage onNavigate={onNavigate} />;
      case 'signup': return <SignupPage onNavigate={onNavigate} />;
      case 'productDetail':
        if (selectedProduct) {
          return <ProductDetailPage
            product={selectedProduct}
            relatedProducts={products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 8)}
            reviews={reviews.filter(r => r.productId === selectedProduct.id)}
            onBackToShop={() => setCurrentPage('shop')}
            onProductClick={handleProductClick}
            onNavigateToReviews={() => setCurrentPage('productReviews')}
            onQuickView={setQuickViewProduct}
          />;
        }
        return null;
      case 'checkout': return <CheckoutPage products={products} promotions={promotions} onBackToCart={() => setCurrentPage('cart')} onPlaceOrder={() => { addToast('Order placed successfully!'); setCart([]); setCurrentPage('shop'); }} />;
      case 'admin': return (
        <AdminDashboard
            onNavigate={onNavigate}
            products={products} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct}
            categories={categories} onSaveCategory={handleSaveCategory} onDeleteCategory={handleDeleteCategory}
            heroSlides={heroSlides} onSaveHeroSlide={handleSaveHeroSlide} onDeleteHeroSlide={handleDeleteHeroSlide}
            orders={orders} customers={customers} 
            promotions={promotions} onSavePromotion={handleSavePromotion} onDeletePromotion={handleDeletePromotion}
            homepageSections={homepageSections} onSaveHomepageSections={handleSaveHomepageSections}
            isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}
        />
      );
      case 'productReviews': return selectedProduct && <ProductReviewsPage product={selectedProduct} reviews={reviews.filter(r => r.productId === selectedProduct.id)} onBackToProduct={() => setCurrentPage('productDetail')} />;
      case 'search': return <SearchResultsPage query={searchQuery} results={searchResults} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />;
      case 'searchHistory': return <SearchPage history={searchHistory} onSearch={handleSearch} onClearHistory={() => setSearchHistory([])} />;
      case 'affiliate': return <AffiliatePage />;
      case 'account': return <MyAccountPage products={products} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />;
      case 'forgotPassword': return <ForgotPasswordPage onNavigate={onNavigate} />;
      case 'resetPassword': return <ResetPasswordPage onResetPassword={() => { addToast("Password reset successfully!"); onNavigate('login'); }} onNavigate={onNavigate} />;
      case 'allProducts': return <AllProductsPage products={products.filter(p => p.published)} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />;
      case 'shop':
      default:
        return (
          <>
            <HeroCarousel slides={heroSlides} />
            <Features />
            <CategoryCarousel categories={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
            <ProductGrid 
              products={newArrivals} 
              onProductClick={handleProductClick} 
              title="New Arrivals" 
              onQuickView={setQuickViewProduct} 
              bgColor="bg-bg-primary"
            />
            <ProductGrid 
              products={filteredProducts} 
              onProductClick={handleProductClick} 
              title="Featured Products" 
              onQuickView={setQuickViewProduct} 
              bgColor="bg-bg-secondary"
            />
            {dealsProducts.length > 0 && <DealsSection products={dealsProducts} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />}
            <CTA onShopNowClick={() => onNavigate('allProducts')} />
            {bestsellerProducts.length > 0 && <Bestsellers products={bestsellerProducts} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />}
            <ProductGrid 
              products={resinProducts} 
              onProductClick={handleProductClick} 
              title="Resin Art Collection" 
              onQuickView={setQuickViewProduct} 
              bgColor="bg-bg-secondary"
            />
             <ProductGrid 
              products={jewelryProducts} 
              onProductClick={handleProductClick} 
              title="Handmade Jewelry" 
              onQuickView={setQuickViewProduct} 
              bgColor="bg-bg-primary"
            />
          </>
        );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
        {currentPage !== 'admin' && (
          <Navbar 
            onCartClick={() => setCurrentPage('cart')} 
            onWishlistClick={() => setIsWishlistOpen(true)}
            onHomeClick={() => setCurrentPage('shop')}
            onNavigate={onNavigate}
            searchHistory={searchHistory}
            onSearch={handleSearch}
            products={products}
          />
        )}
        <AnimatePresence>
            {currentPage !== 'shop' && currentPage !== 'admin' && currentPage !== 'productDetail' && (
                <BackButton onNavigate={onNavigate} />
            )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
            <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {renderPage()}
            </motion.div>
        </AnimatePresence>
        {currentPage !== 'admin' && <Footer onNavigate={onNavigate} />}
        <AnimatePresence>
          {quickViewProduct && <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onViewDetails={p => { handleProductClick(p); setQuickViewProduct(null); }} />}
          {isWishlistOpen && <WishlistSidebar products={products} onClose={() => setIsWishlistOpen(false)} onProductClick={p => { handleProductClick(p); setIsWishlistOpen(false); }} />}
        </AnimatePresence>
        {currentPage !== 'admin' && <PromotionalPopup />}
        <GlobalToastContainer toasts={toasts} />
    </div>
  );
};

export default App;
