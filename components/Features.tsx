import * as React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ShieldCheckIcon, SparklesIcon } from './Icons';

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
        <Icon className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-accent-primary" />
        <h3 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 text-xs sm:text-sm text-text-secondary leading-tight sm:leading-normal">{description}</p>
    </motion.div>
);

const Features: React.FC = () => {
    return (
        <motion.section
            className="bg-bg-secondary py-6 sm:py-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ staggerChildren: 0.2 }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 divide-x divide-border-primary">
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