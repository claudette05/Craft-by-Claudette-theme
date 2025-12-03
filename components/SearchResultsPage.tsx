
import * as React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface SearchResultsPageProps {
  query: string;
  results: Product[];
  onProductClick: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
};

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, results, onProductClick, onQuickView }) => {
  const [sortBy, setSortBy] = React.useState('default');
  const [filterCategory, setFilterCategory] = React.useState('All');

  // Extract unique categories from the search results
  const categories = React.useMemo(() => {
    const cats = new Set(results.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [results]);

  // Reset filters when query changes
  React.useEffect(() => {
      setSortBy('default');
      setFilterCategory('All');
  }, [query]);

  // Process results based on sort and filter state
  const displayedResults = React.useMemo(() => {
    let processed = [...results];

    // Filter
    if (filterCategory !== 'All') {
      processed = processed.filter(p => p.category === filterCategory);
    }

    // Sort
    if (sortBy === 'price-asc') {
      processed.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sortBy === 'price-desc') {
      processed.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    }

    return processed;
  }, [results, sortBy, filterCategory]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Search Results</h1>
        <p className="mt-2 text-text-secondary">
          Found {results.length} result{results.length !== 1 && 's'} for: <span className="font-semibold text-accent-primary">"{query}"</span>
        </p>
      </div>

      {results.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-bg-secondary p-4 rounded-lg shadow-sm border border-border-primary">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="category-filter" className="text-sm font-medium text-text-secondary whitespace-nowrap">Filter:</label>
                <select
                    id="category-filter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full sm:w-48 p-2 rounded-md border border-border-primary bg-bg-tertiary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="sort-by" className="text-sm font-medium text-text-secondary whitespace-nowrap">Sort By:</label>
                <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-48 p-2 rounded-md border border-border-primary bg-bg-tertiary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                    <option value="default">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </div>
        </div>
      )}

      {displayedResults.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${sortBy}-${filterCategory}-${query}`}
        >
          {displayedResults.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onProductClick}
              onQuickView={onQuickView}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
        >
          {results.length > 0 ? (
              <>
                <p className="text-xl font-semibold text-text-primary">No results match your filters</p>
                <button 
                    onClick={() => { setFilterCategory('All'); setSortBy('default'); }}
                    className="mt-4 text-accent-primary hover:underline"
                >
                    Clear Filters
                </button>
              </>
          ) : (
              <>
                <p className="text-xl font-semibold text-text-primary">No products found</p>
                <p className="mt-2 text-text-secondary">
                    We couldn't find any products matching your search. Please try a different keyword.
                </p>
              </>
          )}
        </motion.div>
      )}
    </motion.main>
  );
};

export default SearchResultsPage;
