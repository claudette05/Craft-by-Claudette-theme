import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import AccountSidebar from './account/AccountSidebar';
import AccountDashboard from './account/AccountDashboard';
import AccountOrderHistory from './account/AccountOrderHistory';
import AccountProfile from './account/AccountProfile';
import AccountAddresses from './account/AccountAddresses';
import AccountWishlist from './account/AccountWishlist';

export type AccountPage = 'dashboard' | 'orders' | 'profile' | 'addresses' | 'wishlist';

interface MyAccountPageProps {
    wishlist: number[];
    allProducts: Product[];
    onProductClick: (product: Product) => void;
    onAddToCart: (productId: number, quantity: number) => void;
    onToggleWishlist: (productId: number) => void;
    onQuickView: (product: Product) => void;
}

const MyAccountPage: React.FC<MyAccountPageProps> = (props) => {
    const [activePage, setActivePage] = useState<AccountPage>('dashboard');

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <AccountDashboard setActivePage={setActivePage} />;
            case 'orders':
                return <AccountOrderHistory />;
            case 'profile':
                return <AccountProfile />;
            case 'addresses':
                return <AccountAddresses />;
            case 'wishlist':
                return <AccountWishlist {...props} />;
            default:
                return <AccountDashboard setActivePage={setActivePage} />;
        }
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
        >
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-800">My Account</h1>
                <p className="mt-1 text-zinc-500">Manage your orders, profile, and wishlist.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
                    <AccountSidebar activePage={activePage} setActivePage={setActivePage} />
                </div>
                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/60 p-6 sm:p-8 rounded-lg shadow-md"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </motion.main>
    );
};

export default MyAccountPage;