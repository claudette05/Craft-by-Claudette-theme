import * as React from 'react';
import { HomeIcon, PackageIcon as ProductsIcon, ClipboardListIcon as OrdersIcon, TagIcon as DiscountsIcon, SettingsIcon, StarIcon as ReviewsIcon, PhotoIcon as HeroIcon, LayoutIcon as ContentIcon, EyeIcon as AppearanceIcon, LogoutIcon } from '../Icons';

const AdminSidebar = ({ activePage, setActivePage, onLinkClick, onNavigateToShop }) => (
    <aside className="w-64 bg-[var(--bg-secondary)] text-[var(--text-secondary)] h-full fixed top-0 left-0 shadow-lg flex flex-col z-40">
        <div className="p-6">
            <h1 className="text-2xl font-bold text-amber-500">Craft by Claudette</h1>
            <p className="text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            <SidebarLink icon={<HomeIcon />} label="Dashboard" page="dashboard" activePage={activePage} onClick={() => { setActivePage('dashboard'); onLinkClick?.(); }} />

            <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase text-[var(--text-accent)]">Content</p>
            <SidebarLink icon={<HeroIcon />} label="Hero Section" page="hero" activePage={activePage} onClick={() => { setActivePage('hero'); onLinkClick?.(); }} />
            <SidebarLink icon={<ContentIcon />} label="Homepage Sections" page="homepage" activePage={activePage} onClick={() => { setActivePage('homepage'); onLinkClick?.(); }} />
            <SidebarLink icon={<ContentIcon />} label="Homepage Manager" page="homepageManager" activePage={activePage} onClick={() => { setActivePage('homepageManager'); onLinkClick?.(); }} />
            <SidebarLink icon={<ReviewsIcon />} label="Customer Reviews" page="reviews" activePage={activePage} onClick={() => { setActivePage('reviews'); onLinkClick?.(); }} />

            <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase text-[var(--text-accent)]">Store</p>
            <SidebarLink icon={<ProductsIcon />} label="Products" page="products" activePage={activePage} onClick={() => { setActivePage('products'); onLinkClick?.(); }} />
            <SidebarLink icon={<ProductsIcon />} label="Categories" page="categories" activePage={activePage} onClick={() => { setActivePage('categories'); onLinkClick?.(); }} />
            <SidebarLink icon={<OrdersIcon />} label="Orders" page="orders" activePage={activePage} onClick={() => { setActivePage('orders'); onLinkClick?.(); }} />
            <SidebarLink icon={<DiscountsIcon />} label="Promotions" page="promotions" activePage={activePage} onClick={() => { setActivePage('promotions'); onLinkClick?.(); }} />
            
            <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase text-[var(--text-accent)]">Settings</p>
            <SidebarLink icon={<SettingsIcon />} label="Lookbook Settings" page="lookbook" activePage={activePage} onClick={() => { setActivePage('lookbook'); onLinkClick?.(); }} />
            <SidebarLink icon={<AppearanceIcon />} label="Popup Manager" page="popup" activePage={activePage} onClick={() => { setActivePage('popup'); onLinkClick?.(); }} />


        </nav>
        <div className="p-4 border-t border-[var(--border-primary)]">
            <button onClick={onNavigateToShop} className="w-full text-left flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-200">
                <LogoutIcon className="w-5 h-5" />
                <span className="font-medium">Back to Shop</span>
            </button>
        </div>
    </aside>
);

const SidebarLink = ({ icon, label, page, activePage, onClick }) => (
    <button 
        onClick={onClick} 
        className={`w-full text-left flex items-center gap-3 py-2 px-3 rounded-md transition-colors duration-200 ${
            activePage === page ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-[var(--bg-tertiary)]'
        }`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
        <span className="font-medium">{label}</span>
    </button>
);

export default AdminSidebar;
