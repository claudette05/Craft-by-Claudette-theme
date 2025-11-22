
import * as React from 'react';
import { Promotion } from '../../../types';

interface PromotionFormProps {
    promotion: Promotion | null;
    onSave: (promotion: Promotion) => void;
    onCancel: () => void;
}

const emptyPromotion: Omit<Promotion, 'id' | 'usageCount'> = {
    code: '',
    type: 'Percentage',
    value: 0,
    status: 'Active',
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">{label}</label>
        <input id={id} {...props} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 text-[var(--text-primary)]" />
    </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, id, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">{label}</label>
        <select id={id} {...props} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 text-[var(--text-primary)]">
            {children}
        </select>
    </div>
);

const PromotionForm: React.FC<PromotionFormProps> = ({ promotion, onSave, onCancel }) => {
    const [formData, setFormData] = React.useState<Promotion | Omit<Promotion, 'id' | 'usageCount'>>(promotion || emptyPromotion);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        const parsedValue = isNumber ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Cast to Promotion, assuming ID will be handled by the saver if missing
        onSave(formData as Promotion);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input 
                    label="Promo Code" 
                    id="code" 
                    name="code" 
                    value={formData.code} 
                    onChange={handleChange} 
                    placeholder="e.g., SUMMERSALE"
                    required 
                    style={{ textTransform: 'uppercase' }}
                />
                <Select label="Status" id="status" name="status" value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Expired">Expired</option>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Select label="Discount Type" id="type" name="type" value={formData.type} onChange={handleChange}>
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount (GH₵)</option>
                </Select>
                <Input 
                    label="Value" 
                    id="value" 
                    name="value" 
                    type="number" 
                    value={formData.value} 
                    onChange={handleChange} 
                    min="0"
                    step={formData.type === 'Fixed' ? "0.01" : "1"}
                    required 
                />
            </div>
            
            <div className="flex justify-end gap-4 pt-4 border-t border-[var(--border-primary)]">
                <button type="button" onClick={onCancel} className="bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 text-zinc-800 dark:text-zinc-200 font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Save Promotion</button>
            </div>
        </form>
    );
};

export default PromotionForm;
