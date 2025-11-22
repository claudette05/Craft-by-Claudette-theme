
import * as React from 'react';
import { motion } from 'framer-motion';

const AccountAddresses: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">My Addresses</h2>
                <button className="bg-accent-primary hover:opacity-90 text-accent-text font-bold py-2 px-4 rounded-full transition-colors text-sm">
                    Add New Address
                </button>
            </div>
            
            <motion.div 
                className="text-center py-12 px-6 bg-pink-100/50 dark:bg-bg-tertiary rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <p className="font-semibold text-text-primary">No addresses found</p>
                <p className="mt-1 text-text-secondary text-sm">You have not saved any delivery or billing addresses yet.</p>
            </motion.div>
        </div>
    );
};

export default AccountAddresses;
