import React from 'react';
import { AccountPage } from '../MyAccountPage';
import { HomeIcon, ShoppingCartIcon, UserIcon, MapPinIcon, HeartIcon } from '../../constants';

interface AccountSidebarProps {
    activePage: AccountPage;
    setActivePage: (page: AccountPage) => void;
}

const NavLink: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors text-sm font-medium ${
            isActive 
                ? 'bg-amber-100 text-amber-800' 
                : 'text-zinc-600 hover:bg-pink-100/50 hover:text-zinc-800'
        }`}
    >
        <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
        <span>{label}</span>
    </button>
);

const AccountSidebar: React.FC<AccountSidebarProps> = ({ activePage, setActivePage }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'orders', label: 'Order History', icon: ShoppingCartIcon },
        { id: 'profile', label: 'Profile Details', icon: UserIcon },
        { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
        { id: 'wishlist', label: 'My Wishlist', icon: HeartIcon },
    ];
    
    return (
        <aside className="bg-white/60 p-4 rounded-lg shadow-md">
            <nav className="space-y-1">
                {navItems.map(item => (
                    <NavLink
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activePage === item.id}
                        onClick={() => setActivePage(item.id as AccountPage)}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default AccountSidebar;