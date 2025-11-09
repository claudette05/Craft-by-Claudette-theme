import React from 'react';
import { Page } from '../types';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-amber-600 transition-colors">
        {children}
    </a>
);

const FooterLink: React.FC<{ children: React.ReactNode, onClick: () => void }> = ({ children, onClick }) => (
    <button onClick={onClick} className="text-zinc-600 hover:text-amber-600 transition-colors text-sm">
        {children}
    </button>
);

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-pink-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-amber-600 mb-2">Craft by Claudette</h3>
            <p className="text-zinc-600 mb-4">Handmade with love, just for you.</p>
            <div className="flex justify-center md:justify-start space-x-6">
              <SocialIcon href="#">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049 1.064.218 1.791.465 2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" /></svg>
              </SocialIcon>
               <SocialIcon href="#">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.92 15.26a1.16 1.16 0 00-1.07.12 1.12 1.12 0 00-.43.9v3.46a1.13 1.13 0 001.13 1.13h1.13a1.13 1.13 0 001.13-1.13v-4.5a3.39 3.39 0 013.38-3.38H18.8a1.13 1.13 0 001.13-1.13V8.38a1.13 1.13 0 00-1.13-1.13h-1.5a1.13 1.13 0 00-1.13 1.13v.75a6.76 6.76 0 00-6.75-6.75 6.76 6.76 0 00-6.75 6.75v5.63a3.38 3.38 0 003.38 3.38h3.37a1.12 1.12 0 001.13-1.13V16.3a1.16 1.16 0 00-.7-.94z" /></svg>
              </SocialIcon>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-800 mb-4">Company</h4>
            <div className="flex flex-col items-center md:items-start space-y-2">
              <FooterLink onClick={() => {}}>About Us</FooterLink>
              <FooterLink onClick={() => onNavigate('affiliate')}>Affiliate Program</FooterLink>
              <FooterLink onClick={() => {}}>Careers</FooterLink>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-800 mb-4">Support</h4>
            <div className="flex flex-col items-center md:items-start space-y-2">
              <FooterLink onClick={() => {}}>Contact Us</FooterLink>
              <FooterLink onClick={() => {}}>FAQs</FooterLink>
              <FooterLink onClick={() => {}}>Shipping & Returns</FooterLink>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-pink-200 pt-8 text-center">
            <p className="text-zinc-500 text-sm">&copy; {new Date().getFullYear()} Craft by Claudette. All rights reserved.</p>
            <button onClick={() => onNavigate('admin')} className="text-sm text-zinc-400 hover:text-amber-600 transition-colors mt-2">
                Admin Dashboard
            </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;