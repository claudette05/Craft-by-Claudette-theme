import * as React from 'react';
import { motion } from 'framer-motion';
import { Category, Product } from '../../../types';
import { TrashIcon } from '../../Icons';

interface AdminCategoriesPageProps {
    categories: Category[];
    products: Product[];
    onAddCategory: () => void;
    onEditCategory: (category: Category) => void;
    onDeleteCategory: (categoryId: number) => void;
}

const CategoryRow: React.FC<{ category: Category; productCount: number; index: number; onEdit: () => void; onDelete: () => void; }> = ({ category, productCount, index, onEdit, onDelete }) => {
    return (
        <motion.tr
            className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <td className="p-4">
                <img src={category.imageUrl} alt={category.name} className="w-12 h-12 object-cover rounded-md" />
            </td>
            <th scope="row" className="px-6 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap">
                {category.name}
            </th>
            <td className="px-6 py-4">{productCount}</td>
            <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                <button onClick={onEdit} className="font-medium text-amber-600 hover:underline">Edit</button>
                <button onClick={onDelete} className="text-zinc-400 hover:text-red-500"><TrashIcon /></button>
            </td>
        </motion.tr>
    );
};

const AdminCategoriesPage: React.FC<AdminCategoriesPageProps> = ({ categories, products, onAddCategory, onEditCategory, onDeleteCategory }) => {
    const productCounts = React.useMemo(() => {
        const counts = new Map<string, number>();
        products.forEach(p => {
            counts.set(p.category, (counts.get(p.category) || 0) + 1);
        });
        return counts;
    }, [products]);

    return (
        <div>
            <header className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Categories</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Organize your products into categories.</p>
                </div>
                <button onClick={onAddCategory} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Add New Category
                </button>
            </header>

            <div className="bg-[var(--bg-secondary)] p-2 sm:p-6 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                        <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-tertiary)]">
                            <tr>
                                <th scope="col" className="p-4">Image</th>
                                <th scope="col" className="px-6 py-3">Category Name</th>
                                <th scope="col" className="px-6 py-3">Product Count</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <CategoryRow 
                                    key={category.id} 
                                    category={category} 
                                    productCount={productCounts.get(category.name) || 0}
                                    index={index} 
                                    onEdit={() => onEditCategory(category)}
                                    onDelete={() => onDeleteCategory(category.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoriesPage;