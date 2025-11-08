import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { HeartIcon } from '../constants';
import ProductGrid from './ProductGrid';

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
    return (
        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
                <linearGradient id="half-fill">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#d1d5db" stopOpacity="1" />
                </linearGradient>
            </defs>
            <path
                fill={half ? "url(#half-fill)" : (filled ? "currentColor" : "#d1d5db")}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
        </svg>
    );
};


interface ProductDetailPageProps {
    product: Product;
    relatedProducts: Product[];
    onAddToCart: (productId: number, quantity: number) => void;
    wishlist: number[];
    onToggleWishlist: (productId: number) => void;
    onBackToShop: () => void;
    onProductClick: (product: Product) => void;
    onNavigateToReviews: () => void;
    onQuickView: (product: Product) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, relatedProducts, onAddToCart, wishlist, onToggleWishlist, onBackToShop, onProductClick, onNavigateToReviews, onQuickView }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(product.imageUrl);

    const hasSale = typeof product.salePrice === 'number';
    const isInWishlist = wishlist.includes(product.id);

    useEffect(() => {
        // Reset state when product changes
        setQuantity(1);
        setSelectedColor(null);
        setSelectedSize(null);
        setSelectedImage(product.imageUrl);
    }, [product]);

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };
    
    const availableColors = useMemo(() => {
        if (!product.variants) return [];
        const colors = product.variants.map(v => ({ name: v.color, hex: v.colorHex, imageUrl: v.imageUrl }));
        return [...new Map(colors.map(item => [item.name, item])).values()];
    }, [product.variants]);

    const availableSizes = useMemo(() => {
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

    const handleAddToCartClick = () => {
        let message = `${quantity} x ${product.name} added to cart!`;
        if (selectedColor) message = `${quantity} x ${product.name} (Color: ${selectedColor}${selectedSize ? `, Size: ${selectedSize}`: ''}) added to cart!`;
        onAddToCart(product.id, quantity);
        alert(message);
    };
    
    const hasVariants = product.variants && product.variants.length > 0;
    const hasColorOptions = availableColors.length > 0;
    const hasSizeOptions = availableSizes.length > 0;

    const isAddToCartDisabled = hasVariants && ((hasColorOptions && !selectedColor) || (hasSizeOptions && !selectedSize));

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 pb-16"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 text-sm text-zinc-500">
                    <button onClick={onBackToShop} className="hover:text-amber-600">Home</button> / <span className="text-zinc-800 font-medium">{product.category}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Image */}
                    <motion.div 
                        className="bg-white p-4 rounded-lg shadow-md"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img src={selectedImage} alt={product.name} className="w-full h-auto object-cover rounded-lg aspect-square" />
                    </motion.div>

                    {/* Product Details */}
                    <motion.div 
                        className="flex flex-col justify-center"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <span className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</span>
                        <h1 className="text-3xl md:text-4xl font-bold my-2 text-zinc-800">{product.name}</h1>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <StarRating rating={4.5} />
                            <button onClick={onNavigateToReviews} className="text-sm text-zinc-600 hover:text-amber-600 transition-colors">(142 Reviews)</button>
                        </div>
                        
                        {hasSale ? (
                            <div className="flex items-baseline space-x-3 mb-4">
                                <p className="text-3xl font-light text-red-600">GH₵{product.salePrice?.toFixed(2)}</p>
                                <p className="text-xl font-light text-gray-500 line-through">GH₵{product.price.toFixed(2)}</p>
                            </div>
                        ) : (
                            <p className="text-3xl font-light text-amber-600 mb-4">GH₵{product.price.toFixed(2)}</p>
                        )}

                        <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                        
                        {/* Variant Selection */}
                        {hasVariants && (
                            <div className="space-y-6 mb-6">
                                {hasColorOptions && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-zinc-700 mb-2">Color: <span className="font-normal">{selectedColor}</span></h3>
                                        <div className="flex items-center gap-3">
                                            {availableColors.map(color => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => handleColorSelect(color)}
                                                    className={`w-8 h-8 rounded-full border-2 transition ${selectedColor === color.name ? 'ring-2 ring-amber-500 ring-offset-2' : 'border-gray-200'}`}
                                                    style={{ backgroundColor: color.hex || 'transparent' }}
                                                    aria-label={`Select color ${color.name}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {hasSizeOptions && (
                                     <div>
                                        <h3 className="text-sm font-semibold text-zinc-700 mb-2">Size: <span className="font-normal">{selectedSize}</span></h3>
                                        <div className="flex items-center gap-3">
                                            {availableSizes.map(size => (
                                                <button
                                                    key={size.name}
                                                    onClick={() => setSelectedSize(size.name)}
                                                    disabled={size.stock === 0}
                                                    className={`px-4 py-2 border rounded-full text-sm font-medium transition ${
                                                        selectedSize === size.name 
                                                            ? 'bg-amber-600 text-white border-amber-600' 
                                                            : 'bg-white text-zinc-700 border-gray-300'
                                                    } ${
                                                        size.stock === 0 
                                                            ? 'opacity-50 cursor-not-allowed line-through' 
                                                            : 'hover:border-amber-500'
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
                            <span className="font-semibold text-zinc-700">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-full bg-white">
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-2.5 text-zinc-600 hover:text-amber-600 disabled:opacity-50" aria-label="Decrease quantity">
                                    <MinusIcon />
                                </button>
                                <span className="px-5 font-semibold text-lg text-zinc-800 tabular-nums">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} className="p-2.5 text-zinc-600 hover:text-amber-600" aria-label="Increase quantity">
                                    <PlusIcon />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleAddToCartClick} 
                                className="flex-grow bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-full transition-colors disabled:bg-zinc-400 disabled:cursor-not-allowed"
                                disabled={isAddToCartDisabled}
                            >
                                {isAddToCartDisabled ? 'Select Options' : 'Add to Cart'}
                            </button>
                            <motion.button
                                onClick={() => onToggleWishlist(product.id)}
                                className={`flex-shrink-0 flex items-center justify-center p-3 rounded-full border transition-colors ${
                                    isInWishlist ? 'bg-red-50 border-red-400 text-red-500' : 'bg-white border-gray-300 text-zinc-600 hover:bg-gray-100 hover:border-gray-400'
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

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16 md:mt-24">
                    <ProductGrid 
                        title="You Might Also Like"
                        products={relatedProducts}
                        onProductClick={onProductClick}
                        onAddToCart={onAddToCart}
                        wishlist={wishlist}
                        onToggleWishlist={onToggleWishlist}
                        onQuickView={onQuickView}
                        bgColor="bg-transparent"
                    />
                </div>
            )}
        </motion.main>
    );
};

export default ProductDetailPage;