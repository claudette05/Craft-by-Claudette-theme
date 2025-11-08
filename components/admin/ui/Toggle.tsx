import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, setEnabled }) => {
    return (
        <div
            onClick={() => setEnabled(!enabled)}
            className={`flex items-center w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                enabled ? 'bg-amber-500 justify-end' : 'bg-zinc-300 dark:bg-zinc-600 justify-start'
            }`}
        >
            <motion.div
                layout
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                className="w-4 h-4 bg-white rounded-full shadow-md"
            />
        </div>
    );
};

export default Toggle;