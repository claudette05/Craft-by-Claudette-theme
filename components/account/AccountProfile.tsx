
import * as React from 'react';
import { useAppContext } from '../../context/AppContext';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, className = '', ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary">{label}</label>
        <input 
            id={id} 
            {...props} 
            className={`mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-bg-tertiary shadow-sm focus:border-accent-primary focus:ring-accent-primary sm:text-sm p-3 text-text-primary ${className}`} 
        />
    </div>
);

const AccountProfile: React.FC = () => {
    const { user } = useAppContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Profile updated successfully! (Demo)');
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Profile Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="First Name" id="first-name" defaultValue="Jane" />
                    <Input label="Last Name" id="last-name" defaultValue="Doe" />
                </div>
                <Input 
                    label="Email Address" 
                    id="email" 
                    type="email" 
                    value={user?.email || ''} 
                    readOnly
                    className="opacity-75 cursor-not-allowed bg-zinc-100 dark:bg-zinc-700/50"
                />
                
                <div className="pt-6 border-t border-pink-200 dark:border-border-primary">
                    <h3 className="text-lg font-semibold text-text-primary">Change Password</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                        <Input label="Current Password" id="current-password" type="password" placeholder="••••••••" />
                        <Input label="New Password" id="new-password" type="password" placeholder="••••••••" />
                    </div>
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-accent-primary hover:opacity-90 text-accent-text font-bold py-2 px-6 rounded-full transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountProfile;