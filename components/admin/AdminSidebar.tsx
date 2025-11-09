import React from 'react';
import { motion } from 'framer-motion';
import { HomeIcon } from '@/constants/adminConstants';
import { PackageIcon } from '@/constants/adminConstants';
import { ShoppingCartIcon } from '@/constants/adminConstants';
import { UsersIcon } from '@/constants/adminConstants';
import { SettingsIcon } from '@/constants/adminConstants';
import { TagIcon } from '@/constants/adminConstants';
import { ChartBarIcon } from '@/constants/adminConstants';
import { LayoutIcon } from '@/constants/adminConstants';
import { ChevronLeftIcon } from '@/constants/adminConstants';

type AdminPage = 'dashboard' | 'products' | 'orders' | 'customers' | 'promotions' | 'analytics' | 'content' | 'settings';

interface AdminSidebarProps {
    activePage: AdminPage;
    setActivePage: (page: AdminPage) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'products', label: 'Products', icon: PackageIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingCartIcon },
    { id: 'customers', label: 'Customers', icon: UsersIcon },
    { id: 'promotions', label: 'Promotions', icon: TagIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'content', label: 'Content', icon: LayoutIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

const sidebarVariants = {
    expanded: { width: '16rem' /* 256px */ },
    collapsed: { width: '5rem' /* 80px */ },
};

const logoVariants = {
    expanded: { opacity: 1, scale: 1 },
    collapsed: { opacity: 0, scale: 0.8 },
}

const navLabelVariants = {
    expanded: { opacity: 1, x: 0, display: 'block' },
    collapsed: { opacity: 0, x: -10, transition: { duration: 0.1 }, display: 'none' },
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage, setActivePage, isCollapsed, setIsCollapsed }) => {
    
    return (
        <motion.div
            initial={false}
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-[var(--bg-primary)] text-[var(--text-primary)] hidden sm:flex flex-col h-screen fixed top-0 left-0 z-40 shadow-lg"
        >
            <div className="flex items-center justify-between p-4 h-20 border-b border-[var(--border-primary)]">
                <motion.div variants={logoVariants} transition={{ delay: isCollapsed ? 0 : 0.2}} className="flex items-center">
                     <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                    <motion.span variants={navLabelVariants} className="text-xl font-bold ml-2">Admin</motion.span>
                </motion.div>
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors duration-200"
                >
                    <ChevronLeftIcon />
                </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <a
                        key={item.id}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setActivePage(item.id as AdminPage);
                        }}
                        className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${ 
                            activePage === item.id 
                                ? 'bg-[var(--bg-accent)] text-[var(--text-accent)]' 
                                : 'hover:bg-[var(--bg-secondary)]'
                        }`}
                    >
                        <item.icon className={`h-6 w-6 ${isCollapsed ? 'mx-auto' : ''}`} />
                        <motion.span 
                            variants={navLabelVariants}
                            className="ml-4 font-medium"
                        >
                            {item.label}
                        </motion.span>
                    </a>
                ))}
            </nav>
            <div className="px-4 py-4 border-t border-[var(--border-primary)]">
                {/* Future footer items can go here */}
            </div>
        </motion.div>
    );
};

export default AdminSidebar;
