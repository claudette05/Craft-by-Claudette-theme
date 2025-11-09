import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, HeartIcon } from '../../constants';
import { AccountPage } from '../MyAccountPage';
import { MOCK_ORDERS } from '../../../adminConstants'; // Using for demo data

interface AccountDashboardProps {
    setActivePage: (page: AccountPage) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, onClick: () => void }> = ({ icon, title, value, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
        className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-6 cursor-pointer"
        onClick={onClick}
    >
        <div className="bg-amber-100 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-zinc-500">{title}</p>
            <p className="text-2xl font-bold text-zinc-800">{value}</p>
        </div>
    </motion.div>
);

const AccountDashboard: React.FC<AccountDashboardProps> = ({ setActivePage }) => {
    // In a real app, this data would come from props or a state manager
    const totalOrders = MOCK_ORDERS.length; 
    const wishlistItems = 4; // Mock data

    return (
        <div>
            <h2 className="text-2xl font-bold text-zinc-800 mb-2">Welcome Back!</h2>
            <p className="text-zinc-600 mb-8">From your dashboard, you can view your recent orders, manage your shipping addresses, and edit your password and account details.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard 
                    icon={<ShoppingCartIcon className="h-8 w-8 text-amber-600" />} 
                    title="Total Orders" 
                    value={totalOrders} 
                    onClick={() => setActivePage('orders')}
                />
                <StatCard 
                    icon={<HeartIcon className="h-8 w-8 text-amber-600" />} 
                    title="Wishlist Items" 
                    value={wishlistItems}
                    onClick={() => setActivePage('wishlist')}
                />
            </div>
        </div>
    );
};

export default AccountDashboard;