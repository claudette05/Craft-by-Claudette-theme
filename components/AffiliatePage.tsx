
import * as React from 'react';
import { motion } from 'framer-motion';

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const AffiliatePage: React.FC = () => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for your interest! We will review your application and get back to you soon.');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-20 bg-pink-50"
        >
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557825835-b4527f242af7?q=80&w=2670&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <motion.div 
                    className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold">Partner With Us & Earn</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">Join the Craft by Claudette affiliate family, share your love for handmade creations, and earn commissions on every sale you refer.</p>
                    <motion.a
                        href="#join-form"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-lg"
                    >
                        Become an Affiliate
                    </motion.a>
                </motion.div>
            </section>

            {/* How it Works Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-zinc-800 mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                            <div className="bg-amber-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto text-amber-600 text-3xl font-bold">1</div>
                            <h3 className="text-xl font-semibold mt-6 mb-2">Sign Up</h3>
                            <p className="text-zinc-600">Fill out our simple application form to join the program. It's free and takes just a few minutes.</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <div className="bg-amber-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto text-amber-600 text-3xl font-bold">2</div>
                            <h3 className="text-xl font-semibold mt-6 mb-2">Share Your Link</h3>
                            <p className="text-zinc-600">You'll get a unique referral link. Share it on your blog, social media, or with friends and family.</p>
                        </motion.div>
                         <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                            <div className="bg-amber-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto text-amber-600 text-3xl font-bold">3</div>
                            <h3 className="text-xl font-semibold mt-6 mb-2">Earn Commission</h3>
                            <p className="text-zinc-600">Earn a 10% commission on every single purchase made through your unique link.</p>
                        </motion.div>
                    </div>
                </div>
            </section>
            
            {/* Perks Section */}
            <section className="py-16 bg-pink-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-zinc-800 mb-12">Affiliate Perks & Benefits</h2>
                    <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {['Competitive 10% commission', '30-day cookie window', 'Exclusive discounts for your followers', 'Early access to new products', 'Opportunities for features on our socials', 'A dedicated affiliate support team'].map((perk, index) => (
                             <motion.div 
                                key={index} 
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, x: -20 }} 
                                whileInView={{ opacity: 1, x: 0 }} 
                                viewport={{ once: true }} 
                                transition={{ delay: index * 0.1 }}
                            >
                                <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <span className="text-zinc-700">{perk}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Join Form Section */}
            <section id="join-form" className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-zinc-800 mb-2">Ready to Join?</h2>
                        <p className="text-center text-zinc-600 mb-8">Let's create something beautiful together.</p>
                        <motion.form 
                            onSubmit={handleSubmit}
                            className="bg-pink-50 p-8 rounded-lg shadow-md space-y-6"
                            initial={{ opacity: 0, y: 20 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700">Full Name</label>
                                    <input type="text" id="name" required className="mt-1 block w-full px-4 py-2 rounded-lg border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Email Address</label>
                                    <input type="email" id="email" required className="mt-1 block w-full px-4 py-2 rounded-lg border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="social" className="block text-sm font-medium text-zinc-700">Instagram Handle or Website URL</label>
                                <input type="text" id="social" required className="mt-1 block w-full px-4 py-2 rounded-lg border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-zinc-700">Tell us why you'd be a great fit!</label>
                                <textarea id="message" rows={4} className="mt-1 block w-full px-4 py-2 rounded-lg border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"></textarea>
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
                            >
                                Apply Now
                            </motion.button>
                        </motion.form>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default AffiliatePage;