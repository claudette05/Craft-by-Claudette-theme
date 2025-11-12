
import * as React from 'react';
import Toggle from '../ui/Toggle';

interface AdminSettingsPageProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const FormInput: React.FC<{ label: string; id: string; type?: string; value: string; }> = 
({ label, id, type = 'text', value }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">{label}</label>
        <div className="mt-1">
            <input 
                type={type} 
                name={id} 
                id={id} 
                className="block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3" 
                defaultValue={value}
            />
        </div>
    </div>
);

const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ isDarkMode, toggleDarkMode }) => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Settings</h1>
                <p className="text-[var(--text-secondary)] mt-1">Manage your site's settings and preferences.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm">
                        <section>
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Shop Information</h2>
                            <div className="mt-4 grid grid-cols-1 gap-y-6">
                                <FormInput label="Shop Name" id="shop-name" value="Craft by Claudette" />
                                <FormInput label="Contact Email" id="shop-email" type="email" value="hello@craftbyclaudette.com" />
                            </div>
                        </section>
                    </div>
                </div>
                <div>
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm">
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
            </div>
        </div>
    );
};

export default AdminSettingsPage;