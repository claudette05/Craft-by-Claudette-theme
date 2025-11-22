
import * as React from 'react';
import { useAppContext } from '../../../context/AppContext';
import Toggle from '../ui/Toggle';
import { PopupContentRenderer } from '../../PromotionalPopup';
import { PopupConfig, SpinnerSegment } from '../../../types';
import { SparklesIcon, TrashIcon, PlusIcon } from '../../Icons';

// --- Predefined Templates ---
const TEMPLATES = [
    {
        id: 'classic-newsletter',
        name: 'Classic Newsletter',
        description: 'A standard modal with image on the left and form on the right.',
        config: {
            type: 'standard',
            content: {
                title: "Join Our Newsletter",
                description: "Get the latest updates and 10% off your first order.",
                imageUrl: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop",
                buttonText: "Subscribe Now",
                successTitle: "Welcome Aboard!",
                successMessage: "Here is your discount code.",
                discountCode: "WELCOME10",
                placeholderText: "Enter email",
                disclaimerText: "Unsubscribe at any time."
            },
            style: {
                layout: 'image-left',
                width: 'md',
                position: 'center',
                borderRadius: 'lg',
                backgroundColor: '#ffffff',
                textColor: '#18181b',
                buttonColor: '#F59E0B',
                entranceAnimation: 'scale',
                exitAnimation: 'fade'
            }
        }
    },
    {
        id: 'lucky-spin',
        name: 'Lucky Spin Wheel',
        description: 'Engage users with a gamified spin-to-win popup.',
        config: {
            type: 'spinner',
            content: {
                title: "Spin to Win!",
                description: "Test your luck and win exclusive discounts.",
                imageUrl: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?q=80&w=1000&auto=format&fit=crop",
                buttonText: "Try My Luck",
                successTitle: "Congratulations!",
                successMessage: "You've won a prize! Use code below.",
                placeholderText: "Enter email to spin",
                disclaimerText: "One spin per customer."
            },
            style: {
                layout: 'image-left',
                width: 'lg',
                position: 'center',
                borderRadius: 'xl',
                backgroundColor: '#ffffff',
                textColor: '#18181b',
                buttonColor: '#E11D48',
                buttonTextColor: '#ffffff',
                entranceAnimation: 'bounce',
                exitAnimation: 'zoom'
            },
            spinnerSegments: [
                { id: '1', label: '10% OFF', value: 'SPIN10', color: '#E11D48', textColor: '#ffffff', probability: 20 },
                { id: '2', label: 'Free Ship', value: 'FREESHIP', color: '#18181b', textColor: '#ffffff', probability: 20 },
                { id: '3', label: '5% OFF', value: 'SPIN5', color: '#E11D48', textColor: '#ffffff', probability: 40 },
                { id: '4', label: 'No Luck', value: 'TRYAGAIN', color: '#71717a', textColor: '#ffffff', probability: 10 },
                { id: '5', label: '20% OFF', value: 'JACKPOT20', color: '#18181b', textColor: '#E11D48', probability: 5 },
                { id: '6', label: 'Free Gift', value: 'GIFT', color: '#E11D48', textColor: '#ffffff', probability: 5 },
            ]
        }
    },
    {
        id: 'flash-sale-slide',
        name: 'Flash Sale Slide-in',
        description: 'A non-intrusive slide-in notification for the bottom right corner.',
        config: {
            type: 'standard',
            content: {
                title: "Flash Sale! ⚡",
                description: "50% off all earrings for the next hour only.",
                imageUrl: "",
                buttonText: "Shop Sale",
                successTitle: "Code Copied!",
                successMessage: "Hurry before it ends!",
                discountCode: "FLASH50",
                placeholderText: "Email for code",
                disclaimerText: ""
            },
            style: {
                layout: 'no-image',
                width: 'sm',
                position: 'bottom-right',
                borderRadius: 'md',
                backgroundColor: '#18181b',
                textColor: '#ffffff',
                buttonColor: '#F59E0B',
                buttonTextColor: '#ffffff',
                entranceAnimation: 'slide-left',
                exitAnimation: 'slide-right'
            }
        }
    },
    {
        id: 'countdown-banner',
        name: 'Countdown Banner',
        description: 'Create urgency with a timer. Perfect for top banners.',
        config: {
            type: 'countdown',
            content: {
                title: "Flash Sale Ending Soon!",
                description: "Use code FLASH20 at checkout.",
                imageUrl: "",
                buttonText: "Shop Now",
                successTitle: "Saved!",
                successMessage: "Don't wait too long!",
                discountCode: "FLASH20",
                placeholderText: "Email address",
                disclaimerText: "Offer expires when timer hits zero.",
                timerDurationMinutes: 15
            },
            style: {
                layout: 'no-image',
                width: 'lg',
                position: 'top-center',
                borderRadius: 'none',
                backgroundColor: '#18181b', // zinc-900
                textColor: '#ffffff',
                buttonColor: '#F59E0B', // amber-500
                buttonTextColor: '#ffffff',
                overlayColor: 'rgba(0,0,0,0.0)', // No overlay for banner usually
                entranceAnimation: 'slide-down',
                exitAnimation: 'slide-up'
            }
        }
    }
];

// --- UI Components for Builder ---

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            active 
                ? 'border-amber-500 text-amber-600 dark:text-amber-400' 
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
    >
        {label}
    </button>
);

const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="mb-4">
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">{label}</label>
        {children}
    </div>
);

const Input: React.FC<{ value: string | number; onChange: (val: string) => void; type?: string; placeholder?: string }> = ({ value, onChange, type = 'text', placeholder }) => (
    <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 p-2 text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-amber-500 outline-none transition-all"
    />
);

const TextArea: React.FC<{ value: string; onChange: (val: string) => void; rows?: number }> = ({ value, onChange, rows = 3 }) => (
    <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 p-2 text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
    />
);

const ColorPicker: React.FC<{ label: string; value: string; onChange: (val: string) => void }> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-700/50 p-2 rounded-md border border-zinc-200 dark:border-zinc-600">
        <span className="text-sm text-[var(--text-primary)]">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--text-secondary)] uppercase">{value}</span>
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
        </div>
    </div>
);

const Select: React.FC<{ value: string; onChange: (val: string) => void; options: { label: string, value: string }[] }> = ({ value, onChange, options }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 p-2 text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-amber-500 outline-none"
    >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
);

const Slider: React.FC<{ value: number; min: number; max: number; onChange: (val: number) => void; label: string; unit?: string }> = ({ value, min, max, onChange, label, unit }) => (
    <div className="bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-md border border-zinc-200 dark:border-zinc-600">
        <div className="flex justify-between mb-2">
            <span className="text-sm text-[var(--text-primary)]">{label}</span>
            <span className="text-xs font-bold text-amber-600">{value}{unit}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-600 accent-amber-500"
        />
    </div>
);


const AdminPopupSettingsPage: React.FC = () => {
    const { popupConfig, updatePopupConfig } = useAppContext();
    const [config, setConfig] = React.useState<PopupConfig>(popupConfig);
    const [activeTab, setActiveTab] = React.useState<'templates' | 'content' | 'design' | 'behavior'>('templates');
    const [isDirty, setIsDirty] = React.useState(false);

    React.useEffect(() => {
        if (!isDirty) {
            setConfig(popupConfig);
        }
    }, [popupConfig, isDirty]);

    const updateContent = (key: keyof PopupConfig['content'], value: string | number) => {
        setConfig(prev => ({ ...prev, content: { ...prev.content, [key]: value } }));
        setIsDirty(true);
    };

    const updateStyle = (key: keyof PopupConfig['style'], value: string) => {
        setConfig(prev => ({ ...prev, style: { ...prev.style, [key]: value } }));
        setIsDirty(true);
    };

    const updateBehavior = (key: keyof PopupConfig['behavior'], value: any) => {
        setConfig(prev => ({ ...prev, behavior: { ...prev.behavior, [key]: value } }));
        setIsDirty(true);
    };
    
    // New: Update Config Type
    const updateType = (type: 'standard' | 'spinner' | 'countdown') => {
        setConfig(prev => ({ ...prev, type }));
        setIsDirty(true);
    };

    // New: Manage Spinner Segments
    const updateSegment = (index: number, field: keyof SpinnerSegment, value: any) => {
        if (!config.spinnerSegments) return;
        const newSegments = [...config.spinnerSegments];
        newSegments[index] = { ...newSegments[index], [field]: value };
        setConfig(prev => ({ ...prev, spinnerSegments: newSegments }));
        setIsDirty(true);
    };

    const addSegment = () => {
        const newSegment: SpinnerSegment = {
            id: Date.now().toString(),
            label: 'New Prize',
            value: 'CODE',
            color: '#000000',
            textColor: '#ffffff',
            probability: 10
        };
        setConfig(prev => ({ ...prev, spinnerSegments: [...(prev.spinnerSegments || []), newSegment] }));
        setIsDirty(true);
    };

    const removeSegment = (index: number) => {
         if (!config.spinnerSegments) return;
         const newSegments = config.spinnerSegments.filter((_, i) => i !== index);
         setConfig(prev => ({ ...prev, spinnerSegments: newSegments }));
         setIsDirty(true);
    };

    const applyTemplate = (templateConfig: Partial<PopupConfig>) => {
        setConfig(prev => ({
            ...prev,
            type: templateConfig.type || 'standard',
            content: { ...prev.content, ...templateConfig.content },
            style: { ...prev.style, ...templateConfig.style },
            spinnerSegments: templateConfig.spinnerSegments || prev.spinnerSegments
        }));
        setIsDirty(true);
        setActiveTab('design');
    };

    const handleSave = () => {
        updatePopupConfig(config);
        setIsDirty(false);
    };

    const handleReset = () => {
        if (window.confirm('Discard unsaved changes?')) {
            setConfig(popupConfig);
            setIsDirty(false);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between mb-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Popup Builder</h1>
                    <div className="flex items-center gap-2 mt-1">
                         <Toggle enabled={config.enabled} onToggle={() => {
                             setConfig(prev => ({...prev, enabled: !prev.enabled}));
                             setIsDirty(true);
                         }} />
                         <span className="text-sm text-[var(--text-secondary)]">{config.enabled ? 'Popup is Live' : 'Popup is Disabled'}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleReset}
                        disabled={!isDirty} 
                        className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 disabled:opacity-50"
                    >
                        Reset
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
                    >
                        {isDirty ? 'Publish Changes' : 'Saved'}
                    </button>
                </div>
            </header>

            {/* Builder Workspace */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                
                {/* Left Panel: Controls */}
                <div className="w-full lg:w-[450px] flex flex-col bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-sm overflow-hidden shrink-0">
                    {/* Tabs */}
                    <div className="flex border-b border-[var(--border-primary)] overflow-x-auto hide-scrollbar">
                        <TabButton label="Templates" active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} />
                        <TabButton label="Content" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                        <TabButton label="Design" active={activeTab === 'design'} onClick={() => setActiveTab('design')} />
                        <TabButton label="Behavior" active={activeTab === 'behavior'} onClick={() => setActiveTab('behavior')} />
                    </div>

                    {/* Scrollable Settings Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        
                        {/* TEMPLATES TAB */}
                        {activeTab === 'templates' && (
                            <div className="space-y-4">
                                <p className="text-sm text-[var(--text-secondary)] mb-2">Choose a starting point.</p>
                                {TEMPLATES.map(tpl => (
                                    <button 
                                        key={tpl.id}
                                        onClick={() => applyTemplate(tpl.config as any)}
                                        className="w-full text-left p-4 rounded-lg border border-[var(--border-primary)] hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="p-2 bg-zinc-100 dark:bg-zinc-700 rounded-full text-amber-600"><SparklesIcon className="w-5 h-5"/></span>
                                            <span className="font-bold text-[var(--text-primary)] group-hover:text-amber-600">{tpl.name}</span>
                                        </div>
                                        <p className="text-xs text-[var(--text-secondary)] pl-12">{tpl.description}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* CONTENT TAB */}
                        {activeTab === 'content' && (
                            <>
                                <FormGroup label="Popup Type">
                                    <Select 
                                        value={config.type || 'standard'} 
                                        onChange={(v) => updateType(v as any)}
                                        options={[
                                            { label: 'Standard Popup', value: 'standard' },
                                            { label: 'Spin-to-Win (Gamified)', value: 'spinner' },
                                            { label: 'Countdown Banner', value: 'countdown' },
                                        ]}
                                    />
                                </FormGroup>

                                <FormGroup label="Main Text">
                                    <div className="space-y-3">
                                        <Input placeholder="Title" value={config.content.title} onChange={(v) => updateContent('title', v)} />
                                        <TextArea rows={4} value={config.content.description} onChange={(v) => updateContent('description', v)} />
                                        <Input placeholder="Input Placeholder" value={config.content.placeholderText} onChange={(v) => updateContent('placeholderText', v)} />
                                        <Input placeholder="Button Text" value={config.content.buttonText} onChange={(v) => updateContent('buttonText', v)} />
                                    </div>
                                </FormGroup>

                                {config.type === 'countdown' && (
                                    <FormGroup label="Countdown Settings">
                                        <div className="bg-amber-50 dark:bg-amber-500/10 p-3 rounded-md border border-amber-200 dark:border-amber-500/20">
                                            <label className="block text-xs text-[var(--text-secondary)] mb-1">Timer Duration (Minutes)</label>
                                            <Input 
                                                type="number" 
                                                placeholder="15" 
                                                value={config.content.timerDurationMinutes || ''} 
                                                onChange={(v) => updateContent('timerDurationMinutes', parseInt(v) || 0)} 
                                            />
                                        </div>
                                    </FormGroup>
                                )}

                                {config.type === 'spinner' ? (
                                     <FormGroup label="Wheel Segments">
                                         <div className="space-y-4">
                                            {config.spinnerSegments?.map((segment, idx) => (
                                                <div key={segment.id} className="p-3 bg-zinc-50 dark:bg-zinc-700/30 border border-zinc-200 dark:border-zinc-600 rounded-md space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-[var(--text-secondary)]">Slice {idx + 1}</span>
                                                        <button onClick={() => removeSegment(idx)} className="text-xs text-red-500 hover:underline">Remove</button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Input placeholder="Label (e.g. 10% OFF)" value={segment.label} onChange={(v) => updateSegment(idx, 'label', v)} />
                                                        <Input placeholder="Code (e.g. SAVE10)" value={segment.value} onChange={(v) => updateSegment(idx, 'value', v)} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <ColorPicker label="Bg" value={segment.color} onChange={(v) => updateSegment(idx, 'color', v)} />
                                                        <ColorPicker label="Text" value={segment.textColor} onChange={(v) => updateSegment(idx, 'textColor', v)} />
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={addSegment} className="w-full py-2 flex items-center justify-center gap-2 border border-dashed border-zinc-400 text-zinc-500 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                <PlusIcon className="w-4 h-4" /> Add Segment
                                            </button>
                                         </div>
                                     </FormGroup>
                                ) : (
                                    <FormGroup label="Success State (Standard)">
                                        <div className="space-y-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-md border border-green-100 dark:border-green-900/20">
                                            <Input placeholder="Success Title" value={config.content.successTitle} onChange={(v) => updateContent('successTitle', v)} />
                                            <TextArea rows={2} value={config.content.successMessage} onChange={(v) => updateContent('successMessage', v)} />
                                            <Input placeholder="Discount Code" value={config.content.discountCode} onChange={(v) => updateContent('discountCode', v)} />
                                        </div>
                                    </FormGroup>
                                )}

                                <FormGroup label="Visuals">
                                     <div className="space-y-3">
                                        <Input placeholder="Image URL" value={config.content.imageUrl} onChange={(v) => updateContent('imageUrl', v)} />
                                        {config.content.imageUrl && <img src={config.content.imageUrl} className="w-full h-20 object-cover rounded-md border border-zinc-200" alt="preview" />}
                                     </div>
                                </FormGroup>
                            </>
                        )}

                        {/* DESIGN TAB */}
                        {activeTab === 'design' && (
                            <>
                                <FormGroup label="Position & Layout">
                                     <div className="space-y-3">
                                        <Select 
                                            value={config.style.position || 'center'} 
                                            onChange={(v) => updateStyle('position', v)}
                                            options={[
                                                { label: 'Center (Modal)', value: 'center' },
                                                { label: 'Bottom Right (Slide-in)', value: 'bottom-right' },
                                                { label: 'Bottom Left (Slide-in)', value: 'bottom-left' },
                                                { label: 'Top Center (Banner)', value: 'top-center' },
                                            ]}
                                        />
                                        <Select 
                                            value={config.style.layout} 
                                            onChange={(v) => updateStyle('layout', v)}
                                            options={[
                                                { label: 'Image Left', value: 'image-left' },
                                                { label: 'Image Right', value: 'image-right' },
                                                { label: 'Image Top', value: 'image-top' },
                                                { label: 'No Image', value: 'no-image' },
                                                { label: 'Background Image', value: 'background-image' },
                                            ]}
                                        />
                                     </div>
                                </FormGroup>

                                <FormGroup label="Animations">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Entrance</label>
                                            <Select 
                                                value={config.style.entranceAnimation || 'scale'} 
                                                onChange={(v) => updateStyle('entranceAnimation', v)}
                                                options={[
                                                    { label: 'Scale / Zoom', value: 'scale' },
                                                    { label: 'Fade In', value: 'fade' },
                                                    { label: 'Slide Up', value: 'slide-up' },
                                                    { label: 'Slide Down', value: 'slide-down' },
                                                    { label: 'Slide Left', value: 'slide-left' },
                                                    { label: 'Slide Right', value: 'slide-right' },
                                                    { label: 'Rotate In', value: 'rotate' },
                                                ]}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Exit</label>
                                            <Select 
                                                value={config.style.exitAnimation || 'fade'} 
                                                onChange={(v) => updateStyle('exitAnimation', v)}
                                                options={[
                                                    { label: 'Fade Out', value: 'fade' },
                                                    { label: 'Scale Out', value: 'scale' },
                                                    { label: 'Slide Up', value: 'slide-up' },
                                                    { label: 'Slide Down', value: 'slide-down' },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </FormGroup>

                                <FormGroup label="Sizing & Shape">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Select 
                                            value={config.style.width} 
                                            onChange={(v) => updateStyle('width', v)}
                                            options={[
                                                { label: 'Small', value: 'sm' },
                                                { label: 'Medium', value: 'md' },
                                                { label: 'Large', value: 'lg' },
                                            ]}
                                        />
                                        <Select 
                                            value={config.style.borderRadius} 
                                            onChange={(v) => updateStyle('borderRadius', v)}
                                            options={[
                                                { label: 'Square', value: 'none' },
                                                { label: 'Small Round', value: 'sm' },
                                                { label: 'Medium Round', value: 'md' },
                                                { label: 'Large Round', value: 'lg' },
                                                { label: 'Pill / Oval', value: 'full' },
                                            ]}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup label="Colors">
                                    <div className="space-y-2">
                                        <ColorPicker label="Background" value={config.style.backgroundColor} onChange={(v) => updateStyle('backgroundColor', v)} />
                                        <ColorPicker label="Text Color" value={config.style.textColor} onChange={(v) => updateStyle('textColor', v)} />
                                        <ColorPicker label="Button Color" value={config.style.buttonColor} onChange={(v) => updateStyle('buttonColor', v)} />
                                        <ColorPicker label="Button Text" value={config.style.buttonTextColor} onChange={(v) => updateStyle('buttonTextColor', v)} />
                                        <ColorPicker label="Overlay Color" value={config.style.overlayColor} onChange={(v) => updateStyle('overlayColor', v)} />
                                    </div>
                                </FormGroup>
                            </>
                        )}

                        {/* BEHAVIOR TAB */}
                        {activeTab === 'behavior' && (
                            <>
                                <FormGroup label="Triggers">
                                    <div className="space-y-4">
                                        <Slider 
                                            label="Time Delay" 
                                            value={config.behavior.delay} 
                                            min={0} max={60} 
                                            onChange={(v) => updateBehavior('delay', v)} 
                                            unit="s"
                                        />

                                        <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-md border border-zinc-200 dark:border-zinc-600">
                                            <span className="text-sm text-[var(--text-primary)]">Exit Intent (Desktop)</span>
                                            <Toggle enabled={config.behavior.showOnExit} onToggle={() => updateBehavior('showOnExit', !config.behavior.showOnExit)} />
                                        </div>

                                        <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-md border border-zinc-200 dark:border-zinc-600">
                                            <span className="text-sm text-[var(--text-primary)]">Show on Scroll</span>
                                            <Toggle enabled={config.behavior.showOnScroll} onToggle={() => updateBehavior('showOnScroll', !config.behavior.showOnScroll)} />
                                        </div>

                                        {config.behavior.showOnScroll && (
                                             <Slider 
                                                label="Scroll Percentage" 
                                                value={config.behavior.scrollPercentage} 
                                                min={10} max={100} 
                                                onChange={(v) => updateBehavior('scrollPercentage', v)} 
                                                unit="%"
                                            />
                                        )}
                                    </div>
                                </FormGroup>
                                
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-6">
                                    <h4 className="text-blue-800 dark:text-blue-300 font-semibold text-sm mb-2">Behavior Note</h4>
                                    <p className="text-blue-600 dark:text-blue-400 text-xs leading-relaxed">
                                        Triggers are additive. The popup will show when <strong>ANY</strong> enabled trigger condition is met. It will only show once per session.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Panel: Live Preview */}
                <div className="flex-1 bg-zinc-100 dark:bg-black/50 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col relative overflow-hidden">
                    <div className="absolute top-4 left-4 bg-zinc-800 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-50">
                        LIVE PREVIEW
                    </div>
                    
                    {/* Preview Viewport */}
                    <div className="flex-1 relative flex items-center justify-center overflow-auto p-8 bg-[url('https://placehold.co/1920x1080/e4e4e7/ffffff?text=Website+Content+Background')] bg-cover bg-center">
                         {/* We render a simulated backdrop to show opacity accurately if centered */}
                        {config.style.position === 'center' && (
                             <div 
                                className="absolute inset-0 transition-colors duration-300" 
                                style={{ backgroundColor: config.style.overlayColor }}
                            />
                        )}
                        
                        {/* The Actual Component Instance in Preview Mode */}
                        <div className={`z-10 transition-all duration-500 ${
                            config.style.position === 'bottom-right' ? 'absolute bottom-8 right-8' :
                            config.style.position === 'bottom-left' ? 'absolute bottom-8 left-8' :
                            config.style.position === 'top-center' ? 'absolute top-8 left-1/2 -translate-x-1/2' :
                            '' // center uses flex centering from parent
                        }`}>
                             <PopupContentRenderer 
                                config={config} 
                                onClose={() => {}} 
                                previewMode={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPopupSettingsPage;
