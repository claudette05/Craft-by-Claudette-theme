import * as React from 'react';
import { motion } from 'framer-motion';

export interface AdminStat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

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
            className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm flex items-center gap-6"
            variants={itemVariants}
        >
            <div className="bg-amber-100 dark:bg-amber-500/10 p-3 rounded-full">
                <Icon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
                <p className="text-sm text-[var(--text-secondary)]">{label}</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;