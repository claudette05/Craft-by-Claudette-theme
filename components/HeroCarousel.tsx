
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSlide } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from '../constants';

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };
  
  const slideIndex = ((page % slides.length) + slides.length) % slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [page]);


  return (
    <div className="relative w-full h-[80vh] sm:h-[70vh] overflow-hidden bg-orange-100">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute w-full h-full"
        >
          <img
            src={slides[slideIndex].imageUrl}
            alt={slides[slideIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
              >
                {slides[slideIndex].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-base sm:text-lg md:text-xl mb-8"
              >
                {slides[slideIndex].subtitle}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                {slides[slideIndex].buttonText}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute z-10 top-1/2 -translate-y-1/2 left-4">
        <button onClick={() => paginate(-1)} className="bg-white/50 hover:bg-white/80 rounded-full p-2 text-zinc-800">
          <ChevronLeftIcon />
        </button>
      </div>
      <div className="absolute z-10 top-1/2 -translate-y-1/2 right-4">
        <button onClick={() => paginate(1)} className="bg-white/50 hover:bg-white/80 rounded-full p-2 text-zinc-800">
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
