import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../../../types';
import Toggle from './Toggle';
import { TrashIcon, XIcon } from '../../../constants';

interface ProductFormProps {
    product: Product | null;
    onSave: (product: Product) => void;
    onCancel: () => void;
}

const emptyProduct: Omit<Product, 'id'> = {
    name: '',
    price: 0,
    salePrice: undefined,
    imageUrl: 'https://placehold.co/600x400/FFF0E6/F97316?text=Image',
    category: 'Earrings',
    description: '',
    stock: 0,
    variants: [],
    tags: [],
    published: true,
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">{label}</label>
        <input id={id} {...props} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2" />
    </div>
);

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Product | Omit<Product, 'id'>>(product || emptyProduct);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
    };

    const handlePublishedChange = (published: boolean) => {
        setFormData(prev => ({ ...prev, published }));
    };
    
    const handleVariantChange = (variantId: string, field: keyof ProductVariant, value: string | number) => {
        const updatedVariants = formData.variants?.map(v => 
            v.id === variantId ? { ...v, [field]: value } : v
        );
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    const addVariant = () => {
        const newVariant: ProductVariant = { id: `new-${Date.now()}`, color: '', size: '', stock: 0 };
        setFormData(prev => ({ ...prev, variants: [...(prev.variants || []), newVariant] }));
    };
    
    const removeVariant = (variantId: string) => {
        setFormData(prev => ({ ...prev, variants: prev.variants?.filter(v => v.id !== variantId) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Product);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <Input label="Product Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)]">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2"></textarea>
                    </div>
                </div>
                <div>
                    <img src={formData.imageUrl} alt="Product preview" className="rounded-lg shadow-sm w-full aspect-square object-cover"/>
                    <Input label="Image URL" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input label="Price" id="price" name="price" type="number" value={formData.price} onChange={handleChange} step="0.01" />
                <Input label="Sale Price" id="salePrice" name="salePrice" type="number" value={formData.salePrice || ''} onChange={handleChange} step="0.01" />
                <Input label="Stock" id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} />
                <div>
                     <label htmlFor="category" className="block text-sm font-medium text-[var(--text-secondary)]">Category</label>
                     <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2">
                         <option>Earrings</option>
                         <option>Bracelets</option>
                         <option>Necklaces</option>
                         <option>Resin</option>
                         <option>Keychains</option>
                     </select>
                </div>
            </div>
            
            <div>
                 <h3 className="text-md font-semibold text-[var(--text-primary)] mb-2">Variants</h3>
                 <div className="space-y-2">
                     {formData.variants?.map(variant => (
                         <div key={variant.id} className="grid grid-cols-10 gap-2 items-center">
                            <input value={variant.color} onChange={e => handleVariantChange(variant.id, 'color', e.target.value)} placeholder="Color" className="col-span-3 mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2" />
                             <input value={variant.size} onChange={e => handleVariantChange(variant.id, 'size', e.target.value)} placeholder="Size" className="col-span-3 mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2" />
                             <input value={variant.stock} onChange={e => handleVariantChange(variant.id, 'stock', parseInt(e.target.value) || 0)} type="number" placeholder="Stock" className="col-span-3 mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2" />
                             <button type="button" onClick={() => removeVariant(variant.id)} className="text-zinc-400 hover:text-red-500"><TrashIcon /></button>
                         </div>
                     ))}
                 </div>
                 <button type="button" onClick={addVariant} className="mt-2 text-sm font-medium text-amber-600 hover:text-amber-500">+ Add Variant</button>
            </div>

            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-700/50 p-4 rounded-lg">
                <span className="font-medium text-[var(--text-primary)]">Published</span>
                <Toggle enabled={formData.published} setEnabled={handlePublishedChange} />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-[var(--border-primary)]">
                <button type="button" onClick={onCancel} className="bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 text-zinc-800 dark:text-zinc-200 font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Save Product</button>
            </div>
        </form>
    );
};

export default ProductForm;