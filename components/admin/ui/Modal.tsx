import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from '../../../constants';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } },
};

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.div
                className="absolute inset-0 bg-black/60"
                variants={backdropVariants}
                onClick={onClose}
            />
            <motion.div
                className="relative w-full max-w-3xl bg-[var(--bg-secondary)] rounded-xl shadow-lg flex flex-col max-h-[90vh]"
                variants={modalVariants}
            >
                <header className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] flex-shrink-0">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                        aria-label="Close modal"
                    >
                        <XIcon />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Modal;