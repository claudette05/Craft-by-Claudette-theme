
import * as React from 'react';
import { motion } from 'framer-motion';
import { ProductReview } from '../types';
import { StarIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

const CustomerLovePage: React.FC = () => {
    const { reviews } = useAppContext();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-pink-50/50 dark:bg-gray-900/50 pt-24 pb-16"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-amber-700 dark:text-amber-500">Customer Love</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Here's what our amazing customers are saying about their creations. We are so grateful for your support!</p>
                </div>

                {reviews.length > 0 ? (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 sm:gap-8">
                        {reviews.map((review, index) => (
                            <motion.div 
                                key={review.id} 
                                className="break-inside-avoid-column mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {review.imageUrl && (
                                    <img
                                        src={review.imageUrl}
                                        alt={`Testimonial from ${review.author}`}
                                        className="w-full h-auto object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <div className="flex items-center mb-3">
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{review.title}</h3>
                                    {review.comment && <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">&ldquo;{review.comment}&rdquo;</p>}
                                    <div className="flex items-center justify-between mt-5">
                                        <p className="text-sm font-bold text-amber-800 dark:text-amber-400">{review.author}</p>
                                        {review.verifiedPurchase && (
                                             <div className="flex items-center gap-1 text-[10px] text-green-700 dark:text-green-400 font-bold">
                                                 <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                 </svg>
                                                 <span>Verified</span>
                                             </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500">No reviews yet. Be the first to share your love!</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
        ))}
    </div>
);

export default CustomerLovePage;
