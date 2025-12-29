
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductReview, ProductVariant } from '../types';
// Fixed missing XIcon import
import { ChevronLeftIcon, HeartIcon, LinkIcon, CheckBadgeIcon, MailIcon, XIcon } from './Icons';
import ProductGrid from './ProductGrid';
import { useAppContext } from '../context/AppContext';
import SizeGuideModal from './SizeGuideModal';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryUtils';

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

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
    const gradientId = React.useId();
    return (
        <svg className={`${className} ${filled || half ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`} fill="currentColor" viewBox="0 0 20 20">
            <defs>
                <linearGradient id={gradientId}>
                    <stop offset="50%" stopColor="currentColor" />
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

const StockIndicator: React.FC<{ stock: number }> = ({ stock }) => {
    let text, colorClass, dotColorClass;

    if (stock < 0) {
        text = 'Select options for availability';
        colorClass = 'text-zinc-500 dark:text-zinc-400';
        dotColorClass = 'bg-zinc-400';
    } else if (stock > 10) {
        text = 'In Stock';
        colorClass = 'text-green-600 dark:text-green-400';
        dotColorClass = 'bg-green-500';
    } else if (stock > 0) {
        text = `Low Stock - Only ${stock} left!`;
        colorClass = 'text-orange-600 dark:text-orange-400';
        dotColorClass = 'bg-orange-500';
    } else {
        text = 'Out of Stock';
        colorClass = 'text-red-600 dark:text-red-400';
        dotColorClass = 'bg-red-500';
    }

    return (
        <div className={`flex items-center gap-2 mb-4 font-semibold text-sm ${colorClass}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${dotColorClass}`}></span>
            {text}
        </div>
    );
};

const ReviewCard: React.FC<{ review: ProductReview, onImageClick: (src: string) => void }> = ({ review, onImageClick }) => (
    <div className="border-b border-border-primary py-6 last:border-0 first:pt-0">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <div className="font-bold text-text-primary">{review.author}</div>
                {review.verifiedPurchase && (
                    <div className="flex items-center gap-1 text-[10px] text-green-700 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                        <CheckBadgeIcon className="w-3 h-3" />
                        Verified Purchase
                    </div>
                )}
            </div>
            <div className="text-xs text-text-secondary">{review.date}</div>
        </div>
        <div className="flex items-center mb-3">
            <StarRating rating={review.rating} className="w-4 h-4" />
            <h4 className="ml-2 font-semibold text-text-primary text-sm">{review.title}</h4>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{review.comment}</p>
        {review.images && review.images.length > 0 && (
            <div className="flex gap-3 mt-2">
                {review.images.map((img, idx) => (
                    <img
                        key={idx}
                        src={optimizeCloudinaryUrl(img, 200)}
                        alt="Review attachment"
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 border border-border-primary transition-opacity"
                        onClick={() => onImageClick(img)}
                    />
                ))}
            </div>
        )}
    </div>
);


interface ProductDetailPageProps {
    product: Product;
    relatedProducts: Product[];
    reviews: ProductReview[];
    onBackToShop: () => void;
    onProductClick: (product: Product) => void;
    onNavigateToReviews: () => void;
    onQuickView: (product: Product) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, relatedProducts, reviews, onBackToShop, onProductClick, onNavigateToReviews, onQuickView }) => {
    const { wishlist, toggleWishlist, addToCart, addToast, shopInfo } = useAppContext();
    const [quantity, setQuantity] = React.useState(1);
    const [isAdded, setIsAdded] = React.useState(false);
    const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
    const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
    const [selectedImage, setSelectedImage] = React.useState(product.imageUrl);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = React.useState(false);
    const [expandedReviewImage, setExpandedReviewImage] = React.useState<string | null>(null);

    const hasSale = typeof product.salePrice === 'number';
    const isInWishlist = wishlist.includes(product.id);

    const averageRating = React.useMemo(() => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return total / reviews.length;
    }, [reviews]);

    React.useEffect(() => {
        setQuantity(1);
        setSelectedColor(null);
        setSelectedSize(null);
        setSelectedImage(product.imageUrl);
        setIsAdded(false);
    }, [product]);

    // Logic: Find the image for the current selection
    React.useEffect(() => {
        if (!product.variants) return;
        
        // Try to find a variant that matches BOTH or either selection and has an image
        const matchingVariant = product.variants.find(v => {
            const colorMatch = !selectedColor || v.color === selectedColor;
            const sizeMatch = !selectedSize || v.size === selectedSize;
            return colorMatch && sizeMatch && v.imageUrl;
        });

        if (matchingVariant?.imageUrl) {
            setSelectedImage(matchingVariant.imageUrl);
        }
    }, [selectedColor, selectedSize, product.variants]);

    const allImages = React.useMemo(() => {
        const imgs = [product.imageUrl];
        if (product.images) {
            imgs.push(...product.images);
        }
        return Array.from(new Set(imgs));
    }, [product]);

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };
    
    const availableColors = React.useMemo(() => {
        if (!product.variants) return [];
        const colors = product.variants
            .filter(v => v.color && v.color.trim() !== '')
            .map(v => ({ name: v.color, hex: v.colorHex, imageUrl: v.imageUrl }));
        return [...new Map(colors.map(item => [item.name, item])).values()];
    }, [product.variants]);

    const hasVariants = product.variants && product.variants.length > 0;
    const hasColorOptions = availableColors.length > 0;

    const availableSizes = React.useMemo(() => {
        if (!product.variants) return [];
        let variants = product.variants;
        if (hasColorOptions && selectedColor) {
            variants = variants.filter(v => v.color === selectedColor);
        }
        return variants
            .filter(v => v.size && v.size.trim() !== '')
            .map(v => ({ name: v.size, stock: v.stock }));
    }, [product.variants, selectedColor, hasColorOptions]);

    const hasSizeOptions = availableSizes.length > 0;

    const handleColorSelect = (colorName: string) => {
        setSelectedColor(colorName);
        // We don't reset size if the new color also has that size available
        const sizeStillValid = availableSizes.some(s => s.name === selectedSize && s.stock > 0);
        if (!sizeStillValid) setSelectedSize(null);
    };

    const handleSizeSelect = (sizeName: string) => {
        setSelectedSize(sizeName);
    };

    const stockLevel = React.useMemo(() => {
        if (!hasVariants) return product.stock;
        if (hasColorOptions && !selectedColor) return -1;
        if (hasSizeOptions && !selectedSize) return -1;

        const selectedVariant = product.variants?.find(v => {
            const colorMatch = !hasColorOptions || v.color === selectedColor;
            const sizeMatch = !hasSizeOptions || v.size === selectedSize;
            return colorMatch && sizeMatch;
        });

        return selectedVariant ? selectedVariant.stock : 0;
    }, [product, selectedColor, selectedSize, hasVariants, hasColorOptions, hasSizeOptions]);

    const isAddToCartDisabled = (hasVariants && ((hasColorOptions && !selectedColor) || (hasSizeOptions && !selectedSize))) || stockLevel === 0;

    const handleAddToCartClick = () => {
        if (isAdded || isAddToCartDisabled) return;
        addToCart(product.id, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };
    
    const addToCartText = stockLevel === 0 ? 'Out of Stock' :
        (isAddToCartDisabled ? 'Select Options' : 'Add to Cart');

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            addToast('Link copied to clipboard!', 'info');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            addToast('Failed to copy link', 'error');
        });
    };
    
    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            onBackToShop();
        }
    };

    const emailInquiryUrl = `mailto:${shopInfo.email}?subject=Inquiry: ${product.name}&body=Hello, I'm interested in the ${product.name}. Could you please provide more details? %0AProduct link: ${window.location.href}`;

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 pb-16 bg-bg-primary"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={goBack}
                    className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors mb-4"
                    aria-label="Go back to previous page"
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                    <span>Back</span>
                </button>
                <div className="mb-6 text-sm text-text-secondary">
                    <button onClick={onBackToShop} className="hover:text-accent-primary">Home</button> / <span className="text-text-primary font-medium">{product.category}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <motion.div 
                        className="bg-bg-secondary p-4 rounded-3xl shadow-md h-fit sticky top-24 border border-border-primary/50"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative overflow-hidden rounded-2xl aspect-square bg-bg-tertiary">
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={selectedImage}
                                    src={optimizeCloudinaryUrl(selectedImage, 1000)} 
                                    alt={product.name} 
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, ease: "circOut" }}
                                    className="w-full h-full object-cover" 
                                />
                            </AnimatePresence>
                        </div>

                        {allImages.length > 1 && (
                            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 hide-scrollbar">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(img)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-accent-primary ring-2 ring-accent-primary/30' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <img src={optimizeCloudinaryUrl(img, 200)} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <motion.div 
                        className="flex flex-col justify-center"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <span className="text-sm text-text-secondary uppercase tracking-wider font-bold">{product.category}</span>
                        <h1 className="text-3xl md:text-5xl font-black my-2 text-text-primary leading-tight">{product.name}</h1>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <StarRating rating={averageRating} />
                            <button onClick={onNavigateToReviews} className="text-sm text-text-secondary hover:text-accent-primary transition-colors underline underline-offset-4 decoration-dotted">
                                {reviews.length > 0 ? `(${reviews.length} Review${reviews.length === 1 ? '' : 's'})` : 'No reviews yet'}
                            </button>
                        </div>
                        
                        {hasSale ? (
                            <div className="flex items-baseline space-x-3 mb-4">
                                <p className="text-4xl font-black text-red-600">GH₵{product.salePrice?.toFixed(2)}</p>
                                <p className="text-2xl font-medium text-text-secondary line-through opacity-50">GH₵{product.price.toFixed(2)}</p>
                            </div>
                        ) : (
                            <p className="text-4xl font-black text-accent-primary mb-4">GH₵{product.price.toFixed(2)}</p>
                        )}

                        <StockIndicator stock={stockLevel} />

                        <p className="text-text-secondary mb-8 leading-relaxed text-lg">{product.description}</p>
                        
                        {hasVariants && (
                            <div className="space-y-8 mb-8 bg-bg-secondary p-6 rounded-3xl border border-border-primary/30 shadow-sm">
                                {hasColorOptions && (
                                    <div>
                                        <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-3">Color: <span className="font-normal normal-case text-text-secondary ml-1">{selectedColor || 'Choose Color'}</span></h3>
                                        <div className="flex items-center gap-4">
                                            {availableColors.map(color => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => handleColorSelect(color.name)}
                                                    className={`group relative w-10 h-10 rounded-full border-2 transition-all p-0.5 ${selectedColor === color.name ? 'border-accent-primary scale-110 shadow-lg' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'}`}
                                                    aria-label={`Select color ${color.name}`}
                                                >
                                                    <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex || 'transparent' }} />
                                                    {selectedColor === color.name && (
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-primary rounded-full border-2 border-white flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {hasSizeOptions && (
                                     <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Size: <span className="font-normal normal-case text-text-secondary ml-1">{selectedSize || 'Select Size'}</span></h3>
                                            <button 
                                                onClick={() => setIsSizeGuideOpen(true)}
                                                className="text-xs text-accent-primary hover:underline font-bold uppercase tracking-tighter"
                                            >
                                                Size Guide
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {availableSizes.map(size => (
                                                <button
                                                    key={size.name}
                                                    onClick={() => handleSizeSelect(size.name)}
                                                    disabled={size.stock === 0}
                                                    className={`px-5 py-2.5 border rounded-2xl text-sm font-bold transition-all ${
                                                        selectedSize === size.name 
                                                            ? 'bg-accent-primary text-white border-accent-primary shadow-md scale-105' 
                                                            : 'bg-bg-secondary text-text-primary border-border-primary hover:border-accent-primary'
                                                    } ${
                                                        size.stock === 0 
                                                            ? 'opacity-30 cursor-not-allowed line-through' 
                                                            : ''
                                                    }`}
                                                >
                                                    {size.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-8">
                            <span className="font-bold text-text-primary uppercase tracking-widest text-sm">Quantity:</span>
                            <div className="flex items-center border border-border-primary rounded-full bg-bg-secondary px-2">
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-3 text-text-secondary hover:text-accent-primary disabled:opacity-30" aria-label="Decrease quantity">
                                    <MinusIcon />
                                </button>
                                <span className="px-4 font-black text-xl text-text-primary tabular-nums">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} className="p-3 text-text-secondary hover:text-accent-primary" aria-label="Increase quantity">
                                    <PlusIcon />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.button 
                                onClick={handleAddToCartClick} 
                                className="flex-grow font-black py-4 px-6 rounded-full disabled:cursor-not-allowed shadow-xl uppercase tracking-widest text-sm overflow-hidden"
                                disabled={isAddToCartDisabled && !isAdded}
                                animate={{ 
                                    backgroundColor: isAdded ? '#22c55e' : (isAddToCartDisabled ? '#a1a1aa' : '#f59e0b')
                                }}
                                whileHover={{ scale: (isAddToCartDisabled || isAdded) ? 1 : 1.02 }}
                                whileTap={{ scale: (isAddToCartDisabled || isAdded) ? 1 : 0.98 }}
                            >
                               <span className={`block ${isAdded || !isAddToCartDisabled ? 'text-white' : 'text-zinc-200'}`}>
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.span
                                            key={isAdded ? 'added' : addToCartText}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="inline-block"
                                        >
                                            {isAdded ? 'Added to Cart!' : addToCartText}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                            </motion.button>
                            <motion.button
                                onClick={() => toggleWishlist(product.id)}
                                className={`flex-shrink-0 flex items-center justify-center p-4 rounded-full border shadow-sm transition-all ${
                                    isInWishlist ? 'bg-red-50 dark:bg-red-500/10 border-red-400 dark:border-red-500/30 text-red-500' : 'bg-bg-secondary border-border-primary text-text-secondary hover:bg-bg-tertiary hover:border-zinc-400'
                                }`}
                                whileTap={{ scale: 0.8 }}
                                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                <HeartIcon className="h-7 w-7" filled={isInWishlist} />
                            </motion.button>
                        </div>
                        <div className="mt-8 pt-8 border-t border-border-primary/50 flex gap-4">
                            <button
                                onClick={handleCopyToClipboard}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-border-primary rounded-2xl bg-bg-secondary text-text-primary hover:bg-bg-tertiary transition-colors font-bold text-xs uppercase tracking-widest shadow-sm"
                                aria-label="Share this product by copying the link"
                            >
                                <LinkIcon className="h-4 w-4" />
                                <span>Copy Link</span>
                            </button>
                            <a
                                href={emailInquiryUrl}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-border-primary rounded-2xl bg-bg-secondary text-text-primary hover:bg-bg-tertiary transition-colors font-bold text-xs uppercase tracking-widest shadow-sm"
                                aria-label="Inquire about this product via email"
                            >
                                <MailIcon className="h-4 w-4" />
                                <span>Email Inquiry</span>
                            </a>
                        </div>

                        {/* Customer Reviews Section */}
                        <div className="mt-16 border-t border-border-primary/50 pt-12">
                            <div className="flex justify-between items-end mb-8">
                                <h2 className="text-3xl font-black text-text-primary">Reviews</h2>
                                <button onClick={onNavigateToReviews} className="text-sm font-black text-accent-primary hover:underline uppercase tracking-widest">See All</button>
                            </div>
                            
                            {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.slice(0, 2).map(review => (
                                        <ReviewCard key={review.id} review={review} onImageClick={setExpandedReviewImage} />
                                    ))}
                                    <div className="pt-6 text-center">
                                        <button 
                                            onClick={onNavigateToReviews} 
                                            className="px-8 py-3 bg-bg-secondary border-2 border-border-primary rounded-full text-xs font-black text-text-primary hover:bg-bg-tertiary transition-all shadow-md uppercase tracking-widest"
                                        >
                                            View all {reviews.length} reviews
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-bg-tertiary/50 rounded-3xl border-2 border-dashed border-border-primary/30">
                                    <p className="text-text-secondary mb-4 font-medium">No reviews yet for this product.</p>
                                    <button onClick={onNavigateToReviews} className="text-accent-primary font-black uppercase tracking-widest text-sm hover:underline">Be the first to review!</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {relatedProducts.length > 0 ? (
                <div className="mt-24 md:mt-32">
                    <ProductGrid 
                        title="Complete the Look"
                        products={relatedProducts}
                        onProductClick={onProductClick}
                        onQuickView={onQuickView}
                        bgColor="bg-transparent"
                    />
                </div>
            ) : null}
            
            <AnimatePresence>
                {isSizeGuideOpen && <SizeGuideModal onClose={() => setIsSizeGuideOpen(false)} category={product.category} />}
                {expandedReviewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                        onClick={() => setExpandedReviewImage(null)}
                    >
                        <motion.img 
                            src={optimizeCloudinaryUrl(expandedReviewImage, 1200)} 
                            className="max-w-full max-h-[90vh] rounded-3xl shadow-2xl" 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                        />
                        <button className="absolute top-6 right-6 text-white hover:text-accent-primary p-2 transition-colors">
                            {/* Fixed missing XIcon use in the review lightbox */}
                            <XIcon className="w-10 h-10" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.main>
    );
};

export default ProductDetailPage;
