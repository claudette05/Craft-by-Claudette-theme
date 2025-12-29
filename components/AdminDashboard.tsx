
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, AdminOrder, AdminCustomer, Promotion, ToastMessage, Category, HeroSlide, HomepageSections, Page } from '../types';
import AdminSidebar from './admin/AdminSidebar';
import AdminDashboardHome from './admin/pages/AdminDashboardHome';
import AdminProductsPage from './admin/pages/AdminProductsPage';
import AdminOrdersPage from './admin/pages/AdminOrdersPage';
import AdminCustomersPage from './admin/pages/AdminCustomersPage';
import AdminSettingsPage from './admin/pages/AdminSettingsPage';
import AdminPromotionsPage from './admin/pages/AdminPromotionsPage';
import AdminAnalyticsPage from './admin/pages/AdminAnalyticsPage';
import AdminHeroPage from './admin/pages/AdminHeroPage';
import AdminCategoriesPage from './admin/pages/AdminCategoriesPage';
import AdminHomepagePage from './admin/pages/AdminHomepagePage';
import AdminPopupSettingsPage from './admin/pages/AdminPopupSettingsPage';
import AdminEmailsPage from './admin/pages/AdminEmailsPage'; // Import new page
import Modal from './admin/ui/Modal';
import ProductForm from './admin/ui/ProductForm';
import CategoryForm from './admin/ui/CategoryForm';
import HeroSlideForm from './admin/ui/HeroSlideForm';
import PromotionForm from './admin/ui/PromotionForm';
import Toast from './admin/ui/Toast';
import { HamburgerIcon } from './Icons';

// Fix: Removed local Page type definition that was shadowing and causing conflicts with the central Page type
type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'promotions' | 'analytics' | 'hero' | 'homepage' | 'settings' | 'popup' | 'emails';

interface AdminDashboardProps {
    onNavigate: (page: Page) => void;
    
    products: Product[];
    onSaveProduct: (product: Product, imageFile?: File) => Promise<void> | void;
    onDeleteProduct: (productId: number) => Promise<void> | void;

    categories: Category[];
    onSaveCategory: (category: Category, imageFile?: File) => Promise<void> | void;
    onDeleteCategory: (categoryId: number) => Promise<void> | void;

    heroSlides: HeroSlide[];
    onSaveHeroSlide: (slide: HeroSlide, imageFile?: File) => Promise<void> | void;
    onDeleteHeroSlide: (slideId: number) => Promise<void> | void;

    orders: AdminOrder[];
    customers: AdminCustomer[];
    promotions: Promotion[];
    onSavePromotion: (promotion: Promotion) => void;
    onDeletePromotion: (id: number) => void;
    
    homepageSections: HomepageSections;
    onSaveHomepageSections: (sections: HomepageSections) => Promise<void> | void;

    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const adminPageTitles: Record<AdminPage, string> = {
    dashboard: 'Dashboard',
    products: 'Products',
    categories: 'Categories',
    orders: 'Orders',
    customers: 'Customers',
    promotions: 'Promotions',
    analytics: 'Analytics',
    hero: 'Hero Section',
    homepage: 'Homepage Sections',
    settings: 'Settings',
    popup: 'Popup Manager',
    emails: 'Email Logs',
};

const AdminMobileHeader: React.FC<{ onMenuClick: () => void, title: string }> = ({ onMenuClick, title }) => (
    <div className="sm:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--bg-secondary)] shadow-md z-30 flex items-center px-4 justify-between">
        <button onClick={onMenuClick} className="p-2 text-[var(--text-secondary)]">
            <HamburgerIcon />
        </button>
        <h2 className="text-lg font-bold text-[var(--text-primary)]">{title}</h2>
        <div className="w-8"></div> {/* Spacer */}
    </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const {
        onNavigate, products, onSaveProduct, onDeleteProduct, categories,
        onSaveCategory, onDeleteCategory, heroSlides, onSaveHeroSlide, onDeleteHeroSlide,
        orders, customers, promotions, onSavePromotion, onDeletePromotion,
        homepageSections, onSaveHomepageSections,
        isDarkMode, toggleDarkMode
    } = props;

    const [activePage, setActivePage] = React.useState<AdminPage>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    
    // UI states
    const [isProductModalOpen, setIsProductModalOpen] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
    const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
    const [isHeroModalOpen, setIsHeroModalOpen] = React.useState(false);
    const [editingHeroSlide, setEditingHeroSlide] = React.useState<HeroSlide | null>(null);
    const [isPromotionModalOpen, setIsPromotionModalOpen] = React.useState(false);
    const [editingPromotion, setEditingPromotion] = React.useState<Promotion | null>(null);

    // Product Handlers
    const handleOpenAddProductModal = () => { setEditingProduct(null); setIsProductModalOpen(true); };
    const handleOpenEditProductModal = (product: Product) => { setEditingProduct(product); setIsProductModalOpen(true); };
    const handleCloseProductModal = () => { setIsProductModalOpen(false); setEditingProduct(null); };
    const handleSaveProductWithModal = async (productData: Product, imageFile?: File) => {
        await onSaveProduct(productData, imageFile);
        handleCloseProductModal();
    };

    // Category Handlers
    const handleOpenAddCategoryModal = () => { setEditingCategory(null); setIsCategoryModalOpen(true); };
    const handleOpenEditCategoryModal = (category: Category) => { setEditingCategory(category); setIsCategoryModalOpen(true); };
    const handleCloseCategoryModal = () => { setIsCategoryModalOpen(false); setEditingCategory(null); };
    const handleSaveCategoryWithModal = async (categoryData: Category, imageFile?: File) => {
        await onSaveCategory(categoryData, imageFile);
        handleCloseCategoryModal();
    };

    // Hero Slide Handlers
    const handleOpenAddHeroSlideModal = () => { setEditingHeroSlide(null); setIsHeroModalOpen(true); };
    const handleOpenEditHeroSlideModal = (slide: HeroSlide) => { setEditingHeroSlide(slide); setIsHeroModalOpen(true); };
    const handleCloseHeroModal = () => { setIsHeroModalOpen(false); setEditingHeroSlide(null); };
    const handleSaveHeroSlideWithModal = async (slideData: HeroSlide, imageFile?: File) => {
        await onSaveHeroSlide(slideData, imageFile);
        handleCloseHeroModal();
    };

    // Promotion Handlers
    const handleOpenAddPromotionModal = () => { setEditingPromotion(null); setIsPromotionModalOpen(true); };
    const handleOpenEditPromotionModal = (promotion: Promotion) => { setEditingPromotion(promotion); setIsPromotionModalOpen(true); };
    const handleClosePromotionModal = () => { setIsPromotionModalOpen(false); setEditingPromotion(null); };
    const handleSavePromotionWithModal = (promotionData: Promotion) => {
        onSavePromotion(promotionData);
        handleClosePromotionModal();
    };

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard': return <AdminDashboardHome orders={orders} products={products} onNavigateToSettings={() => setActivePage('settings')} />;
            case 'products': return <AdminProductsPage products={products} onAddProduct={handleOpenAddProductModal} onEditProduct={handleOpenEditProductModal} onDeleteProduct={onDeleteProduct} />;
            case 'categories': return <AdminCategoriesPage categories={categories} products={products} onAddCategory={handleOpenAddCategoryModal} onEditCategory={handleOpenEditCategoryModal} onDeleteCategory={onDeleteCategory} />;
            case 'orders': return <AdminOrdersPage orders={orders} />;
            case 'customers': return <AdminCustomersPage customers={customers} />;
            case 'promotions': return <AdminPromotionsPage promotions={promotions} onAddPromotion={handleOpenAddPromotionModal} onEditPromotion={handleOpenEditPromotionModal} onDeletePromotion={onDeletePromotion} />;
            case 'analytics': return <AdminAnalyticsPage />;
            case 'hero': return <AdminHeroPage slides={heroSlides} onAddSlide={handleOpenAddHeroSlideModal} onEditSlide={handleOpenEditHeroSlideModal} onDeleteSlide={onDeleteHeroSlide} />;
            case 'homepage': return <AdminHomepagePage allProducts={products} sections={homepageSections} onSave={onSaveHomepageSections} />;
            case 'settings': return <AdminSettingsPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
            case 'popup': return <AdminPopupSettingsPage />;
            case 'emails': return <AdminEmailsPage />; 
            default: return <AdminDashboardHome orders={orders} products={products} onNavigateToSettings={() => setActivePage('settings')} />;
        }
    };

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
            >
                <div className="flex">
                    <AnimatePresence>
                        {isSidebarOpen && (
                             <>
                                <motion.div className="fixed inset-0 bg-black/50 z-40 sm:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} />
                                <motion.div className="fixed top-0 left-0 h-full z-50 sm:hidden" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                                    <AdminSidebar activePage={activePage} setActivePage={setActivePage} onLinkClick={() => setIsSidebarOpen(false)} onNavigateToShop={() => onNavigate('shop')} />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <div className="hidden sm:block">
                        <AdminSidebar activePage={activePage} setActivePage={setActivePage} onNavigateToShop={() => onNavigate('shop')} />
                    </div>

                    <div className="flex-1 ml-0 sm:ml-64">
                         <AdminMobileHeader onMenuClick={() => setIsSidebarOpen(true)} title={adminPageTitles[activePage]} />
                        <main className="p-6 md:p-10">
                            <div className="pt-16 sm:pt-0">
                                <AnimatePresence mode="wait">
                                    <motion.div key={activePage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                                        {renderContent()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </main>
                    </div>
                </div>
                
                <AnimatePresence>
                    {isProductModalOpen && (
                        <Modal title={editingProduct ? 'Edit Product' : 'Add New Product'} onClose={handleCloseProductModal}>
                            <ProductForm product={editingProduct} onSave={handleSaveProductWithModal} onCancel={handleCloseProductModal} />
                        </Modal>
                    )}
                    {isCategoryModalOpen && (
                        <Modal title={editingCategory ? 'Edit Category' : 'Add New Category'} onClose={handleCloseCategoryModal}>
                            <CategoryForm category={editingCategory} onSave={handleSaveCategoryWithModal} onCancel={handleCloseCategoryModal} />
                        </Modal>
                    )}
                    {isHeroModalOpen && (
                        <Modal title={editingHeroSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'} onClose={handleCloseHeroModal}>
                            <HeroSlideForm slide={editingHeroSlide} onSave={handleSaveHeroSlideWithModal} onCancel={handleCloseHeroModal} />
                        </Modal>
                    )}
                    {isPromotionModalOpen && (
                        <Modal title={editingPromotion ? 'Edit Promotion' : 'Add New Promotion'} onClose={handleClosePromotionModal}>
                            <PromotionForm promotion={editingPromotion} onSave={handleSavePromotionWithModal} onCancel={handleClosePromotionModal} />
                        </Modal>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
