
import * as React from 'react';
import { motion } from 'framer-motion';
import SalesChart from '../charts/SalesChart';
import { Product, AdminOrder } from '../../../types';

// Mock Data for Categories (Percentage of sales/inventory)
const CATEGORY_DATA = [
    { name: 'Earrings', value: 45, color: 'bg-pink-400' },
    { name: 'Bracelets', value: 30, color: 'bg-amber-400' },
    { name: 'Necklaces', value: 15, color: 'bg-purple-400' },
    { name: 'Resin', value: 10, color: 'bg-blue-400' },
];

const CategoryBarChart = () => {
    const maxVal = Math.max(...CATEGORY_DATA.map(d => d.value));
    
    return (
        <div className="space-y-5">
            {CATEGORY_DATA.map((cat, index) => (
                <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-[var(--text-primary)]">{cat.name}</span>
                        <span className="text-[var(--text-secondary)] font-mono">{cat.value}%</span>
                    </div>
                    <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-3 overflow-hidden">
                        <motion.div 
                            className={`h-full rounded-full ${cat.color}`} 
                            initial={{ width: 0 }}
                            animate={{ width: `${(cat.value / maxVal) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

const LowStockTable = ({ products }: { products: Product[] }) => {
    // Filter for low stock (<= 20) and sort ascending
    const lowStockItems = products
        .filter(p => p.stock <= 20)
        .sort((a,b) => a.stock - b.stock);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Product</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold text-right">Stock Level</th>
                    </tr>
                </thead>
                <tbody>
                    {lowStockItems.map(item => (
                        <motion.tr 
                            key={item.id} 
                            className="border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--bg-tertiary)] transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded object-cover bg-[var(--bg-tertiary)]" />
                                    <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">{item.category}</td>
                            <td className="px-6 py-4 text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    item.stock === 0 
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                }`}>
                                    {item.stock === 0 ? 'Out of Stock' : `${item.stock} remaining`}
                                </span>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface AdminAnalyticsPageProps {
    orders: AdminOrder[];
    products: Product[];
}

const AdminAnalyticsPage: React.FC<AdminAnalyticsPageProps> = ({ orders, products }) => {
    return (
        <div className="space-y-8 pb-8">
            <header>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Analytics</h1>
                <p className="text-[var(--text-secondary)] mt-1">Real-time insights into sales, inventory, and performance.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <motion.div 
                    className="bg-[var(--bg-secondary)] p-6 md:p-8 rounded-xl shadow-sm border border-[var(--border-primary)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold text-[var(--text-primary)]">Sales Revenue</h2>
                        <select className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-none rounded px-2 py-1 outline-none cursor-pointer hover:text-[var(--text-primary)]">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-72 w-full">
                        <SalesChart orders={orders} />
                    </div>
                </motion.div>

                {/* Popular Categories */}
                <motion.div 
                    className="bg-[var(--bg-secondary)] p-6 md:p-8 rounded-xl shadow-sm border border-[var(--border-primary)] flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Popular Categories</h2>
                    <p className="text-sm text-[var(--text-secondary)] mb-8">Distribution of sales by product category.</p>
                    <div className="flex-grow flex flex-col justify-center">
                        <CategoryBarChart />
                    </div>
                </motion.div>
            </div>

            {/* Low Stock Alert */}
            <motion.div 
                className="bg-[var(--bg-secondary)] p-6 md:p-8 rounded-xl shadow-sm border border-[var(--border-primary)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-[var(--text-primary)]">Low Stock Alerts</h2>
                        <p className="text-sm text-[var(--text-secondary)]">Products that are running low or out of stock.</p>
                    </div>
                    <button className="text-sm font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 transition-colors">
                        View All Inventory &rarr;
                    </button>
                </div>
                <LowStockTable products={products} />
            </motion.div>
        </div>
    );
};

export default AdminAnalyticsPage;
