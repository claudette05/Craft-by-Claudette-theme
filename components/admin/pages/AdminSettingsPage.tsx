
import * as React from 'react';
import Toggle from '../ui/Toggle';
import { useAppContext } from '../../../context/AppContext';

interface AdminSettingsPageProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const FormInput: React.FC<{ label: string; id: string; type?: string; value: string | number; onChange?: (val: string) => void }> = 
({ label, id, type = 'text', value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">{label}</label>
        <div className="mt-1">
            <input 
                type={type} 
                name={id} 
                id={id} 
                className="block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3 text-[var(--text-primary)]" 
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                readOnly={!onChange}
            />
        </div>
    </div>
);

const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ isDarkMode, toggleDarkMode }) => {
    const { freeGiftConfig, updateFreeGiftConfig } = useAppContext();
    const [giftConfig, setGiftConfig] = React.useState(freeGiftConfig);

    const handleGiftChange = (field: keyof typeof giftConfig, value: any) => {
        setGiftConfig(prev => ({ ...prev, [field]: value }));
    };

    const saveGiftSettings = () => {
        updateFreeGiftConfig(giftConfig);
    };

    return (
        <div className="space-y-8 pb-10">
            <header>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Settings</h1>
                <p className="text-[var(--text-secondary)] mt-1">Manage your site's settings and preferences.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="md:col-span-2">
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm border border-[var(--border-primary)]">
                        <section>
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Shop Information</h2>
                            <div className="mt-4 grid grid-cols-1 gap-y-6">
                                <FormInput label="Shop Name" id="shop-name" value="Craft by Claudette" />
                                <FormInput label="Contact Email" id="shop-email" type="email" value="hello@craftbyclaudette.com" />
                            </div>
                        </section>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div>
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm border border-[var(--border-primary)]">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Appearance</h2>
                        <div className="mt-4 flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">
                                Dark Mode
                            </label>
                           <Toggle enabled={isDarkMode} onToggle={toggleDarkMode} />
                        </div>
                         <p className="mt-2 text-xs text-[var(--text-secondary)]">
                            Toggle dark mode for the entire site.
                        </p>
                    </div>
                </div>

                {/* Free Gift Settings */}
                <div className="md:col-span-2">
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm border border-[var(--border-primary)]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Free Gift Threshold</h2>
                            <Toggle enabled={giftConfig.enabled} onToggle={() => handleGiftChange('enabled', !giftConfig.enabled)} />
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">
                            Encourage customers to spend more by offering a free gift when their cart reaches a certain amount.
                        </p>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <FormInput 
                                label="Threshold Amount (GH₵)" 
                                id="gift-threshold" 
                                type="number" 
                                value={giftConfig.threshold} 
                                onChange={(v) => handleGiftChange('threshold', parseInt(v) || 0)} 
                            />
                            <FormInput 
                                label="Progress Message" 
                                id="gift-message" 
                                value={giftConfig.message} 
                                onChange={(v) => handleGiftChange('message', v)} 
                            />
                            <p className="text-xs text-[var(--text-secondary)] -mt-4">Use <code>{'{amount}'}</code> as a placeholder for the remaining amount.</p>
                            
                            <FormInput 
                                label="Success Message" 
                                id="gift-success" 
                                value={giftConfig.successMessage} 
                                onChange={(v) => handleGiftChange('successMessage', v)} 
                            />
                        </div>
                        <div className="mt-6 text-right">
                            <button 
                                onClick={saveGiftSettings}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
