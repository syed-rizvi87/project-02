import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  Customer, 
  Coupon, 
  PageRoute, 
  AccountTab, 
  AdminTab, 
  ProductColor,
  Address
} from '../types/ecommerce';
import { 
  MOCK_PRODUCTS, 
  INITIAL_USER, 
  INITIAL_ORDERS, 
  MOCK_COUPONS 
} from '../data/mockData';
import { api } from '../services/api';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface EcommerceContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  currentUser: Customer | null;
  currentPage: PageRoute;
  selectedProductId: string | null;
  activeAccountTab: AccountTab;
  trackingOrderId: string | null;
  activeAdminTab: AdminTab;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  appliedCoupon: Coupon | null;
  toasts: ToastNotification[];
  quickViewProduct: Product | null;
  isLoadingBackend: boolean;
  
  // Navigation & UI controls
  navigateTo: (page: PageRoute, productId?: string, accountTab?: AccountTab, trackingOrderId?: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setActiveAccountTab: (tab: AccountTab) => void;
  setActiveAdminTab: (tab: AdminTab) => void;
  setTrackingOrderId: (orderId: string | null) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  
  // Cart Actions
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Coupon Actions
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  
  // Orders & Checkout
  placeOrder: (shippingAddress: Order['shippingAddress'], paymentMethod: string, shippingMethod: string, shippingCost: number) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  
  // Catalog Management (Admin)
  addProduct: (product: Omit<Product, 'id' | 'sku' | 'rating' | 'reviewCount' | 'slug'>) => Promise<Product>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  
  // Customer & Auth
  loginUser: (user?: Customer) => void;
  logoutUser: () => void;
  updateProfile: (updates: Partial<Customer>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  
  // Toasts
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
  removeToast: (id: string) => void;
}

const EcommerceContext = createContext<EcommerceContextType | undefined>(undefined);

export const EcommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-001');
  const [activeAccountTab, setActiveAccountTab] = useState<AccountTab>('dashboard');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>('ord-8921');
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');
  
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isLoadingBackend, setIsLoadingBackend] = useState<boolean>(false);

  // Initialize cart with one default item
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'prod-001-Oat Melange-40 / M',
      product: MOCK_PRODUCTS[0],
      selectedColor: MOCK_PRODUCTS[0].colors[0],
      selectedSize: '40 / M',
      quantity: 1
    }
  ]);
  
  const [wishlist, setWishlist] = useState<string[]>(['prod-002', 'prod-003']);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [currentUser, setCurrentUser] = useState<Customer | null>(INITIAL_USER);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Toast helper
  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync initial state from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const fetchBackendData = async () => {
      setIsLoadingBackend(true);
      try {
        const [backendProducts, backendOrders, backendCustomer] = await Promise.allSettled([
          api.getProducts(),
          api.getOrders(),
          api.getCustomer()
        ]);

        if (!isMounted) return;

        if (backendProducts.status === 'fulfilled' && backendProducts.value?.length > 0) {
          setProducts(backendProducts.value);
        }
        if (backendOrders.status === 'fulfilled' && backendOrders.value?.length > 0) {
          setOrders(backendOrders.value);
        }
        if (backendCustomer.status === 'fulfilled' && backendCustomer.value) {
          setCurrentUser(backendCustomer.value);
        }
      } catch (err) {
        console.warn('Backend initialized with local fallback:', err);
      } finally {
        if (isMounted) setIsLoadingBackend(false);
      }
    };

    fetchBackendData();
    return () => { isMounted = false; };
  }, []);

  const navigateTo = (
    page: PageRoute, 
    productId?: string, 
    accountTab?: AccountTab, 
    orderId?: string
  ) => {
    setCurrentPage(page);
    if (productId) setSelectedProductId(productId);
    if (accountTab) setActiveAccountTab(accountTab);
    if (orderId) setTrackingOrderId(orderId);
    
    // Smooth scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Cart logic
  const addToCart = (
    product: Product, 
    size: string, 
    color: ProductColor, 
    quantity = 1, 
    openDrawer = true
  ) => {
    const cartItemId = `${product.id}-${color.name}-${size}`;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { id: cartItemId, product, selectedColor: color, selectedSize: size, quantity }];
      }
    });

    showToast(`Added "${product.title}" to your shopping bag.`, 'success');
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    const item = cart.find(i => i.id === cartItemId);
    setCart(prev => prev.filter(i => i.id !== cartItemId));
    if (item) {
      showToast(`Removed "${item.product.title}" from your bag.`, 'info');
    }
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === cartItemId ? { ...item, quantity: newQty } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist logic
  const toggleWishlist = (productId: string) => {
    const isPresent = wishlist.includes(productId);
    const product = products.find(p => p.id === productId);
    
    if (isPresent) {
      setWishlist(prev => prev.filter(id => id !== productId));
      showToast(`Removed "${product?.title || 'Item'}" from wishlist.`, 'info');
    } else {
      setWishlist(prev => [...prev, productId]);
      showToast(`Saved "${product?.title || 'Item'}" to your wishlist.`, 'success');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon logic with backend validation
  const applyCoupon = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    try {
      const res = await api.validateCoupon(cleanCode, cartSubtotal);
      setAppliedCoupon(res.coupon);
      showToast(`Promotion "${res.coupon.code}" applied!`, 'success');
      return { success: true, message: res.message };
    } catch (err: any) {
      // Fallback local verification
      const fallback = MOCK_COUPONS.find(c => c.code === cleanCode);
      if (fallback) {
        if (fallback.minSpend && cartSubtotal < fallback.minSpend) {
          return { success: false, message: `Requires minimum order value of $${fallback.minSpend}.` };
        }
        setAppliedCoupon(fallback);
        showToast(`Promotion "${fallback.code}" applied!`, 'success');
        return { success: true, message: fallback.description };
      }
      return { success: false, message: err.message || 'Invalid promotion code.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promotion code removed.', 'info');
  };

  // Place Order with backend sync
  const placeOrder = async (
    shippingAddress: Order['shippingAddress'], 
    paymentMethod: string, 
    shippingMethod: string, 
    shippingCost: number
  ): Promise<Order> => {
    const discountAmount = appliedCoupon 
      ? appliedCoupon.discountPercent 
        ? (cartSubtotal * appliedCoupon.discountPercent) / 100 
        : (appliedCoupon.discountAmount || 0)
      : 0;

    const taxAmount = Number(((cartSubtotal - discountAmount) * 0.08).toFixed(2));
    const grandTotal = Number((cartSubtotal - discountAmount + shippingCost + taxAmount).toFixed(2));

    let createdOrder: Order;

    try {
      createdOrder = await api.createOrder({
        items: [...cart],
        shippingAddress,
        paymentMethod,
        shippingMethod,
        shippingCost,
        subtotal: cartSubtotal,
        discount: discountAmount,
        tax: taxAmount,
        total: grandTotal
      });
    } catch (err) {
      // Local fallback in case of connection drop
      const orderNum = `AUR-${Math.floor(10000 + Math.random() * 90000)}-${shippingAddress.country.slice(0, 2).toUpperCase()}`;
      const trackingNum = `DHL-EX-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      createdOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: 'Confirmed',
        items: [...cart],
        subtotal: cartSubtotal,
        shippingCost,
        shippingMethod,
        discount: discountAmount,
        tax: taxAmount,
        total: grandTotal,
        shippingAddress,
        paymentMethod,
        trackingNumber: trackingNum,
        carrier: 'DHL Express Worldwide',
        estimatedDelivery: '3 to 5 business days',
        checkpoints: [
          {
            id: 'chk-1',
            status: 'Order Placed & Verified',
            location: 'Atelier Central Facility · Milan',
            timestamp: 'Just now',
            description: 'Payment verified and allocated to master packaging atelier.',
            completed: true
          }
        ]
      };
    }

    setOrders(prev => [createdOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    showToast(`Order #${createdOrder.orderNumber} placed and recorded!`, 'success');
    return createdOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    // Optimistic local update
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status } : ord));
    try {
      await api.updateOrderStatus(orderId, status);
      showToast(`Updated order ${orderId} status to ${status} in database.`, 'info');
    } catch (err) {
      showToast(`Order status updated to ${status}.`, 'info');
    }
  };

  // Product additions & inventory controls
  const addProduct = async (newProdData: Omit<Product, 'id' | 'sku' | 'rating' | 'reviewCount' | 'slug'>): Promise<Product> => {
    try {
      const created = await api.createProduct(newProdData);
      setProducts(prev => [created, ...prev]);
      showToast(`Product "${created.title}" published to catalog.`, 'success');
      return created;
    } catch (err) {
      // Fallback
      const id = `prod-${Date.now()}`;
      const sku = `AUR-NEW-${Math.floor(100 + Math.random() * 900)}`;
      const fullProduct: Product = {
        ...newProdData,
        id,
        sku,
        rating: 5.0,
        reviewCount: 0,
        slug: newProdData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };
      setProducts(prev => [fullProduct, ...prev]);
      showToast(`Product "${fullProduct.title}" added to catalog.`, 'success');
      return fullProduct;
    }
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    const validStock = Math.max(0, newStock);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: validStock } : p));
    try {
      await api.updateStock(productId, validStock);
      showToast(`Stock level synced with backend warehouse.`, 'info');
    } catch (err) {
      showToast(`Stock updated locally.`, 'info');
    }
  };

  // Customer Management
  const loginUser = (user: Customer = INITIAL_USER) => {
    setCurrentUser(user);
    showToast(`Signed in as ${user.name}.`, 'success');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Signed out of your account.', 'info');
    navigateTo('home');
  };

  const updateProfile = async (updates: Partial<Customer>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    try {
      await api.updateCustomer(updates);
      showToast('Profile synchronized with client database.', 'success');
    } catch (err) {
      showToast('Profile updated.', 'success');
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    try {
      const created = await api.addAddress(address);
      const updated = address.isDefault 
        ? currentUser.addresses.map(a => ({ ...a, isDefault: false }))
        : [...currentUser.addresses];
      
      setCurrentUser({
        ...currentUser,
        addresses: [...updated, created]
      });
      showToast('Address saved to database.', 'success');
    } catch (err) {
      const newAddress: Address = { ...address, id: `addr-${Date.now()}` };
      const updated = address.isDefault 
        ? currentUser.addresses.map(a => ({ ...a, isDefault: false }))
        : [...currentUser.addresses];
      setCurrentUser({
        ...currentUser,
        addresses: [...updated, newAddress]
      });
      showToast('Address saved.', 'success');
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      addresses: currentUser.addresses.map(a => ({
        ...a,
        isDefault: a.id === addressId
      }))
    });
    try {
      await api.setDefaultAddress(addressId);
    } catch (err) {
      // optimistic state already set
    }
    showToast('Default destination updated.', 'info');
  };

  const deleteAddress = async (addressId: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      addresses: currentUser.addresses.filter(a => a.id !== addressId)
    });
    try {
      await api.deleteAddress(addressId);
    } catch (err) {
      // optimistic state already set
    }
    showToast('Address removed.', 'info');
  };

  return (
    <EcommerceContext.Provider value={{
      products,
      cart,
      wishlist,
      orders,
      currentUser,
      currentPage,
      selectedProductId,
      activeAccountTab,
      trackingOrderId,
      activeAdminTab,
      isCartOpen,
      isSearchOpen,
      searchQuery,
      selectedCategory,
      appliedCoupon,
      toasts,
      quickViewProduct,
      isLoadingBackend,
      
      navigateTo,
      setIsCartOpen,
      setIsSearchOpen,
      setSearchQuery,
      setSelectedCategory,
      setActiveAccountTab,
      setActiveAdminTab,
      setTrackingOrderId,
      openQuickView,
      closeQuickView,
      
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal,
      cartTotalCount,
      
      toggleWishlist,
      isInWishlist,
      
      applyCoupon,
      removeCoupon,
      
      placeOrder,
      updateOrderStatus,
      
      addProduct,
      updateProductStock,
      
      loginUser,
      logoutUser,
      updateProfile,
      addAddress,
      setDefaultAddress,
      deleteAddress,
      
      showToast,
      removeToast
    }}>
      {children}
    </EcommerceContext.Provider>
  );
};

export const useEcommerce = () => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
};
