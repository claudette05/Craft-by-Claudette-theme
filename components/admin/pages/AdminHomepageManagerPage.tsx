
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HomepageSection, Category, Product } from '../../../types';
import Modal from '../ui/Modal';
import { EditIcon, DeleteIcon, DragHandleIcon } from '../../Icons';

const ItemType = 'SECTION';

interface DraggableSectionProps {
    section: HomepageSection;
    index: number;
    moveSection: (dragIndex: number, hoverIndex: number) => void;
    onEdit: (section: HomepageSection) => void;
    onDelete: (sectionId: string) => void;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({ section, index, moveSection, onEdit, onDelete }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
        accept: ItemType,
        hover(item: { index: number }) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;
            moveSection(dragIndex, hoverIndex);
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
        <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="flex items-center justify-between bg-[var(--bg-secondary)] p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
                <div ref={drag} className="cursor-move">
                    <DragHandleIcon />
                </div>
                <div>
                    <h4 className="font-semibold text-lg text-[var(--text-primary)]">{section.title}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">Type: <span className="font-medium">{section.filterType}</span> | Value: <span className="font-medium">{section.filterValue}</span></p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => onEdit(section)} className="p-2 text-[var(--text-secondary)] hover:text-amber-500"><EditIcon /></button>
                <button onClick={() => onDelete(section.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500"><DeleteIcon /></button>
            </div>
        </div>
    );
};


interface SectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (section: HomepageSection) => void;
    section: HomepageSection | null;
    allCategories: Category[];
    allTags: string[];
}

const SectionModal: React.FC<SectionModalProps> = ({ isOpen, onClose, onSave, section, allCategories, allTags }) => {
    const [title, setTitle] = React.useState('');
    const [filterType, setFilterType] = React.useState<'category' | 'tag'>('category');
    const [filterValue, setFilterValue] = React.useState('');

    React.useEffect(() => {
        if (section) {
            setTitle(section.title);
            setFilterType(section.filterType);
            setFilterValue(section.filterValue);
        } else {
            setTitle('');
            setFilterType('category');
            setFilterValue('');
        }
    }, [section, isOpen]);

    const handleSave = () => {
        if (!title || !filterValue) {
            alert("Please provide a title and select a filter value.");
            return;
        }
        onSave({
            id: section ? section.id : `section_${Date.now()}`,
            title,
            filterType,
            filterValue,
        });
        onClose();
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <Modal title={section ? 'Edit Section' : 'Add New Section'} onClose={onClose}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Section Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Filter Type</label>
                        <select value={filterType} onChange={e => setFilterType(e.target.value as any)} className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-700">
                            <option value="category">Category</option>
                            <option value="tag">Tag</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Filter Value</label>
                        <select value={filterValue} onChange={e => setFilterValue(e.target.value)} className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-700">
                            <option value="">Select a value</option>
                            {(filterType === 'category' ? allCategories.map(c => c.name) : allTags).map(val => (
                                <option key={val} value={val}>{val}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={onClose} className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-600">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 rounded bg-amber-500 text-white">Save Section</button>
                    </div>
                </div>
            </Modal>
        )}
        </AnimatePresence>
    );
};

interface AdminHomepageManagerPageProps {
    sections: HomepageSection[];
    onUpdate: (sections: HomepageSection[]) => void;
    allCategories: Category[];
    allProducts: Product[];
}

const AdminHomepageManagerPage: React.FC<AdminHomepageManagerPageProps> = ({ sections, onUpdate, allCategories, allProducts }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingSection, setEditingSection] = React.useState<HomepageSection | null>(null);

    const allTags = React.useMemo(() => {
        const tags = new Set<string>();
        allProducts.forEach(p => p.tags?.forEach(t => tags.add(t)));
        return Array.from(tags);
    }, [allProducts]);

    const moveSection = (dragIndex: number, hoverIndex: number) => {
        const draggedSection = sections[dragIndex];
        const updated = [...sections];
        updated.splice(dragIndex, 1);
        updated.splice(hoverIndex, 0, draggedSection);
        onUpdate(updated);
    };

    const handleAddNew = () => { setEditingSection(null); setIsModalOpen(true); };
    const handleEdit = (section: HomepageSection) => { setEditingSection(section); setIsModalOpen(true); };
    
    const handleDelete = (sectionId: string) => {
        if(window.confirm('Are you sure you want to delete this section?')) {
            const updated = sections.filter(s => s.id !== sectionId);
            onUpdate(updated);
        }
    };

    const handleSaveSection = (section: HomepageSection) => {
        const isEditing = sections.some(s => s.id === section.id);
        const updated = isEditing 
            ? sections.map(s => s.id === section.id ? section : s)
            : [...sections, section];
        onUpdate(updated);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <header className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Homepage Content Manager</h1>
                        <p className="text-[var(--text-secondary)] mt-1">Create and manage custom product sections for your homepage.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleAddNew} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Add New Section
                        </button>
                    </div>
                </header>
                
                <div className="space-y-4">
                    {sections.length > 0 ? (
                        sections.map((section, i) => (
                            <DraggableSection
                                key={section.id}
                                index={i}
                                section={section}
                                moveSection={moveSection}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
                            <p className="text-[var(--text-secondary)]">No custom sections yet. Click 'Add New Section' to get started!</p>
                        </div>
                    )}
                </div>

                <SectionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveSection}
                    section={editingSection}
                    allCategories={allCategories}
                    allTags={allTags}
                />
            </div>
        </DndProvider>
    );
};

export default AdminHomepageManagerPage;
