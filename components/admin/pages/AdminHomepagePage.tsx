

import * as React from 'react';
import { motion } from 'framer-motion';
import { Product, HomepageSections } from '../../../types';
import { HOMEPAGE_SECTIONS_CONFIG } from '../../../constants';

interface HomepageSectionEditorProps {
    title: string;
    description: string;
    allProducts: Product[];
    selectedProductIds: number[];
    onUpdate: (newIds: number[]) => void;
}

const HomepageSectionEditor: React.FC<HomepageSectionEditorProps> = ({ title, description, allProducts, selectedProductIds, onUpdate }) => {
    const [selected, setSelected] = React.useState<Product[]>([]);
    const [available, setAvailable] = React.useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const selectedSet = new Set(selectedProductIds);
        const initialSelected = allProducts.filter(p => selectedSet.has(p.id));
        // Maintain original order
        initialSelected.sort((a, b) => selectedProductIds.indexOf(a.id) - selectedProductIds.indexOf(b.id));

        const initialAvailable = allProducts.filter(p => !selectedSet.has(p.id) && p.published);
        
        setSelected(initialSelected);
        setAvailable(initialAvailable);
    }, [allProducts, selectedProductIds]);

    const handleAdd = (product: Product) => {
        const newSelected = [...selected, product];
        const newAvailable = available.filter(p => p.id !== product.id);
        setSelected(newSelected);
        setAvailable(newAvailable);
        onUpdate(newSelected.map(p => p.id));
    };

    const handleRemove = (product: Product) => {
        const newAvailable = [...available, product];
        const newSelected = selected.filter(p => p.id !== product.id);
        setAvailable(newAvailable);
        setSelected(newSelected);
        onUpdate(newSelected.map(p => p.id));
    };

    const filteredAvailable = available.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 mb-4">{description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available Products */}
                <div>
                    <h4 className="font-semibold mb-2">Available Products</h4>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-2 mb-2 rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50"
                    />
                    <ul className="h-72 overflow-y-auto border border-zinc-200 dark:border-zinc-700 rounded-md p-2 space-y-2">
                        {filteredAvailable.map(p => (
                            <li key={p.id} className="flex items-center justify-between p-2 bg-[var(--bg-tertiary)] rounded">
                                <span className="text-sm truncate">{p.name}</span>
                                <button onClick={() => handleAdd(p)} className="text-xs bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600">Add</button>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Selected Products */}
                <div>
                    <h4 className="font-semibold mb-2">Selected Products (Drag to reorder)</h4>
                    <ul className="h-72 overflow-y-auto border border-zinc-200 dark:border-zinc-700 rounded-md p-2 space-y-2">
                        {selected.map(p => (
                             <li key={p.id} className="flex items-center justify-between p-2 bg-[var(--bg-tertiary)] rounded">
                                <span className="text-sm truncate">{p.name}</span>
                                <button onClick={() => handleRemove(p)} className="text-xs bg-zinc-300 dark:bg-zinc-600 px-2 py-1 rounded hover:bg-zinc-400">Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


interface AdminHomepagePageProps {
    allProducts: Product[];
    sections: HomepageSections;
    onSave: (sections: HomepageSections) => void;
}

const AdminHomepagePage: React.FC<AdminHomepagePageProps> = ({ allProducts, sections, onSave }) => {
    const [currentSections, setCurrentSections] = React.useState<HomepageSections>(sections);

    React.useEffect(() => {
        setCurrentSections(sections);
    }, [sections]);

    const handleUpdateSection = (sectionId: keyof HomepageSections, newIds: number[]) => {
        setCurrentSections(prev => ({
            ...prev,
            [sectionId]: newIds
        }));
    };

    const handleSaveChanges = () => {
        onSave(currentSections);
    };

    return (
        <div>
            <header className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Homepage Content</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage featured products on your homepage.</p>
                </div>
                <button onClick={handleSaveChanges} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Save Changes
                </button>
            </header>
            <div className="space-y-8">
                {HOMEPAGE_SECTIONS_CONFIG.map(config => (
                    <HomepageSectionEditor 
                        key={config.id}
                        title={config.title}
                        description={config.description}
                        allProducts={allProducts}
                        selectedProductIds={currentSections[config.id as keyof HomepageSections]}
                        onUpdate={(newIds) => handleUpdateSection(config.id, newIds)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminHomepagePage;
