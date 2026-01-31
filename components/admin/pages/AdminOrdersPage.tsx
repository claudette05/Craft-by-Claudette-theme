
import * as React from 'react';
import { motion } from 'framer-motion';
import { AdminOrder, OrderStatus } from '../../../types';
import { useAppContext } from '../../../context/AppContext';

const statusColorMap: Record<OrderStatus, string> = {
    Completed: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
    Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
};

const OrderRow: React.FC<{ order: AdminOrder, index: number, onCopyId: (id: string) => void }> = ({ order, index, onCopyId }) => (
    <motion.tr
        className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
    >
        <th scope="row" className="px-6 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap">
            <div className="flex items-center gap-2">
                <span className="font-mono text-xs">{order.id}</span>
                <button 
                    onClick={() => onCopyId(order.id)}
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors text-[var(--text-secondary)]"
                    title="Copy Order ID"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                </button>
            </div>
        </th>
        <td className="px-6 py-4">{order.customerName}</td>
        <td className="px-6 py-4">{order.date}</td>
        <td className="px-6 py-4 font-bold">GH₵{order.total.toFixed(2)}</td>
        <td className="px-6 py-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[order.status]}`}>
                {order.status}
            </span>
        </td>
        <td className="px-6 py-4 text-right">
            <a href="#" className="font-medium text-amber-600 hover:underline">Manage</a>
        </td>
    </motion.tr>
);

interface AdminOrdersPageProps {
    orders: AdminOrder[];
}

const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ orders }) => {
    const { addToast } = useAppContext();

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        addToast(`Order ID ${id} copied!`, 'info');
    };

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Orders</h1>
                <p className="text-[var(--text-secondary)] mt-1">Bookkeeping and fulfillment for all customer transactions.</p>
            </header>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm border border-[var(--border-primary)]">
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
                            {orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <OrderRow key={order.id} order={order} index={index} onCopyId={handleCopyId} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                                        No orders recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
