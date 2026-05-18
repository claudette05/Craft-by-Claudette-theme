
import * as React from 'react';
import { AdminOrder, OrderStatus, Product, AdminCustomer } from '../../../types';
import AdminOrdersTable from '../AdminOrdersTable';
import AdminManageOrderPage from './AdminManageOrderPage';
import { databaseService } from '../../../services/databaseService';
import Modal from '../ui/Modal';
import ManualOrderForm from '../ui/ManualOrderForm';

interface AdminOrdersPageProps {
    orders: AdminOrder[];
    products: Product[];
    customers: AdminCustomer[];
    onSaveOrder: (order: Partial<AdminOrder>) => Promise<void>;
    onDeleteOrder: (orderId: string) => Promise<void>;
}


const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ orders, products, customers, onSaveOrder, onDeleteOrder }) => {
    const [selectedOrder, setSelectedOrder] = React.useState<AdminOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);


    const handleSelectOrder = (order: AdminOrder) => {
        setSelectedOrder(order);
    };

    const handleUpdateStatus = (newStatus: OrderStatus) => {
        if (selectedOrder) {
            const updatedOrder = { ...selectedOrder, status: newStatus };
            setSelectedOrder(updatedOrder);
            onSaveOrder(updatedOrder);
        }
    };
    
    const handleSaveNewOrder = async (order: Partial<AdminOrder>) => {
        await onSaveOrder(order);
        setIsModalOpen(false);
    }


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Orders</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Create Manual Order
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <AdminOrdersTable orders={orders} onSelectOrder={handleSelectOrder} onDeleteOrder={onDeleteOrder} />
                </div>
                <div>
                    <AdminManageOrderPage order={selectedOrder} onUpdateStatus={handleUpdateStatus} />
                </div>
            </div>
            {isModalOpen && (
                <Modal title="Create New Order" onClose={() => setIsModalOpen(false)}>
                    <ManualOrderForm 
                        onSave={handleSaveNewOrder}
                        onCancel={() => setIsModalOpen(false)}
                        products={products}
                        customers={customers}
                    />
                </Modal>
            )}
        </div>
    );
};

export default AdminOrdersPage;
