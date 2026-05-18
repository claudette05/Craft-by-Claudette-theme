
import * as React from 'react';
import { AdminOrder, Product, AdminCustomer, OrderStatus } from '../../../types';
import { TrashIcon } from '../../Icons';

interface ManualOrderFormProps {
    onSave: (order: Partial<AdminOrder>) => void;
    onCancel: () => void;
    products: Product[];
    customers: AdminCustomer[];
}

const ManualOrderForm: React.FC<ManualOrderFormProps> = ({ onSave, onCancel, products, customers }) => {
    const [selectedCustomerId, setSelectedCustomerId] = React.useState<number | string>('');
    const [items, setItems] = React.useState<{ productId: number; quantity: number; price: number; name: string }[]>([]);
    const [shippingAddress, setShippingAddress] = React.useState('');
    const [status, setStatus] = React.useState<OrderStatus>('Pending');
    const [productSearch, setProductSearch] = React.useState('');

    const handleAddItem = (product: Product) => {
        if (product && !items.find(item => item.productId === product.id)) {
            setItems([...items, { productId: product.id, quantity: 1, price: product.salePrice ?? product.price, name: product.name }]);
        }
        setProductSearch('');
    };

    const handleRemoveItem = (productId: number) => {
        setItems(items.filter(item => item.productId !== productId));
    };

    const handleQuantityChange = (productId: number, quantity: string) => {
        const numQuantity = parseInt(quantity, 10);
        setItems(items.map(item => item.productId === productId ? { ...item, quantity: Math.max(1, isNaN(numQuantity) ? 1 : numQuantity) } : item));
    };

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    const filteredProducts = productSearch 
        ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) && !items.find(i => i.productId === p.id))
        : [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const customer = customers.find(c => c.id === selectedCustomerId);
        if (!customer) {
            alert("Please select a customer.");
            return;
        }
        if (items.length === 0) {
            alert("Please add at least one product to the order.");
            return;
        }

        const newOrder: Partial<AdminOrder> = {
            customerName: customer.name,
            customerEmail: customer.email,
            date: new Date().toISOString(),
            total,
            status,
            items: items.map(({ productId, quantity, price }) => ({ productId, quantity, price })),
            shippingAddress: shippingAddress || `${customer.name}'s default address (mock)`,
        };
        onSave(newOrder);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <select 
                    value={selectedCustomerId} 
                    onChange={e => setSelectedCustomerId(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2"
                >
                    <option value="">Select a customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Add Products</label>
                <input 
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search for products to add..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2"
                />
                {filteredProducts.length > 0 && (
                     <ul className="border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                        {filteredProducts.slice(0, 5).map(p => (
                            <li key={p.id} onClick={() => handleAddItem(p)} className="p-2 hover:bg-amber-100 cursor-pointer">
                                {p.name} - GH₵{(p.salePrice ?? p.price).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {items.length > 0 && (
                 <div className="space-y-2">
                    <h3 className="text-lg font-medium">Order Items</h3>
                     <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
                             <tr>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                 <th></th>
                             </tr>
                         </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                             {items.map(item => (
                                 <tr key={item.productId}>
                                     <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="number" value={item.quantity} onChange={e => handleQuantityChange(item.productId, e.target.value)} className="w-16 p-1 border-gray-300 rounded-md" />
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap">GH₵{item.price.toFixed(2)}</td>
                                     <td className="px-6 py-4 whitespace-nowrap">GH₵{(item.price * item.quantity).toFixed(2)}</td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                         <button type="button" onClick={() => handleRemoveItem(item.productId)}><TrashIcon className="w-5 h-5 text-red-500" /></button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                     <div className="text-right font-bold text-lg">Total: GH₵{total.toFixed(2)}</div>
                 </div>
            )}
            
            <div>
                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea id="shippingAddress" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2" />
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Order Status</label>
                <select id="status" value={status} onChange={e => setStatus(e.target.value as OrderStatus)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2">
                    {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg">Save Order</button>
            </div>
        </form>
    );
};

export default ManualOrderForm;
