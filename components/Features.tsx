import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from '../constants';

// Icons as React Components that accept a className prop
const ShieldCheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624l.21-1.401a2.25 2.25 0 00-1.625-2.312l-1.401-.21a2.25 2.25 0 00-2.312 1.625l-.21 1.401a2.25 2.25 0 001.625 2.312l1.401.21a2.25 2.25 0 002.312-1.625z" />
    </svg>
);


interface FeatureProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureProps> = ({ icon: Icon, title, description }) => (
    <motion.div
        className="text-center p-3 sm:p-4"
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
    >
        <Icon className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-amber-600" />
        <h3 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-zinc-800">{title}</h3>
        <p className="mt-1 text-xs sm:text-sm text-zinc-600 leading-tight sm:leading-normal">{description}</p>
    </motion.div>
);

const Features: React.FC = () => {
    return (
        <motion.section
            className="bg-white py-6 sm:py-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ staggerChildren: 0.2 }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 divide-x divide-pink-200">
                    <FeatureCard
                        icon={ShieldCheckIcon}
                        title="Safe Payments"
                        description="Shop with confidence using our secure payment options."
                    />
                    <FeatureCard
                        icon={SparklesIcon}
                        title="Custom Orders"
                        description="We love bringing your unique custom creations to life."
                    />
                    <FeatureCard
                        icon={HeartIcon}
                        title="Handmade w/ Love"
                        description="Every piece is crafted by hand, ensuring a one-of-a-kind treasure."
                    />
                </div>
            </div>
        </motion.section>
    );
};

export default Features;
