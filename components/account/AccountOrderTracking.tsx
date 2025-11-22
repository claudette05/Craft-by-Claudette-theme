
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_ORDERS } from '../../adminConstants';
import { AdminOrder, TrackingStatus, OrderStatus } from '../../types';
import { ClipboardListIcon, BoxIcon, TruckIcon, CheckCircleIcon } from '../Icons';
import { useAppContext } from '../../context/AppContext';

const trackingIcons: Record<TrackingStatus, React.ComponentType<{ className?: string }>> = {
  'Order Placed': ClipboardListIcon,
  'Shipped': BoxIcon,
  'Out for Delivery': TruckIcon,
  'Delivered': CheckCircleIcon,
};

const statusColorMap: Record<OrderStatus, string> = {
    Completed: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
    Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
};

const TrackingTimeline: React.FC<{ order: AdminOrder }> = ({ order }) => {
    const history = order.trackingHistory || [];
    
    return (
        <div className="mt-6">
            <ol className="relative border-l border-zinc-200 dark:border-zinc-700">
                {history.map((event, index) => {
                    const Icon = trackingIcons[event.status];
                    const isLast = index === history.length - 1;

                    return (
                        <motion.li 
                            key={index} 
                            className="mb-10 ml-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                        >
                            <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-8 ring-bg-secondary ${isLast ? 'bg-accent-primary text-accent-text' : 'bg-zinc-200 dark:bg-zinc-700 text-text-secondary'}`}>
                                <Icon className="w-5 h-5" />
                            </span>
                            <div className="ml-2">
                                <h3 className="flex items-center mb-1 text-lg font-semibold text-text-primary">{event.status}</h3>
                                <time className="block mb-2 text-sm font-normal leading-none text-text-secondary">{event.date}</time>
                                <p className="text-base font-normal text-text-secondary">{event.location}</p>
                            </div>
                        </motion.li>
                    );
                })}
            </ol>
        </div>
    );
};


const AccountOrderTracking: React.FC = () => {
    const { user } = useAppContext();
    const trackableOrders = React.useMemo(() => {
        return MOCK_ORDERS.filter(o => o.trackingNumber && o.customerEmail === user?.email);
    }, [user]);

    const [selectedOrder, setSelectedOrder] = React.useState<AdminOrder | null>(null);

    React.useEffect(() => {
        if (trackableOrders.length > 0 && !selectedOrder) {
            setSelectedOrder(trackableOrders[0]);
        } else if (trackableOrders.length === 0) {
            setSelectedOrder(null);
        }
    }, [trackableOrders, selectedOrder]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Order Tracking</h2>
            
            {trackableOrders.length > 0 && selectedOrder ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order List */}
                    <div className="lg:col-span-1">
                        <h3 className="font-semibold text-text-primary mb-3">Your Orders</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                            {trackableOrders.map(order => (
                                <button
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                                        selectedOrder.id === order.id 
                                            ? 'bg-amber-100 dark:bg-accent-primary/20' 
                                            : 'hover:bg-pink-100/50 dark:hover:bg-bg-tertiary'
                                    }`}
                                >
                                    <p className={`font-semibold text-sm ${selectedOrder.id === order.id ? 'text-accent-primary' : 'text-text-primary'}`}>Order {order.id}</p>
                                    <p className="text-xs text-text-secondary">Placed on {order.date}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tracking Details */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedOrder.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 mb-8 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border-primary pb-6">
                                        <div>
                                            <h1 className="text-2xl font-bold text-text-primary">Order {selectedOrder.id}</h1>
                                            <p className="text-text-secondary mt-1">Placed on {selectedOrder.date}</p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColorMap[selectedOrder.status]}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-text-secondary mb-1">Total Amount</p>
                                            <p className="text-xl font-bold text-text-primary">GH₵{selectedOrder.total.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-text-secondary mb-1">Tracking Number</p>
                                            <p className="text-base font-mono font-medium text-accent-primary">{selectedOrder.trackingNumber}</p>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-text-primary mb-4">Tracking History</h3>
                                <TrackingTimeline order={selectedOrder} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                <motion.div 
                    className="text-center py-12 px-6 bg-pink-100/50 dark:bg-bg-tertiary rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="font-semibold text-text-primary">No trackable orders found</p>
                    <p className="mt-1 text-text-secondary text-sm">Once your order ships, you'll be able to track it here.</p>
                </motion.div>
            )}
        </div>
    );
};

export default AccountOrderTracking;