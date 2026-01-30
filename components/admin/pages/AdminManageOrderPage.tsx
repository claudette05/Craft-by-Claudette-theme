
import * as React from 'react';
import { AdminOrder, OrderStatus } from '../../../types';

interface AdminManageOrderPageProps {
    order: AdminOrder | null;
    onUpdateStatus: (newStatus: OrderStatus) => void;
}

const statusOptions: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

const AdminManageOrderPage: React.FC<AdminManageOrderPageProps> = ({ order, onUpdateStatus }) => {
    if (!order) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select an order to view details</p>
            </div>
        );
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdateStatus(e.target.value as OrderStatus);
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Manage Order #{order.id.slice(-6)}</h2>
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{order.customerName}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">GH₵{order.total.toFixed(2)}</p>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={order.status}
                        onChange={handleStatusChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                        {statusOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default AdminManageOrderPage;
