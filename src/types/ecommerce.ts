export interface ProductColor {
  name: string;
  hex: string;
  bgClass: string;
}

export interface ProductDetailItem {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
  helpfulCount: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'Apparel & Tailoring' | 'Handcrafted Leather' | 'Architectural Living' | 'Footwear & Accents';
  categorySlug: 'apparel' | 'leather' | 'living' | 'footwear';
  sku: string;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  materials: string;
  dimensions?: string;
  care: string;
  origin: string;
  reviews?: Review[];
}

export interface CartItem {
  id: string; // unique item instance id: `${productId}-${color}-${size}`
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface TrackingCheckpoint {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  shippingMethod: string;
  discount: number;
  tax: number;
  total: number;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  checkpoints: TrackingCheckpoint[];
}

export interface Address {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  tier: 'Club Silver' | 'Gold Atelier' | 'Private Client';
  rewardPoints: number;
  totalOrders: number;
  addresses: Address[];
  joinedDate: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  description: string;
  minSpend?: number;
}

export type PageRoute = 
  | 'home' 
  | 'shop' 
  | 'product-details' 
  | 'cart' 
  | 'checkout' 
  | 'auth' 
  | 'account' 
  | 'admin';

export type AccountTab = 
  | 'dashboard' 
  | 'orders' 
  | 'tracking' 
  | 'wishlist' 
  | 'addresses' 
  | 'profile';

export type AdminTab = 
  | 'overview' 
  | 'products' 
  | 'categories' 
  | 'orders' 
  | 'customers' 
  | 'analytics' 
  | 'inventory';
