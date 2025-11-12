import * as React from 'react';
import { motion } from 'framer-motion';
import { AdminCustomer } from '../../../types';

const CustomerRow: React.FC<{ customer: AdminCustomer, index: number }> = ({ customer, index }) => (
    <motion.tr
        className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
    >
        <td className="px-6 py-4">
            <div className="flex items-center">
                <img className="w-10 h-10 rounded-full" src={customer.avatarUrl} alt={customer.name} />
                <div className="pl-3">
                    <div className="text-base font-semibold text-[var(--text-primary)]">{customer.name}</div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4">{customer.email}</td>
        <td className="px-6 py-4">{customer.orders}</td>
        <td className="px-6 py-4 font-semibold">GH₵{customer.totalSpent.toFixed(2)}</td>
        <td className="px-6 py-4 text-right">
            <a href="#" className="font-medium text-amber-600 hover:underline">View Profile</a>
        </td>
    </motion.tr>
);

interface AdminCustomersPageProps {
    customers: AdminCustomer[];
}

const AdminCustomersPage: React.FC<AdminCustomersPageProps> = ({ customers }) => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Customers</h1>
                <p className="text-[var(--text-secondary)] mt-1">View and manage your customer list.</p>
            </header>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                        <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-tertiary)]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Customer</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Orders</th>
                                <th scope="col" className="px-6 py-3">Total Spent</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
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