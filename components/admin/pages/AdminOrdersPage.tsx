import * as React from 'react';
import { motion } from 'framer-motion';
import { AdminOrder, OrderStatus } from '../../../types';

const statusColorMap: Record<OrderStatus, string> = {
    Completed: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
};

const OrderRow: React.FC<{ order: AdminOrder, index: number }> = ({ order, index }) => (
    <motion.tr
        className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
    >
        <th scope="row" className="px-6 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap">
            {order.id}
        </th>
        <td className="px-6 py-4">{order.customerName}</td>
        <td className="px-6 py-4">{order.date}</td>
        <td className="px-6 py-4">GH₵{order.total.toFixed(2)}</td>
        <td className="px-6 py-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[order.status]}`}>
                {order.status}
            </span>
        </td>
        <td className="px-6 py-4 text-right">
            <a href="#" className="font-medium text-amber-600 hover:underline">View Details</a>
        </td>
    </motion.tr>
);

interface AdminOrdersPageProps {
    orders: AdminOrder[];
}

const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ orders }) => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Orders</h1>
                <p className="text-[var(--text-secondary)] mt-1">View and manage all customer orders.</p>
            </header>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                        <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-tertiary)]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Order ID</th>
                                <th scope="col" className="px-6 py-3">Customer</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Total</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <OrderRow key={order.id} order={order} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;