import React from 'react';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-zinc-600">{label}</label>
        <input 
            id={id} 
            {...props} 
            className="mt-1 block w-full rounded-md border-zinc-300 bg-zinc-50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3" 
        />
    </div>
);

const AccountProfile: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Profile updated successfully! (Demo)');
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-zinc-800 mb-6">Profile Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="First Name" id="first-name" defaultValue="Jane" />
                    <Input label="Last Name" id="last-name" defaultValue="Doe" />
                </div>
                <Input label="Email Address" id="email" type="email" defaultValue="jane.doe@example.com" />
                
                <div className="pt-6 border-t border-pink-200">
                    <h3 className="text-lg font-semibold text-zinc-700">Change Password</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                        <Input label="Current Password" id="current-password" type="password" placeholder="••••••••" />
                        <Input label="New Password" id="new-password" type="password" placeholder="••••••••" />
                    </div>
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountProfile;