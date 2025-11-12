import * as React from 'react';
import { motion } from 'framer-motion';
import { Product, ProductReview } from '../types';

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

const Star: React.FC<{ filled?: boolean; half?: boolean, className?: string }> = ({ filled = false, half = false, className }) => {
    const gradientId = `half-fill-${React.useId()}`;
    return (
        <svg className={`${className} text-amber-400`} fill="currentColor" viewBox="0 0 20 20">
            <defs>
                <linearGradient id={gradientId}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#d1d5db" stopOpacity="1" />
                </linearGradient>
            </defs>
            <path
                fill={half ? `url(#${gradientId})` : (filled ? "currentColor" : "#d1d5db")}
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
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 pb-16"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-sm text-zinc-500">
                    <button onClick={onBackToProduct} className="hover:text-amber-600">Back to Product</button> / <span className="text-zinc-800 font-medium">Reviews</span>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-white rounded-lg shadow-sm">
                    <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-zinc-800">{product.name}</h1>
                        <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                            <StarRating rating={averageRating} />
                            <span className="font-semibold text-zinc-700">{averageRating.toFixed(1)} out of 5</span>
                            <span className="text-zinc-500">({reviews.length} ratings)</span>
                        </div>
                    </div>
                    <div className="sm:ml-auto">
                        <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full transition-colors">
                            Write a review
                        </button>
                    </div>
                </div>

                {/* Reviews List */}
                <motion.div
                    className="space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            className="bg-white p-6 rounded-lg shadow-sm"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <div className="flex items-center mb-2">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-600">
                                    {review.author.charAt(0)}
                                </div>
                                <div className="ml-4">
                                    <p className="font-semibold text-zinc-800">{review.author}</p>
                                    <p className="text-xs text-zinc-500">{review.date}</p>
                                </div>
                                {review.verifiedPurchase && (
                                    <div className="ml-auto flex items-center gap-1 text-xs text-green-600">
                                        <CheckBadgeIcon className="w-4 h-4" />
                                        <span>Verified Purchase</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center my-3">
                                <StarRating rating={review.rating} />
                                <h3 className="ml-3 font-semibold text-zinc-800">{review.title}</h3>
                            </div>
                            <p className="text-zinc-600 leading-relaxed">{review.comment}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.main>
    );
};

export default ProductReviewsPage;