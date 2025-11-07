import React from 'react';
import { Product, Category, HeroSlide } from './types';

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
  },
  {
    id: 2,
    name: 'Oceanic Beaded Bracelet',
    price: 25.00,
    imageUrl: 'https://images.unsplash.com/photo-1611099222359-52a69a083311?q=80&w=2574&auto=format&fit=crop',
    category: 'Bracelets',
    description: 'A beautiful bracelet made with various shades of blue and white beads, reminiscent of ocean waves.',
  },
  {
    id: 3,
    name: 'Glitter Gloss Keychain',
    price: 12.00,
    salePrice: 9.50,
    imageUrl: 'https://images.unsplash.com/photo-1575429391320-42f068771a36?q=80&w=2574&auto=format&fit=crop',
    category: 'Keychains',
    description: 'Never lose your lipgloss again! This keychain features a mini tube of our signature glitter gloss.',
  },
  {
    id: 4,
    name: 'Satin Ribbon Choker',
    price: 15.75,
    imageUrl: 'https://images.unsplash.com/photo-1595932582801-5e544711655b?q=80&w=2574&auto=format&fit=crop',
    category: 'Necklaces',
    description: 'A simple yet elegant choker made from high-quality satin ribbon. Available in multiple colors.',
  },
  {
    id: 5,
    name: 'Floral Resin Coaster',
    price: 22.00,
    imageUrl: 'https://images.unsplash.com/photo-1636572481942-12492162523d?q=80&w=2574&auto=format&fit=crop',
    category: 'Resin',
    description: 'Protect your surfaces in style with this stunning coaster featuring real dried flowers preserved in clear resin.',
  },
  {
    id: 6,
    name: 'Sunset Bead Necklace',
    price: 32.00,
    salePrice: 28.00,
    imageUrl: 'https://images.unsplash.com/photo-1507702811690-3f7dc36f2f45?q=80&w=2574&auto=format&fit=crop',
    category: 'Necklaces',
    description: 'A vibrant necklace with beads in shades of orange, pink, and gold, inspired by a beautiful sunset.',
  },
   {
    id: 7,
    name: 'Starry Night Earrings',
    price: 19.99,
    imageUrl: 'https://images.unsplash.com/photo-1616190419994-ff083bffb36c?q=80&w=2574&auto=format&fit=crop',
    category: 'Earrings',
    description: 'Dark blue resin earrings with silver glitter, mimicking a clear starry night sky.',
  },
   {
    id: 8,
    name: 'Friendship Bracelet Kit',
    price: 28.00,
    imageUrl: 'https://images.unsplash.com/photo-1454563823136-7e8392a404c0?q=80&w=2564&auto=format&fit=crop',
    category: 'Beads',
    description: 'Everything you need to make your own beautiful beaded friendship bracelets. Great for gifts!',
  },
  {
    id: 9,
    name: 'Rose Gold Beaded Ring',
    price: 14.00,
    imageUrl: 'https://images.unsplash.com/photo-1611652033959-8a562828602c?q=80&w=2574&auto=format&fit=crop',
    category: 'Beads',
    description: 'A delicate and stackable ring made with tiny rose gold beads. Adds a subtle sparkle.',
  },
  {
    id: 10,
    name: 'Personalized Resin Keychain',
    price: 16.50,
    imageUrl: 'https://images.unsplash.com/photo-1606913743380-a5491a1357c3?q=80&w=2574&auto=format&fit=crop',
    category: 'Keychains',
    description: 'A custom keychain with your initial, preserved in clear resin with your choice of glitter or flowers.',
  },
];

export const DEALS_PRODUCTS = PRODUCTS.filter(p => p.salePrice).slice(0, 3);
export const TRENDING_PRODUCTS = [PRODUCTS[1], PRODUCTS[4], PRODUCTS[6], PRODUCTS[8]];
export const BESTSELLER_PRODUCTS = [PRODUCTS[0], PRODUCTS[2], PRODUCTS[4], PRODUCTS[7]];


// SVG Icons
export const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);