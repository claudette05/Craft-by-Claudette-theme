
import * as React from 'react';
import { HeroSlide, Category } from '../../../types';
import { EditIcon, DeleteIcon, AddIcon } from '../../Icons';

interface AdminHeroPageProps {
    slides: HeroSlide[];
    categories: Category[];
    onAddSlide: () => void;
    onEditSlide: (slide: HeroSlide) => void;
    onDeleteSlide: (slideId: number) => void;
}

const AdminHeroPage: React.FC<AdminHeroPageProps> = ({ slides, categories, onAddSlide, onEditSlide, onDeleteSlide }) => {

    return (
        <div>
            <header className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Hero Section</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage the slides in your homepage hero carousel.</p>
                </div>
                <button onClick={onAddSlide} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    <AddIcon />
                    <span>Add New Slide</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map(slide => (
                    <div key={slide.id} className="bg-[var(--bg-secondary)] rounded-lg shadow-sm overflow-hidden group">
                        <div className="relative h-48">
                            <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => onEditSlide(slide)} className="p-3 bg-white/20 rounded-full text-white hover:bg-white/40"><EditIcon /></button>
                                    <button onClick={() => onDeleteSlide(slide.id)} className="p-3 bg-white/20 rounded-full text-white hover:bg-white/40"><DeleteIcon /></button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-[var(--text-primary)]">{slide.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">{slide.subtitle}</p>
                            <div className="mt-3 text-xs">
                                <span className="font-semibold">CTA:</span> <a href={slide.ctaLink} className="text-amber-500 hover:underline">{slide.ctaText}</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminHeroPage;
