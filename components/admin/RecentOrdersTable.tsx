import * as React from 'react';
import { AdminOrder, OrderStatus } from '../../types';

interface RecentOrdersTableProps {
    orders: AdminOrder[];
}

const statusColorMap: Record<OrderStatus, string> = {
    Completed: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
    // FIX: Added 'Shipped' to satisfy the OrderStatus type.
    Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
};

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
    return (
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-tertiary)]">
                        <tr>
                            <th scope="col" className="px-6 py-3">Order ID</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-[var(--border-primary)] last:border-b-0 hover:bg-[var(--bg-tertiary)]">
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrdersTable;