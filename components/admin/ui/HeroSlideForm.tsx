

import * as React from 'react';
import { HeroSlide } from '../../../types';

interface HeroSlideFormProps {
    slide: HeroSlide | null;
    onSave: (slide: HeroSlide, imageFile?: File) => void;
    onCancel: () => void;
}

const emptySlide: Omit<HeroSlide, 'id'> = {
    title: '',
    subtitle: '',
    imageUrl: 'https://placehold.co/1200x600/FFF0E6/F97316?text=Hero+Image',
    buttonText: 'Shop Now',
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">{label}</label>
        <input id={id} {...props} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2" />
    </div>
);

const HeroSlideForm: React.FC<HeroSlideFormProps> = ({ slide, onSave, onCancel }) => {
    const [formData, setFormData] = React.useState<HeroSlide | Omit<HeroSlide, 'id'>>(slide || emptySlide);
    const [imageFile, setImageFile] = React.useState<File | undefined>();
    const [imagePreview, setImagePreview] = React.useState(slide?.imageUrl || emptySlide.imageUrl);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as HeroSlide, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <Input label="Title" id="title" name="title" value={formData.title} onChange={handleChange} required />
                    <Input label="Subtitle" id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} required />
                    <Input label="Button Text" id="buttonText" name="buttonText" value={formData.buttonText} onChange={handleChange} required />
                     <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)]">Hero Image</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg, image/gif"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-1 w-full text-center px-4 py-2 border border-dashed border-zinc-300 dark:border-zinc-600 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                            Upload Image
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Image Preview</label>
                    <img src={imagePreview} alt="Hero slide preview" className="rounded-lg shadow-sm w-full aspect-video object-cover"/>
                </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4 border-t border-[var(--border-primary)]">
                <button type="button" onClick={onCancel} className="bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 text-zinc-800 dark:text-zinc-200 font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Save Slide</button>
            </div>
        </form>
    );
};

export default HeroSlideForm;