
import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import { XIcon } from './Icons';

interface SizeGuideModalProps {
    onClose: () => void;
    category?: string;
}

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

type SizeGuideData = {
    title: string;
    description: string;
    headers: string[];
    rows: string[][];
    tips?: string[];
};

const SIZE_GUIDES: Record<string, SizeGuideData> = {
    rings: {
        title: 'Ring Size Chart',
        description: "Measure your finger's circumference in millimeters to find your size.",
        headers: ['US Size', 'UK Size', 'Diameter (mm)', 'Circumference (mm)'],
        rows: [
            ['5', 'J 1/2', '15.7', '49.3'],
            ['6', 'L 1/2', '16.5', '51.9'],
            ['7', 'N 1/2', '17.3', '54.4'],
            ['8', 'P 1/2', '18.1', '57.0'],
            ['9', 'R 1/2', '19.0', '59.5'],
            ['10', 'T 1/2', '19.8', '62.1'],
        ],
        tips: [
            'Measure your finger at the end of the day when it is largest.',
            'Avoid measuring when your hands are cold, as they shrink.',
            'If you fall between two sizes, we recommend ordering the larger size.'
        ]
    },
    necklaces: {
        title: 'Necklace Length Guide',
        description: "Refer to the chart below to see where different chain lengths typically fall.",
        headers: ['Length', 'Style', 'Placement'],
        rows: [
            ['14-16"', 'Choker', 'Base of the throat'],
            ['18"', 'Princess', 'On the collarbone'],
            ['20-24"', 'Matinee', 'Between collarbone and bust'],
            ['30"', 'Opera', 'On the bust or below'],
        ],
        tips: [
            '18" is the most common standard length.',
            'Consider the neckline of the clothing you plan to wear with it.'
        ]
    },
    bracelets: {
        title: 'Bracelet Size Chart',
        description: "Find your perfect fit by measuring your wrist circumference.",
        headers: ['Size', 'Wrist (in)', 'Wrist (cm)'],
        rows: [
            ['XS', '5.5 - 6.0', '14.0 - 15.2'],
            ['S', '6.0 - 6.5', '15.2 - 16.5'],
            ['M', '6.5 - 7.0', '16.5 - 17.8'],
            ['L', '7.0 - 7.5', '17.8 - 19.0'],
            ['XL', '7.5 - 8.0', '19.0 - 20.3'],
        ],
        tips: [
            'Measure tightly and add 0.5 inches for a comfortable fit.',
            'Use a piece of string and a ruler if you don\'t have a measuring tape.'
        ]
    }
};

const getGuideKey = (category: string = ''): string | null => {
    const cat = category.toLowerCase();
    if (cat.includes('ring')) return 'rings';
    if (cat.includes('necklace')) return 'necklaces';
    if (cat.includes('bracelet') || cat.includes('wrist')) return 'bracelets';
    return null;
};

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ onClose, category }) => {
    const guideKey = getGuideKey(category);
    // If a match is found, show only that guide. Otherwise, show all guides.
    const guidesToShow = guideKey ? { [guideKey]: SIZE_GUIDES[guideKey] } : SIZE_GUIDES;

    return (
        <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                variants={backdropVariants}
                onClick={onClose}
            />
            <motion.div
                className="relative w-full max-w-2xl bg-bg-secondary rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                variants={modalVariants}
            >
                <div className="flex items-center justify-between p-4 border-b border-border-primary bg-bg-tertiary flex-shrink-0">
                    <h2 className="text-lg font-bold text-text-primary">Size Guide</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-bg-primary transition-colors">
                        <XIcon />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-12">
                        {Object.entries(guidesToShow).map(([key, guide]) => (
                            <section key={key}>
                                <h3 className="text-xl font-semibold text-accent-primary mb-2">{guide.title}</h3>
                                <p className="text-sm text-text-secondary mb-4">{guide.description}</p>
                                
                                <div className="overflow-x-auto rounded-lg border border-border-primary mb-4">
                                    <table className="w-full text-sm text-left text-text-secondary">
                                        <thead className="text-xs text-text-primary uppercase bg-bg-tertiary">
                                            <tr>
                                                {guide.headers.map((header, idx) => (
                                                    <th key={idx} className="px-6 py-3 font-semibold">{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guide.rows.map((row, rowIdx) => (
                                                <tr key={rowIdx} className="border-b border-border-primary last:border-0 hover:bg-bg-tertiary/50 transition-colors">
                                                    {row.map((cell, cellIdx) => (
                                                        <td key={cellIdx} className={`px-6 py-3 ${cellIdx === 0 ? 'font-medium text-text-primary' : ''}`}>
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {guide.tips && (
                                    <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                                        <h4 className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase mb-2">Measuring Tips</h4>
                                        <ul className="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                                            {guide.tips.map((tip, idx) => (
                                                <li key={idx}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        ))}

                        {Object.keys(guidesToShow).length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-text-secondary">Sizing information is not available for this specific category.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SizeGuideModal;
