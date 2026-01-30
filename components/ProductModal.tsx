
import * as React from 'react';
import { motion, Variants, AnimatePresence, PanInfo } from 'framer-motion';
import { Product } from '../types';
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { useAppContext } from '../context/AppContext';
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

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onViewDetails: (product: Product) => void;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } },
};

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onViewDetails }) => {
    const { addToCart } = useAppContext();
    const [quantity, setQuantity] = React.useState(1);
    const [isAdded, setIsAdded] = React.useState(false);
    const hasSale = typeof product.salePrice === 'number';

    const [selectedImage, setSelectedImage] = React.useState(product.imageUrl);
    const thumbScrollRef = React.useRef<HTMLDivElement>(null);
    const [canScrollThumbLeft, setCanScrollThumbLeft] = React.useState(false);
    const [canScrollThumbRight, setCanScrollThumbRight] = React.useState(false);

    const allImages = React.useMemo(() => {
        const imgs = [product.imageUrl];
        if (product.images) {
            imgs.push(...product.images);
        }
        return Array.from(new Set(imgs));
    }, [product]);

    const currentIndex = allImages.indexOf(selectedImage);

    const checkThumbScroll = React.useCallback(() => {
        const el = thumbScrollRef.current;
        if (el) {
            setCanScrollThumbLeft(el.scrollLeft > 0);
            setCanScrollThumbRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
        }
    }, []);

    React.useLayoutEffect(() => {
        const el = thumbScrollRef.current;
        if (el) {
            checkThumbScroll();
            el.addEventListener('scroll', checkThumbScroll);
            const observer = new ResizeObserver(checkThumbScroll);
            observer.observe(el);
            return () => {
                el.removeEventListener('scroll', checkThumbScroll);
                observer.disconnect();
            };
        }
    }, [checkThumbScroll, allImages.length]);

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const handleAddToCartClick = () => {
        if (isAdded) return;
        addToCart(product.id, quantity);
        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            onClose(); 
        }, 1500);
    };

    const handleViewDetailsClick = () => {
        onViewDetails(product);
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        let newIndex = currentIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % allImages.length;
        } else {
            newIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        }
        setSelectedImage(allImages[newIndex]);
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const offsetThreshold = 50;
        const velocityThreshold = 500;
        if (info.offset.x < -offsetThreshold || info.velocity.x < -velocityThreshold) {
            navigateImage('next');
        } else if (info.offset.x > offsetThreshold || info.velocity.x > velocityThreshold) {
            navigateImage('prev');
        }
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

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                variants={backdropVariants}
                onClick={onClose}
            />
            <motion.div
                className="relative w-full max-w-4xl bg-bg-primary rounded-2xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden custom-scrollbar"
                variants={modalVariants}
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button - Sticky on Mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md text-text-primary hover:text-accent-primary transition-all border border-border-primary/20"
                    aria-label="Close quick view"
                >
                    <XIcon className="w-5 h-5" />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col shrink-0 md:border-r border-border-primary/30">
                    <div className="relative group/modalimg overflow-hidden rounded-xl aspect-square mb-4 bg-bg-tertiary flex-shrink-0 touch-pan-y">
                         <AnimatePresence mode="wait">
                            <motion.img 
                                key={selectedImage}
                                src={optimizeCloudinaryUrl(selectedImage, 800)} 
                                alt={product.name} 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-full h-full object-cover cursor-pointer"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={handleDragEnd}
                            />
                        </AnimatePresence>

                        {allImages.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md text-white opacity-0 group-hover/modalimg:opacity-100 transition-opacity hidden md:flex"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md text-white opacity-0 group-hover/modalimg:opacity-100 transition-opacity hidden md:flex"
                                    aria-label="Next image"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-white text-[10px] font-bold md:hidden">
                                    {currentIndex + 1} / {allImages.length}
                                </div>
                            </>
                        )}
                    </div>

                     {allImages.length > 1 && (
                        <div className="relative group/thumbs shrink-0">
                            <AnimatePresence>
                                {canScrollThumbLeft && (
                                    <motion.button 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={(e) => { e.stopPropagation(); handleThumbScroll('left'); }}
                                        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-md text-text-primary hidden md:flex items-center justify-center border border-border-primary/20 opacity-0 group-hover/thumbs:opacity-100"
                                        aria-label="Scroll thumbnails left"
                                    >
                                        <ChevronLeftIcon className="w-4 h-4" />
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
                                        onClick={() => setSelectedImage(img)}
                                        className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-accent-primary ring-2 ring-accent-primary/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <img src={optimizeCloudinaryUrl(img, 200)} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {canScrollThumbRight && (
                                    <motion.button 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={(e) => { e.stopPropagation(); handleThumbScroll('right'); }}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-md text-text-primary hidden md:flex items-center justify-center border border-border-primary/20 opacity-0 group-hover/thumbs:opacity-100"
                                        aria-label="Scroll thumbnails right"
                                    >
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-bg-secondary/30">
                    <span className="text-xs md:text-sm text-text-secondary uppercase tracking-widest font-bold mb-1">{product.category}</span>
                    <h2 className="text-2xl md:text-4xl font-black mb-3 text-text-primary leading-tight">{product.name}</h2>
                    
                    {hasSale ? (
                        <div className="flex items-baseline space-x-3 mb-6">
                            <p className="text-3xl font-black text-red-600">GH₵{product.salePrice?.toFixed(2)}</p>
                            <p className="text-xl font-medium text-text-secondary line-through opacity-50">GH₵{product.price.toFixed(2)}</p>
                        </div>
                    ) : (
                        <p className="text-3xl font-black text-accent-primary mb-6">GH₵{product.price.toFixed(2)}</p>
                    )}

                    <div className="text-text-secondary mb-8 leading-relaxed text-sm md:text-base max-h-48 md:max-h-none overflow-y-auto pr-2 custom-scrollbar">
                        {product.description}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <span className="font-bold text-text-primary uppercase text-[10px] tracking-widest">Quantity</span>
                            <div className="flex items-center border border-border-primary rounded-full bg-bg-primary px-1">
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-2.5 text-text-secondary hover:text-accent-primary disabled:opacity-30 transition-colors" aria-label="Decrease quantity">
                                    <MinusIcon />
                                </button>
                                <span className="px-5 font-black text-lg text-text-primary tabular-nums min-w-[3rem] text-center">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} className="p-2.5 text-text-secondary hover:text-accent-primary transition-colors" aria-label="Increase quantity">
                                    <PlusIcon />
                                </button>
                            </div>
                        </div>

                        <div className="flex-grow w-full">
                            <motion.button
                                onClick={handleAddToCartClick}
                                className="w-full font-black py-4 px-6 rounded-full overflow-hidden shadow-xl uppercase tracking-widest text-sm"
                                animate={{ 
                                    backgroundColor: isAdded ? '#22c55e' : '#f59e0b',
                                }}
                                whileHover={{ scale: isAdded ? 1 : 1.02 }}
                                whileTap={{ scale: isAdded ? 1 : 0.98 }}
                            >
                                <span className="block text-white">
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.span
                                            key={isAdded ? 'added' : 'add'}
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -10, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="inline-block"
                                        >
                                            {isAdded ? 'Added!' : 'Add to Cart'}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                            </motion.button>
                        </div>
                    </div>

                    <button 
                        onClick={handleViewDetailsClick}
                        className="text-center text-sm font-black text-text-secondary hover:text-accent-primary transition-colors uppercase tracking-widest py-2"
                    >
                        View Full Details &rarr;
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProductModal;
