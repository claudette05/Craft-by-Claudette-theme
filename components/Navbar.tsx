import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, HamburgerIcon, XIcon, SearchIcon, UserIcon, HeartIcon } from './Icons';
import { Page } from '../types';
import ThemeToggle from './ThemeToggle';
import { useAppContext } from '../context/AppContext';

interface NavbarProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  onHomeClick: () => void;
  onNavigate: (page: Page) => void;
  searchHistory: string[];
  onSearch: (query: string) => void;
}

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Contact', href: '#' },
];

const Navbar: React.FC<NavbarProps> = ({ onCartClick, onWishlistClick, onHomeClick, onNavigate, searchHistory, onSearch }) => {
  const { cartItemCount, wishlist, user, logout, isDarkMode, toggleDarkMode } = useAppContext();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const accountMenuRef = React.useRef<HTMLDivElement>(null);

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
        setIsAccountMenuOpen(false);
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogoutClick = () => {
    logout();
    setIsAccountMenuOpen(false);
    if(isMenuOpen) toggleMenu();
  };
  
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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <button onClick={onHomeClick} className="text-2xl font-bold text-accent-primary transition-colors hover:opacity-80">
                Craft by Claudette
              </button>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.name === 'Home') onHomeClick();
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

                <div className="ml-2" ref={accountMenuRef}>
                  {!!user ? (
                    <div className="relative">
                      <button onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} className="p-1 rounded-full text-text-secondary hover:text-accent-primary focus:outline-none transition-colors">
                        <UserIcon />
                      </button>
                      <AnimatePresence>
                        {isAccountMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-bg-secondary rounded-md shadow-lg py-1 z-50 border border-border-primary/50"
                          >
                            <a href="#/account" onClick={() => setIsAccountMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary">My Account</a>
                            <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary">Logout</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                ) : (
                    <button onClick={() => onNavigate('login')} className="flex items-center gap-1 text-text-secondary hover:text-accent-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        <UserIcon className="h-4 w-4" />
                        Login
                    </button>
                )}
                </div>
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
                            onClick={(e) => {
                              e.preventDefault();
                              if (link.name === 'Home') onHomeClick();
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
                        {!!user ? (
                          <>
                           <a href="#/account" onClick={toggleMenu} className="text-text-primary hover:text-accent-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                              My Account
                           </a>
                           <button onClick={handleLogoutClick} className="text-text-primary hover:text-accent-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                              Logout
                           </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { onNavigate('login'); toggleMenu(); }} className="text-text-primary hover:text-accent-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                                Login
                            </button>
                             <button onClick={() => { onNavigate('signup'); toggleMenu(); }} className="text-text-primary hover:text-accent-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                                Sign Up
                            </button>
                          </>
                        )}
                    </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;