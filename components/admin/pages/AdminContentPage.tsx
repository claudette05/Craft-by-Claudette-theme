
import * as React from 'react';
import { ChevronRightIcon, PhotoIcon, SparklesIcon, StarIcon, SwatchIcon } from '../../Icons';

interface ContentLinkProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const ContentLink: React.FC<ContentLinkProps> = ({ title, description, icon, onClick }) => (
    <div onClick={onClick} className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg cursor-pointer transition-colors">
        <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-lg text-amber-600 dark:text-amber-400">
            {icon}
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-[var(--text-primary)]">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        </div>
        <ChevronRightIcon className="text-[var(--text-secondary)]" />
    </div>
);


const AdminContentPage: React.FC<{ onNavigate: (page: any) => void }> = ({ onNavigate }) => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Site Content</h1>
                <p className="text-[var(--text-secondary)] mt-1">Manage your website's pages, sections, and media.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ContentLink
                    icon={<PhotoIcon />}
                    title="Hero Section"
                    description="Manage the main banner carousel on your homepage."
                    onClick={() => onNavigate('hero')}
                />
                <ContentLink
                    icon={<SparklesIcon />}
                    title="Homepage Sections"
                    description="Curate 'Deals' and 'Bestsellers' product carousels."
                    onClick={() => onNavigate('homepage')}
                />
                <ContentLink
                    icon={<SwatchIcon />}
                    title="Lookbook"
                    description="Create and manage your lookbook gallery (Coming Soon)."
                    onClick={() => {}}
                />
                <ContentLink
                    icon={<StarIcon />}
                    title="Testimonials"
                    description="Showcase customer reviews and testimonials (Coming Soon)."
                    onClick={() => {}}
                />
            </div>

            <div className="mt-8 p-4 bg-amber-500/10 text-amber-700 dark:text-amber-300 dark:bg-amber-500/20 rounded-lg text-center">
                Configuration for rule-based sections like "Resin Art" and "Gifts" is also coming soon!
            </div>
        </div>
    );
};

export default AdminContentPage;
