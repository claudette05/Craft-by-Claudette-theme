import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Product } from './types';
import { PRODUCTS, CATEGORIES, HERO_SLIDES, TRENDING_PRODUCTS, DEALS_PRODUCTS, BESTSELLER_PRODUCTS } from './constants';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import Features from './components/Features';
import CategoryCarousel from './components/CategoryCarousel';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CTA from './components/CTA';
import Footer from './components/Footer';
import DealsSection from './components/DealsSection';
import Newsletter from './components/Newsletter';
import Bestsellers from './components/Bestsellers';


const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleAddToCart = useCallback((quantity: number) => {
    setCartCount(prevCount => prevCount + quantity);
  }, []);
  
  const handleSelectCategory = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') {
      return PRODUCTS;
    }
    return PRODUCTS.filter(product => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-pink-50 text-zinc-800 min-h-screen selection:bg-amber-200">
      <Navbar cartCount={cartCount} />
      <main className="pt-20">
        <HeroCarousel slides={HERO_SLIDES} />
        <Features />
        <DealsSection 
          products={DEALS_PRODUCTS} 
          onProductClick={handleProductClick} 
          onAddToCart={handleAddToCart}
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
        />
        <ProductGrid 
          title="Trending Now"
          products={TRENDING_PRODUCTS} 
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          bgColor="bg-white"
        />
        <Bestsellers 
          products={BESTSELLER_PRODUCTS}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
        />
        <CTA />
        <Newsletter />
        <Footer />
      </main>
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={handleCloseModal}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;