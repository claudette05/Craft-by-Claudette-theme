import React from 'react';
import { AdminStat, AdminOrder, AdminTopProduct, AdminCustomer, Promotion } from '../types';

// SVG Icons
export const ShoppingCartIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

// Admin Icons
export const DollarSignIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m0-10a9 9 0 110 18 9 9 0 010-18z" />
    </svg>
);

export const UsersIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm6-11a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);

export const PackageIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

export const HomeIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

export const SettingsIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const TagIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M15 11l-4 4-4-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h.01" />
    </svg>
);

export const LayoutIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

export const ChartBarIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const ADMIN_STATS: AdminStat[] = [
    {
        label: 'Total Sales',
        value: 'GH₵12,845',
        icon: DollarSignIcon,
    },
    {
        label: 'Total Orders',
        value: '431',
        icon: ShoppingCartIcon,
    },
    {
        label: 'New Customers',
        value: '78',
        icon: UsersIcon,
    },
    {
        label: 'Products in Stock',
        value: '10',
        icon: PackageIcon,
    },
];

export const MOCK_ORDERS: AdminOrder[] = [
    { id: '#3066', customerName: 'Liam Johnson', date: '2023-10-26', total: 128.50, status: 'Completed' },
    { id: '#3065', customerName: 'Olivia Smith', date: '2023-10-26', total: 42.00, status: 'Processing' },
    { id: '#3064', customerName: 'Noah Williams', date: '2023-10-25', total: 75.25, status: 'Completed' },
    { id: '#3063', customerName: 'Emma Brown', date: '2023-10-25', total: 22.00, status: 'Pending' },
    { id: '#3062', customerName: 'James Jones', date: '2023-10-24', total: 199.99, status: 'Cancelled' },
    { id: '#3061', customerName: 'Ava Garcia', date: '2023-10-24', total: 56.75, status: 'Completed' },
    { id: '#3067', customerName: 'Sophia Martinez', date: '2023-10-27', total: 88.00, status: 'Processing' },
    { id: '#3068', customerName: 'William Davis', date: '2023-10-27', total: 15.50, status: 'Completed' },
];

export const MOCK_TOP_PRODUCTS: AdminTopProduct[] = [
    { id: 1, name: 'Pastel Dream Earrings', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2574&auto=format&fit=crop', sales: 124 },
    { id: 3, name: 'Glitter Gloss Keychain', imageUrl: 'https://images.unsplash.com/photo-1575429391320-42f068771a36?q=80&w=2574&auto=format&fit=crop', sales: 98 },
    { id: 5, name: 'Floral Resin Coaster', imageUrl: 'https://images.unsplash.com/photo-1636572481942-12492162523d?q=80&w=2574&auto=format&fit=crop', sales: 85 },
    { id: 8, name: 'Friendship Bracelet Kit', imageUrl: 'https://images.unsplash.com/photo-1454563823136-7e8392a404c0?q=80&w=2564&auto=format&fit=crop', sales: 72 },
];

export const MOCK_CUSTOMERS: AdminCustomer[] = [
    { id: 1, name: 'Liam Johnson', email: 'liam.j@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=liam', orders: 5, totalSpent: 450.75 },
    { id: 2, name: 'Olivia Smith', email: 'olivia.s@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=olivia', orders: 8, totalSpent: 780.20 },
    { id: 3, name: 'Noah Williams', email: 'noah.w@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=noah', orders: 2, totalSpent: 120.00 },
    { id: 4, name: 'Emma Brown', email: 'emma.b@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=emma', orders: 12, totalSpent: 1250.50 },
    { id: 5, name: 'James Jones', email: 'james.j@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=james', orders: 1, totalSpent: 199.99 },
    { id: 6, name: 'Ava Garcia', email: 'ava.g@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=ava', orders: 3, totalSpent: 250.00 },
];

export const MOCK_PROMOTIONS: Promotion[] = [
    { id: 1, code: 'WELCOME10', type: 'Percentage', value: 10, status: 'Active', startDate: '2023-01-01', endDate: '2024-12-31', usageCount: 152 },
    { id: 2, code: 'FREESHIP', type: 'Fixed', value: 5.00, status: 'Active', startDate: '2023-06-01', endDate: '2024-12-31', usageCount: 340 },
    { id: 3, code: 'SUMMER20', type: 'Percentage', value: 20, status: 'Expired', startDate: '2023-08-01', endDate: '2023-08-31', usageCount: 512 },
    { id: 4, code: 'HOLIDAYGIFT', type: 'Fixed', value: 15.00, status: 'Scheduled', startDate: '2024-11-20', endDate: '2024-12-25', usageCount: 0 },
];

export const MOCK_SALES_DATA = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
    { name: 'Jul', sales: 7000 },
];
