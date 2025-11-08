// FIX: Import React to resolve "Cannot find namespace 'React'" error on line 49.
import React from 'react';

export interface ProductVariant {
  id: string; // Unique ID for the variant
  color: string;
  colorHex?: string; // For UI swatches
  size: string;
  stock: number;
  imageUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  category: string;
  description: string;
  stock: number;
  variants?: ProductVariant[];
  tags?: string[];
  published: boolean;
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

export interface CartItem {
  productId: number;
  quantity: number;
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

// Admin Dashboard Types
export interface AdminStat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type OrderStatus = 'Completed' | 'Processing' | 'Pending' | 'Cancelled';

export interface AdminOrder {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
}

export interface AdminTopProduct {
  id: number;
  name: string;
  imageUrl: string;
  sales: number;
}

export interface ProductReview {
  id: number;
  productId: number;
  author: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface AdminCustomer {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    orders: number;
    totalSpent: number;
}

export interface Promotion {
    id: number;
    code: string;
    type: 'Percentage' | 'Fixed';
    value: number;
    status: 'Active' | 'Expired' | 'Scheduled';
    startDate: string;
    endDate: string;
    usageCount: number;
}

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};