
import * as React from 'react';
import { HeroSlide, Category } from '../../../types';
import { UploadIcon, VideoIcon } from '../../Icons';

interface HeroSlideFormProps {
    slide: HeroSlide | null;
    categories: Category[];
    onSave: (slide: HeroSlide, imageFile?: File, videoFile?: File) => void;
    onCancel: () => void;
}

const HeroSlideForm: React.FC<HeroSlideFormProps> = ({ slide, categories, onSave, onCancel }) => {
    const [formData, setFormData] = React.useState<Partial<HeroSlide>>({});
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [videoPreview, setVideoPreview] = React.useState<string | null>(null);
    const [videoFile, setVideoFile] = React.useState<File | null>(null);
    
    const imageFileInputRef = React.useRef<HTMLInputElement>(null);
    const videoFileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (slide) {
            setFormData(slide);
            setImagePreview(slide.imageUrl);
            setVideoPreview(slide.videoUrl || null);
        } else {
            setFormData({ title: '', subtitle: '', ctaText: 'Shop Now', ctaLink: '#' });
            setImagePreview(null);
            setVideoPreview(null);
        }
    }, [slide]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setVideoFile(null);
            setVideoPreview(null);
            setFormData(prev => ({...prev, videoUrl: undefined}));
        }
    };
    
    const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
            setImageFile(null);
            setImagePreview(null);
            setFormData(prev => ({...prev, imageUrl: ''}));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as HeroSlide, imageFile || undefined, videoFile || undefined);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-[var(--text-primary)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <InputField label="Title" name="title" value={formData.title || ''} onChange={handleChange} required />
                    <InputField label="Subtitle" name="subtitle" value={formData.subtitle || ''} onChange={handleChange} required />
                    <InputField label="CTA Button Text" name="ctaText" value={formData.ctaText || ''} onChange={handleChange} required />
                    <div>
                        <label htmlFor="ctaLink" className="block text-sm font-medium mb-1">CTA Button Link (Category)</label>
                        <select id="ctaLink" name="ctaLink" value={formData.ctaLink || ''} onChange={handleChange} className="w-full p-3 rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 appearance-none">
                            <option value="#">Select a Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={`/category/${cat.name.toLowerCase()}`}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Banner Image</label>
                        <div 
                            onClick={() => imageFileInputRef.current?.click()}
                            className="w-full aspect-video rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors duration-200"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="text-center p-6">
                                    <UploadIcon className="mx-auto h-12 w-12 text-zinc-400" />
                                    <p className="mt-2 text-sm text-zinc-500">Click to upload an image</p>
                                    <p className="text-xs text-zinc-400">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={imageFileInputRef} onChange={handleImageFileChange} className="hidden" accept="image/*" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Or, Upload a Banner Video</label>
                        {videoPreview && (
                             <div className="mb-2">
                                <video src={videoPreview} controls className="rounded-lg shadow-sm w-full aspect-video" />
                            </div>
                        )}
                        <input type="file" accept="video/*" ref={videoFileInputRef} onChange={handleVideoFileChange} className="hidden" />
                        <button 
                            type="button" 
                            onClick={() => videoFileInputRef.current?.click()} 
                            className="w-full text-sm text-center py-2 bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 rounded-md text-[var(--text-primary)] transition-colors flex items-center justify-center gap-2"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15.5 10.25-3.75 3.75-3.75-3.75"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.25 12.75v-1.5a5 5 0 0 0-5-5h-1.5"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.75 11.25v1.5a5 5 0 0 0 5 5h1.5"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.25 12.75a5 5 0 0 1-5 5h-1.5"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.75 11.25a5 5 0 0 1 5-5h1.5"></path></svg>
                            {videoPreview || (formData.videoUrl && !videoFile) ? 'Change Video' : 'Upload Video'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-[var(--border-primary)]">
                <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 font-semibold transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors">
                    {slide ? 'Save Changes' : 'Create Slide'}
                </button>
            </div>
        </form>
    );
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium mb-1">{label}</label>
        <input id={props.name} {...props} className="w-full p-3 rounded-md border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50" />
    </div>
);

export default HeroSlideForm;
