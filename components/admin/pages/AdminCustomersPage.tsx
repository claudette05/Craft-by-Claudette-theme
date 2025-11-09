import React from 'react';
import { motion } from 'framer-motion';
import { AdminCustomer } from '../../../types';

const CustomerRow: React.FC<{ customer: AdminCustomer, index: number }> = ({ customer, index }) => (
    <motion.tr
        className="bg-white border-b hover:bg-zinc-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
    >
        <td className="px-6 py-4">
            <div className="flex items-center">
                <img className="w-10 h-10 rounded-full" src={customer.avatarUrl} alt={customer.name} />
                <div className="pl-3">
                    <div className="text-base font-semibold text-zinc-900">{customer.name}</div>
                    <div className="font-normal text-zinc-500">{customer.email}</div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4">{customer.orders}</td>
        <td className="px-6 py-4 font-semibold">GH₵{customer.totalSpent.toFixed(2)}</td>
        <td className="px-6 py-4 text-right">
            <a href="#" className="font-medium text-amber-600 hover:underline">View Profile</a>
        </td>
    </motion.tr>
);

// FIX: Add props interface to accept customers from parent component
interface AdminCustomersPageProps {
    customers: AdminCustomer[];
}

const AdminCustomersPage: React.FC<AdminCustomersPageProps> = ({ customers }) => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-800">Customers</h1>
                <p className="text-zinc-500 mt-1">Manage your customer database.</p>
            </header>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-zinc-500">
                        <thead className="text-xs text-zinc-700 uppercase bg-zinc-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Customer</th>
                                <th scope="col" className="px-6 py-3">Orders</th>
                                <th scope="col" className="px-6 py-3">Total Spent</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* FIX: Use `customers` prop instead of hardcoded MOCK_CUSTOMERS */}
                            {customers.map((customer, index) => (
                                <CustomerRow key={customer.id} customer={customer} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomersPage;