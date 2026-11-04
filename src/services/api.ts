import { 
  Product, 
  Order, 
  Customer, 
  Address, 
  Review, 
  Coupon 
} from '../types/ecommerce';

const BASE_URL = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Request failed with status ${res.status}`);
  }
  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sort?: string;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
    if (params?.inStock) query.set('inStock', 'true');
    if (params?.sort) query.set('sort', params.sort);

    const qs = query.toString();
    const res = await fetch(`${BASE_URL}/products${qs ? `?${qs}` : ''}`);
    return handleResponse<Product[]>(res);
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    return handleResponse<Product>(res);
  },

  async createProduct(product: Omit<Product, 'id' | 'sku' | 'rating' | 'reviewCount' | 'slug'>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return handleResponse<Product>(res);
  },

  async updateStock(productId: string, stock: number): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${productId}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock })
    });
    return handleResponse<Product>(res);
  },

  async submitReview(productId: string, review: Omit<Review, 'id' | 'date' | 'helpfulCount'>): Promise<{ product: Product; review: Review }> {
    const res = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    return handleResponse<{ product: Product; review: Review }>(res);
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${BASE_URL}/categories`);
    return handleResponse<any[]>(res);
  },

  // Orders
  async getOrders(email?: string): Promise<Order[]> {
    const qs = email ? `?email=${encodeURIComponent(email)}` : '';
    const res = await fetch(`${BASE_URL}/orders${qs}`);
    return handleResponse<Order[]>(res);
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/${id}`);
    return handleResponse<Order>(res);
  },

  async createOrder(orderPayload: {
    items: Order['items'];
    shippingAddress: Order['shippingAddress'];
    paymentMethod: string;
    shippingMethod: string;
    shippingCost: number;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  }): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    return handleResponse<Order>(res);
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse<Order>(res);
  },

  // Coupons
  async validateCoupon(code: string, subtotal: number): Promise<{ coupon: Coupon; discount: number; message: string }> {
    const res = await fetch(`${BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });
    return handleResponse<{ coupon: Coupon; discount: number; message: string }>(res);
  },

  // Customer
  async getCustomer(): Promise<Customer> {
    const res = await fetch(`${BASE_URL}/customer`);
    return handleResponse<Customer>(res);
  },

  async updateCustomer(updates: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`${BASE_URL}/customer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return handleResponse<Customer>(res);
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    const res = await fetch(`${BASE_URL}/customer/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address)
    });
    return handleResponse<Address>(res);
  },

  async deleteAddress(addressId: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/customer/addresses/${addressId}`, {
      method: 'DELETE'
    });
    return handleResponse<{ message: string }>(res);
  },

  async setDefaultAddress(addressId: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/customer/addresses/${addressId}/default`, {
      method: 'PATCH'
    });
    return handleResponse<{ message: string }>(res);
  },

  // Analytics
  async getAnalytics(): Promise<any> {
    const res = await fetch(`${BASE_URL}/analytics`);
    return handleResponse<any>(res);
  },

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{ success: boolean; code: string; message: string }> {
    const res = await fetch(`${BASE_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse<{ success: boolean; code: string; message: string }>(res);
  }
};
