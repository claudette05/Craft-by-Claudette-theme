import * as React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { LookbookConfig } from '../types';

const Lookbook: React.FC = () => {
  const { lookbookConfig } = useAppContext();

  if (!lookbookConfig) return null;

  const { mode, images, overlayText, linkUrl } = lookbookConfig as LookbookConfig;

  const renderCover = () => {
    const background = images[0] || 'https://via.placeholder.com/800x400?text=Lookbook+Cover';
    return (
      <div className="relative w-full h-96 overflow-hidden rounded-xl lookbook" style={{ backgroundImage: `url(${background})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70" />
        {overlayText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.h2
              className="text-4xl sm:text-5xl font-bold text-white text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {overlayText}
            </motion.h2>
          </div>
        )}
        {linkUrl && (
          <a href={linkUrl} className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-full transition-colors shadow-lg">
            Explore Customer Love
          </a>
        )}
      </div>
    );
  };

  const renderCollage = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lookbook">
      {images.filter(Boolean).map((src, idx) => (
        <motion.div
          key={idx}
          className="relative overflow-hidden rounded-lg"
          whileHover={{ scale: 1.03 }}
        >
          <img src={src} alt={`Lookbook ${idx}`} className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  );

  const renderCarousel = () => (
    <div className="relative lookbook overflow-hidden rounded-xl">
      <div className="whitespace-nowrap transition-transform duration-500" style={{ transform: 'translateX(0%)' }}>
        {images.filter(Boolean).map((src, idx) => (
          <div key={idx} className="inline-block w-full h-96">
            <img src={src} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="my-8">
      {mode === 'cover' && renderCover()}
      {mode === 'collage' && renderCollage()}
      {mode === 'carousel' && renderCarousel()}
    </div>
  );
};

export default Lookbook;