import { AdminStat, AdminOrder, AdminTopProduct, AdminCustomer, Promotion } from './types';
import { ShoppingCartIcon, DollarSignIcon, UsersIcon, PackageIcon } from './constants';

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