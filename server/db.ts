import { 
  Product, 
  Order, 
  Customer, 
  Coupon, 
  Review, 
  Address,
  TrackingCheckpoint
} from '../src/types/ecommerce';
import { 
  MOCK_PRODUCTS, 
  INITIAL_USER, 
  INITIAL_ORDERS, 
  MOCK_COUPONS, 
  MOCK_CATEGORIES,
  MOCK_ADMIN_METRICS 
} from '../src/data/mockData';

// Central in-memory state store with atomic operations
class InMemoryDatabase {
  private products: Product[] = [...MOCK_PRODUCTS];
  private orders: Order[] = [...INITIAL_ORDERS];
  private customer: Customer = { ...INITIAL_USER };
  private coupons: Coupon[] = [...MOCK_COUPONS];
  private categories = [...MOCK_CATEGORIES];
  private newsletterSubscribers: { email: string; date: string }[] = [];

  // Products
  getProducts(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    sort?: string;
  }): Product[] {
    let result = [...this.products];

    if (filters?.category && filters.category !== 'All Collections') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.materials.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters?.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    if (filters?.sort) {
      switch (filters.sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        default:
          break;
      }
    }

    return result;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(productData: Omit<Product, 'id' | 'sku' | 'rating' | 'reviewCount' | 'slug'>): Product {
    const id = `prod-${Date.now()}`;
    const sku = `AUR-NEW-${Math.floor(100 + Math.random() * 900)}`;
    const slug = productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const newProduct: Product = {
      ...productData,
      id,
      sku,
      slug,
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };

    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProductStock(id: string, newStock: number): Product | null {
    const product = this.products.find(p => p.id === id);
    if (!product) return null;
    product.stock = Math.max(0, newStock);
    return product;
  }

  addReviewToProduct(productId: string, review: Omit<Review, 'id' | 'date' | 'helpfulCount'>): { product: Product; review: Review } | null {
    const product = this.products.find(p => p.id === productId);
    if (!product) return null;

    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      helpfulCount: 0
    };

    if (!product.reviews) {
      product.reviews = [];
    }
    product.reviews.unshift(newReview);
    product.reviewCount = product.reviews.length;
    
    // Recalculate average rating
    const sumRatings = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Number((sumRatings / product.reviews.length).toFixed(1));

    return { product, review: newReview };
  }

  // Categories
  getCategories() {
    return this.categories.map(cat => ({
      ...cat,
      itemCount: this.products.filter(p => p.category === cat.name).length
    }));
  }

  // Orders
  getOrders(email?: string): Order[] {
    if (email) {
      return this.orders.filter(o => o.shippingAddress.email.toLowerCase() === email.toLowerCase());
    }
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  createOrder(orderPayload: {
    items: Order['items'];
    shippingAddress: Order['shippingAddress'];
    paymentMethod: string;
    shippingMethod: string;
    shippingCost: number;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  }): Order {
    // Decrement stock for purchased items
    for (const item of orderPayload.items) {
      const prod = this.products.find(p => p.id === item.product.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    const orderNum = `AUR-${Math.floor(10000 + Math.random() * 90000)}-${orderPayload.shippingAddress.country.slice(0, 2).toUpperCase()}`;
    const trackingNum = `DHL-EX-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Confirmed',
      items: orderPayload.items,
      subtotal: orderPayload.subtotal,
      shippingCost: orderPayload.shippingCost,
      shippingMethod: orderPayload.shippingMethod,
      discount: orderPayload.discount,
      tax: orderPayload.tax,
      total: orderPayload.total,
      shippingAddress: orderPayload.shippingAddress,
      paymentMethod: orderPayload.paymentMethod,
      trackingNumber: trackingNum,
      carrier: 'DHL Express Worldwide',
      estimatedDelivery: '3 to 5 business days',
      checkpoints: [
        {
          id: `chk-${Date.now()}-1`,
          status: 'Order Placed & Payment Confirmed',
          location: 'Atelier Central Facility · Milan',
          timestamp: 'Just now',
          description: 'Payment verified and specimen allocated to packaging team.',
          completed: true
        },
        {
          id: `chk-${Date.now()}-2`,
          status: 'Quality Control & Wax Sealing',
          location: 'Atelier Inspection Depot · Milan',
          timestamp: 'Scheduled today',
          description: 'Hand inspection verified. Certificate of authenticity enclosed.',
          completed: false
        },
        {
          id: `chk-${Date.now()}-3`,
          status: 'Dispatched with Carrier',
          location: 'Milan Gateway Airport (MXP)',
          timestamp: 'Upcoming',
          description: 'Handed to DHL Express courier for insured international transit.',
          completed: false
        }
      ]
    };

    this.orders.unshift(newOrder);

    // Update customer total orders count and points
    if (this.customer.email.toLowerCase() === orderPayload.shippingAddress.email.toLowerCase()) {
      this.customer.totalOrders += 1;
      this.customer.rewardPoints += Math.round(orderPayload.subtotal * 0.1);
    }

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return null;

    order.status = status;

    // Append dynamic tracking checkpoint based on state
    if (status === 'Shipped') {
      const alreadyShipped = order.checkpoints.some(c => c.status === 'Dispatched with Carrier' && c.completed);
      if (!alreadyShipped) {
        order.checkpoints.forEach(c => {
          if (c.status.includes('Quality Control')) c.completed = true;
          if (c.status.includes('Dispatched with Carrier')) {
            c.completed = true;
            c.timestamp = 'Just now';
          }
        });
      }
    } else if (status === 'Delivered') {
      order.checkpoints.forEach(c => c.completed = true);
      order.checkpoints.push({
        id: `chk-del-${Date.now()}`,
        status: 'Delivered to Consignee Destination',
        location: `${order.shippingAddress.city}, ${order.shippingAddress.country}`,
        timestamp: 'Delivered today',
        description: `Signed for by ${order.shippingAddress.fullName}. Parcel received safely.`,
        completed: true
      });
    }

    return order;
  }

  // Coupons
  validateCoupon(code: string, currentSubtotal: number): { valid: boolean; coupon?: Coupon; discount: number; message: string } {
    const clean = code.trim().toUpperCase();
    const coupon = this.coupons.find(c => c.code === clean);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or expired promotional code.' };
    }

    if (coupon.minSpend && currentSubtotal < coupon.minSpend) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Requires minimum order value of $${coupon.minSpend}.` 
      };
    }

    const discount = coupon.discountPercent 
      ? (currentSubtotal * coupon.discountPercent) / 100 
      : (coupon.discountAmount || 0);

    return { 
      valid: true, 
      coupon, 
      discount, 
      message: `Coupon "${coupon.code}" applied: ${coupon.description}` 
    };
  }

  getCoupons() {
    return this.coupons;
  }

  // Customer
  getCustomer(): Customer {
    return this.customer;
  }

  updateCustomer(updates: Partial<Customer>): Customer {
    this.customer = { ...this.customer, ...updates };
    return this.customer;
  }

  addAddress(address: Omit<Address, 'id'>): Address {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`
    };

    if (address.isDefault) {
      this.customer.addresses.forEach(a => a.isDefault = false);
    }

    this.customer.addresses.push(newAddress);
    return newAddress;
  }

  deleteAddress(addressId: string): boolean {
    const initialLen = this.customer.addresses.length;
    this.customer.addresses = this.customer.addresses.filter(a => a.id !== addressId);
    return this.customer.addresses.length < initialLen;
  }

  setDefaultAddress(addressId: string): boolean {
    let found = false;
    this.customer.addresses.forEach(a => {
      if (a.id === addressId) {
        a.isDefault = true;
        found = true;
      } else {
        a.isDefault = false;
      }
    });
    return found;
  }

  // Newsletter
  subscribeNewsletter(email: string): { success: boolean; code: string; message: string } {
    const exists = this.newsletterSubscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      this.newsletterSubscribers.push({
        email,
        date: new Date().toISOString()
      });
    }
    return {
      success: true,
      code: 'ATELIER30',
      message: 'Subscription confirmed. Benefit code ATELIER30 activated.'
    };
  }

  // Analytics
  getAnalytics() {
    const totalRevenue = this.orders.reduce((sum, o) => sum + o.total, 0);
    const lowStock = this.products.filter(p => p.stock <= 5);

    return {
      totalRevenue: Math.round(totalRevenue + 120000), // realistic cumulative figure
      ordersCount: this.orders.length + 338,
      averageOrderValue: Math.round((totalRevenue + 120000) / (this.orders.length + 338)),
      monthlyGrowth: '+18.4%',
      customerRetention: '76.8%',
      lowStockItemsCount: lowStock.length,
      salesTrend: MOCK_ADMIN_METRICS.salesTrend,
      categoryShare: [
        { name: 'Apparel & Tailoring', percent: 48, revenue: 61650 },
        { name: 'Handcrafted Leather', percent: 32, revenue: 41100 },
        { name: 'Architectural Living', percent: 14, revenue: 17980 },
        { name: 'Footwear & Accents', percent: 6, revenue: 7720 }
      ]
    };
  }
}

export const db = new InMemoryDatabase();
