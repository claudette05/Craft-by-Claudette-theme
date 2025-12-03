
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../../types';
import { TrashIcon } from '../../Icons';

interface AdminProductsPageProps {
    products: Product[];
    onAddProduct: () => void;
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
}

const ProductRow: React.FC<{ 
    product: Product; 
    index: number; 
    onEdit: () => void; 
    onDelete: () => void;
    isSelected: boolean;
    onToggleSelect: () => void;
}> = ({ product, index, onEdit, onDelete, isSelected, onToggleSelect }) => {
    const stockStatus = product.stock > 10 ? 'In Stock' : (product.stock > 0 ? 'Low Stock' : 'Out of Stock');
    const stockColor = product.stock > 10 ? 'bg-green-100 text-green-800' : (product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800');
    const publishedStatus = product.published ? 'Published' : 'Draft';
    const publishedColor = product.published ? 'bg-blue-100 text-blue-800' : 'bg-zinc-200 text-zinc-800';

    return (
        <motion.tr
            className={`border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors ${isSelected ? 'bg-amber-50 dark:bg-amber-900/10' : 'bg-[var(--bg-secondary)]'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <td className="p-4">
                <input 
                    type="checkbox" 
                    checked={isSelected} 
                    onChange={onToggleSelect}
                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                />
            </td>
            <td className="p-4">
                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
            </td>
            <th scope="row" className="px-6 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap">
                {product.name}
            </th>
            <td className="px-6 py-4 font-semibold">GH₵{(product.salePrice ?? product.price).toFixed(2)}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockColor}`}>
                    {stockStatus} ({product.stock})
                </span>
            </td>
             <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${publishedColor}`}>
                    {publishedStatus}
                </span>
            </td>
            <td className="px-6 py-4">{product.category}</td>
            <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                <button onClick={onEdit} className="font-medium text-amber-600 hover:underline">Edit</button>
                <button onClick={onDelete} className="text-zinc-400 hover:text-red-500"><TrashIcon /></button>
            </td>
        </motion.tr>
    );
};

const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ products, onAddProduct, onEditProduct, onDeleteProduct }) => {
    const [sortKey, setSortKey] = React.useState('name-asc');
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

    const sortedProducts = React.useMemo(() => {
        return [...products].sort((a, b) => {
            switch (sortKey) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'price-asc': return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
                case 'price-desc': return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
                case 'stock-asc': return a.stock - b.stock;
                case 'stock-desc': return b.stock - a.stock;
                case 'category-asc': return a.category.localeCompare(b.category);
                default: return 0;
            }
        });
    }, [products, sortKey]);
    
    const sortOptions = [
        { value: 'name-asc', label: 'Name' },
        { value: 'price-asc', label: 'Price (Low to High)' },
        { value: 'price-desc', label: 'Price (High to Low)' },
        { value: 'stock-asc', label: 'Stock (Ascending)' },
        { value: 'stock-desc', label: 'Stock (Descending)' },
        { value: 'category-asc', label: 'Category' },
    ];

    const toggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p.id));
        }
    };

    const toggleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Delete ${selectedIds.length} products?`)) {
            selectedIds.forEach(id => onDeleteProduct(id));
            setSelectedIds([]);
        }
    };

    // Note: Actual bulk update logic would need to be bubbled up to parent or context in a real app
    // Here we simulate it
    const handleBulkPublish = (publish: boolean) => {
        alert(`${publish ? 'Published' : 'Unpublished'} ${selectedIds.length} items (Mock Action)`);
        setSelectedIds([]);
    };

    return (
        <div className="relative pb-20">
            <header className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Products</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage your inventory and product details.</p>
                </div>
            </header>
            
            <div className="flex flex-col gap-4 items-stretch sm:flex-row sm:items-center sm:justify-between mb-4">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <label htmlFor="sort-products" className="text-sm font-medium text-[var(--text-secondary)] mr-2 whitespace-nowrap">Sort by:</label>
                        <select
                            id="sort-products"
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                            className="w-full sm:w-auto text-sm rounded-lg border-zinc-300 dark:border-zinc-600 bg-[var(--bg-secondary)] shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 text-[var(--text-primary)]"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button onClick={onAddProduct} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Add New Product
                </button>
            </div>

            <div className="bg-[var(--bg-secondary)] p-2 sm:p-6 rounded-lg shadow-sm border border-[var(--border-primary)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                        <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-tertiary)]">
                            <tr>
                                <th scope="col" className="p-4">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.length === products.length && products.length > 0} 
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                                    />
                                </th>
                                <th scope="col" className="p-4">Image</th>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Stock</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProducts.map((product, index) => (
                                <ProductRow 
                                    key={product.id} 
                                    product={product} 
                                    index={index} 
                                    onEdit={() => onEditProduct(product)}
                                    onDelete={() => onDeleteProduct(product.id)}
                                    isSelected={selectedIds.includes(product.id)}
                                    onToggleSelect={() => toggleSelectOne(product.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-800 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-6"
                    >
                        <span className="font-medium text-sm">{selectedIds.length} Selected</span>
                        <div className="h-4 w-px bg-zinc-600"></div>
                        <button onClick={() => handleBulkPublish(true)} className="text-sm hover:text-green-400 font-medium">Publish</button>
                        <button onClick={() => handleBulkPublish(false)} className="text-sm hover:text-amber-400 font-medium">Unpublish</button>
                        <button onClick={handleBulkDelete} className="text-sm hover:text-red-400 font-medium flex items-center gap-1">
                            <TrashIcon className="w-4 h-4" /> Delete
                        </button>
                        <button onClick={() => setSelectedIds([])} className="text-xs text-zinc-400 hover:text-white ml-2">Cancel</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProductsPage;
