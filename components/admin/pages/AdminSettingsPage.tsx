
import * as React from 'react';
import Toggle from '../ui/Toggle';
import { useAppContext } from '../../../context/AppContext';
import { PhotoIcon, SparklesIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, ExclamationTriangleIcon } from '../../Icons';

interface AdminSettingsPageProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const FormInput: React.FC<{ label: string; id: string; type?: string; value: string | number; onChange?: (val: string) => void; placeholder?: string }> = 
({ label, id, type = 'text', value, onChange, placeholder }) => (
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
                placeholder={placeholder}
            />
        </div>
    </div>
);

const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ isDarkMode, toggleDarkMode }) => {
    const { 
        freeGiftConfig, updateFreeGiftConfig, 
        cloudinaryConfig, updateCloudinaryConfig, 
        shopInfo, updateShopInfo, 
        uploadImage, addToast 
    } = useAppContext();
    
    const [localCloudConfig, setLocalCloudConfig] = React.useState(cloudinaryConfig);
    const [localShopInfo, setLocalShopInfo] = React.useState(shopInfo);
    
    const [isSavingShop, setIsSavingShop] = React.useState(false);
    const [isSavingCloud, setIsSavingCloud] = React.useState(false);
    const [isTestingCloud, setIsTestingCloud] = React.useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
    
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const importFileRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        setLocalCloudConfig(cloudinaryConfig);
        setLocalShopInfo(shopInfo);
    }, [cloudinaryConfig, shopInfo]);

    const handleShopChange = (field: keyof typeof localShopInfo, value: string) => {
        setLocalShopInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveShopInfo = async () => {
        setIsSavingShop(true);
        try {
            await updateShopInfo(localShopInfo);
        } catch (e) {
            addToast("Failed to save shop info", "error");
        } finally {
            setIsSavingShop(false);
        }
    };

    const handleSaveCloudConfig = async () => {
        setIsSavingCloud(true);
        try {
            await updateCloudinaryConfig(localCloudConfig);
        } catch (e) {
            addToast("Failed to save storage settings", "error");
        } finally {
            setIsSavingCloud(false);
        }
    };

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploadingLogo(true);
            try {
                const url = await uploadImage(e.target.files[0]);
                handleShopChange('logoUrl', url);
                addToast("Logo uploaded!");
            } catch (err: any) {
                addToast(err.message || "Logo upload failed", "error");
            } finally {
                setIsUploadingLogo(false);
            }
        }
    };

    const testCloudinary = async () => {
        if (!localCloudConfig.cloudName || !localCloudConfig.uploadPreset) {
            addToast("Enter Cloud Name and Preset first", "error");
            return;
        }
        setIsTestingCloud(true);
        try {
            const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            const res = await fetch(pixel);
            const blob = await res.blob();
            const file = new File([blob], "test.gif", { type: "image/gif" });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', localCloudConfig.uploadPreset);
            const response = await fetch(`https://api.cloudinary.com/v1_1/${localCloudConfig.cloudName}/image/upload`, { method: 'POST', body: formData });
            if (response.ok) addToast("Cloudinary Connected!", "success");
            else throw new Error("Invalid configuration");
        } catch (err: any) {
            addToast(`Error: ${err.message}`, "error");
        } finally {
            setIsTestingCloud(false);
        }
    };

    const handleExportData = () => {
        const data: Record<string, string | null> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('craft_data_'))) {
                data[key] = localStorage.getItem(key);
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `craft-shop-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        addToast("Backup downloaded!");
    };

    const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                Object.keys(data).forEach(key => {
                    if (data[key]) localStorage.setItem(key, data[key]);
                });
                addToast("Data imported! Refreshing...", "success");
                setTimeout(() => window.location.reload(), 1500);
            } catch (err) {
                addToast("Failed to import: Invalid file", "error");
            }
        };
        reader.readAsText(file);
    };

    const handleFactoryReset = () => {
        if (window.confirm("DELETE ALL DATA? This cannot be undone.")) {
            localStorage.clear();
            addToast("Store reset.", "info");
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <header>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Settings</h1>
                <p className="text-[var(--text-secondary)] mt-1">Manage shop identity and integrations.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shop Information */}
                <div className="lg:col-span-2">
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm border border-[var(--border-primary)]">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Shop Information</h2>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex flex-col items-center shrink-0">
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Store Logo</label>
                                <div className="relative w-32 h-32 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/30 overflow-hidden flex items-center justify-center group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    {localShopInfo.logoUrl ? <img src={localShopInfo.logoUrl} className="w-full h-full object-contain" alt="Logo" /> : <div className="text-center p-4"><PhotoIcon className="w-8 h-8 mx-auto text-zinc-400" /><span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 block">Upload</span></div>}
                                    {isUploadingLogo && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div></div>}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
                            </div>
                            <div className="flex-1 space-y-6">
                                <FormInput label="Shop Name" id="shop-name" value={localShopInfo.name} onChange={(v) => handleShopChange('name', v)} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormInput label="Contact Email" id="shop-email" type="email" value={localShopInfo.email} onChange={(v) => handleShopChange('email', v)} />
                                    <FormInput label="WhatsApp Number" id="shop-whatsapp" value={localShopInfo.whatsapp} onChange={(v) => handleShopChange('whatsapp', v)} placeholder="e.g. 233552130759" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-primary)]">
                                    <FormInput label="MoMo Number (for payments)" id="shop-momo-number" value={localShopInfo.momoNumber || ''} onChange={(v) => handleShopChange('momoNumber', v)} placeholder="e.g. 0509680962" />
                                    <FormInput label="MoMo Registered Name" id="shop-momo-name" value={localShopInfo.momoName || ''} onChange={(v) => handleShopChange('momoName', v)} placeholder="e.g. Claudette Cobbah" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-[var(--border-primary)] text-right">
                            <button 
                                onClick={handleSaveShopInfo} 
                                disabled={isSavingShop}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-sm disabled:opacity-70"
                            >
                                {isSavingShop ? 'Syncing...' : 'Save & Sync Shop Info'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Theme Settings */}
                <div className="space-y-8">
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm border border-[var(--border-primary)]">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Appearance</h2>
                        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Dark Mode</label>
                            <Toggle enabled={isDarkMode} onToggle={toggleDarkMode} />
                        </div>
                    </div>
                </div>

                {/* Storage Configuration */}
                <div className="lg:col-span-2">
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm border border-[var(--border-primary)]">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Cloudinary Storage</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormInput label="Cloud Name" id="cloud-name" value={localCloudConfig.cloudName} onChange={(v) => setLocalCloudConfig(p => ({...p, cloudName: v}))} />
                            <FormInput label="Upload Preset" id="upload-preset" value={localCloudConfig.uploadPreset} onChange={(v) => setLocalCloudConfig(p => ({...p, uploadPreset: v}))} />
                        </div>
                        <div className="mt-8 pt-6 border-t border-[var(--border-primary)] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button onClick={testCloudinary} disabled={isTestingCloud} className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 disabled:opacity-50">
                                {isTestingCloud ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent"></div> : <SparklesIcon className="w-4 h-4" />}
                                Test Connection
                            </button>
                            <button 
                                onClick={handleSaveCloudConfig} 
                                disabled={isSavingCloud}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-sm disabled:opacity-70"
                            >
                                {isSavingCloud ? 'Saving...' : 'Save Storage Settings'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Database & Portability */}
                <div className="lg:col-span-3">
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm border border-[var(--border-primary)]">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Store Maintenance</h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">Manage local backups and data health.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-700/30 rounded-xl border border-zinc-200 dark:border-zinc-600">
                                <h3 className="font-bold text-sm mb-1">Backup</h3>
                                <button onClick={handleExportData} className="mt-4 w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 py-2 rounded-lg text-sm font-bold hover:bg-zinc-100 transition-colors">
                                    <ArrowDownTrayIcon className="w-4 h-4" /> Export JSON
                                </button>
                            </div>
                            
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-700/30 rounded-xl border border-zinc-200 dark:border-zinc-600">
                                <h3 className="font-bold text-sm mb-1">Restore</h3>
                                <input type="file" ref={importFileRef} onChange={handleImportData} accept=".json" className="hidden" />
                                <button onClick={() => importFileRef.current?.click()} className="mt-4 w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 py-2 rounded-lg text-sm font-bold hover:bg-zinc-100 transition-colors">
                                    <ArrowUpTrayIcon className="w-4 h-4" /> Import JSON
                                </button>
                            </div>

                            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                                <h3 className="font-bold text-sm text-red-700 dark:text-red-400 mb-1">Danger Zone</h3>
                                <button onClick={handleFactoryReset} className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm">
                                    <ExclamationTriangleIcon className="w-4 h-4" /> Reset All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
