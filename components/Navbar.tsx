
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, HamburgerIcon, XIcon, SearchIcon, HeartIcon } from './Icons';
import { Page, Product } from '../types';
import ThemeToggle from './ThemeToggle';
import { useAppContext } from '../context/AppContext';

interface NavbarProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  onHomeClick: () => void;
  onNavigate: (page: Page) => void;
  searchHistory: string[];
  onSearch: (query: string) => void;
  products: Product[];
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick, onWishlistClick, onHomeClick, onNavigate, searchHistory, onSearch, products }) => {
  const { cartItemCount, wishlist, isDarkMode, toggleDarkMode, shopInfo } = useAppContext();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Contact Configurations from context
  const whatsappMessage = encodeURIComponent(`Hello ${shopInfo.name}! I'm browsing your website and I'd like to make an enquiry...`);
  const whatsappUrl = `https://wa.me/${shopInfo.whatsapp}?text=${whatsappMessage}`;

  const navLinks = [
    { name: 'Home', href: '#', isExternal: false },
    { name: 'Send Enquiry', href: whatsappUrl, isExternal: true },
  ];

  const navBgClass = isScrolled || isMenuOpen
    ? 'bg-bg-primary/80 backdrop-blur-lg shadow-sm'
    : 'bg-transparent';

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      onSearch(searchInputValue.trim());
      setIsSearchOpen(false);
      setSearchInputValue('');
    }
  };

  const handleSearchIconClick = () => {
    if (isSearchOpen) {
        setIsSearchOpen(false);
    } else if (searchHistory.length > 0) {
      onNavigate('searchHistory');
    } else {
      setIsSearchOpen(true);
    }
  };

  const suggestions = React.useMemo(() => {
    if (!searchInputValue.trim()) return [];
    const lowerQuery = searchInputValue.toLowerCase();
    return products
      .filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery) ||
        p.tags?.some(t => t.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 5);
  }, [searchInputValue, products]);

  const handleSuggestionClick = (productName: string) => {
    onSearch(productName);
    setIsSearchOpen(false);
    setSearchInputValue('');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <button onClick={onHomeClick} className="flex items-center gap-3 transition-opacity hover:opacity-80">
                {shopInfo.logoUrl ? (
                    <img src={shopInfo.logoUrl} alt={shopInfo.name} className="h-10 sm:h-12 w-auto object-contain" />
                ) : (
                    <span className="text-2xl font-bold text-accent-primary">{shopInfo.name}</span>
                )}
              </button>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!link.isExternal) {
                        e.preventDefault();
                        if (link.name === 'Home') onHomeClick();
                      }
                    }}
                    className="text-text-secondary hover:text-accent-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:flex items-center gap-2">
                <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <button onClick={handleSearchIconClick} className="p-1 rounded-full text-text-secondary hover:text-accent-primary focus:outline-none transition-colors">
                  <SearchIcon />
                </button>

                <button onClick={onWishlistClick} className="relative p-1 rounded-full text-text-secondary hover:text-accent-primary focus:outline-none transition-colors">
                  <HeartIcon className="h-6 w-6" />
                  {wishlist.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-accent-primary text-accent-text text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
                    >
                      {wishlist.length}
                    </motion.span>
                  )}
                </button>
              </div>

              <button onClick={onCartClick} className="relative p-1 rounded-full text-text-secondary hover:text-accent-primary focus:outline-none transition-colors ml-2">
                <ShoppingCartIcon />
                {cartItemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-accent-primary text-accent-text text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </button>
              <div className="md:hidden ml-2 flex items-center">
                  <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                  <button onClick={handleSearchIconClick} className="p-1 rounded-full text-text-secondary hover:text-accent-primary focus:outline-none transition-colors">
                    <SearchIcon />
                  </button>
                  <button onClick={toggleMenu} className="p-1 rounded-md text-text-secondary hover:text-accent-primary focus:outline-none transition-colors ml-1">
                      {isMenuOpen ? <XIcon /> : <HamburgerIcon />}
                  </button>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 h-20 bg-bg-primary/80 backdrop-blur-md"
            >
              <form onSubmit={handleSearchSubmit} className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="relative w-full">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-accent-primary/50 bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/80 transition"
                  />
                   <AnimatePresence>
                    {searchInputValue.length > 0 && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-4 bg-bg-secondary/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border-primary/50 overflow-hidden max-h-[60vh] overflow-y-auto z-50"
                        >
                            {suggestions.map(product => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => handleSuggestionClick(product.name)}
                                    className="w-full text-left px-4 py-3 hover:bg-bg-tertiary flex items-center gap-4 transition-colors border-b border-border-primary/50 last:border-0"
                                >
                                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">{product.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                            <span>{product.category}</span>
                                            {typeof product.salePrice === 'number' && <span className="text-red-500 font-medium">Sale</span>}
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {suggestions.length > 0 && (
                                 <button
                                    type="submit"
                                    className="w-full text-center py-3 text-sm font-medium text-accent-primary hover:bg-bg-tertiary transition-colors bg-bg-secondary/50"
                                >
                                    View all results for "{searchInputValue}"
                                </button>
                            )}
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsSearchOpen(false)} 
                  className="ml-4 p-2 rounded-full text-text-secondary hover:text-accent-primary hover:bg-bg-secondary/50 transition-colors"
                  aria-label="Close search"
                >
                  <XIcon />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      <AnimatePresence>
          {isMenuOpen && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-bg-primary/80 backdrop-blur-sm md:hidden"
                  onClick={toggleMenu}
              >
                  <motion.div 
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="pt-20 bg-bg-secondary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col items-center space-y-2 pt-8 pb-12">
                        {navLinks.map((link) => (
                          <a 
                            key={link.name} 
                            href={link.href} 
                            target={link.isExternal ? "_blank" : undefined}
                            rel={link.isExternal ? "noopener noreferrer" : undefined}
                            onClick={(e) => {
                              if (!link.isExternal) {
                                e.preventDefault();
                                if (link.name === 'Home') onHomeClick();
                              }
                              toggleMenu();
                            }}
                            className="text-text-primary hover:text-accent-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
                          >
                            {link.name}
                          </a>
                        ))}
                        <div className="border-t border-border-primary w-3/4 my-4" />
                        <button onClick={() => { onWishlistClick(); toggleMenu(); }} className="flex items-center gap-2 text-text-primary hover:text-accent-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                          <HeartIcon className="h-5 w-5" /> My Wishlist ({wishlist.length})
                        </button>
                    </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
