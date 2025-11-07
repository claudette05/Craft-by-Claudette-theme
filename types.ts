export interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  category: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
}

// FIX: Add Testimonial interface to resolve import error in components/Testimonials.tsx
export interface Testimonial {
  id: number;
  name: string;
  quote: string;
  rating: number;
}

// FIX: Add LookbookPost interface to resolve import error in components/Lookbook.tsx
export interface LookbookPost {
  id: number;
  imageUrl: string;
  caption: string;
}