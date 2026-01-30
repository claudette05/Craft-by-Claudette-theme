import { Category, HeroSlide, ProductReview, HomepageSectionConfig } from './types';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 101,
    title: 'New Resin Earrings',
    subtitle: 'Handcrafted with love and vibrant colors.',
    imageUrl: 'https://images.unsplash.com/photo-1611151923205-3333575303a1?q=80&w=2670&auto=format&fit=crop',
    buttonText: 'Shop Now',
  },
  {
    id: 102,
    title: 'Beaded Bracelets',
    subtitle: 'Unique designs for every style.',
    imageUrl: 'https://images.unsplash.com/photo-1589309797086-628867a1956f?q=80&w=2670&auto=format&fit=crop',
    buttonText: 'Explore Collection',
  },
  {
    id: 103,
    title: 'Lipgloss Keychains',
    subtitle: 'Beauty on the go, stylish and practical.',
    imageUrl: 'https://images.unsplash.com/photo-1620920494901-de1a63c8a98a?q=80&w=2670&auto=format&fit=crop',
    buttonText: 'Discover More',
  },
];

export const CATEGORIES: Category[] = [
  { id: 201, name: 'Resin', imageUrl: 'https://images.unsplash.com/photo-1636572481942-12492162523d?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 202, name: 'Beads', imageUrl: 'https://images.unsplash.com/photo-1454563823136-7e8392a404c0?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 203, name: 'Lipgloss', imageUrl: 'https://images.unsplash.com/photo-1575429391320-42f068771a36?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 204, name: 'Ribbons', imageUrl: 'https://images.unsplash.com/photo-1595932582801-5e544711655b?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 205, name: 'Keychains', imageUrl: 'https://images.unsplash.com/photo-1606913743380-a5491a1357c3?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 206, name: 'Bracelets', imageUrl: 'https://images.unsplash.com/photo-1611099222359-52a69a083311?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 207, name: 'Earrings', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 208, name: 'Necklaces', imageUrl: 'https://images.unsplash.com/photo-1507702811690-3f7dc36f2f45?q=80&w=200&h=200&auto=format&fit=crop' },
];

export const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 301,
    productId: 1,
    author: 'Emily R.',
    rating: 5,
    date: '2023-10-15',
    title: 'Absolutely stunning!',
    comment: 'These earrings are even more beautiful in person. They are so lightweight and catch the light perfectly. I get compliments every time I wear them. Highly recommend!',
    verifiedPurchase: true,
  },
  {
    id: 302,
    productId: 1,
    author: 'Jessica B.',
    rating: 4,
    date: '2023-09-28',
    title: 'Very pretty and unique',
    comment: 'I love the design and the colors are lovely. My only small issue is that the backings are a bit loose, but that\'s an easy fix. Otherwise, they are perfect.',
    verifiedPurchase: true,
  },
  {
    id: 303,
    productId: 1,
    author: 'Sarah L.',
    rating: 5,
    date: '2023-09-10',
    title: 'My new favorites!',
    comment: 'I\'m obsessed with these earrings! They go with everything and are such a great statement piece without being too heavy. The quality is fantastic.',
    verifiedPurchase: false,
  },
   {
    id: 304,
    productId: 5,
    author: 'Mike P.',
    rating: 5,
    date: '2023-10-20',
    title: 'Incredible craftsmanship',
    comment: 'Bought this as a gift for my wife and she was thrilled. The flowers inside the resin are so detailed and beautifully preserved. It looks amazing on our coffee table.',
    verifiedPurchase: true,
  },
  {
    id: 305,
    productId: 5,
    author: 'Chloe G.',
    rating: 4,
    date: '2023-10-05',
    title: 'Beautiful but has a tiny bubble',
    comment: 'This coaster is gorgeous and I love using it. There\'s a very small air bubble near the edge, but it\'s only noticeable if you look closely. It doesn\'t affect its function at all.',
    verifiedPurchase: true,
  }
];

export const HOMEPAGE_SECTIONS_CONFIG: HomepageSectionConfig[] = [
  { id: 'deals', title: 'Deals of the Day', description: 'Products currently featured in the "Deals of the Day" section.' },
  { id: 'bestsellers', title: 'Our Bestsellers', description: 'Products highlighted as bestsellers on the homepage.' },
];
