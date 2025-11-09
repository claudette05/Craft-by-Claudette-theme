
import React from 'react';
// FIX: Import Variants from framer-motion to correctly type animation variants.
import { motion, Variants } from 'framer-motion';
import { Testimonial } from '../types';

interface TestimonialsProps {
    testimonials: Testimonial[];
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg 
        className={`w-5 h-5 ${filled ? 'text-amber-500' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

// FIX: Correctly type the variants object with the `Variants` type from framer-motion.
const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100
        }
    },
};

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2 
                    className="text-2xl md:text-3xl font-bold text-center mb-12 text-zinc-800"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    From Our Customers
                </motion.h2>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {testimonials.map(testimonial => (
                        <motion.div 
                            key={testimonial.id}
                            className="bg-pink-50/50 p-6 md:p-8 rounded-lg shadow-sm"
                            variants={itemVariants}
                        >
                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} filled={i < testimonial.rating} />
                                ))}
                            </div>
                            <p className="text-zinc-600 italic mb-6">"{testimonial.quote}"</p>
                            <p className="font-bold text-amber-700">{testimonial.name}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;