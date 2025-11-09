import React from 'react';
import { motion } from 'framer-motion';
import { Promotion } from '../../../types';

const statusColorMap = {
    Active: 'bg-green-100 text-green-800',
    Expired: 'bg-zinc-200 text-zinc-800',
    Scheduled: 'bg-blue-100 text-blue-800',
};

const PromotionRow: React.FC<{ promo: Promotion, index: number }> = ({ promo, index }) => (
     <motion.tr
        className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
    >
        <td className="px-6 py-4 font-mono text-sm font-medium text-[var(--text-primary)]">{promo.code}</td>
        <td className="px-6 py-4">{promo.type} ({promo.type === 'Percentage' ? `${promo.value}%` : `GH₵${promo.value.toFixed(2)}`})</td>
        <td className="px-6 py-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[promo.status]}`}>
                {promo.status}
            </span>
        </td>
        <td className="px-6 py-4">{promo.usageCount}</td>
        <td className="px-6 py-4 text-right">
             <button className="font-medium text-amber-600 hover:underline">Edit</button>
        </td>
    </motion.tr>
);

interface AdminPromotionsPageProps {
    promotions: Promotion[];
}

const AdminPromotionsPage: React.FC<AdminPromotionsPageProps> = ({ promotions }) => {
    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Promotions</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage discount codes and promotions.</p>
                </div>
                 <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Create Promotion
                </button>
            </header>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                        <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-tertiary)]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Code</th>
                                <th scope="col" className="px-6 py-3">Type/Value</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Used</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map((promo, index) => (
                                <PromotionRow key={promo.id} promo={promo} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPromotionsPage;