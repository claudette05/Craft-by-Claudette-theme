import React from 'react';
import { motion } from 'framer-motion';
import { AdminStat } from '../../types';

interface StatCardProps {
    stat: AdminStat;
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
    const { label, value, icon: Icon } = stat;
    return (
        <motion.div 
            className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-6"
            variants={itemVariants}
        >
            <div className="bg-amber-100 p-3 rounded-full">
                <Icon className="h-8 w-8 text-amber-600" />
            </div>
            <div>
                <p className="text-sm text-zinc-500">{label}</p>
                <p className="text-2xl font-bold text-zinc-800">{value}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;
