import React from 'react';
import { motion } from 'framer-motion';

const AccountAddresses: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-800">My Addresses</h2>
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm">
                    Add New Address
                </button>
            </div>
            
            <motion.div 
                className="text-center py-12 px-6 bg-pink-100/50 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <p className="font-semibold text-zinc-700">No addresses found</p>
                <p className="mt-1 text-zinc-500 text-sm">You have not saved any shipping or billing addresses yet.</p>
            </motion.div>
        </div>
    );
};

export default AccountAddresses;
