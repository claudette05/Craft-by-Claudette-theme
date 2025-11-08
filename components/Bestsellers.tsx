import React, { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ChevronLeftIcon, ChevronRightIcon } from '../constants';

interface BestsellersProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (productId: number, quantity: number) => void;
  wishlist: number[];
  onToggleWishlist: (productId: number) => void;
  onQuickView: (product: Product) => void;
}

const Bestsellers: React.FC<BestsellersProps> = ({ products, onProductClick, onAddToCart, wishlist, onToggleWishlist, onQuickView }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const checkScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const isScrollable = el.scrollWidth > el.clientWidth;
      setCanScrollPrev(el.scrollLeft > 0);
      setCanScrollNext(isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  }, []);

  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    checkScrollButtons();

    const resizeObserver = new ResizeObserver(checkScrollButtons);
    if (el) resizeObserver.observe(el);

    return () => {
        if (el) resizeObserver.unobserve(el);
    };
  }, [products, checkScrollButtons]);

  const handleNav = (direction: 'prev' | 'next') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8;
      const newScrollLeft = direction === 'prev' 
        ? el.scrollLeft - scrollAmount 
        : el.scrollLeft + scrollAmount;
      
      el.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12 text-zinc-800"
        >
          Our Bestsellers
        </motion.h2>
      </div>
      <div className="relative group">
        <motion.button
          onClick={() => handleNav('prev')}
          disabled={!canScrollPrev}
          className="absolute top-1/2 -translate-y-1/2 left-2 z-10 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed hidden md:flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeftIcon />
        </motion.button>

        <div
            ref={scrollContainerRef}
            className="overflow-x-auto hide-scrollbar scroll-smooth"
            onScroll={checkScrollButtons}
        >
            <div
                className="flex gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-4"
            >
              {products.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-8/12 sm:w-5/12 md:w-4/12 lg:w-3/12 xl:w-1/5">
                    <ProductCard product={product} onClick={onProductClick} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onQuickView={onQuickView} />
                </div>
              ))}
            </div>
        </div>

        <motion.button
          onClick={() => handleNav('next')}
          disabled={!canScrollNext}
          className="absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed hidden md:flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRightIcon />
        </motion.button>
      </div>
    </section>
  );
};

export default Bestsellers;