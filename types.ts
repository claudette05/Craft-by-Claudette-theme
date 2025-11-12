// types.ts

export interface ProductVariant {
  id: string;
  color: string;
  colorHex?: string;
  imageUrl?: string;
  size: string;
  stock: number;
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

export type Page = 
  'shop' | 'cart' | 'login' | 'signup' | 'productDetail' | 
  'checkout' | 'admin' | 'productReviews' | 'search' | 
  'searchHistory' | 'affiliate' | 'account' | 'forgotPassword' | 
  'resetPassword' | 'allProducts';

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type OrderStatus = 'Completed' | 'Processing' | 'Pending' | 'Cancelled' | 'Shipped';

export type TrackingStatus = 'Order Placed' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface OrderTrackingEvent {
    status: TrackingStatus;
    date: string;
    location: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  trackingHistory?: OrderTrackingEvent[];
}

export interface AdminCustomer {
  id: number;
  name: string;
  avatarUrl: string;
  email: string;
  orders: number;
  totalSpent: number;
}

export interface Promotion {
    id: number;
    code: string;
    type: 'Percentage' | 'Fixed';
    value: number;
    status: 'Active' | 'Expired' | 'Scheduled';
    usageCount: number;
}

export interface ProductReview {
  id: number;
  productId: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface HomepageSections {
    deals: number[];
    bestsellers: number[];
}

export interface HomepageSectionConfig {
    id: keyof HomepageSections;
    title: string;
    description: string;
}

export interface Testimonial {
    id: number;
    name: string;
    quote: string;
    rating: number;
}

export interface LookbookPost {
    id: number;
    imageUrl: string;
    caption: string;
}

export type AccountPage = 'dashboard' | 'orders' | 'profile' | 'addresses' | 'wishlist' | 'notifications' | 'tracking';

export interface AdminTopProduct {
    id: number;
    name: string;
    imageUrl: string;
    sales: number;
}