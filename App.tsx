

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon } from './components/Icons';
import { Product, Page, HeroSlide, HomepageSections, Category, AdminOrder, AdminCustomer, Promotion } from './types';
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
import MyAccountPage from './components/MyAccountPage';
import WishlistSidebar from './components/WishlistSidebar';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import GlobalToastContainer from './components/GlobalToastContainer';
import { useAppContext } from './context/AppContext';
import AllProductsPage from './components/AllProductsPage';
import { getProducts, getCategories, getHeroSlides, getHomepageSections, saveProduct, deleteProduct, saveCategory, deleteCategory, saveHeroSlide, deleteHeroSlide, saveHomepageSections } from './services/firebaseService';

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

const getRouteFromHash = (): { page: Page; productId: string | null } => {
    const hash = window.location.hash.slice(1);
    const [path, param] = hash.split('/').filter(Boolean);

    if (path === 'product' && param) {
        return { page: 'productDetail', productId: param };
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
  const { user, isDarkMode, toggleDarkMode, toasts, addToast, setCart } = useAppContext();
  
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
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(() => {
    if (initialRoute.page === 'productDetail' && initialRoute.productId) return initialRoute.productId;
    const savedId = sessionStorage.getItem('selectedProductId');
    return savedId ? JSON.parse(savedId) : null;
  });
  const [searchQuery, setSearchQuery] = React.useState<string>(() => sessionStorage.getItem('searchQuery') || '');
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  
  const [quickViewProduct, setQuickViewProduct] = React.useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);

  const [searchHistory, setSearchHistory] = React.useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    const loadFirebaseData = async () => {
        setIsLoading(true);
        try {
            const [productsData, categoriesData, heroSlidesData, homepageSectionsData] = await Promise.all([
                getProducts(),
                getCategories(),
                getHeroSlides(),
                getHomepageSections()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            setHeroSlides(heroSlidesData);
            if (homepageSectionsData) {
                setHomepageSections(homepageSectionsData);
            }
        } catch (error) {
            console.error("Error loading data from Firebase:", error);
            addToast('Failed to load data from server.', 'error');
        }
        setIsLoading(false);
    };
    loadFirebaseData();
  }, [addToast]);

  const handleSaveProduct = async (productData: Product, imageFile?: File) => {
    try {
        const savedProduct = await saveProduct(productData, imageFile);
        if (productData.id) {
            setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
            addToast('Product updated successfully!');
        } else {
            setProducts([savedProduct, ...products]);
            addToast('Product added successfully!');
        }
    } catch (error) {
        addToast('Failed to save product.', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        try {
            await deleteProduct(productId);
            setProducts(products.filter(p => p.id !== productId));
            addToast('Product deleted!', 'info');
        } catch (error) {
            addToast('Failed to delete product.', 'error');
        }
    }
  };

  const handleSaveCategory = async (categoryData: Category, imageFile?: File) => {
    try {
        const savedCategory = await saveCategory(categoryData, imageFile);
        if (categoryData.id) {
            setCategories(categories.map(c => c.id === savedCategory.id ? savedCategory : c));
            addToast('Category updated successfully!');
        } else {
            setCategories([savedCategory, ...categories]);
            addToast('Category added successfully!');
        }
    } catch (error) {
        addToast('Failed to save category.', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
        try {
            await deleteCategory(categoryId);
            setCategories(categories.filter(c => c.id !== categoryId));
            addToast('Category deleted!', 'info');
        } catch (error) {
            addToast('Failed to delete category.', 'error');
        }
    }
  };

  const handleSaveHeroSlide = async (slideData: HeroSlide, imageFile?: File) => {
    try {
        const savedSlide = await saveHeroSlide(slideData, imageFile);
        if (slideData.id) {
            setHeroSlides(heroSlides.map(s => s.id === savedSlide.id ? savedSlide : s));
            addToast('Hero slide updated successfully!');
        } else {
            setHeroSlides([savedSlide, ...heroSlides]);
            addToast('Hero slide added successfully!');
        }
    } catch (error) {
        addToast('Failed to save hero slide.', 'error');
    }
  };

  const handleDeleteHeroSlide = async (slideId: string) => {
    if (window.confirm('Are you sure you want to delete this hero slide?')) {
        try {
            await deleteHeroSlide(slideId);
            setHeroSlides(heroSlides.filter(s => s.id !== slideId));
            addToast('Hero slide deleted!', 'info');
        } catch (error) {
            addToast('Failed to delete hero slide.', 'error');
        }
    }
  };

  const handleSaveHomepageSections = async (sections: HomepageSections) => {
      try {
        await saveHomepageSections(sections);
        setHomepageSections(sections);
        addToast("Homepage sections updated successfully!");
      } catch (error) {
        addToast('Failed to save homepage sections.', 'error');
      }
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
            onBackToShop={() => setCurrentPage('shop')}
            onProductClick={handleProductClick}
            onNavigateToReviews={() => setCurrentPage('productReviews')}
            onQuickView={setQuickViewProduct}
          />;
        }
        return null;
      case 'checkout': return <CheckoutPage products={products} onBackToCart={() => setCurrentPage('cart')} onPlaceOrder={() => { addToast('Order placed successfully!'); setCart([]); setCurrentPage('shop'); }} />;
      case 'admin': return (
        <AdminDashboard
            onNavigate={onNavigate}
            products={products} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct}
            categories={categories} onSaveCategory={handleSaveCategory} onDeleteCategory={handleDeleteCategory}
            heroSlides={heroSlides} onSaveHeroSlide={handleSaveHeroSlide} onDeleteHeroSlide={handleDeleteHeroSlide}
            orders={orders} customers={customers} promotions={promotions}
            homepageSections={homepageSections} onSaveHomepageSections={handleSaveHomepageSections}
            isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}
        />
      );
      case 'productReviews': return selectedProduct && <ProductReviewsPage product={selectedProduct} reviews={[]} onBackToProduct={() => setCurrentPage('productDetail')} />;
      case 'search': return <SearchResultsPage query={searchQuery} results={searchResults} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />;
      case 'searchHistory': return <SearchPage history={searchHistory} onSearch={handleSearch} onClearHistory={() => setSearchHistory([])} />;
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
            <ProductGrid products={filteredProducts} onProductClick={handleProductClick} title="Featured Products" onQuickView={setQuickViewProduct} />
            {dealsProducts.length > 0 && <DealsSection products={dealsProducts} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />}
            <CTA onShopNowClick={() => onNavigate('allProducts')} />
            {bestsellerProducts.length > 0 && <Bestsellers products={bestsellerProducts} onProductClick={handleProductClick} onQuickView={setQuickViewProduct} />}
            <Newsletter />
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
        <GlobalToastContainer toasts={toasts} />
    </div>
  );
};

export default App;
