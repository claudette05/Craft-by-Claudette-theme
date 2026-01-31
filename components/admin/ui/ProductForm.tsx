
import * as React from 'react';
import { Product, ProductVariant } from '../../../types';
import Toggle from './Toggle';
import { TrashIcon, PhotoIcon } from '../../Icons';
import { useAppContext } from '../../../context/AppContext';

interface ProductFormProps {
    product: Product | null;
    onSave: (product: Product, imageFile?: File, additionalImageFiles?: File[]) => Promise<void> | void;
    onCancel: () => void;
}

interface GalleryItem {
    id: string;
    url: string;
    file?: File;
}

const emptyProduct: Omit<Product, 'id'> = {
    name: '',
    price: 0,
    salePrice: undefined,
    imageUrl: 'https://placehold.co/600x400/FFF0E6/F97316?text=Image',
    images: [],
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
        <input id={id} {...props} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 text-[var(--text-primary)]" />
    </div>
);

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
    const { uploadImage, addToast, categories } = useAppContext();
    const [formData, setFormData] = React.useState<Product | Omit<Product, 'id'>>(product || emptyProduct);
    const [tagInput, setTagInput] = React.useState('');
    
    // Main image state
    const [imageFile, setImageFile] = React.useState<File | undefined>();
    const [imagePreview, setImagePreview] = React.useState(product?.imageUrl || emptyProduct.imageUrl);
    
    // Additional gallery state - Unified for better management
    const [galleryItems, setGalleryItems] = React.useState<GalleryItem[]>(() => {
        if (product && Array.isArray(product.images)) {
            return product.images.filter(url => typeof url === 'string' && url.trim() !== '').map(url => ({ 
                id: `existing-${url}`, 
                url 
            }));
        }
        return [];
    });

    const [isSaving, setIsSaving] = React.useState(false);
    const [uploadingVariants, setUploadingVariants] = React.useState<Set<string>>(new Set());
    
    const mainFileInputRef = React.useRef<HTMLInputElement>(null);
    const additionalFilesInputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        const parsedValue = isNumber ? parseFloat(value) || undefined : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files) as File[];
            const newItems: GalleryItem[] = files.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                url: URL.createObjectURL(file),
                file: file
            }));
            
            setGalleryItems(prev => [...prev, ...newItems]);
        }
    };

    const handleRemoveGalleryItem = (id: string) => {
        setGalleryItems(prev => prev.filter(item => item.id !== id));
    };

    const handlePublishedChange = () => {
        setFormData(prev => ({ ...prev, published: !prev.published }));
    };
    
    const handleVariantChange = (variantId: string, field: keyof ProductVariant, value: string | number) => {
        const updatedVariants = formData.variants?.map(v => 
            v.id === variantId ? { ...v, [field]: value } : v
        );
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    const handleVariantImageChange = async (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingVariants(prev => new Set(prev).add(variantId));
            
            try {
                addToast('Uploading variant image...', 'info');
                const url = await uploadImage(file);
                handleVariantChange(variantId, 'imageUrl', url);
                addToast('Variant image updated');
            } catch (err: any) {
                addToast(err.message || 'Variant upload failed', 'error');
            } finally {
                setUploadingVariants(prev => {
                    const next = new Set(prev);
                    next.delete(variantId);
                    return next;
                });
            }
        }
    };

    const addVariant = () => {
        const newVariant: ProductVariant = { id: `new-${Date.now()}`, color: '', colorHex: '#000000', size: '', stock: 0, imageUrl: '' };
        setFormData(prev => ({ ...prev, variants: [...(prev.variants || []), newVariant] }));
    };
    
    const removeVariant = (variantId: string) => {
        setFormData(prev => ({ ...prev, variants: prev.variants?.filter(v => v.id !== variantId) }));
    };

    const handleAddTag = () => {
        const newTag = tagInput.trim().toLowerCase();
        if (newTag && !formData.tags?.includes(newTag)) {
            setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
        }
        setTagInput('');
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag !== tagToRemove) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Split gallery items into existing URLs and new Files
        const existingImageUrls = galleryItems.filter(item => !item.file).map(item => item.url);
        const newImageFiles = galleryItems.filter(item => item.file).map(item => item.file as File);
        
        // Update product data with existing URLs before sending to parent
        const finalProductData = {
            ...formData,
            images: existingImageUrls
        } as Product;

        try {
            await onSave(finalProductData, imageFile, newImageFiles);
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Product Info Section */}
                <div className="md:col-span-2 space-y-4">
                    <Input label="Product Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)]">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 text-[var(--text-primary)]"></textarea>
                    </div>
                </div>

                {/* Main Image & Additional Images Section */}
                <div>
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Main Image</h2>
                    <img src={imagePreview} alt="Product preview" className="rounded-lg shadow-sm w-full aspect-square object-cover mb-2"/>
                    <input type="file" accept="image/*" ref={mainFileInputRef} onChange={handleMainImageChange} className="hidden" />
                    <button type="button" onClick={() => mainFileInputRef.current?.click()} className="w-full text-sm text-center py-2 bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 rounded-md text-[var(--text-primary)] transition-colors">Change Main Image</button>
                    
                    <div className="mt-6">
                        <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Product Gallery</h2>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            {galleryItems.map((item) => (
                                <div key={item.id} className="relative group">
                                    <img src={item.url} alt="Gallery item" className="rounded-md shadow-sm w-full aspect-square object-cover"/>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveGalleryItem(item.id)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                    >
                                        <TrashIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input type="file" accept="image/*" ref={additionalFilesInputRef} onChange={handleAdditionalImagesChange} className="hidden" multiple />
                        <button type="button" onClick={() => additionalFilesInputRef.current?.click()} className="w-full text-sm text-center py-2 bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 rounded-md text-[var(--text-primary)] transition-colors">Add to Gallery</button>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input label="Price" id="price" name="price" type="number" value={formData.price} onChange={handleChange} step="0.01" />
                <Input label="Sale Price" id="salePrice" name="salePrice" type="number" value={formData.salePrice || ''} onChange={handleChange} step="0.01" placeholder="Optional" />
                <Input label="Stock" id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} />
                <div>
                     <label htmlFor="category" className="block text-sm font-medium text-[var(--text-secondary)]">Category</label>
                     <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 text-[var(--text-primary)]">
                         {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                         ))}
                     </select>
                </div>
            </div>
            
             <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)]">Tags</label>
                <div className="flex items-center gap-2 mt-1">
                    <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Add a tag and press Enter"
                        className="block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 text-[var(--text-primary)]"
                    />
                    <button type="button" onClick={handleAddTag} className="bg-amber-500 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-amber-600 transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags?.map(tag => (
                        <span key={tag} className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-medium px-2.5 py-1 rounded-full">
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg">
                 <h3 className="text-md font-semibold text-[var(--text-primary)] mb-4">Product Variants</h3>
                 
                 {formData.variants && formData.variants.length > 0 && (
                     <div className="grid grid-cols-12 gap-2 mb-2 px-1 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                         <div className="col-span-3">Color</div>
                         <div className="col-span-1 text-center">Hex</div>
                         <div className="col-span-3">Size</div>
                         <div className="col-span-2">Stock</div>
                         <div className="col-span-2 text-center">Image</div>
                         <div className="col-span-1 text-center">Action</div>
                     </div>
                 )}

                 <div className="space-y-3">
                     {formData.variants?.map(variant => (
                         <div key={variant.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-3">
                                <input 
                                    value={variant.color} 
                                    onChange={e => handleVariantChange(variant.id, 'color', e.target.value)} 
                                    placeholder="Color" 
                                    className="block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 text-[var(--text-primary)]" 
                                />
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <input 
                                    type="color" 
                                    value={variant.colorHex || '#000000'} 
                                    onChange={e => handleVariantChange(variant.id, 'colorHex', e.target.value)} 
                                    className="h-9 w-9 p-0 border-0 rounded-full cursor-pointer bg-transparent overflow-hidden" 
                                    title="Choose Hex Color"
                                />
                            </div>
                            <div className="col-span-3">
                                <input 
                                    value={variant.size} 
                                    onChange={e => handleVariantChange(variant.id, 'size', e.target.value)} 
                                    placeholder="Size" 
                                    className="block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 text-[var(--text-primary)]" 
                                />
                            </div>
                            <div className="col-span-2">
                                <input 
                                    value={variant.stock} 
                                    onChange={e => handleVariantChange(variant.id, 'stock', parseInt(e.target.value) || 0)} 
                                    type="number" 
                                    placeholder="Qty" 
                                    className="block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 text-[var(--text-primary)]" 
                                />
                            </div>
                            <div className="col-span-2 flex justify-center">
                                <label className="relative cursor-pointer group w-10 h-10 rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 flex items-center justify-center hover:border-amber-500 transition-colors">
                                    {uploadingVariants.has(variant.id) ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent"></div>
                                    ) : variant.imageUrl ? (
                                        <img src={variant.imageUrl} alt="Variant" className="w-full h-full object-cover" />
                                    ) : (
                                        <PhotoIcon className="w-5 h-5 text-zinc-400 group-hover:text-amber-500" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                         <PhotoIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => handleVariantImageChange(variant.id, e)}
                                        disabled={uploadingVariants.has(variant.id)}
                                    />
                                </label>
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <button 
                                    type="button" 
                                    onClick={() => removeVariant(variant.id)} 
                                    className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                    title="Remove Variant"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                         </div>
                     ))}
                 </div>
                 
                 <button 
                    type="button" 
                    onClick={addVariant} 
                    className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-500 transition-colors"
                >
                    <span className="text-lg font-bold">+</span> Add Variant
                </button>
            </div>

            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-700/50 p-4 rounded-lg">
                <span className="font-medium text-[var(--text-primary)]">Published</span>
                <Toggle enabled={formData.published} onToggle={handlePublishedChange} />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-[var(--border-primary)]">
                <button type="button" disabled={isSaving} onClick={onCancel} className="bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 text-zinc-800 dark:text-zinc-200 font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70">
                    {isSaving ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Saving Product...
                        </>
                    ) : 'Save Product'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
