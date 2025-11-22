
import * as React from 'react';
import { HomeIcon, PackageIcon, ShoppingCartIcon, UsersIcon, SettingsIcon, TagIcon, ChartBarIcon, LayoutIcon, ExternalLinkIcon, SparklesIcon } from '../Icons';

type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'promotions' | 'analytics' | 'hero' | 'homepage' | 'settings' | 'popup';

interface AdminSidebarProps {
    activePage: AdminPage;
    setActivePage: (page: AdminPage) => void;
    onLinkClick?: () => void;
    onNavigateToShop?: () => void;
}

const NavLink: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
            isActive 
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300' 
                : 'text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700/50 dark:hover:text-zinc-200'
        }`}
    >
        <Icon className="h-5 w-5 mr-3" />
        <span>{label}</span>
    </button>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage, setActivePage, onLinkClick, onNavigateToShop }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'products', label: 'Products', icon: PackageIcon },
        { id: 'categories', label: 'Categories', icon: LayoutIcon },
        { id: 'orders', label: 'Orders', icon: ShoppingCartIcon },
        { id: 'customers', label: 'Customers', icon: UsersIcon },
        { id: 'promotions', label: 'Promotions', icon: TagIcon },
        { id: 'popup', label: 'Popup Manager', icon: SparklesIcon },
        { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
        { id: 'hero', label: 'Hero Section', icon: LayoutIcon },
        { id: 'homepage', label: 'Homepage', icon: LayoutIcon },
    ];

    const settingsItem = { id: 'settings', label: 'Settings', icon: SettingsIcon };

    const handleNavClick = (page: AdminPage) => {
        setActivePage(page);
        onLinkClick?.();
    };

    const handleViewStoreClick = () => {
        onNavigateToShop?.();
        onLinkClick?.();
    };
    
    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-[var(--bg-secondary)] shadow-md z-40 flex flex-col">
            <div className="h-16 sm:h-20 flex items-center justify-center border-b border-[var(--border-primary)]">
                <h1 className="text-xl font-bold text-amber-600">Admin Panel</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map(item => (
                    <NavLink
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activePage === item.id}
                        onClick={() => handleNavClick(item.id as AdminPage)}
                    />
                ))}
            </nav>
            <div className="p-4 border-t border-[var(--border-primary)]">
                {onNavigateToShop && (
                     <button
                        onClick={handleViewStoreClick}
                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors text-sm font-medium text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700/50 dark:hover:text-zinc-200 mb-2`}
                    >
                        <ExternalLinkIcon className="h-5 w-5 mr-3" />
                        <span>View Store</span>
                    </button>
                )}
                <NavLink
                    key={settingsItem.id}
                    label={settingsItem.label}
                    icon={settingsItem.icon}
                    isActive={activePage === settingsItem.id}
                    onClick={() => handleNavClick(settingsItem.id as AdminPage)}
                />
            </div>
        </aside>
    );
};

export default AdminSidebar;
