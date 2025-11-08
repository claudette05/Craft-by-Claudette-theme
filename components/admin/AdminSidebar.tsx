import React from 'react';
import { HomeIcon, PackageIcon, ShoppingCartIcon, UsersIcon, SettingsIcon, TagIcon, ChartBarIcon, LayoutIcon } from '../../constants';

type AdminPage = 'dashboard' | 'products' | 'orders' | 'customers' | 'promotions' | 'analytics' | 'content' | 'settings';

interface AdminSidebarProps {
    activePage: AdminPage;
    setActivePage: (page: AdminPage) => void;
}

const NavLink: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
    <div className="relative group">
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
        {/* Tooltip */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-zinc-800 dark:bg-zinc-900 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {label}
            {/* Arrow */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-zinc-800 dark:bg-zinc-900 transform rotate-45"></div>
        </div>
    </div>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage, setActivePage }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'products', label: 'Products', icon: PackageIcon },
        { id: 'orders', label: 'Orders', icon: ShoppingCartIcon },
        { id: 'customers', label: 'Customers', icon: UsersIcon },
        { id: 'promotions', label: 'Promotions', icon: TagIcon },
        { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
        { id: 'content', label: 'Site Content', icon: LayoutIcon },
    ];

    const settingsItem = { id: 'settings', label: 'Settings', icon: SettingsIcon };
    
    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-[var(--bg-secondary)] shadow-md z-40 flex-col hidden sm:flex">
            <div className="h-20 flex items-center justify-center border-b border-[var(--border-primary)]">
                <h1 className="text-xl font-bold text-amber-600">Admin Panel</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activePage === item.id}
                        onClick={() => setActivePage(item.id as AdminPage)}
                    />
                ))}
            </nav>
            <div className="p-4 border-t border-[var(--border-primary)]">
                <NavLink
                    key={settingsItem.id}
                    label={settingsItem.label}
                    icon={settingsItem.icon}
                    isActive={activePage === settingsItem.id}
                    onClick={() => setActivePage(settingsItem.id as AdminPage)}
                />
            </div>
        </aside>
    );
};

export default AdminSidebar;