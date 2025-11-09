import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, AdminOrder, AdminCustomer, Promotion, ToastMessage } from '@/types';
import { PRODUCTS } from '@/constants';
import { MOCK_ORDERS, MOCK_CUSTOMERS, MOCK_PROMOTIONS } from '@/constants/adminConstants';
import AdminSidebar from './admin/AdminSidebar';
import AdminDashboardHome from './admin/pages/AdminDashboardHome';
import AdminProductsPage from './admin/pages/AdminProductsPage';
import AdminOrdersPage from './admin/pages/AdminOrdersPage';
import AdminCustomersPage from './admin/pages/AdminCustomersPage';
import AdminSettingsPage from './admin/pages/AdminSettingsPage';
import AdminPromotionsPage from './admin/pages/AdminPromotionsPage';
import AdminAnalyticsPage from './admin/pages/AdminAnalyticsPage';
import AdminContentPage from './admin/pages/AdminContentPage';
import Modal from './admin/ui/Modal';
import ProductForm from './admin/ui/ProductForm';
import Toast from './admin/ui/Toast';

type Page = 'shop' | 'cart' | 'login' | 'signup' | 'admin';
type AdminPage = 'dashboard' | 'products' | 'orders' | 'customers' | 'promotions' | 'analytics' | 'content' | 'settings';

interface AdminDashboardProps {
    onNavigate: (page: Page) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
    const [activePage, setActivePage] = useState<AdminPage>('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Data states
    const [products, setProducts] = useState<Product[]>(PRODUCTS);
    const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS);
    const [customers, setCustomers] = useState<AdminCustomer[]>(MOCK_CUSTOMERS);
    const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);

    // UI states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = (productData: Product) => {
        if (editingProduct) { // Update existing
            setProducts(products.map(p => p.id === productData.id ? productData : p));
            addToast('Product updated successfully!');
        } else { // Add new
            const newProduct = { ...productData, id: Date.now() }; // Mock ID
            setProducts([newProduct, ...products]);
            addToast('Product added successfully!');
        }
        handleCloseModal();
    };

    const handleDeleteProduct = (productId: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== productId));
            addToast('Product deleted!', 'info');
        }
    };

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard': return <AdminDashboardHome />;
            case 'products': return <AdminProductsPage products={products} onAddProduct={handleOpenAddModal} onEditProduct={handleOpenEditModal} onDeleteProduct={handleDeleteProduct} />;
            case 'orders': return <AdminOrdersPage orders={orders} />;
            case 'customers': return <AdminCustomersPage customers={customers} />;
            case 'promotions': return <AdminPromotionsPage promotions={promotions} />;
            case 'analytics': return <AdminAnalyticsPage />;
            case 'content': return <AdminContentPage />;
            case 'settings': return <AdminSettingsPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
            default: return <AdminDashboardHome />;
        }
    };

    return (
        <div className={isDarkMode ? '' : ''}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
            >
                <div className="flex">
                    <AdminSidebar 
                        activePage={activePage} 
                        setActivePage={setActivePage} 
                        isCollapsed={isCollapsed} 
                        setIsCollapsed={setIsCollapsed} 
                    />
                    <main className={`flex-1 p-6 md:p-10 ml-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'sm:ml-20' : 'sm:ml-64'}`}>
                        <div className="pt-20 sm:pt-0"> {/* Adjust padding for mobile */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activePage}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </main>
                </div>
                
                <AnimatePresence>
                    {isModalOpen && (
                        <Modal
                            title={editingProduct ? 'Edit Product' : 'Add New Product'}
                            onClose={handleCloseModal}
                        >
                            <ProductForm 
                                product={editingProduct}
                                onSave={handleSaveProduct}
                                onCancel={handleCloseModal}
                            />
                        </Modal>
                    )}
                </AnimatePresence>
                
                <div className="fixed top-5 right-5 z-[100]">
                    <AnimatePresence>
                        {toasts.map(toast => (
                            <Toast key={toast.id} message={toast.message} type={toast.type} />
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;