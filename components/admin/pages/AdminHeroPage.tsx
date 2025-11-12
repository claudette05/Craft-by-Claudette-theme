import * as React from 'react';
import { motion } from 'framer-motion';
import { HeroSlide } from '../../../types';
import { TrashIcon } from '../../Icons';

interface AdminHeroPageProps {
    slides: HeroSlide[];
    onAddSlide: () => void;
    onEditSlide: (slide: HeroSlide) => void;
    onDeleteSlide: (slideId: number) => void;
}

const HeroSlideCard: React.FC<{ slide: HeroSlide; onEdit: () => void; onDelete: () => void; }> = ({ slide, onEdit, onDelete }) => (
    <div className="bg-[var(--bg-secondary)] rounded-lg shadow-sm overflow-hidden flex flex-col">
        <img src={slide.imageUrl} alt={slide.title} className="w-full h-40 object-cover" />
        <div className="p-4 flex-grow flex flex-col">
            <h3 className="font-bold text-lg text-[var(--text-primary)]">{slide.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 flex-grow">{slide.subtitle}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-2">Button: <span className="font-semibold text-[var(--text-primary)]">{slide.buttonText}</span></p>
        </div>
        <div className="p-4 bg-[var(--bg-tertiary)] flex justify-end gap-3">
            <button onClick={onEdit} className="text-sm font-medium text-amber-600 hover:text-amber-500">Edit</button>
            <button onClick={onDelete} className="text-sm font-medium text-zinc-500 hover:text-red-500"><TrashIcon/></button>
        </div>
    </div>
);


const AdminHeroPage: React.FC<AdminHeroPageProps> = ({ slides, onAddSlide, onEditSlide, onDeleteSlide }) => {
    return (
        <div>
            <header className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Hero Section</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage the slides in your homepage carousel.</p>
                </div>
                <button onClick={onAddSlide} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Add New Slide
                </button>
            </header>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
                {slides.map(slide => (
                    <motion.div key={slide.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <HeroSlideCard 
                            slide={slide} 
                            onEdit={() => onEditSlide(slide)}
                            onDelete={() => onDeleteSlide(slide.id)}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default AdminHeroPage;