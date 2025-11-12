import { AdminOrder, AdminCustomer, Promotion } from './types';

export const MOCK_ORDERS: AdminOrder[] = [
  { id: '#12548', customerName: 'John Doe', date: '2023-10-26', total: 125.00, status: 'Completed' },
  { id: '#12547', customerName: 'Jane Smith', date: '2023-10-25', total: 85.50, status: 'Processing' },
  { id: '#12546', customerName: 'Emily Johnson', date: '2023-10-25', total: 240.00, status: 'Completed' },
  { id: '#12545', customerName: 'Mike Brown', date: '2023-10-24', total: 45.00, status: 'Pending' },
  { id: '#12544', customerName: 'Sarah Wilson', date: '2023-10-23', total: 15.00, status: 'Cancelled' },
  { id: '#12543', customerName: 'David Lee', date: '2023-10-22', total: 95.00, status: 'Completed' },
  { id: '#12542', customerName: 'Jessica Garcia', date: '2023-10-22', total: 110.25, status: 'Completed' },
];

export const MOCK_CUSTOMERS: AdminCustomer[] = [
    { id: 1, name: 'John Doe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', email: 'john.d@example.com', orders: 5, totalSpent: 450.75 },
    { id: 2, name: 'Jane Smith', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', email: 'jane.s@example.com', orders: 3, totalSpent: 210.00 },
    { id: 3, name: 'Emily Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', email: 'emily.j@example.com', orders: 8, totalSpent: 980.50 },
    { id: 4, name: 'Mike Brown', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', email: 'mike.b@example.com', orders: 2, totalSpent: 95.00 },
];

export const MOCK_PROMOTIONS: Promotion[] = [
    { id: 1, code: 'SAVE10', type: 'Percentage', value: 10, status: 'Active', usageCount: 152 },
    { id: 2, code: 'FREESHIP', type: 'Fixed', value: 15, status: 'Active', usageCount: 230 },
    { id: 3, code: 'FALL2023', type: 'Percentage', value: 15, status: 'Expired', usageCount: 540 },
    { id: 4, code: 'WELCOME5', type: 'Fixed', value: 5, status: 'Scheduled', usageCount: 0 },
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
