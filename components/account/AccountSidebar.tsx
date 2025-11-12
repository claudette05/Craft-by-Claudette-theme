import * as React from 'react';
import { AccountPage } from '../../types';
import { HomeIcon, ShoppingCartIcon, UserIcon, HeartIcon, LocationMarkerIcon, BellIcon, LogoutIcon } from '../Icons';
import { useAppContext } from '../../context/AppContext';

interface AccountSidebarProps {
    activePage: AccountPage;
    setActivePage: (page: AccountPage) => void;
    onLinkClick?: () => void;
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
                ? 'bg-amber-100 text-amber-800 dark:bg-accent-primary/20 dark:text-accent-primary' 
                : 'text-text-secondary hover:bg-pink-100/50 dark:hover:bg-bg-tertiary hover:text-text-primary'
        }`}
    >
        <Icon className="h-5 w-5 mr-3" />
        <span>{label}</span>
    </button>
);

const AccountSidebar: React.FC<AccountSidebarProps> = ({ activePage, setActivePage, onLinkClick }) => {
    const { logout } = useAppContext();
    
    const navItems: { id: AccountPage, label: string, icon: React.ComponentType<{ className?: string }> }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'orders', label: 'Orders', icon: ShoppingCartIcon },
        { id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
        { id: 'profile', label: 'Profile Details', icon: UserIcon },
        { id: 'addresses', label: 'Addresses', icon: LocationMarkerIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
    ];

    const handleNavClick = (page: AccountPage) => {
        setActivePage(page);
        onLinkClick?.();
    };
    
    const handleLogout = () => {
        logout();
        onLinkClick?.();
    };

    return (
        <aside className="w-64 bg-bg-secondary p-4 rounded-lg shadow-sm flex-shrink-0 h-full flex flex-col">
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activePage === item.id}
                        onClick={() => handleNavClick(item.id)}
                    />
                ))}
            </nav>
            <div className="pt-4 border-t border-border-primary">
                <NavLink
                    label="Logout"
                    icon={LogoutIcon}
                    isActive={false}
                    onClick={handleLogout}
                />
            </div>
        </aside>
    );
};

export default AccountSidebar;
