
import * as React from 'react';
import { motion } from 'framer-motion';
import { MOCK_ORDERS } from '../../adminConstants';
import { AdminOrder, OrderStatus } from '../../types';

const statusColorMap: Record<OrderStatus, string> = {
    Completed: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
};

const OrderRow: React.FC<{ order: AdminOrder, index: number }> = ({ order, index }) => (
    <motion.tr
        className="border-b border-pink-200 dark:border-border-primary last:border-b-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
    >
        <th scope="row" className="px-4 sm:px-6 py-4 font-medium text-text-primary whitespace-nowrap">
            {order.id}
        </th>
        <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">{order.date}</td>
        <td className="px-4 sm:px-6 py-4">GH₵{order.total.toFixed(2)}</td>
        <td className="px-4 sm:px-6 py-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[order.status]}`}>
                {order.status}
            </span>
        </td>
        <td className="px-4 sm:px-6 py-4 text-right">
            <a href="#" className="font-medium text-accent-primary hover:underline text-sm">View</a>
        </td>
    </motion.tr>
);

const AccountOrderHistory: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Order History</h2>
            {MOCK_ORDERS.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text-primary uppercase bg-pink-100/50 dark:bg-bg-tertiary">
                            <tr>
                                <th scope="col" className="px-4 sm:px-6 py-3">Order</th>
                                <th scope="col" className="px-4 sm:px-6 py-3 hidden sm:table-cell">Date</th>
                                <th scope="col" className="px-4 sm:px-6 py-3">Total</th>
                                <th scope="col" className="px-4 sm:px-6 py-3">Status</th>
                                <th scope="col" className="px-4 sm:px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_ORDERS.map((order, index) => (
                                <OrderRow key={order.id} order={order} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-text-secondary">You haven't placed any orders yet.</p>
            )}
        </div>
    );
};

export default AccountOrderHistory;
