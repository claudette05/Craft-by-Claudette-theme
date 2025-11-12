import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, AccountPage } from '../types';
import AccountSidebar from './account/AccountSidebar';
import AccountDashboard from './account/AccountDashboard';
import AccountOrderHistory from './account/AccountOrderHistory';
import AccountProfile from './account/AccountProfile';
import AccountAddresses from './account/AccountAddresses';
import AccountWishlist from './account/AccountWishlist';
import AccountNotifications from './account/AccountNotifications';
import AccountOrderTracking from './account/AccountOrderTracking';
import { HamburgerIcon } from './Icons';

interface MyAccountPageProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    onQuickView: (product: Product) => void;
}

const MyAccountPage: React.FC<MyAccountPageProps> = (props) => {
    const [activePage, setActivePage] = React.useState<AccountPage>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard': return <AccountDashboard setActivePage={setActivePage} />;
            case 'orders': return <AccountOrderHistory />;
            case 'profile': return <AccountProfile />;
            case 'addresses': return <AccountAddresses />;
            case 'wishlist': return <AccountWishlist {...props} />;
            case 'notifications': return <AccountNotifications />;
            case 'tracking': return <AccountOrderTracking />;
            default: return <AccountDashboard setActivePage={setActivePage} />;
        }
    };
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-20 bg-pink-50 dark:bg-bg-tertiary min-h-screen"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-text-primary">My Account</h1>
                </header>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-bg-secondary rounded-md shadow-sm fixed top-24 left-4 z-30">
                        <HamburgerIcon />
                    </button>

                    <AnimatePresence>
                        {isSidebarOpen && (
                            <>
                                <motion.div className="fixed inset-0 bg-black/50 z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} />
                                <motion.div className="fixed top-0 left-0 h-full z-50 md:hidden" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                                    <AccountSidebar activePage={activePage} setActivePage={setActivePage} onLinkClick={() => setIsSidebarOpen(false)} />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                    
                    <div className="hidden md:block">
                        <AccountSidebar activePage={activePage} setActivePage={setActivePage} />
                    </div>

                    <main className="flex-1 w-full bg-bg-secondary p-6 sm:p-8 rounded-lg shadow-sm">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePage}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </motion.div>
    );
};

export default MyAccountPage;