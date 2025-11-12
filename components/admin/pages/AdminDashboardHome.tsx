import * as React from 'react';
import { motion } from 'framer-motion';
import { AdminOrder, Product, AdminTopProduct } from '../../../types';
import StatCard, { AdminStat } from '../StatCard';
import RecentOrdersTable from '../RecentOrdersTable';
import TopProductsList from '../TopProductsList';
import SalesChart from '../charts/SalesChart';
import { ShoppingCartIcon, DollarSignIcon, UsersIcon, PackageIcon } from '../../Icons';


interface AdminDashboardHomeProps {
    orders: AdminOrder[];
    products: Product[];
}

const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({ orders, products }) => {
    
    const topProducts = React.useMemo((): AdminTopProduct[] => {
        // This is a placeholder for a real sales calculation
        return products.slice(0, 4).map(p => ({
            id: p.id,
            name: p.name,
            imageUrl: p.imageUrl,
            sales: Math.floor(Math.random() * 100) + 50 // Mock sales data
        })).sort((a,b) => b.sales - a.sales);
    }, [products]);

    const totalSales = React.useMemo(() => {
        return orders.reduce((acc, order) => acc + (order.status === 'Completed' ? order.total : 0), 0);
    }, [orders]);

    const adminStats: AdminStat[] = [
        { label: 'Total Sales', value: `GH₵${totalSales.toFixed(2)}`, icon: DollarSignIcon },
        { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingCartIcon },
        { label: 'New Customers', value: '78', icon: UsersIcon }, // Mocked for now
        { label: 'Products in Stock', value: products.filter(p=>p.stock > 0).length.toString(), icon: PackageIcon },
    ];


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

            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
                    className="lg:col-span-3 bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Sales Overview</h2>
                    <div className="h-72">
                        <SalesChart />
                    </div>
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

            <motion.div 
                className="mt-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <RecentOrdersTable orders={orders.slice(0, 6)} />
            </motion.div>
        </div>
    );
};

export default AdminDashboardHome;
