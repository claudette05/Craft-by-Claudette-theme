
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductReview } from '../types';
import { useAppContext } from '../context/AppContext';

const StarRating: React.FC<{ rating: number, totalStars?: number, className?: string }> = ({ rating, totalStars = 5, className = "w-5 h-5" }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} filled className={className} />)}
            {halfStar && <Star half className={className} />}
            {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className={className} />)}
        </div>
    );
};

const ClickableStarRating: React.FC<{ rating: number, setRating: (r: number) => void }> = ({ rating, setRating }) => {
    const [hover, setHover] = React.useState(0);
    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        key={index}
                        type="button"
                        className="focus:outline-none transform transition-transform hover:scale-110"
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(rating)}
                    >
                         <Star filled={starValue <= (hover || rating)} className="w-8 h-8 cursor-pointer transition-colors duration-200" />
                    </button>
                );
            })}
        </div>
    );
};


const Star: React.FC<{ filled?: boolean; half?: boolean, className?: string }> = ({ filled = false, half = false, className }) => {
    const gradientId = `half-fill-${React.useId()}`;
    return (
        <svg className={`${className} ${filled || half ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <defs>
                <linearGradient id={gradientId}>
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#d1d5db" stopOpacity="1" />
                </linearGradient>
            </defs>
            <path
                fill={half ? `url(#${gradientId})` : "currentColor"}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
        </svg>
    );
};

const CheckBadgeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);

interface ProductReviewsPageProps {
    product: Product;
    reviews: ProductReview[];
    onBackToProduct: () => void;
}

const ProductReviewsPage: React.FC<ProductReviewsPageProps> = ({ product, reviews, onBackToProduct }) => {
    const { addReview } = useAppContext();
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    
    const [rating, setRating] = React.useState(0);
    const [author, setAuthor] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [comment, setComment] = React.useState('');

    const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }

        addReview({
            productId: product.id,
            author: author || 'Anonymous',
            rating,
            title,
            comment,
        });

        // Reset form
        setRating(0);
        setAuthor('');
        setTitle('');
        setComment('');
        setIsFormOpen(false);
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 pb-16 bg-bg-primary"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-sm text-text-secondary">
                    <button onClick={onBackToProduct} className="hover:text-accent-primary">Back to Product</button> / <span className="text-text-primary font-medium">Reviews</span>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-bg-secondary rounded-lg shadow-sm">
                    <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-text-primary">{product.name}</h1>
                        <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                            <StarRating rating={averageRating} />
                            <span className="font-semibold text-text-primary">{averageRating.toFixed(1)} out of 5</span>
                            <span className="text-text-secondary">({reviews.length} ratings)</span>
                        </div>
                    </div>
                    <div className="sm:ml-auto">
                        <button 
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="bg-accent-primary hover:bg-accent-primary/90 text-accent-text font-bold py-2 px-6 rounded-full transition-colors"
                        >
                            {isFormOpen ? 'Cancel Review' : 'Write a review'}
                        </button>
                    </div>
                </div>

                {/* Review Form */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.form
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-primary overflow-hidden"
                            onSubmit={handleSubmit}
                        >
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Share your experience</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Overall Rating</label>
                                        <ClickableStarRating rating={rating} setRating={setRating} />
                                    </div>
                                    <div>
                                        <label htmlFor="author" className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                                        <input 
                                            id="author" 
                                            type="text" 
                                            required
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            placeholder="Display name"
                                            className="w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-bg-tertiary p-2.5 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Review Title</label>
                                        <input 
                                            id="title" 
                                            type="text" 
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Sum up your experience"
                                            className="w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-bg-tertiary p-2.5 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-text-secondary mb-1">Review</label>
                                    <textarea 
                                        id="comment" 
                                        rows={6}
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tell us what you liked or didn't like..."
                                        className="w-full rounded-md border-zinc-300 dark:border-zinc-600 bg-bg-tertiary p-2.5 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none resize-none"
                                    ></textarea>
                                    <div className="mt-4 text-right">
                                        <button 
                                            type="submit"
                                            className="bg-accent-primary hover:bg-accent-primary/90 text-accent-text font-bold py-2 px-8 rounded-full transition-colors"
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Reviews List */}
                <motion.div
                    className="space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {reviews.length === 0 ? (
                        <div className="text-center py-12 text-text-secondary">
                            <p className="text-lg">No reviews yet.</p>
                            <p className="text-sm">Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <motion.div
                                key={review.id}
                                className="bg-bg-secondary p-6 rounded-lg shadow-sm border border-border-primary/50"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                <div className="flex items-center mb-2">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center font-bold text-accent-primary">
                                        {review.author.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-semibold text-text-primary">{review.author}</p>
                                        <p className="text-xs text-text-secondary">{review.date}</p>
                                    </div>
                                    {review.verifiedPurchase && (
                                        <div className="ml-auto flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                            <CheckBadgeIcon className="w-4 h-4" />
                                            <span className="hidden sm:inline">Verified Purchase</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center my-3">
                                    <StarRating rating={review.rating} />
                                    <h3 className="ml-3 font-semibold text-text-primary">{review.title}</h3>
                                </div>
                                <p className="text-text-secondary leading-relaxed">{review.comment}</p>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>
        </motion.main>
    );
};

export default ProductReviewsPage;
