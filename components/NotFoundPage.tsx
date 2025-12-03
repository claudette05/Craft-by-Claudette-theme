
import * as React from 'react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC<{ onNavigate: (page: any) => void }> = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-bg-primary p-4 text-center"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md"
      >
        <div className="relative">
            <h1 className="text-9xl font-bold text-accent-primary/20 select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl md:text-4xl font-bold text-text-primary">Page Not Found</span>
            </div>
        </div>
        <p className="text-text-secondary mt-4 mb-8 text-lg">
          Oops! The page you're looking for doesn't seem to exist. It might have been moved or deleted.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('shop')}
          className="bg-accent-primary hover:bg-accent-primary/90 text-accent-text font-bold py-3 px-8 rounded-full transition-colors shadow-lg"
        >
          Back to Homepage
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;
