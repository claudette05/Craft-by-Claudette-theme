import * as React from 'react';
import { motion } from 'framer-motion';
import { ProductReview, Page } from '../types';
import { StarIcon } from './Icons';

interface HomepageCustomerLoveProps {
  reviews: ProductReview[];
  onNavigate: (page: Page) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`h-4 w-4 sm:h-5 sm:w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
        ))}
    </div>
);

const HomepageCustomerLove: React.FC<HomepageCustomerLoveProps> = ({ reviews, onNavigate }) => {
  // Display only top 3-4 featured or recent reviews
  const displayReviews = [...reviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  if (displayReviews.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-bg-secondary/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Customer Love 🤍</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">See what our community is saying about their custom pieces.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-bg-primary rounded-2xl p-6 shadow-sm border border-border-primary hover:shadow-md transition-shadow relative"
            >
              <div className="absolute -top-3 -right-3 text-4xl opacity-10">💬</div>
              <StarRating rating={review.rating} />
              <h3 className="font-bold text-text-primary mt-4 mb-2 line-clamp-1">{review.title}</h3>
              <p className="text-text-secondary text-sm line-clamp-4 italic mb-6">"{review.comment}"</p>
              
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border-primary">
                  <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold text-sm">
                      {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{review.author}</p>
                    {review.verifiedPurchase && (
                        <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">Verified Buyer</p>
                    )}
                  </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('customerLove')}
            className="px-8 py-3 rounded-full bg-transparent border-2 border-accent-primary text-accent-primary font-semibold hover:bg-accent-primary hover:text-white transition-colors"
          >
            View More Reviews
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default HomepageCustomerLove;
