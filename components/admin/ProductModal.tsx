

import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, onSave, product }) => {
    const [formData, setFormData] = useState(product || {});

    useEffect(() => {
        setFormData(product || {});
    }, [product]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{product ? 'Edit Product' : 'Add Product'}</h3>
                        <div className="mt-2">
                            <form>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                                        <input type="number" name="price" id="price" value={formData.price || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                                        <input type="number" name="stock" id="stock" value={formData.stock || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                    <input type="text" name="category" id="category" value={formData.category || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                                    <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button onClick={handleSave} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
                        <button onClick={onClose} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
