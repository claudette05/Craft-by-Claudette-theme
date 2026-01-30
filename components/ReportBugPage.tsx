
import * as React from 'react';
import { motion } from 'framer-motion';
import { Page } from '../types';
import { useAppContext } from '../context/AppContext';

interface ReportBugPageProps {
    onNavigate: (page: Page) => void;
}

const bugTypes = ['Visual Glitch', 'Functionality Error', 'Payment Issue', 'Other'];

const ReportBugPage: React.FC<ReportBugPageProps> = ({ onNavigate }) => {
    const { addToast } = useAppContext();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            addToast('Thank you! Your report has been submitted.', 'success');
            onNavigate('shop');
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-28 pb-16 bg-bg-primary px-4"
        >
            <div className="max-w-md mx-auto bg-bg-secondary p-8 rounded-xl shadow-lg border border-border-primary">
                <h1 className="text-2xl font-bold text-text-primary mb-2 text-center">Report a Bug</h1>
                <p className="text-text-secondary text-center mb-6 text-sm">Found something not working right? Let us know!</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Issue Type</label>
                        <select className="w-full p-3 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary outline-none focus:ring-2 focus:ring-accent-primary">
                            {bugTypes.map(type => (
                                <option key={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                        <textarea 
                            required
                            rows={4} 
                            className="w-full p-3 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                            placeholder="Describe what happened..."
                        ></textarea>
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent-primary hover:opacity-90 text-accent-text font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Submitting...' : 'Submit Report'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => onNavigate('shop')}
                        className="w-full text-text-secondary hover:text-text-primary text-sm py-2"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default ReportBugPage;
