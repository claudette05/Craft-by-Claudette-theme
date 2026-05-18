
export type Product = {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  images?: string[];
  videoUrl?: string;
  category: string;
  description: string;
  stock: number;
  published: boolean;
  tags?: string[];
  isNew?: boolean;
  sku?: string;
  weight?: number;
  dimensions?: string;
  variants?: ProductVariant[];
  isPreorder?: boolean;
  preorderReleaseDate?: string;
  relatedProductIds?: number[];
};

export type ProductVariant = {
  id: string;
  color?: string;
  colorHex?: string;
  size?: string;
  stock: number;
  imageUrl?: string;
};

export type Category = {
  id: string;
  name: string;
  imageUrl: string;
  productCount?: number;
};

export type CartItem = {
  productId: number;
  variantId?: string; 
  quantity: number;
};

export type Page = 
  | 'shop' 
  | 'cart' 
  | 'productDetail' 
  | 'checkout' 
  | 'admin' 
  | 'productReviews'
  | 'search'
  | 'searchHistory'
  | 'affiliate'
  | 'allProducts'
  | 'reportBug'
  | 'notFound'
  | 'login'
  | 'signup'
  | 'forgotPassword'
  | 'resetPassword'
  | 'myAccount'
  | 'preorderPolicy'
  | 'customerLove';

export type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  videoUrl?: string;
  ctaText: string;
  ctaLink: string;
};

export type HomepageSections = {
  bestsellers: number[];
  deals: number[];
  preorders: number[];
};

export type HomepageSection = {
  id: string;
  title: string;
  filterType: 'category' | 'tag';
  filterValue: string;
}

export type HomepageSectionConfig = {
    id: keyof HomepageSections;
    title: string;
    description: string;
};

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Completed';

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: { productId: number; quantity: number; price?: number }[];
  shippingAddress?: string;
  trackingHistory?: { status: string; date: string; location: string }[];
}

export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  firstOrderDate: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Promotion {
  id: number;
  code: string;
  discount: number; // Percentage
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ProductReview {
  id: number;
  productId: number;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  imageUrl?: string;
}

export interface PopupConfig {
    enabled: boolean;
    type: 'standard' | 'spin-the-wheel';
    content: {
        title: string;
        description: string;
        imageUrl: string;
        buttonText: string;
        successTitle: string;
        successMessage: string;
        discountCode: string;
        placeholderText: string;
        disclaimerText: string;
    };
    style: {
        layout: 'image-left' | 'image-right' | 'image-top';
        width: 'sm' | 'md' | 'lg';
        backgroundColor: string;
        textColor: string;
        buttonColor: string;
        buttonTextColor: string;
        overlayColor: string;
        borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
        fontFamily: string;
        position: 'center' | 'bottom-left' | 'bottom-right';
        entranceAnimation: 'fade' | 'slide-up' | 'scale';
        exitAnimation: 'fade' | 'slide-down' | 'scale';
    };
    behavior: {
        delay: number;
        showOnExit: boolean;
        showOnScroll: boolean;
        scrollPercentage: number;
    };
    spinnerSegments: {
        id: string;
        label: string;
        value: string;
        color: string;
        textColor: string;
        probability: number;
    }[];
}

export interface EmailLog {
    id: string;
    recipient: string;
    subject: string;
    template: 'welcome' | 'order-confirmation' | 'shipping-update';
    timestamp: string;
    status: 'sent' | 'failed';
}

export interface FreeGiftConfig {
    enabled: boolean;
    threshold: number;
    message: string;
    successMessage: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface CloudinaryConfig {
    cloudName: string;
    uploadPreset: string;
}

export interface ShopInfo {
    name: string;
    email: string;
    whatsapp: string;
    logoUrl: string;
}
