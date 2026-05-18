
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { HeroSlide } from '../types';

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const nextSlide = () => setCurrentIndex(prev => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);

    React.useEffect(() => {
      const timer = setTimeout(nextSlide, 7000); // Auto-play every 7 seconds
      return () => clearTimeout(timer);
    }, [currentIndex, slides.length]);

    if (!slides.length) return null;

    return (
      <div className="relative w-full h-[80vh] sm:h-[90vh] md:h-screen overflow-hidden bg-zinc-900">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            {slides[currentIndex].videoUrl ? (
                <video 
                    src={slides[currentIndex].videoUrl}
                    className="w-full h-full object-cover" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                />
            ) : (
                <img 
                    src={slides[currentIndex].imageUrl} 
                    alt={slides[currentIndex].title} 
                    className="w-full h-full object-cover" 
                />
            )}
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-4">
            <motion.h1 
                key={`${currentIndex}-title`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
            >
                {slides[currentIndex].title}
            </motion.h1>
            <motion.p 
                key={`${currentIndex}-subtitle`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 text-lg md:text-xl max-w-2xl"
            >
                {slides[currentIndex].subtitle}
            </motion.p>
        </div>

        <button onClick={prevSlide} className="absolute z-20 top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors">
            <ChevronLeftIcon className="h-6 w-6 text-white" />
        </button>
        <button onClick={nextSlide} className="absolute z-20 top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors">
            <ChevronRightIcon className="h-6 w-6 text-white" />
        </button>
        
        <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
                <button 
                    key={index} 
                    onClick={() => setCurrentIndex(index)} 
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-amber-500 scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                />
            ))}
        </div>
      </div>
    );
};

export default HeroCarousel;
