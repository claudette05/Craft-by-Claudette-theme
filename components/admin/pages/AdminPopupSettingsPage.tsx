
import * as React from 'react';
import { TwitterPicker, ColorResult } from 'react-color';
import { useAppContext } from '../../../context/AppContext';
import Toggle from '../ui/Toggle';
import { PopupConfig } from '../../../types';

const AdminPopupSettingsPage: React.FC = () => {
    const { popupConfig, updatePopupConfig } = useAppContext();
    const [config, setConfig] = React.useState<PopupConfig>(popupConfig);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        setConfig(popupConfig);
    }, [popupConfig]);

    const handleConfigChange = (newConfig: Partial<PopupConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    const handleNestedChange = <T extends keyof PopupConfig>(
        key: T,
        value: Partial<PopupConfig[T]>
    ) => {
        handleConfigChange({ [key]: { ...(config[key] as object), ...value } } as Partial<PopupConfig>);
    };

    const handleSave = () => {
        setIsSaving(true);
        try {
            updatePopupConfig(config);
            // In the new setup, the context handles saving to localStorage and notifies the user.
        } finally {
            setIsSaving(false);
        }
    };

    const Input: React.FC<{
        value: string | number;
        onChange: (val: string) => void;
        type?: string;
        placeholder?: string;
    }> = ({ value, onChange, type = 'text', placeholder }) => (
        <input
            type={type}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 p-2 text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-amber-500 outline-none transition-all"
        />
    );

    const Slider: React.FC<{
        value: number;
        min: number;
        max: number;
        onChange: (val: number) => void;
        label: string;
        unit?: string;
    }> = ({ value, min, max, onChange, label, unit }) => (
        <div className="bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-md border border-zinc-200 dark:border-zinc-600">
            <div className="flex justify-between mb-2">
                <span className="text-sm text-[var(--text-primary)]">{label}</span>
                <span className="text-xs font-bold text-amber-600">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value ?? 0}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-600 accent-amber-500"
            />
        </div>
    );
    
    if (!config || !config.content || !config.style || !config.behavior) {
        return <div>Loading popup settings...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-[var(--bg-secondary)] rounded-lg shadow-md border border-[var(--border-primary)]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Promotional Popup</h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Customize and manage the popup for your storefront.</p>
                </div>
                <Toggle enabled={config.enabled} onToggle={() => handleConfigChange({ enabled: !config.enabled })} />
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity ${!config.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold border-b border-[var(--border-primary)] pb-2">Content</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input value={config.content.title || ''} onChange={v => handleNestedChange('content', { title: v })} placeholder="e.g. Get 15% Off!"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Input value={config.content.description || ''} onChange={v => handleNestedChange('content', { description: v })} placeholder="e.g. Subscribe to our newsletter" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Button Text</label>
                            <Input value={config.content.buttonText || ''} onChange={v => handleNestedChange('content', { buttonText: v })} placeholder="e.g. Subscribe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Success Message</label>
                            <Input value={config.content.successMessage || ''} onChange={v => handleNestedChange('content', { successMessage: v })} placeholder="e.g. Thanks for subscribing!" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-semibold border-b border-[var(--border-primary)] pb-2">Appearance & Behavior</h2>
                    <div className="space-y-4">
                        <Slider value={config.behavior.delay || 5} min={0} max={60} onChange={v => handleNestedChange('behavior', { delay: v })} label="Display Delay" unit="s" />
                        <Slider value={typeof config.style.borderRadius === 'string' ? parseInt(config.style.borderRadius, 10) : 8} min={0} max={32} onChange={v => handleNestedChange('style', { borderRadius: `${v}px` })} label="Border Radius" unit="px" />
                        
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <ColorPicker label="Background" color={config.style.backgroundColor || '#ffffff'} onChange={c => handleNestedChange('style', { backgroundColor: c.hex })} />
                            <ColorPicker label="Text Color" color={config.style.textColor || '#000000'} onChange={c => handleNestedChange('style', { textColor: c.hex })} />
                            <ColorPicker label="Button BG" color={config.style.buttonColor || '#000000'} onChange={c => handleNestedChange('style', { buttonColor: c.hex })} />
                            <ColorPicker label="Button Text" color={config.style.buttonTextColor || '#ffffff'} onChange={c => handleNestedChange('style', { buttonTextColor: c.hex })} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-primary)] text-right">
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-sm disabled:opacity-70"
                >
                    {isSaving ? 'Saving...' : 'Publish Popup'}
                </button>
            </div>
        </div>
    );
};

const ColorPicker: React.FC<{ label: string; color: string; onChange: (color: ColorResult) => void; }> = ({ label, color, onChange }) => {
    const [displayColorPicker, setDisplayColorPicker] = React.useState(false);
    const popover = React.useRef<HTMLDivElement>(null);

    const handleClick = () => setDisplayColorPicker(!displayColorPicker);
    const handleClose = () => setDisplayColorPicker(false);

    React.useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (popover.current && !popover.current.contains(event.target as Node)) {
                handleClose();
            }
        };
        window.addEventListener('click', listener, { capture: true });
        return () => window.removeEventListener('click', listener, { capture: true });
    }, []);

    return (
        <div className="relative">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="w-full h-10 rounded-md border border-zinc-300 dark:border-zinc-600 flex items-center px-2 bg-white dark:bg-zinc-700" onClick={handleClick}>
                <div className="w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-500" style={{ backgroundColor: color }}></div>
                <span className="ml-2 text-sm uppercase">{color}</span>
            </div>
            {displayColorPicker && (
                <div className="absolute z-10 mt-2" ref={popover}>
                    <TwitterPicker color={color} onChangeComplete={onChange} />
                </div>
            )}
        </div>
    );
};

export default AdminPopupSettingsPage;
