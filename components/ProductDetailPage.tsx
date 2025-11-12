import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { HeartIcon } from './Icons';
import ProductGrid from './ProductGrid';
import { useAppContext } from '../context/AppContext';

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

const StarRating: React.FC<{ rating: number, totalStars?: number }> = ({ rating, totalStars = 5 }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} filled />)}
            {halfStar && <Star half />}
            {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} />)}
        </div>
    );
};

const Star: React.FC<{ filled?: boolean; half?: boolean }> = ({ filled = false, half = false }) => {
    const gradientId = React.useId();
    return (
        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
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


interface ProductDetailPageProps {
    product: Product;
    relatedProducts: Product[];
    onBackToShop: () => void;
    onProductClick: (product: Product) => void;
    onNavigateToReviews: () => void;
    onQuickView: (product: Product) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, relatedProducts, onBackToShop, onProductClick, onNavigateToReviews, onQuickView }) => {
    const { wishlist, toggleWishlist, addToCart } = useAppContext();
    const [quantity, setQuantity] = React.useState(1);
    const [isAdded, setIsAdded] = React.useState(false);
    const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
    const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
    const [selectedImage, setSelectedImage] = React.useState(product.imageUrl);

    const hasSale = typeof product.salePrice === 'number';
    const isInWishlist = wishlist.includes(product.id);

    React.useEffect(() => {
        setQuantity(1);
        setSelectedColor(null);
        setSelectedSize(null);
        setSelectedImage(product.imageUrl);
        setIsAdded(false);
    }, [product]);

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };
    
    const availableColors = React.useMemo(() => {
        if (!product.variants) return [];
        const colors = product.variants.map(v => ({ name: v.color, hex: v.colorHex, imageUrl: v.imageUrl }));
        return [...new Map(colors.map(item => [item.name, item])).values()];
    }, [product.variants]);

    const availableSizes = React.useMemo(() => {
        if (!product.variants || !selectedColor) return [];
        return product.variants
            .filter(v => v.color === selectedColor)
            .map(v => ({ name: v.size, stock: v.stock }));
    }, [product.variants, selectedColor]);

    const handleColorSelect = (color: { name: string, imageUrl?: string }) => {
        setSelectedColor(color.name);
        setSelectedSize(null); // Reset size when color changes
        if (color.imageUrl) {
            setSelectedImage(color.imageUrl);
        }
    };
    
    const hasVariants = product.variants && product.variants.length > 0;
    const hasColorOptions = availableColors.length > 0;
    const hasSizeOptions = availableSizes.length > 0;

    const stockLevel = React.useMemo(() => {
        if (!hasVariants) return product.stock;
        if ((hasColorOptions && !selectedColor) || (hasSizeOptions && !selectedSize)) return -1;
        const selectedVariant = product.variants?.find(v => (!hasColorOptions || v.color === selectedColor) && (!hasSizeOptions || v.size === selectedSize));
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

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 pb-16 bg-bg-primary"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 text-sm text-text-secondary">
                    <button onClick={onBackToShop} className="hover:text-accent-primary">Home</button> / <span className="text-text-primary font-medium">{product.category}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <motion.div 
                        className="bg-bg-secondary p-4 rounded-lg shadow-md"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img src={selectedImage} alt={product.name} className="w-full h-auto object-cover rounded-lg aspect-square" />
                    </motion.div>

                    <motion.div 
                        className="flex flex-col justify-center"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <span className="text-sm text-text-secondary uppercase tracking-wider">{product.category}</span>
                        <h1 className="text-3xl md:text-4xl font-bold my-2 text-text-primary">{product.name}</h1>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <StarRating rating={4.5} />
                            <button onClick={onNavigateToReviews} className="text-sm text-text-secondary hover:text-accent-primary transition-colors">(142 Reviews)</button>
                        </div>
                        
                        {hasSale ? (
                            <div className="flex items-baseline space-x-3">
                                <p className="text-3xl font-light text-red-600">GH₵{product.salePrice?.toFixed(2)}</p>
                                <p className="text-xl font-light text-text-secondary line-through">GH₵{product.price.toFixed(2)}</p>
                            </div>
                        ) : (
                            <p className="text-3xl font-light text-accent-primary">GH₵{product.price.toFixed(2)}</p>
                        )}

                        <StockIndicator stock={stockLevel} />

                        <p className="text-text-secondary mb-6 leading-relaxed">{product.description}</p>
                        
                        {hasVariants && (
                            <div className="space-y-6 mb-6">
                                {hasColorOptions && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-text-primary mb-2">Color: <span className="font-normal">{selectedColor}</span></h3>
                                        <div className="flex items-center gap-3">
                                            {availableColors.map(color => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => handleColorSelect(color)}
                                                    className={`w-8 h-8 rounded-full border-2 transition ${selectedColor === color.name ? 'ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-secondary' : 'border-gray-200 dark:border-zinc-600'}`}
                                                    style={{ backgroundColor: color.hex || 'transparent' }}
                                                    aria-label={`Select color ${color.name}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {hasSizeOptions && (
                                     <div>
                                        <h3 className="text-sm font-semibold text-text-primary mb-2">Size: <span className="font-normal">{selectedSize}</span></h3>
                                        <div className="flex items-center gap-3">
                                            {availableSizes.map(size => (
                                                <button
                                                    key={size.name}
                                                    onClick={() => setSelectedSize(size.name)}
                                                    disabled={size.stock === 0}
                                                    className={`px-4 py-2 border rounded-full text-sm font-medium transition ${
                                                        selectedSize === size.name 
                                                            ? 'bg-accent-primary text-accent-text border-accent-primary' 
                                                            : 'bg-bg-secondary text-text-primary border-border-primary'
                                                    } ${
                                                        size.stock === 0 
                                                            ? 'opacity-50 cursor-not-allowed line-through' 
                                                            : 'hover:border-accent-primary'
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

                        <div className="flex items-center gap-4 mb-6">
                            <span className="font-semibold text-text-primary">Quantity:</span>
                            <div className="flex items-center border border-border-primary rounded-full bg-bg-secondary">
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-2.5 text-text-secondary hover:text-accent-primary disabled:opacity-50" aria-label="Decrease quantity">
                                    <MinusIcon />
                                </button>
                                <span className="px-5 font-semibold text-lg text-text-primary tabular-nums">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} className="p-2.5 text-text-secondary hover:text-accent-primary" aria-label="Increase quantity">
                                    <PlusIcon />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <motion.button 
                                onClick={handleAddToCartClick} 
                                className="flex-grow font-bold py-3 px-4 rounded-full disabled:cursor-not-allowed overflow-hidden"
                                disabled={isAddToCartDisabled && !isAdded}
                                animate={{ 
                                    backgroundColor: isAdded ? '#22c55e' : (isAddToCartDisabled ? '#a1a1aa' : '#f59e0b')
                                }}
                                whileHover={{ scale: (isAddToCartDisabled || isAdded) ? 1 : 1.05 }}
                                whileTap={{ scale: (isAddToCartDisabled || isAdded) ? 1 : 0.95 }}
                            >
                               <span className={`block ${isAdded || !isAddToCartDisabled ? 'text-accent-text' : 'text-white'}`}>
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.span
                                            key={isAdded ? 'added' : addToCartText}
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -10, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="inline-block"
                                        >
                                            {isAdded ? 'Added!' : addToCartText}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                            </motion.button>
                            <motion.button
                                onClick={() => toggleWishlist(product.id)}
                                className={`flex-shrink-0 flex items-center justify-center p-3 rounded-full border transition-colors ${
                                    isInWishlist ? 'bg-red-50 dark:bg-red-500/10 border-red-400 dark:border-red-500/30 text-red-500' : 'bg-bg-secondary border-border-primary text-text-secondary hover:bg-bg-tertiary hover:border-zinc-400 dark:hover:border-zinc-500'
                                }`}
                                whileTap={{ scale: 0.9 }}
                                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                <HeartIcon className="h-6 w-6" filled={isInWishlist} />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-16 md:mt-24">
                    <ProductGrid 
                        title="You Might Also Like"
                        products={relatedProducts}
                        onProductClick={onProductClick}
                        onQuickView={onQuickView}
                        bgColor="bg-transparent"
                    />
                </div>
            )}
        </motion.main>
    );
};

export default ProductDetailPage;
