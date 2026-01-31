
// types.ts

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ShopInfo {
  name: string;
  email: string;
  whatsapp: string;
  momoNumber?: string;
  momoName?: string;
  logoUrl?: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

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
  images?: string[];
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
  'shop' | 'cart' | 'productDetail' | 
  'checkout' | 'admin' | 'productReviews' | 'search' | 
  'searchHistory' | 'affiliate' | 'allProducts' | 'reportBug' | 'notFound' |
  'login' | 'signup' | 'forgotPassword' | 'resetPassword' | 'myAccount';

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
  customerEmail?: string;
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
  images?: string[];
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

export interface PopupContent {
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    successTitle: string;
    successMessage: string;
    discountCode: string;
    placeholderText: string;
    disclaimerText: string;
    timerDurationMinutes?: number;
}

export type PopupPosition = 'center' | 'bottom-right' | 'bottom-left' | 'top-center';
export type AnimationType = 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'rotate';
export type PopupType = 'standard' | 'spinner' | 'countdown';

export interface SpinnerSegment {
    id: string;
    label: string;
    value: string; // The code or text to display on win
    color: string;
    textColor: string;
    probability: number; // 0-100 (relative weight)
}

export interface PopupStyle {
    layout: 'image-left' | 'image-right' | 'image-top' | 'no-image' | 'background-image';
    width: 'sm' | 'md' | 'lg';
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
    overlayColor: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    fontFamily: 'sans' | 'serif' | 'mono';
    position: PopupPosition;
    entranceAnimation: AnimationType;
    exitAnimation: AnimationType;
}

export interface PopupBehavior {
    delay: number; // seconds
    showOnExit: boolean;
    showOnScroll: boolean;
    scrollPercentage: number; // 0-100
}

export interface PopupConfig {
    enabled: boolean;
    type: PopupType;
    content: PopupContent;
    style: PopupStyle;
    behavior: PopupBehavior;
    spinnerSegments?: SpinnerSegment[];
}

export interface EmailLog {
    id: string;
    recipient: string;
    subject: string;
    template: 'welcome' | 'order_confirmation' | 'password_reset' | 'marketing';
    status: 'Sent' | 'Failed' | 'Queued';
    date: string;
    content: string; // HTML string simulation
}

export interface FreeGiftConfig {
    enabled: boolean;
    threshold: number;
    message: string;
    successMessage: string;
}
