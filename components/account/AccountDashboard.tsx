import * as React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, HeartIcon } from '../Icons';
import { AccountPage } from '../../types';
import { MOCK_ORDERS } from '../../adminConstants'; // Using for demo data
import { useAppContext } from '../../context/AppContext';

interface AccountDashboardProps {
    setActivePage: (page: AccountPage) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, onClick: () => void }> = ({ icon, title, value, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
        className="bg-bg-primary p-6 rounded-lg shadow-sm flex items-center gap-6 cursor-pointer"
        onClick={onClick}
    >
        <div className="bg-amber-100 dark:bg-accent-primary/10 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </motion.div>
);

const AccountDashboard: React.FC<AccountDashboardProps> = ({ setActivePage }) => {
    const { wishlist } = useAppContext();
    // In a real app, this data would come from props or a state manager
    const totalOrders = MOCK_ORDERS.length; 
    const wishlistItems = wishlist.length;

    return (
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome Back!</h2>
            <p className="text-text-secondary mb-8">From your dashboard, you can view your recent orders, manage your shipping addresses, and edit your password and account details.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard 
                    icon={<ShoppingCartIcon className="h-8 w-8 text-accent-primary" />} 
                    title="Total Orders" 
                    value={totalOrders} 
                    onClick={() => setActivePage('orders')}
                />
                <StatCard 
                    icon={<HeartIcon className="h-8 w-8 text-accent-primary" />} 
                    title="Wishlist Items" 
                    value={wishlistItems}
                    onClick={() => setActivePage('wishlist')}
                />
            </div>
        </div>
    );
};

export default AccountDashboard;
