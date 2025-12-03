
import { Product } from './types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Pastel Dream Earrings',
    price: 45.00,
    salePrice: 35.00,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611151923205-3333575303a1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'Earrings',
    description: 'Lightweight and dreamy resin earrings with a pastel swirl. Perfect for adding a pop of color to any outfit. Handcrafted with hypoallergenic posts.',
    stock: 15,
    tags: ['resin', 'earrings', 'pastel', 'handmade'],
    published: true,
    variants: [
      { id: 'v1', color: 'Pink Swirl', colorHex: '#FBCFE8', size: 'One Size', stock: 5, imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&auto=format&fit=crop' },
      { id: 'v2', color: 'Blue Swirl', colorHex: '#BFDBFE', size: 'One Size', stock: 8, imageUrl: 'https://images.unsplash.com/photo-1611151923205-3333575303a1?q=80&w=200&auto=format&fit=crop' },
      { id: 'v3', color: 'Purple Swirl', colorHex: '#E9D5FF', size: 'One Size', stock: 2, imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=200&auto=format&fit=crop' }
    ]
  },
  {
    id: 2,
    name: 'Oceanic Blue Bracelet',
    price: 60.00,
    imageUrl: 'https://images.unsplash.com/photo-1611099222359-52a69a083311?q=80&w=800&auto=format&fit=crop',
    category: 'Bracelets',
    description: 'A beautiful beaded bracelet reminiscent of the ocean waves. Made with glass beads and a durable elastic cord.',
    stock: 25,
    tags: ['beads', 'bracelet', 'blue', 'ocean'],
    published: true,
    variants: [
        { id: 'v4', color: '', size: 'Small (6")', stock: 10 },
        { id: 'v5', color: '', size: 'Medium (6.5")', stock: 10 },
        { id: 'v6', color: '', size: 'Large (7")', stock: 5 }
    ]
  },
  {
    id: 3,
    name: 'Glitter Gloss Keychain',
    price: 25.00,
    imageUrl: 'https://images.unsplash.com/photo-1575429391320-42f068771a36?q=80&w=800&auto=format&fit=crop',
    category: 'Keychains',
    description: 'Never lose your lipgloss again! This stylish keychain holds a mini glitter lipgloss, perfect for on-the-go touch-ups.',
    stock: 30,
    tags: ['lipgloss', 'keychain', 'glitter', 'beauty'],
    published: true,
  },
  {
    id: 4,
    name: 'Sunset Orange Necklace',
    price: 75.00,
    imageUrl: 'https://images.unsplash.com/photo-1507702811690-3f7dc36f2f45?q=80&w=800&auto=format&fit=crop',
    category: 'Necklaces',
    description: 'A statement necklace featuring sunset-colored beads. Adjustable length for the perfect fit.',
    stock: 10,
    tags: ['beads', 'necklace', 'orange', 'statement'],
    published: true,
  },
  {
    id: 5,
    name: 'Floral Resin Coaster',
    price: 30.00,
    imageUrl: 'https://images.unsplash.com/photo-1636572481942-12492162523d?q=80&w=800&auto=format&fit=crop',
    category: 'Resin',
    description: 'Protect your surfaces with this beautiful coaster featuring real dried flowers preserved in clear resin.',
    stock: 20,
    tags: ['resin', 'coaster', 'flowers', 'homedecor'],
    published: true,
  },
  {
    id: 6,
    name: 'Satin Bow Clip',
    price: 15.00,
    imageUrl: 'https://images.unsplash.com/photo-1595932582801-5e544711655b?q=80&w=800&auto=format&fit=crop',
    category: 'Ribbons',
    description: 'A classic satin bow hair clip. Available in various colors to match any outfit.',
    stock: 50,
    tags: ['ribbon', 'hair', 'accessory', 'bow'],
    published: true,
  },
  {
    id: 7,
    name: 'Heart Charm Bracelet',
    price: 55.00,
    imageUrl: 'https://images.unsplash.com/photo-1589309797086-628867a1956f?q=80&w=800&auto=format&fit=crop',
    category: 'Bracelets',
    description: 'A delicate chain bracelet with a handmade heart charm. A perfect gift for a loved one.',
    stock: 18,
    tags: ['bracelet', 'charm', 'heart', 'gift'],
    published: false,
  },
  {
    id: 8,
    name: 'Friendship Bracelet Kit',
    price: 40.00,
    salePrice: 32.00,
    imageUrl: 'https://images.unsplash.com/photo-1454563823136-7e8392a404c0?q=80&w=800&auto=format&fit=crop',
    category: 'Beads',
    description: 'Everything you need to make your own colorful friendship bracelets. Includes a variety of beads and threads.',
    stock: 40,
    tags: ['diy', 'kit', 'beads', 'friendship'],
    published: true,
  },
];

export default MOCK_PRODUCTS;
