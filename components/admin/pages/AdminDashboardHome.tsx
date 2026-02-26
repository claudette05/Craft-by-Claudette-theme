
import * as React from 'react';
import { motion } from 'framer-motion';
import { AdminOrder, Product, AdminTopProduct } from '../../../types';
import StatCard, { AdminStat } from '../StatCard';
import RecentOrdersTable from '../RecentOrdersTable';
import TopProductsList from '../TopProductsList';
import { ShoppingCartIcon, DollarSignIcon, PackageIcon, SparklesIcon } from '../../Icons';
import { useAppContext } from '../../../context/AppContext';

interface AdminDashboardHomeProps {
    orders: AdminOrder[];
    products: Product[];
    onNavigateToSettings?: () => void;
}

const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({ orders, products, onNavigateToSettings }) => {
    const { cloudinaryConfig } = useAppContext();
    const isCloudinaryConfigured = cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset;

    const topProducts = React.useMemo((): AdminTopProduct[] => {
        return products.slice(0, 5).map(p => ({
            id: p.id,
            name: p.name,
            imageUrl: p.imageUrl,
            sales: Math.floor(Math.random() * 50) + 10, // Mock sales data
        })).sort((a,b) => b.sales - a.sales);
    }, [products]);

    const totalSales = React.useMemo(() => {
        return orders.reduce((acc, order) => acc + (order.status === 'Completed' ? order.total : 0), 0);
    }, [orders]);


    const adminStats: AdminStat[] = [
        { label: 'Total Sales', value: `GH₵${totalSales.toFixed(2)}`, icon: DollarSignIcon },
        { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingCartIcon },
        { label: 'Products in Stock', value: products.filter(p=>p.stock > 0).length.toString(), icon: PackageIcon },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <motion.header 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Welcome back, Admin!</p>
                </motion.header>
            </div>

            {!isCloudinaryConfigured && onNavigateToSettings && (
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500 text-white p-3 rounded-full">
                            <SparklesIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400">Finish your Setup</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-500/80">Connect Cloudinary to start uploading product images.</p>
                        </div>
                    </div>
                    <button 
                        onClick={onNavigateToSettings}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                    >
                        Configure Now
                    </button>
                </motion.div>
            )}

            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
                {adminStats.map((stat) => (
                    <StatCard key={stat.label} stat={stat} />
                ))}
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <motion.div
                    className="lg:col-span-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <RecentOrdersTable orders={orders.slice(0, 8)} />
                </motion.div>
                <motion.div
                    className="lg:col-span-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <TopProductsList products={topProducts} />
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;
