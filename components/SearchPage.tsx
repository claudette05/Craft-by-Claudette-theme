import * as React from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, ClockIcon } from './Icons';

interface SearchPageProps {
  history: string[];
  onSearch: (query: string) => void;
  onClearHistory: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ history, onSearch, onClearHistory }) => {
  const [searchInputValue, setSearchInputValue] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      onSearch(searchInputValue.trim());
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen"
    >
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary">Search</h1>
          <p className="mt-2 text-text-secondary">Find your next favorite handmade treasure.</p>
        </header>

        <form onSubmit={handleSearchSubmit} className="relative mb-12">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            placeholder="Search for earrings, bracelets, resin art..."
            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-accent-primary/40 bg-bg-secondary text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/80 focus:border-accent-primary/80 transition"
          />
        </form>

        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Recent Searches</h2>
              <button
                onClick={onClearHistory}
                className="text-sm text-accent-primary hover:opacity-80 hover:underline font-medium"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {history.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => onSearch(item)}
                  className="flex items-center gap-2 bg-bg-secondary hover:bg-bg-tertiary border border-border-primary text-text-primary px-3 py-1.5 rounded-full text-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ClockIcon />
                  <span>{item}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
};

export default SearchPage;