import * as React from 'react';
import { motion } from 'framer-motion';

const AccountNotifications: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Notifications</h2>
             <motion.div 
                className="text-center py-12 px-6 bg-pink-100/50 dark:bg-bg-tertiary rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <p className="font-semibold text-text-primary">No new notifications</p>
                <p className="mt-1 text-text-secondary text-sm">You're all caught up!</p>
            </motion.div>
        </div>
    );
};

export default AccountNotifications;
