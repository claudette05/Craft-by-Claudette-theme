
import React, { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import ProductModal from './ProductModal';

const Products = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const functions = getFunctions();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const getProducts = httpsCallable(functions, 'getProducts');
        const result = await getProducts();
        setProducts(result.data);
    };

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (productId) => {
        const deleteProduct = httpsCallable(functions, 'deleteProduct');
        await deleteProduct({ id: productId });
        fetchProducts();
    };

    const handleSaveProduct = async (productData) => {
        if (productData.id) {
            const updateProduct = httpsCallable(functions, 'updateProduct');
            await updateProduct(productData);
        } else {
            const createProduct = httpsCallable(functions, 'createProduct');
            await createProduct(productData);
        }
        fetchProducts();
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Products</h2>
                <button onClick={handleAddProduct} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Product
                </button>
            </div>
            <div className="bg-white shadow-md rounded my-6">
                <table className="min-w-max w-full table-auto">
                    {/* ... table headers ... */}
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                                {/* ... table cells ... */}
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                        <button onClick={() => handleEditProduct(product)} className="w-6 h-6 mr-2 transform hover:text-purple-500 hover:scale-110">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
</svg>
                                        </button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="w-6 h-6 transform hover:text-red-500 hover:scale-110">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
</svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ProductModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveProduct} 
                product={selectedProduct} 
            />
        </div>
    );
};

export default Products;
