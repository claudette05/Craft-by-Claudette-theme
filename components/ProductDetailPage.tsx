
import * as React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Product, ProductReview, ProductVariant } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, LinkIcon, CheckBadgeIcon, XIcon, SparklesIcon, EyeIcon } from './Icons';
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
        <div className="text-text-secondary text-sm leading-relaxed mb-4">{review.comment}</div>
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
    const [selectedImage, setSelectedImage] = React.useState(product?.imageUrl || '');
    const [isSizeGuideOpen, setIsSizeGuideOpen] = React.useState(false);
    const [expandedReviewImage, setExpandedReviewImage] = React.useState<string | null>(null);
    const [isProductLightboxOpen, setIsProductLightboxOpen] = React.useState(false);
    const [isZoomed, setIsZoomed] = React.useState(false);
    const [isManualImageSelection, setIsManualImageSelection] = React.useState(false);

    const thumbScrollRef = React.useRef<HTMLDivElement>(null);
    const [canScrollThumbLeft, setCanScrollThumbLeft] = React.useState(false);
    const [canScrollThumbRight, setCanScrollThumbRight] = React.useState(false);

    const hasSale = typeof product?.salePrice === 'number';
    const isInWishlist = product ? wishlist.includes(product.id) : false;

    // BUILD COMPREHENSIVE GALLERY: Harvest from main image, gallery array, AND variants
    const allImages = React.useMemo(() => {
        if (!product) return [];
        const imgs = [product.imageUrl];
        
        // Add images from explicit gallery array
        if (Array.isArray(product.images)) {
            imgs.push(...product.images);
        }

        // Harvest images from variants (crucial for older products)
        if (Array.isArray(product.variants)) {
            product.variants.forEach(v => {
                if (v.imageUrl) imgs.push(v.imageUrl);
            });
        }

        // Return unique, non-empty, string URLs only
        return Array.from(new Set(imgs.filter(img => typeof img === 'string' && img.trim() !== '')));
    }, [product]);

    const currentIndex = allImages.indexOf(selectedImage);

    const averageRating = React.useMemo(() => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return total / reviews.length;
    }, [reviews]);

    const checkThumbScroll = React.useCallback(() => {
        const el = thumbScrollRef.current;
        if (el) {
            setCanScrollThumbLeft(el.scrollLeft > 5);
            setCanScrollThumbRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
        }
    }, []);

    // Effect to reset state when product changes
    React.useEffect(() => {
        if (!product) return;
        setQuantity(1);
        setSelectedColor(null);
        setSelectedSize(null);
        setSelectedImage(product.imageUrl);
        setIsAdded(false);
        setIsManualImageSelection(false);
    }, [product?.id, product?.imageUrl]);

    React.useLayoutEffect(() => {
        const el = thumbScrollRef.current;
        if (el) {
            checkThumbScroll();
            el.addEventListener('scroll', checkThumbScroll);
            const observer = new ResizeObserver(checkThumbScroll);
            observer.observe(el);
            return () => {
                if (el) {
                    el.removeEventListener('scroll', checkThumbScroll);
                }
                observer.disconnect();
            };
        }
    }, [checkThumbScroll, allImages.length]);

    // Update image when variant changes, UNLESS the user manually picked an image
    React.useEffect(() => {
        if (!product?.variants || isManualImageSelection) return;
        
        const matchingVariant = product.variants.find(v => {
            const colorMatch = !selectedColor || v.color === selectedColor;
            const sizeMatch = !selectedSize || v.size === selectedSize;
            return colorMatch && sizeMatch && v.imageUrl;
        });

        if (matchingVariant?.imageUrl) {
            setSelectedImage(matchingVariant.imageUrl);
        }
    }, [selectedColor, selectedSize, product?.variants, isManualImageSelection]);

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const handleThumbScroll = (direction: 'left' | 'right') => {
        const el = thumbScrollRef.current;
        if (el) {
            const scrollAmount = el.clientWidth * 0.7;
            el.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleThumbnailClick = (img: string) => {
        setIsManualImageSelection(true);
        setSelectedImage(img);
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        setIsManualImageSelection(true);
        if (isZoomed) setIsZoomed(false);
        let newIndex = currentIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % allImages.length;
        } else {
            newIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        }
        setSelectedImage(allImages[newIndex]);
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (isZoomed) return;
        const offsetThreshold = 50;
        const velocityThreshold = 500;
        if (info.offset.x < -offsetThreshold || info.velocity.x < -velocityThreshold) {
            navigateImage('next');
        } else if (info.offset.x > offsetThreshold || info.velocity.x > velocityThreshold) {
            navigateImage('prev');
        }
    };

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isProductLightboxOpen) {
                if (e.key === 'ArrowRight') navigateImage('next');
                if (e.key === 'ArrowLeft') navigateImage('prev');
                if (e.key === 'Escape') setIsProductLightboxOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isProductLightboxOpen, currentIndex, allImages, isZoomed]);

    if (!product) return null;
    
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
        setIsManualImageSelection(false); 
        const sizeStillValid = availableSizes.some(s => s.name === selectedSize && s.stock > 0);
        if (!sizeStillValid) setSelectedSize(null);
    };

    const handleSizeSelect = (sizeName: string) => {
        setSelectedSize(sizeName);
        setIsManualImageSelection(false);
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

    // Prefilled WhatsApp Enquiry Link
    const whatsappEnquiryMessage = encodeURIComponent(
        `Hello ${shopInfo.name}! 👋🏽\n\nI'm interested in the ${product.name} priced at GH₵${(product.salePrice ?? product.price).toFixed(2)}.\n\nCan you please tell me more about this item?\n\nProduct Link: ${window.location.href}`
    );
    const whatsappEnquiryUrl = `https://wa.me/${shopInfo.whatsapp}?text=${whatsappEnquiryMessage}`;

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
                        className="bg-bg-secondary p-4 rounded-3xl shadow-md h-fit md:sticky md:top-24 border border-border-primary/50"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative group/main overflow-hidden rounded-2xl aspect-square bg-bg-tertiary touch-pan-y">
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={selectedImage}
                                    src={optimizeCloudinaryUrl(selectedImage, 1000)} 
                                    alt={product.name} 
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, ease: "circOut" }}
                                    className="w-full h-full object-cover cursor-zoom-in"
                                    onClick={() => setIsProductLightboxOpen(true)}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.2}
                                    onDragEnd={handleDragEnd}
                                />
                            </AnimatePresence>

                            {/* Main Image Navigation Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md text-white hover:bg-white/60 transition-all opacity-0 group-hover/main:opacity-100 hidden md:flex"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeftIcon className="w-6 h-6" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md text-white hover:bg-white/60 transition-all opacity-0 group-hover/main:opacity-100 hidden md:flex"
                                        aria-label="Next image"
                                    >
                                        <ChevronRightIcon className="w-6 h-6" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest pointer-events-none opacity-0 group-hover/main:opacity-100 transition-opacity flex items-center gap-2">
                                        <EyeIcon className="w-3 h-3" />
                                        <span>{currentIndex + 1} / {allImages.length}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {allImages.length > 1 && (
                            <div className="relative group/thumbs mt-4 overflow-hidden rounded-xl min-h-[90px]">
                                <AnimatePresence>
                                    {canScrollThumbLeft && (
                                        <motion.button 
                                            initial={{ opacity: 0, scale: 0.5, x: -10 }}
                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.5, x: -10 }}
                                            onClick={() => handleThumbScroll('left')}
                                            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md shadow-lg text-text-primary hover:text-accent-primary transition-all border border-border-primary/20 hidden md:flex items-center justify-center opacity-0 group-hover/thumbs:opacity-100"
                                            aria-label="Scroll thumbnails left"
                                        >
                                            <ChevronLeftIcon className="w-6 h-6" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                                
                                <div 
                                    ref={thumbScrollRef}
                                    className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar scroll-smooth"
                                >
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleThumbnailClick(img)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-accent-primary ring-2 ring-accent-primary/30' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                            aria-label={`View image ${index + 1}`}
                                        >
                                            <img src={optimizeCloudinaryUrl(img, 200)} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {canScrollThumbRight && (
                                        <motion.button 
                                            initial={{ opacity: 0, scale: 0.5, x: 10 }}
                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.5, x: 10 }}
                                            onClick={() => handleThumbScroll('right')}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md shadow-lg text-text-primary hover:text-accent-primary transition-all border border-border-primary/20 hidden md:flex items-center justify-center opacity-0 group-hover/thumbs:opacity-100"
                                            aria-label="Scroll thumbnails right"
                                        >
                                            <ChevronRightIcon className="w-6 h-6" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
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
                                        <div className="flex items-center gap-4 flex-wrap">
                                            {availableColors.map(color => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => handleColorSelect(color.name)}
                                                    className={`group relative w-9 h-9 md:w-11 md:h-11 rounded-full border-2 transition-all p-0.5 ${selectedColor === color.name ? 'border-accent-primary scale-110 shadow-lg ring-4 ring-accent-primary/20' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'}`}
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
                                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center text-xs md:text-sm font-bold transition-all ${
                                                        selectedSize === size.name 
                                                            ? 'bg-accent-primary text-white border-accent-primary shadow-md scale-110 ring-4 ring-accent-primary/20' 
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
                        <div className="mt-8 pt-8 border-t border-border-primary/50 flex flex-col sm:flex-row gap-4">
                            <a
                                href={whatsappEnquiryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-[#25D366]/30 rounded-2xl bg-[#25D366]/5 text-[#25D366] hover:bg-[#25D366]/10 transition-colors font-bold text-xs uppercase tracking-widest shadow-sm"
                                aria-label="Send WhatsApp Enquiry for this product"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                <span>Send Enquiry</span>
                            </a>
                            <button
                                onClick={handleCopyToClipboard}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-border-primary rounded-2xl bg-bg-secondary text-text-primary hover:bg-bg-tertiary transition-colors font-bold text-xs uppercase tracking-widest shadow-sm"
                                aria-label="Share this product by copying the link"
                            >
                                <LinkIcon className="h-4 w-4" />
                                <span>Copy Link</span>
                            </button>
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
                                    <div className="text-text-secondary mb-4 font-medium">No reviews yet for this product.</div>
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
                
                {/* Review Lightbox */}
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
                            <XIcon className="w-10 h-10" />
                        </button>
                    </motion.div>
                )}

                {/* Product Image Lightbox */}
                {isProductLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/95 p-4 md:p-12 backdrop-blur-xl touch-none"
                        onClick={() => setIsProductLightboxOpen(false)}
                    >
                        <div className="absolute top-6 right-6 flex items-center gap-6 z-[100]">
                            {!isZoomed && (
                                <span className="text-white/60 font-bold tracking-widest text-xs uppercase hidden md:block">
                                    {currentIndex + 1} / {allImages.length}
                                </span>
                            )}
                            <button 
                                onClick={() => setIsProductLightboxOpen(false)}
                                className="text-white/80 hover:text-white transition-colors p-2 bg-white/10 rounded-full"
                                aria-label="Close lightbox"
                            >
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div 
                            className="relative w-full h-full flex items-center justify-center overflow-hidden" 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isZoomed) setIsProductLightboxOpen(false);
                            }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={selectedImage}
                                    className="w-full h-full flex items-center justify-center p-4"
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <motion.img 
                                        src={optimizeCloudinaryUrl(selectedImage, 1800)} 
                                        className={`max-w-full max-h-full object-contain shadow-2xl transition-transform duration-300 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`} 
                                        animate={{ 
                                            scale: isZoomed ? 2.5 : 1,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsZoomed(!isZoomed);
                                        }}
                                        drag={isZoomed ? true : "x"}
                                        dragConstraints={isZoomed ? false : { left: 0, right: 0 }}
                                        dragElastic={isZoomed ? 0 : 0.5}
                                        onDragEnd={handleDragEnd}
                                        layout
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {allImages.length > 1 && !isZoomed && (
                                <>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                                        className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20 p-5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 hidden md:flex"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeftIcon className="w-10 h-10" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                                        className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20 p-5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 hidden md:flex"
                                        aria-label="Next image"
                                    >
                                        <ChevronRightIcon className="w-10 h-10" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Lightbox Thumbnails */}
                        {allImages.length > 1 && !isZoomed && (
                            <motion.div 
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="mt-8 flex gap-3 overflow-x-auto max-w-full px-12 py-4 hide-scrollbar bg-black/40 backdrop-blur-md rounded-2xl border border-white/10" 
                                onClick={(e) => e.stopPropagation()}
                            >
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            if (isZoomed) setIsZoomed(false);
                                            setSelectedImage(img);
                                        }}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-accent-primary ring-4 ring-accent-primary/20' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                                    >
                                        <img src={optimizeCloudinaryUrl(img, 200)} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.main>
    );
};

export default ProductDetailPage;
