
import * as React from 'react';
import { Page } from '../types';
import { useAppContext } from '../context/AppContext';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
        {children}
    </a>
);

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { shopInfo } = useAppContext();

  // Contact Configurations from context
  const whatsappMessage = encodeURIComponent(`Hello ${shopInfo.name}! I'm browsing your website and I'd like to make an enquiry...`);
  const whatsappUrl = `https://wa.me/${shopInfo.whatsapp}?text=${whatsappMessage}`;

  return (
    <footer className="bg-bg-secondary border-t border-border-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Brand Info */}
          <div>
            <h3 className="text-xl font-bold text-accent-primary mb-2">{shopInfo.name}</h3>
            <p className="text-text-secondary mb-6 italic">Handmade with love, just for you.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#25D366] hover:opacity-80 transition-opacity bg-[#25D366]/10 px-6 py-3 rounded-full border border-[#25D366]/30"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Send Enquiry
                </a>
            </div>

            <div className="flex justify-center space-x-6">
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
        </div>
        <div className="mt-12 border-t border-border-primary pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-secondary text-sm">&copy; {new Date().getFullYear()} {shopInfo.name}. All rights reserved.</p>
            <div className="flex gap-4">
                <button onClick={() => onNavigate('reportBug')} className="text-sm text-text-secondary/60 hover:text-accent-primary transition-colors">
                    Report a Bug
                </button>
                <button onClick={() => onNavigate('admin')} className="text-sm text-text-secondary/60 hover:text-accent-primary transition-colors">
                    Internal
                </button>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
