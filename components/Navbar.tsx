import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, HamburgerIcon, XIcon, SearchIcon } from '../constants';

interface NavbarProps {
  cartCount: number;
}

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Shop', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Contact', href: '#' },
];

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
              <a href="/" className="text-2xl font-bold text-amber-600 transition-colors hover:text-amber-700">
                Craft by Claudette
              </a>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="text-zinc-600 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button className="relative p-1 rounded-full text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors">
                <SearchIcon />
              </button>
              <button className="relative p-1 rounded-full text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors ml-2">
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
              <div className="md:hidden ml-2">
                  <button onClick={toggleMenu} className="p-1 rounded-md text-zinc-600 hover:text-amber-600 focus:outline-none transition-colors">
                      {isMenuOpen ? <XIcon /> : <HamburgerIcon />}
                  </button>
              </div>
            </div>
          </div>
        </div>
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
                    <div className="flex flex-col items-center space-y-4 pt-8 pb-12">
                        {navLinks.map((link) => (
                          <a key={link.name} href={link.href} onClick={toggleMenu} className="text-zinc-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                            {link.name}
                          </a>
                        ))}
                    </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;