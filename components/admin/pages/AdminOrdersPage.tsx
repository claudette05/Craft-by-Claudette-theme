
import * as React from 'react';
import { AdminOrder, OrderStatus } from '../../../types';
import AdminOrdersTable from '../AdminOrdersTable';
import AdminManageOrderPage from './AdminManageOrderPage';
import { databaseService } from '../../../services/databaseService';

const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = React.useState<AdminOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = React.useState<AdminOrder | null>(null);

    React.useEffect(() => {
        databaseService.getOrders().then(setOrders);
    }, []);

    const handleSelectOrder = (order: AdminOrder) => {
        setSelectedOrder(order);
    };

    const handleUpdateStatus = (newStatus: OrderStatus) => {
        if (selectedOrder) {
            const updatedOrder = { ...selectedOrder, status: newStatus };
            setSelectedOrder(updatedOrder);
            databaseService.saveOrder(updatedOrder);
            setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <AdminOrdersTable orders={orders} onSelectOrder={handleSelectOrder} />
            </div>
            <div>
                <AdminManageOrderPage order={selectedOrder} onUpdateStatus={handleUpdateStatus} />
            </div>
        </div>
    );
};

export default AdminOrdersPage;
