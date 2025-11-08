import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '../constants';

interface DealsSectionProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (productId: number, quantity: number) => void;
  wishlist: number[];
  onToggleWishlist: (productId: number) => void;
  onQuickView: (product: Product) => void;
}

const Countdown: React.FC = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date("2024-12-31") - +new Date();
        let timeLeft: { [key: string]: number } = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents: React.ReactNode[] = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) {
            return;
        }

        timerComponents.push(
            <div key={interval} className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-white bg-amber-500/80 rounded-lg px-2 sm:px-3 py-2">
                    {String(timeLeft[interval]).padStart(2, '0')}
                </div>
                <div className="text-xs uppercase mt-1 text-zinc-600">{interval}</div>
            </div>
        );
    });

    return (
        <div className="flex space-x-2 md:space-x-4 justify-center">
            {timerComponents.length ? timerComponents : <span>Time's up!</span>}
        </div>
    );
};

const DealsSection: React.FC<DealsSectionProps> = ({ products, onProductClick, onAddToCart, wishlist, onToggleWishlist, onQuickView }) => {
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
    <section className="py-12 md:py-16 bg-orange-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-amber-800 flex items-center justify-center gap-3">
            <ClockIcon /> Deals of the Day
          </h2>
          <p className="mt-2 mb-8 text-zinc-600">Hurry, these deals won't last long!</p>
          <Countdown />
        </motion.div>
      </div>
      <div className="mt-12">
        <div className="relative group">
          <motion.button
            onClick={() => handleNav('prev')}
            disabled={!canScrollPrev}
            className="absolute top-1/2 -translate-y-1/2 left-2 z-10 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed hidden md:flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeftIcon />
          </motion.button>
          
          <motion.div
            ref={scrollContainerRef}
            className="overflow-x-auto hide-scrollbar scroll-smooth"
            onScroll={checkScrollButtons}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
          </motion.div>

          <motion.button
            onClick={() => handleNav('next')}
            disabled={!canScrollNext}
            className="absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed hidden md:flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRightIcon />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;