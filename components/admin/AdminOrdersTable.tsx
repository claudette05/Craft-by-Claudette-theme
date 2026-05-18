
import React from 'react';

const orders = [
  {
    orderId: 'ORD-001',
    customerName: 'John Doe',
    date: '2023-10-26',
    total: 79.98,
    status: 'Shipped',
    items: [
      { id: 1, name: 'Friendship Bracelet Kit', quantity: 1, price: 29.99, image: 'https://cdn.shopify.com/s/files/1/0568/1921/6336/products/friendship-bracelet-kit-eileens-s-favorite-things-2_1800x1800.jpg' },
      { id: 2, name: 'DIY Candle Making Kit', quantity: 1, price: 39.99, image: 'https://cdn.shopify.com/s/files/1/0568/1921/6336/products/diy-candle-making-kit-eileens-s-favorite-things-3_1800x1800.jpg' },
    ],
  },
  {
    orderId: 'ORD-002',
    customerName: 'Jane Smith',
    date: '2023-10-25',
    total: 49.99,
    status: 'Processing',
    items: [
      { id: 3, name: 'Handmade Leather Journal', quantity: 1, price: 49.99, image: '' }, // Empty image URL for testing
    ],
  },
  // ... more orders
];

const AdminOrdersTable: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            <th className="px-5 py-3">Order ID</th>
            <th className="px-5 py-3">Customer</th>
            <th className="px-5 py-3">Date</th>
            <th className="px-5 py-3">Total</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Items</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-300">
          {orders.map((order) => (
            <tr key={order.orderId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">{order.orderId}</p>
              </td>
              <td className="px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">{order.customerName}</p>
              </td>
              <td className="px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">{order.date}</p>
              </td>
              <td className="px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">${order.total.toFixed(2)}</p>
              </td>
              <td className="px-5 py-5 text-sm">
                <span
                  className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${{
                    Shipped: 'text-green-900 bg-green-200',
                    Processing: 'text-yellow-900 bg-yellow-200',
                    Cancelled: 'text-red-900 bg-red-200',
                  }[order.status] || 'text-gray-900 bg-gray-200'}`}>
                  <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full`}></span>
                  <span className="relative">{order.status}</span>
                </span>
              </td>
              <td className="px-5 py-5 text-sm">
                <div className="flex items-center">
                    {order.items.map((item, index) => (
                        item.image && <img key={index} src={item.image} alt={item.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 -ml-2" title={`${item.name} (x${item.quantity})`}/>
                    ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersTable;
