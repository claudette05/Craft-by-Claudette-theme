import React from 'react';
import { Product, Category, HeroSlide, ProductReview } from './types';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'New Resin Earrings',
    subtitle: 'Handcrafted with love and vibrant colors.',
    imageUrl: 'https://images.unsplash.com/photo-1611151923205-3333575303a1?q=80&w=2670&auto=format&fit=crop',
    buttonText: 'Shop Now',
  },
  {
    id: 2,
    title: 'Beaded Bracelets',
    subtitle: 'Unique designs for every style.',
    imageUrl: 'https://images.unsplash.com/photo-1589309797086-628867a1956f?q=80&w=2670&auto=format&fit=crop',
    buttonText: 'Explore Collection',
  },
  {
    id: 3,
    title: 'Lipgloss Keychains',
    subtitle: 'Beauty on the go, stylish and practical.',
    imageUrl: 'https://images.unsplash.com/photo-1620920494901-de1a63c8a98a?q=80&w=2670&auto=format&fit=crop',
    buttonText: 'Discover More',
  },
];

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Resin', imageUrl: 'https://images.unsplash.com/photo-1636572481942-12492162523d?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 2, name: 'Beads', imageUrl: 'https://images.unsplash.com/photo-1454563823136-7e8392a404c0?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 3, name: 'Lipgloss', imageUrl: 'https://images.unsplash.com/photo-1575429391320-42f068771a36?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 4, name: 'Ribbons', imageUrl: 'https://images.unsplash.com/photo-1595932582801-5e544711655b?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 5, name: 'Keychains', imageUrl: 'https://images.unsplash.com/photo-1606913743380-a5491a1357c3?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 6, name: 'Bracelets', imageUrl: 'https://images.unsplash.com/photo-1611099222359-52a69a083311?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 7, name: 'Earrings', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 8, name: 'Necklaces', imageUrl: 'https://images.unsplash.com/photo-1507702811690-3f7dc36f2f45?q=80&w=200&h=200&auto=format&fit=crop' },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Pastel Dream Earrings',
    price: 18.50,
    salePrice: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2574&auto=format&fit=crop',
    category: 'Earrings',
    description: 'Lightweight and dreamy resin earrings with gold flakes. Perfect for adding a touch of magic to your day.',
    stock: 25,
    variants: [
      { id: 'v1-1', color: 'Pink', size: 'Small', stock: 10, colorHex: '#FFC0CB' },
      { id: 'v1-2', color: 'Pink', size: 'Medium', stock: 8, colorHex: '#FFC0CB' },
      { id: 'v1-3', color: 'Blue', size: 'Small', stock: 12, colorHex: '#AEC6CF' },
      { id: 'v1-4', color: 'Blue', size: 'Medium', stock: 0, colorHex: '#AEC6CF' },
      { id: 'v1-5', color: 'Lavender', size: 'Medium', stock: 5, colorHex: '#E6E6FA' },
    ],
    tags: ['resin', 'earrings', 'pastel', 'gold'],
    published: true,
  },
  {
    id: 2,
    name: 'Oceanic Beaded Bracelet',
    price: 25.00,
    imageUrl: 'https://images.unsplash.com/photo-1611099222359-52a69a083311?q=80&w=2574&auto=format&fit=crop',
    category: 'Bracelets',
    description: 'A beautiful bracelet made with various shades of blue and white beads, reminiscent of ocean waves.',
    stock: 15,
    tags: ['beads', 'bracelet', 'ocean', 'blue'],
    published: true,
  },
  {
    id: 3,
    name: 'Glitter Gloss Keychain',
    price: 12.00,
    salePrice: 9.50,
    imageUrl: 'https://images.unsplash.com/photo-1575429391320-42f068771a36?q=80&w=2574&auto=format&fit=crop',
    category: 'Keychains',
    description: 'Never lose your lipgloss again! This keychain features a mini tube of our signature glitter gloss.',
    stock: 40,
    tags: ['lipgloss', 'keychain', 'glitter'],
    published: true,
  },
  {
    id: 4,
    name: 'Satin Ribbon Choker',
    price: 15.75,
    imageUrl: 'https://images.unsplash.com/photo-1595932582801-5e544711655b?q=80&w=2574&auto=format&fit=crop',
    category: 'Necklaces',
    description: 'A simple yet elegant choker made from high-quality satin ribbon. Available in multiple colors.',
    stock: 30,
    variants: [
      { id: 'v4-1', color: 'Black', size: 'One Size', stock: 15, colorHex: '#000000', imageUrl: 'https://images.unsplash.com/photo-1512353087810-72e155c0e549?q=80&w=2574&auto=format&fit=crop' },
      { id: 'v4-2', color: 'Red', size: 'One Size', stock: 10, colorHex: '#FF0000', imageUrl: 'https://images.unsplash.com/photo-1595932582801-5e544711655b?q=80&w=2574&auto=format&fit=crop' },
      { id: 'v4-3', color: 'White', size: 'One Size', stock: 5, colorHex: '#FFFFFF', imageUrl: 'https://images.unsplash.com/photo-1589902639093-ad815894107e?q=80&w=2574&auto=format&fit=crop' },
    ],
    tags: ['ribbon', 'choker', 'necklace', 'satin'],
    published: true,
  },
  {
    id: 5,
    name: 'Floral Resin Coaster',
    price: 22.00,
    imageUrl: 'https://images.unsplash.com/photo-1636572481942-12492162523d?q=80&w=2574&auto=format&fit=crop',
    category: 'Resin',
    description: 'Protect your surfaces in style with this stunning coaster featuring real dried flowers preserved in clear resin.',
    stock: 18,
    tags: ['resin', 'coaster', 'floral', 'homedecor'],
    published: true,
  },
  {
    id: 6,
    name: 'Sunset Bead Necklace',
    price: 32.00,
    salePrice: 28.00,
    imageUrl: 'https://images.unsplash.com/photo-1507702811690-3f7dc36f2f45?q=80&w=2574&auto=format&fit=crop',
    category: 'Necklaces',
    description: 'A vibrant necklace with beads in shades of orange, pink, and gold, inspired by a beautiful sunset.',
    stock: 12,
    tags: ['beads', 'necklace', 'sunset'],
    published: true,
  },
   {
    id: 7,
    name: 'Starry Night Earrings',
    price: 19.99,
    imageUrl: 'https://images.unsplash.com/photo-1616190419994-ff083bffb36c?q=80&w=2574&auto=format&fit=crop',
    category: 'Earrings',
    description: 'Dark blue resin earrings with silver glitter, mimicking a clear starry night sky.',
    stock: 22,
    tags: ['resin', 'earrings', 'glitter', 'stars'],
    published: false,
  },
   {
    id: 8,
    name: 'Friendship Bracelet Kit',
    price: 28.00,
    imageUrl: 'https://images.unsplash.com/photo-1454563823136-7e8392a404c0?q=80&w=2564&auto=format&fit=crop',
    category: 'Beads',
    description: 'Everything you need to make your own beautiful beaded friendship bracelets. Great for gifts!',
    stock: 0,
    tags: ['beads', 'diy', 'kit', 'bracelet'],
    published: true,
  },
  {
    id: 9,
    name: 'Rose Gold Beaded Ring',
    price: 14.00,
    imageUrl: 'https://images.unsplash.com/photo-1611652033959-8a562828602c?q=80&w=2574&auto=format&fit=crop',
    category: 'Beads',
    description: 'A delicate and stackable ring made with tiny rose gold beads. Adds a subtle sparkle.',
    stock: 50,
    tags: ['beads', 'ring', 'rosegold'],
    published: true,
  },
  {
    id: 10,
    name: 'Personalized Resin Keychain',
    price: 16.50,
    imageUrl: 'https://images.unsplash.com/photo-1606913743380-a5491a1357c3?q=80&w=2574&auto=format&fit=crop',
    category: 'Keychains',
    description: 'A custom keychain with your initial, preserved in clear resin with your choice of glitter or flowers.',
    stock: 35,
    tags: ['resin', 'keychain', 'personalized', 'gift'],
    published: true,
  },
];

export const DEALS_PRODUCTS = PRODUCTS.filter(p => p.salePrice).slice(0, 3);
export const TRENDING_PRODUCTS = [PRODUCTS[1], PRODUCTS[4], PRODUCTS[6], PRODUCTS[8]];
export const BESTSELLER_PRODUCTS = [PRODUCTS[0], PRODUCTS[2], PRODUCTS[4], PRODUCTS[7]];

export const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 1,
    productId: 1,
    author: 'Emily R.',
    rating: 5,
    date: '2023-10-15',
    title: 'Absolutely stunning!',
    comment: 'These earrings are even more beautiful in person. They are so lightweight and catch the light perfectly. I get compliments every time I wear them. Highly recommend!',
    verifiedPurchase: true,
  },
  {
    id: 2,
    productId: 1,
    author: 'Jessica B.',
    rating: 4,
    date: '2023-09-28',
    title: 'Very pretty and unique',
    comment: 'I love the design and the colors are lovely. My only small issue is that the backings are a bit loose, but that\'s an easy fix. Otherwise, they are perfect.',
    verifiedPurchase: true,
  },
  {
    id: 3,
    productId: 1,
    author: 'Sarah L.',
    rating: 5,
    date: '2023-09-10',
    title: 'My new favorites!',
    comment: 'I\'m obsessed with these earrings! They go with everything and are such a great statement piece without being too heavy. The quality is fantastic.',
    verifiedPurchase: false,
  },
   {
    id: 4,
    productId: 5,
    author: 'Mike P.',
    rating: 5,
    date: '2023-10-20',
    title: 'Incredible craftsmanship',
    comment: 'Bought this as a gift for my wife and she was thrilled. The flowers inside the resin are so detailed and beautifully preserved. It looks amazing on our coffee table.',
    verifiedPurchase: true,
  },
  {
    id: 5,
    productId: 5,
    author: 'Chloe G.',
    rating: 4,
    date: '2023-10-05',
    title: 'Beautiful but has a tiny bubble',
    comment: 'This coaster is gorgeous and I love using it. There\'s a very small air bubble near the edge, but it\'s only noticeable if you look closely. It doesn\'t affect its function at all.',
    verifiedPurchase: true,
  }
];


// SVG Icons
export const ShoppingCartIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

export const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const SearchIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const HeartIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

export const TrashIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const UserIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const MapPinIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// Admin Icons
export const DollarSignIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m0-10a9 9 0 110 18 9 9 0 010-18z" />
    </svg>
);

export const UsersIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm6-11a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);

export const PackageIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

export const HomeIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

export const SettingsIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const TagIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M15 11l-4 4-4-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h.01" />
    </svg>
);

export const LayoutIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

export const ChartBarIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);