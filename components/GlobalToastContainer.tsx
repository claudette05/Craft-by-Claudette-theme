

import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ToastMessage } from '../types';
import GlobalToast from './GlobalToast';

interface GlobalToastContainerProps {
    toasts: ToastMessage[];
}

const GlobalToastContainer: React.FC<GlobalToastContainerProps> = ({ toasts }) => {
    return (
        <div className="fixed top-24 right-0 sm:right-5 z-[100] w-full sm:w-auto p-4 sm:p-0 space-y-3">
            <AnimatePresence>
                {toasts.map(toast => (
                    <GlobalToast key={toast.id} message={toast.message} type={toast.type} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default GlobalToastContainer;
