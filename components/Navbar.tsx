import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, HamburgerIcon, XIcon, SearchIcon, UserIcon, HeartIcon } from '../constants';

type Page = 'shop' | 'cart' | 'login' | 'signup' | 'affiliate' | 'account' | 'searchHistory' | 'forgotPassword';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onHomeClick: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
  searchHistory: string[];
  onSearch: (query: string) => void;
}

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Contact', href: '#' },
];

const Navbar: React.FC<NavbarProps> = ({ cartCount, wishlistCount, onCartClick, onWishlistClick, onHomeClick, isAuthenticated, onLogout, onNavigate, searchHistory, onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
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
    onLogout();
    setIsAccountMenuOpen(false);
    toggleMenu();
  };
  
  const handleAccountNav = (page: 'account') => {
    onNavigate(page);
    setIsAccountMenuOpen(false);
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
    // If the overlay is already open, clicking again should not navigate.
    // The `isSearchOpen` state will be toggled by the X button instead.
    if (searchHistory.length > 0) {
      onNavigate('searchHistory');
    } else {
      setIsSearchOpen(true);
    }
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300"
        initial={false}
        animate={isScrolled || isMenuOpen ? "scrolled" : "top"}
        variants={{
          top: {
            backgroundColor: 'rgba(254, 249, 241, 0)',
            backdropFilter: 'blur(0px)',
            boxShadow: 'none',
          },
          scrolled: {
            backgroundColor: 'rgba(254, 249, 241, 0.7)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
          }
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <button onClick={onHomeClick} className="text-2xl font-bold text-amber-600 transition-colors hover:text-amber-700">
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
                    className="text-zinc-600 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button onClick={handleSearchIconClick} className="p-1 rounded-full text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors hidden md:block">
                <SearchIcon />
              </button>

              <button onClick={onWishlistClick} className="relative p-1 rounded-full text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors ml-4 hidden md:block">
                <HeartIcon className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </button>

              <div className="hidden md:block ml-4" ref={accountMenuRef}>
                 {isAuthenticated ? (
                  <div className="relative">
                    <button onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} className="p-1 rounded-full text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors">
                      <UserIcon />
                    </button>
                    <AnimatePresence>
                      {isAccountMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                        >
                          <button onClick={() => handleAccountNav('account')} className="block w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-pink-50">My Account</button>
                          <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-pink-50">Logout</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
              ) : (
                  <button onClick={() => onNavigate('login')} className="flex items-center gap-1 text-zinc-600 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      <UserIcon className="h-4 w-4" />
                      Login
                  </button>
              )}
              </div>

              <button onClick={onCartClick} className="relative p-1 rounded-full text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors ml-2">
                <ShoppingCartIcon />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
              <div className="md:hidden ml-2 flex items-center">
                  <button onClick={handleSearchIconClick} className="p-1 rounded-full text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors">
                    <SearchIcon />
                  </button>
                  <button onClick={toggleMenu} className="p-1 rounded-md text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors ml-1">
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
              className="absolute inset-0 h-20 bg-pink-50/80 backdrop-blur-md"
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
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setIsSearchOpen(false)} 
                  className="ml-4 p-2 rounded-full text-zinc-600 hover:text-amber-600 hover:bg-white/50 transition-colors"
                  aria-label="Close search"
                >
                  <XIcon />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      <AnimatePresence>
          {isMenuOpen && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-pink-100/80 backdrop-blur-sm md:hidden"
                  onClick={toggleMenu}
              >
                  <motion.div 
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="pt-20 bg-white"
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
                            className="text-zinc-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                          >
                            {link.name}
                          </a>
                        ))}
                        <div className="border-t border-pink-200 w-3/4 my-4" />
                        <button onClick={() => { onWishlistClick(); toggleMenu(); }} className="flex items-center gap-2 text-zinc-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                          <HeartIcon className="h-5 w-5" /> My Wishlist ({wishlistCount})
                        </button>
                        {isAuthenticated ? (
                          <>
                           <button onClick={() => { onNavigate('account'); toggleMenu(); }} className="text-zinc-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                              My Account
                           </button>
                           <button onClick={handleLogoutClick} className="text-zinc-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                              Logout
                           </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { onNavigate('login'); toggleMenu(); }} className="text-zinc-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                                Login
                            </button>
                             <button onClick={() => { onNavigate('signup'); toggleMenu(); }} className="text-zinc-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
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