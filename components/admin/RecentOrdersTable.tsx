import React from 'react';
import { AdminOrder, OrderStatus } from '../../types';

interface RecentOrdersTableProps {
    orders: AdminOrder[];
}

const statusColorMap: Record<OrderStatus, string> = {
    Completed: 'bg-green-100 text-green-800',
    Processing: 'bg-blue-100 text-blue-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800',
};

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-800 mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-zinc-500">
                    <thead className="text-xs text-zinc-700 uppercase bg-zinc-50">
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
                            <tr key={order.id} className="bg-white border-b hover:bg-zinc-50">
                                <th scope="row" className="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap">
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