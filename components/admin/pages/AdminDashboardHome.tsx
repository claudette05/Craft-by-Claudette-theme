import React from 'react';
import { motion } from 'framer-motion';
import { ADMIN_STATS, MOCK_ORDERS, MOCK_TOP_PRODUCTS } from '@/constants/adminConstants';
import StatCard from '../StatCard';
import RecentOrdersTable from '../RecentOrdersTable';
import TopProductsList from '../TopProductsList';
import SalesChart from '../charts/SalesChart';

const AdminDashboardHome: React.FC = () => {
    return (
        <div>
            <motion.header 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
                <p className="text-[var(--text-secondary)] mt-1">Welcome back, Admin! Here's a snapshot of your store.</p>
            </motion.header>

            {/* Stat Cards */}
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
            >
                {ADMIN_STATS.map((stat) => (
                    <StatCard key={stat.label} stat={stat} />
                ))}
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <motion.div
                    className="lg:col-span-3 bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Sales Overview</h2>
                    <div className="h-72">
                        <SalesChart />
                    </div>
                {/* FIX: Corrected closing tag for motion.div */}
                </motion.div>
                <motion.div
                    className="lg:col-span-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <TopProductsList products={MOCK_TOP_PRODUCTS} />
                </motion.div>
            </div>

            {/* Recent Orders */}
            <motion.div 
                className="mt-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <RecentOrdersTable orders={MOCK_ORDERS.slice(0, 6)} />
            </motion.div>
        </div>
    );
};

export default AdminDashboardHome;