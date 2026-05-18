
import * as React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Product, HomepageSections, HomepageSectionConfig } from '../../../types';
import { DragHandleIcon } from '../../Icons';

const ItemType = 'PRODUCT';

// Simple check for touch devices
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const DraggableProductItem: React.FC<{ product: Product, index: number, moveItem: (dragIndex: number, hoverIndex: number) => void, onRemove: (product: Product) => void }> = ({ product, index, moveItem, onRemove }) => {
    const ref = React.useRef<HTMLLIElement>(null);
    const [, drop] = useDrop({
        accept: ItemType,
        hover(item: { index: number }) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;
            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag, preview] = useDrag({
        type: ItemType,
        item: { index },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    preview(drop(ref));

    return (
        <li ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="flex items-center justify-between p-2 bg-[var(--bg-tertiary)] rounded">
            <div className="flex items-center gap-2">
                <div ref={drag} className="cursor-move touch-action-none">
                    <DragHandleIcon />
                </div>
                <span className="text-sm truncate">{product.name}</span>
            </div>
            <button onClick={() => onRemove(product)} className="text-xs bg-zinc-300 dark:bg-zinc-600 px-2 py-1 rounded hover:bg-zinc-400">Remove</button>
        </li>
    );
};

interface HomepageSectionEditorProps {
    title: string;
    description: string;
    allProducts: Product[];
    selectedProductIds: number[];
    onUpdate: (newIds: number[]) => void;
}

const HomepageSectionEditor: React.FC<HomepageSectionEditorProps> = ({ title, description, allProducts, selectedProductIds, onUpdate }) => {
    const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([]);
    const [availableProducts, setAvailableProducts] = React.useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const selectedIdSet = new Set(selectedProductIds || []);
        const initialSelected = (selectedProductIds || [])
            .map(id => allProducts.find(p => p.id === id))
            .filter((p): p is Product => !!p);

        const initialAvailable = allProducts.filter(p => !selectedIdSet.has(p.id) && p.published);
        
        setSelectedProducts(initialSelected);
        setAvailableProducts(initialAvailable);
    }, [allProducts, selectedProductIds]);

    const handleAdd = (product: Product) => {
        const newSelected = [...selectedProducts, product];
        onUpdate(newSelected.map(p => p.id));
    };

    const handleRemove = (product: Product) => {
        const newSelected = selectedProducts.filter(p => p.id !== product.id);
        onUpdate(newSelected.map(p => p.id));
    };

    const moveProduct = (dragIndex: number, hoverIndex: number) => {
        const draggedItem = selectedProducts[dragIndex];
        const updatedSelected = [...selectedProducts];
        updatedSelected.splice(dragIndex, 1);
        updatedSelected.splice(hoverIndex, 0, draggedItem);
        onUpdate(updatedSelected.map(p => p.id));
    };

    const filteredAvailable = availableProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Use TouchBackend on touch devices, otherwise use HTML5Backend
    const backend = isTouchDevice() ? TouchBackend : HTML5Backend;

    return (
        <DndProvider backend={backend} options={{ enableMouseEvents: !isTouchDevice() }}>
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
                            {selectedProducts.map((p, i) => (
                                <DraggableProductItem key={p.id} index={i} product={p} moveItem={moveProduct} onRemove={handleRemove} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

const HOMEPAGE_SECTIONS_CONFIG: HomepageSectionConfig[] = [
    {
        id: 'bestsellers',
        title: 'Featured Products',
        description: 'These products will be displayed in the "Featured" section on the homepage.'
    },
    {
        id: 'preorders',
        title: 'Preorder Deals',
        description: 'These products will be displayed in the "Preorder Deals" section on the homepage.'
    },
    {
        id: 'deals',
        title: 'New Arrivals',
        description: 'These products will be displayed in the "New Arrivals" section on the homepage.'
    },
];

interface AdminHomepagePageProps {
    allProducts: Product[];
    sections: HomepageSections;
    onSave: (sections: HomepageSections) => void;
}

const AdminHomepagePage: React.FC<AdminHomepagePageProps> = ({ allProducts, sections, onSave }) => {

    const handleUpdateSection = (sectionId: keyof HomepageSections, newIds: number[]) => {
        onSave({
            ...sections,
            [sectionId]: newIds
        });
    };

    return (
        <div>
            <header className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Homepage Content</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage featured products on your homepage.</p>
                </div>
            </header>
            <div className="space-y-8">
                {HOMEPAGE_SECTIONS_CONFIG.map(config => (
                    <HomepageSectionEditor 
                        key={config.id}
                        title={config.title}
                        description={config.description}
                        allProducts={allProducts}
                        selectedProductIds={sections[config.id] || []}
                        onUpdate={(newIds) => handleUpdateSection(config.id, newIds)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminHomepagePage;
