import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductReview } from '../types';
import { useAppContext } from '../context/AppContext';
import { CheckBadgeIcon, PhotoIcon, StarIcon } from './Icons';

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
        <svg className={`${className} ${filled || half ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`} fill="currentColor" viewBox="0 0 20 20">
            <defs>
                <linearGradient id={gradientId}>
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
                </linearGradient>
            </defs>
            <path
                fill={half ? `url(#${gradientId})` : "currentColor"}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
        </svg>
    );
};

const RatingBar: React.FC<{ stars: number; percentage: number; count: number }> = ({ stars, percentage, count }) => (
    <div className="flex items-center gap-4 group">
        <div className="flex items-center gap-1 w-12 shrink-0">
            <span className="text-sm font-bold text-text-primary">{stars}</span>
            <Star filled className="w-3.5 h-3.5" />
        </div>
        <div className="flex-grow h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-amber-400 group-hover:bg-amber-500 transition-colors"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
            />
        </div>
        <span className="text-xs font-medium text-text-secondary w-10 text-right">{percentage}%</span>
    </div>
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
    const [images, setImages] = React.useState<string[]>([]);
    const [expandedImage, setExpandedImage] = React.useState<string | null>(null);

    const stats = React.useMemo(() => {
        const total = reviews.length;
        const counts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5
        reviews.forEach(r => {
            const index = Math.floor(r.rating) - 1;
            if (index >= 0 && index < 5) counts[index]++;
        });

        const average = total > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / total 
            : 0;

        return {
            total,
            average,
            breakdown: counts.map((count, i) => ({
                stars: i + 1,
                count,
                percentage: total > 0 ? Math.round((count / total) * 100) : 0
            })).reverse()
        };
    }, [reviews]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map((file: File) => URL.createObjectURL(file));
            setImages(prev => [...prev, ...newImages]);
        }
    };

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
            images,
        });

        // Reset form
        setRating(0);
        setAuthor('');
        setTitle('');
        setComment('');
        setImages([]);
        setIsFormOpen(false);
    };

    if (!product) return null;

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 pb-16 bg-bg-primary min-h-screen"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-sm text-text-secondary">
                    <button onClick={onBackToProduct} className="hover:text-accent-primary transition-colors">Home</button> / <span className="text-text-primary font-medium">Reviews</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Sidebar Stats */}
                    <aside className="lg:col-span-1 space-y-8 sticky top-28">
                        <div className="bg-bg-secondary p-8 rounded-3xl shadow-sm border border-border-primary/50">
                            <h2 className="text-xl font-black text-text-primary mb-6">Customer Reviews</h2>
                            
                            <div className="flex items-center gap-4 mb-8">
                                <div className="text-5xl font-black text-text-primary tabular-nums">
                                    {stats.average.toFixed(1)}
                                </div>
                                <div>
                                    <StarRating rating={stats.average} className="w-5 h-5" />
                                    <p className="text-sm text-text-secondary mt-1 font-medium">Based on {stats.total} reviews</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {stats.breakdown.map((row) => (
                                    <RatingBar key={row.stars} {...row} />
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-border-primary/50">
                                <h3 className="font-bold text-text-primary mb-2">Review this product</h3>
                                <p className="text-sm text-text-secondary mb-6 leading-relaxed">Share your thoughts with other customers and help them make a better choice!</p>
                                <button 
                                    onClick={() => setIsFormOpen(!isFormOpen)}
                                    className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white font-black py-4 rounded-full transition-all shadow-lg uppercase tracking-widest text-xs"
                                >
                                    {isFormOpen ? 'Cancel' : 'Write a Review'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-bg-secondary p-6 rounded-3xl border border-border-primary/30 flex items-center gap-4">
                             <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-xl" />
                             <div>
                                <h4 className="font-bold text-text-primary text-sm line-clamp-1">{product.name}</h4>
                                <p className="text-accent-primary font-black text-xs mt-0.5">GH₵{product.price.toFixed(2)}</p>
                             </div>
                        </div>
                    </aside>

                    {/* Main Content: Form & List */}
                    <div className="lg:col-span-2">
                        {/* Review Form */}
                        <AnimatePresence>
                            {isFormOpen && (
                                <motion.form
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-bg-secondary p-8 rounded-3xl shadow-xl border-2 border-accent-primary/20 mb-12 overflow-hidden"
                                    onSubmit={handleSubmit}
                                >
                                    <h3 className="text-2xl font-black text-text-primary mb-8">Tell us what you think</h3>
                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-text-primary uppercase tracking-widest mb-3">Overall Rating</label>
                                                <ClickableStarRating rating={rating} setRating={setRating} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="author" className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2 ml-1">Your Name</label>
                                                    <input 
                                                        id="author" 
                                                        type="text" 
                                                        required
                                                        value={author}
                                                        onChange={(e) => setAuthor(e.target.value)}
                                                        placeholder="e.g. Ama Serwaa"
                                                        className="w-full rounded-2xl border-zinc-200 dark:border-zinc-700 bg-bg-tertiary p-4 text-text-primary focus:ring-2 focus:ring-accent-primary outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="title" className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2 ml-1">Review Title</label>
                                                    <input 
                                                        id="title" 
                                                        type="text" 
                                                        required
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        placeholder="e.g. Simply Beautiful!"
                                                        className="w-full rounded-2xl border-zinc-200 dark:border-zinc-700 bg-bg-tertiary p-4 text-text-primary focus:ring-2 focus:ring-accent-primary outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="comment" className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2 ml-1">Your Review</label>
                                                <textarea 
                                                    id="comment" 
                                                    rows={5}
                                                    required
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="What did you love about it? What could be better?"
                                                    className="w-full rounded-2xl border-zinc-200 dark:border-zinc-700 bg-bg-tertiary p-4 text-text-primary focus:ring-2 focus:ring-accent-primary outline-none resize-none transition-all"
                                                ></textarea>
                                            </div>
                                            
                                            {/* Photo Upload */}
                                            <div>
                                                <label className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-3 ml-1">Add Photos (Optional)</label>
                                                <div className="flex gap-3 mb-2 flex-wrap">
                                                    {images.map((img, idx) => (
                                                        <div key={idx} className="relative group w-20 h-20">
                                                            <img src={img} className="w-full h-full object-cover rounded-xl border border-border-primary" />
                                                            <button 
                                                                type="button"
                                                                onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl cursor-pointer hover:border-accent-primary hover:bg-accent-primary/5 transition-all group">
                                                        <PhotoIcon className="w-6 h-6 text-zinc-400 group-hover:text-accent-primary" />
                                                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button 
                                                    type="submit"
                                                    className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white font-black py-4 rounded-full transition-all shadow-xl uppercase tracking-widest text-sm"
                                                >
                                                    Submit My Review
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {/* Reviews List */}
                        <div className="space-y-8">
                            {reviews.length === 0 ? (
                                <div className="text-center py-20 bg-bg-secondary rounded-3xl border-2 border-dashed border-border-primary/40">
                                    <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                                        <StarIcon className="w-8 h-8 text-zinc-300" />
                                    </div>
                                    <p className="text-xl font-bold text-text-primary">No reviews yet</p>
                                    <p className="text-sm text-text-secondary mt-1 px-8 max-w-sm mx-auto">Be the first to share your experience with this item and help others!</p>
                                    <button 
                                        onClick={() => setIsFormOpen(true)}
                                        className="mt-6 text-accent-primary font-black uppercase tracking-widest text-xs hover:underline"
                                    >
                                        Write a review now
                                    </button>
                                </div>
                            ) : (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        visible: { transition: { staggerChildren: 0.1 } }
                                    }}
                                    className="space-y-6"
                                >
                                    {reviews.map((review) => (
                                        <motion.div
                                            key={review.id}
                                            className="bg-bg-secondary p-8 rounded-3xl shadow-sm border border-border-primary/40 hover:shadow-md transition-shadow"
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0 }
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center font-black text-accent-primary text-lg">
                                                        {review.author.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="flex items-center flex-wrap gap-2">
                                                            <p className="font-black text-text-primary">{review.author}</p>
                                                            {review.verifiedPurchase && (
                                                                <div className="flex items-center gap-1 text-[10px] text-green-700 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                                                                    <CheckBadgeIcon className="w-3 h-3" />
                                                                    <span>Verified Purchase</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-text-secondary font-medium">{review.date}</p>
                                                    </div>
                                                </div>
                                                <StarRating rating={review.rating} className="w-4 h-4" />
                                            </div>
                                            
                                            <h3 className="text-lg font-black text-text-primary mb-3">{review.title}</h3>
                                            <p className="text-text-secondary leading-relaxed mb-6 text-sm sm:text-base font-medium">{review.comment}</p>
                                            
                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-3 flex-wrap">
                                                    {review.images.map((img, idx) => (
                                                        <motion.img 
                                                            key={idx} 
                                                            src={img} 
                                                            alt={`Review attachment ${idx}`}
                                                            whileHover={{ scale: 1.05 }}
                                                            className="w-24 h-24 object-cover rounded-2xl cursor-pointer shadow-sm border border-border-primary/50"
                                                            onClick={() => setExpandedImage(img)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox for review images */}
            <AnimatePresence>
                {expandedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 backdrop-blur-xl"
                        onClick={() => setExpandedImage(null)}
                    >
                        <motion.img 
                            src={expandedImage} 
                            className="max-w-full max-h-full rounded-3xl shadow-2xl" 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        />
                        <button className="absolute top-8 right-8 text-white/80 hover:text-white transition-colors bg-white/10 p-3 rounded-full">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.main>
    );
};

export default ProductReviewsPage;