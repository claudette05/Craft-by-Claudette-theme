
import React from 'react';
import { motion } from 'framer-motion';

const Newsletter: React.FC = () => {
    return (
        <motion.section
            className="bg-white py-12 md:py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-amber-100 rounded-lg p-6 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-amber-800 mb-2">Join the Club!</h2>
                    <p className="text-zinc-700 mb-6 max-w-2xl mx-auto text-sm md:text-base">
                        Sign up for our newsletter to get exclusive deals, early access to new collections, and a special treat on your first order.
                    </p>
                    <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full px-4 py-3 rounded-full border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                            required
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-colors flex-shrink-0"
                        >
                            Subscribe
                        </motion.button>
                    </form>
                </div>
            </div>
        </motion.section>
    );
};

export default Newsletter;
