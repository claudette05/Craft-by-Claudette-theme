
import React from 'react';
import { motion } from 'framer-motion';

const AboutSnippet: React.FC = () => {
    return (
        <motion.section
            className="bg-pink-50 py-12 md:py-16 sm:py-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <motion.div 
                        className="rounded-lg overflow-hidden shadow-lg"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1596496058039-ec9e403d937a?q=80&w=2574&auto=format&fit=crop" 
                            alt="Artist working on handmade jewelry"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-amber-800 mb-4">Meet the Maker</h2>
                        <p className="text-zinc-600 mb-6 leading-relaxed">
                            Welcome to Craft by Claudette, where every piece tells a story. Founded from a passion for color, creativity, and handmade charm, each item is lovingly crafted in my small home studio. I believe in the beauty of imperfection and the joy of creating something truly unique.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
                        >
                            Learn Our Story
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default AboutSnippet;
