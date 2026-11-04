import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { AdminTab, Product } from '../types/ecommerce';
import { MOCK_ADMIN_METRICS, MOCK_CATEGORIES } from '../data/mockData';
import { 
  BarChart3, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Users, 
  LineChart, 
  AlertTriangle, 
  ArrowUpRight, 
  Plus, 
  Search, 
  Edit, 
  CheckCircle2, 
  X, 
  Store,
  ChevronRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { 
    products, 
    orders, 
    currentUser, 
    activeAdminTab, 
    setActiveAdminTab, 
    updateOrderStatus, 
    addProduct, 
    updateProductStock, 
    navigateTo,
    showToast 
  } = useEcommerce();

  // Search filter for products table
  const [productSearch, setProductSearch] = useState('');
  
  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Apparel & Tailoring' | 'Handcrafted Leather' | 'Architectural Living' | 'Footwear & Accents'>('Apparel & Tailoring');
  const [newPrice, setNewPrice] = useState(480);
  const [newStock, setNewStock] = useState(10);
  const [newMaterials, setNewMaterials] = useState('');
  const [newOrigin, setNewOrigin] = useState('Milan, Italy');
  const [newDescription, setNewDescription] = useState('');

  // Filter products for product management table
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.stock <= 5);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please provide a product title.', 'warning');
      return;
    }

    const catSlugMap = {
      'Apparel & Tailoring': 'apparel',
      'Handcrafted Leather': 'leather',
      'Architectural Living': 'living',
      'Footwear & Accents': 'footwear'
    } as const;

    await addProduct({
      title: newTitle,
      subtitle: newSubtitle || 'Artisanal atelier handcrafted edition',
      description: newDescription || 'Crafted with master guild precision and raw European materials.',
      price: newPrice,
      category: newCategory,
      categorySlug: catSlugMap[newCategory],
      stock: newStock,
      materials: newMaterials || '100% Certified European Raw Fibres',
      care: 'Specialist maintenance recommended.',
      origin: newOrigin,
      images: [
        '/src/assets/images/hero_luxury_atelier_1793815699829.jpg'
      ],
      colors: [
        { name: 'Oatmeal', hex: '#D6C8B5', bgClass: 'bg-[#D6C8B5]' },
        { name: 'Noir', hex: '#1C1C1E', bgClass: 'bg-[#1C1C1E]' }
      ],
      sizes: ['S / 38', 'M / 40', 'L / 42'],
      isNew: true
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header with Back to Storefront Button */}
      <div className="bg-[#1C1C1E] text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-[#C2A378] text-[#1C1C1E]">
              Staff Management Suite
            </span>
            <span className="text-white/60 text-xs">· Production Release v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Atelier Executive Console
          </h1>
          <p className="text-xs text-white/70 mt-1">
            Global catalog operations, inventory governance, order fulfillments, and revenue metrics.
          </p>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-5 py-2.5 bg-[#FAF9F6] text-[#141416] hover:bg-[#EAE5DC] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto shadow-sm"
        >
          <Store className="w-4 h-4" />
          <span>Exit to Customer Storefront</span>
        </button>
      </div>

      {/* Admin Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-black/10">
        {[
          { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
          { id: 'products', label: 'Products & Editions', icon: Package, count: products.length },
          { id: 'categories', label: 'Taxonomy', icon: FolderTree },
          { id: 'orders', label: 'Client Orders', icon: ShoppingBag, count: orders.length },
          { id: 'customers', label: 'Patron Directory', icon: Users },
          { id: 'analytics', label: 'Commercial Analytics', icon: LineChart },
          { id: 'inventory', label: 'Inventory & Alerts', icon: AlertTriangle, alert: lowStockProducts.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isActive 
                  ? 'bg-[#1C1C1E] text-white shadow-xs' 
                  : 'text-[#4A453E] hover:bg-white hover:text-[#1A1A1A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#777]'}`}>
                  {tab.count}
                </span>
              )}
              {tab.alert !== undefined && tab.alert > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-white hairline-border rounded-xl">
              <span className="text-xs text-[#8A857D] font-medium">Monthly Gross Volume</span>
              <p className="text-3xl font-bold font-serif text-[#1A1A1A] mt-1 tabular-nums">
                ${MOCK_ADMIN_METRICS.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{MOCK_ADMIN_METRICS.monthlyGrowth} vs last quarter</span>
              </div>
            </div>

            <div className="p-6 bg-white hairline-border rounded-xl">
              <span className="text-xs text-[#8A857D] font-medium">Monthly Orders Count</span>
              <p className="text-3xl font-bold font-serif text-[#1A1A1A] mt-1 tabular-nums">
                {MOCK_ADMIN_METRICS.ordersThisMonth}
              </p>
              <p className="text-[11px] text-[#7A746B] mt-1">Across 28 international territories</p>
            </div>

            <div className="p-6 bg-white hairline-border rounded-xl">
              <span className="text-xs text-[#8A857D] font-medium">Average Order Value (AOV)</span>
              <p className="text-3xl font-bold font-serif text-[#1A1A1A] mt-1 tabular-nums">
                ${MOCK_ADMIN_METRICS.averageOrderValue}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">+$42 luxury leather basket lift</p>
            </div>

            <div className="p-6 bg-white hairline-border rounded-xl">
              <span className="text-xs text-[#8A857D] font-medium">Patron Retention</span>
              <p className="text-3xl font-bold font-serif text-[#1A1A1A] mt-1 tabular-nums">
                {MOCK_ADMIN_METRICS.customerRetention}
              </p>
              <p className="text-[11px] text-[#9B6B43] font-medium mt-1">Gold Atelier repeat patrons</p>
            </div>
          </div>

          {/* Revenue Trend SVG Chart */}
          <div className="p-6 sm:p-8 bg-white hairline-border rounded-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/5">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Trailing 6-Month Commercial Trajectory
                </h3>
                <p className="text-xs text-[#7A746B] mt-0.5">Audited monthly order volumes and net intake</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 font-mono">Gross Target: $1.2M</span>
            </div>

            {/* Clean SVG Bar Chart with Tabular Numerals */}
            <div className="h-56 w-full flex items-end justify-between gap-4 pt-8 pb-4">
              {MOCK_ADMIN_METRICS.salesTrend.map((item) => {
                const heightPercent = Math.round((item.sales / 140000) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-[#8A857D] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                      ${(item.sales / 1000).toFixed(0)}k
                    </span>
                    <div 
                      className="w-full max-w-[48px] bg-[#1C1C1E] group-hover:bg-[#9B6B43] rounded-t-md transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-xs text-[#59554F] font-medium mt-1">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="p-6 bg-white hairline-border rounded-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Recent Fulfillments
              </h3>
              <button
                onClick={() => setActiveAdminTab('orders')}
                className="text-xs text-[#9B6B43] hover:underline font-semibold"
              >
                Manage All Orders →
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/10 text-[#8A857D]">
                    <th className="py-2.5">Order ID</th>
                    <th className="py-2.5">Client</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Items</th>
                    <th className="py-2.5">Total</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-[#333]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF9F6]">
                      <td className="py-3 font-mono font-medium">#{ord.orderNumber}</td>
                      <td className="py-3 font-semibold text-[#1A1A1A]">{ord.shippingAddress.fullName}</td>
                      <td className="py-3 text-[#777]">{ord.date}</td>
                      <td className="py-3">{ord.items.length} items</td>
                      <td className="py-3 font-bold tabular-nums">${ord.total.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800' :
                          ord.status === 'Shipped' ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products Management */}
      {activeAdminTab === 'products' && (
        <div className="bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Master Product Catalog</h2>
              <p className="text-xs text-[#7A746B] mt-0.5">Manage pricing, inventory quotas, and product descriptions.</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black flex items-center gap-2 self-start sm:self-auto shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Specimen</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, title or category..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/10 text-[#8A857D]">
                  <th className="py-2.5">Specimen</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5">Price</th>
                  <th className="py-2.5">Stock</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Quick Stock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-[#333]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF9F6]">
                    <td className="py-3 flex items-center gap-3">
                      <img src={p.images[0]} alt={p.title} className="w-10 h-12 object-cover rounded bg-[#EBE7DF]" />
                      <div>
                        <p className="font-semibold text-[#1A1A1A] line-clamp-1">{p.title}</p>
                        <p className="text-[11px] text-[#7A746B]">{p.origin}</p>
                      </div>
                    </td>
                    <td className="py-3 text-[#555]">{p.category}</td>
                    <td className="py-3 font-mono text-[11px] text-[#777]">{p.sku}</td>
                    <td className="py-3 font-bold tabular-nums">${p.price}</td>
                    <td className="py-3">
                      <span className={`font-semibold tabular-nums ${p.stock <= 5 ? 'text-amber-800' : 'text-emerald-800'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        p.stock > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {p.stock > 0 ? 'Active' : 'Sold Out'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center border border-black/15 rounded bg-white">
                        <button
                          onClick={() => updateProductStock(p.id, p.stock - 1)}
                          className="px-2 py-0.5 hover:bg-[#F4F2ED] text-xs"
                          title="Reduce stock by 1"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-xs tabular-nums">{p.stock}</span>
                        <button
                          onClick={() => updateProductStock(p.id, p.stock + 1)}
                          className="px-2 py-0.5 hover:bg-[#F4F2ED] text-xs"
                          title="Increase stock by 1"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Categories Management */}
      {activeAdminTab === 'categories' && (
        <div className="bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-black/10">
            <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Curated Taxonomy Governance</h2>
            <p className="text-xs text-[#7A746B] mt-0.5">Manage store categories and navigation grouping.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_CATEGORIES.map(cat => (
              <div key={cat.id} className="p-4 rounded-xl border border-black/10 flex gap-4 items-center">
                <img src={cat.image} alt={cat.name} className="w-20 h-24 object-cover rounded bg-[#EBE7DF]" />
                <div className="text-xs flex-1">
                  <span className="text-[10px] uppercase font-bold text-[#9B6B43]">Category #{cat.id}</span>
                  <h3 className="text-sm font-bold text-[#1A1A1A] mt-0.5">{cat.name}</h3>
                  <p className="text-[11px] text-[#7A746B] mt-1 line-clamp-2">{cat.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-[#8A857D]">
                    <span>{cat.itemCount} Listed Editions</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">Status: Live</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Client Orders */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-black/10">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Fulfillment & Order Control</h2>
              <p className="text-xs text-[#7A746B] mt-0.5">Update shipment status and manage courier tracking.</p>
            </div>
            <span className="text-xs font-semibold text-[#1A1A1A]">{orders.length} Live Fulfillments</span>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-5 rounded-xl border border-black/10 bg-[#FAF9F6] space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1A1A1A]">#{ord.orderNumber}</span>
                      <span className="text-[#7A746B]">· {ord.date}</span>
                    </div>
                    <p className="text-[#59554F] mt-0.5">
                      Client: <strong>{ord.shippingAddress.fullName}</strong> ({ord.shippingAddress.email})
                    </p>
                  </div>

                  {/* Status Updater Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#7A746B] font-medium">Update Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e: any) => updateOrderStatus(ord.id, e.target.value)}
                      className="px-3 py-1.5 border border-black/20 rounded bg-white text-xs font-semibold cursor-pointer"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-black/5 text-[#59554F]">
                  <div>
                    <span className="font-semibold text-[#1A1A1A] block mb-1">Destined Address:</span>
                    <p>{ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.country}</p>
                    <p className="font-mono text-[11px] text-[#888] mt-1">AWB: {ord.trackingNumber}</p>
                  </div>
                  <div className="text-right sm:text-right">
                    <span className="font-semibold text-[#1A1A1A] block mb-1">Financial Settlement:</span>
                    <p>Total: <strong className="text-[#1A1A1A] text-sm tabular-nums">${ord.total.toLocaleString()}</strong></p>
                    <p className="text-[11px] text-[#888]">{ord.paymentMethod}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Patron Directory */}
      {activeAdminTab === 'customers' && (
        <div className="bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-black/10">
            <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Private Patron Directory</h2>
            <p className="text-xs text-[#7A746B] mt-0.5">Registered private collectors and high-net-worth clients.</p>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/10 text-[#8A857D]">
                  <th className="py-2.5">Patron</th>
                  <th className="py-2.5">Tier Privilege</th>
                  <th className="py-2.5">Total Orders</th>
                  <th className="py-2.5">Reward Points</th>
                  <th className="py-2.5">Patron Since</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-[#333]">
                {currentUser && (
                  <tr className="hover:bg-[#FAF9F6]">
                    <td className="py-3">
                      <p className="font-semibold text-[#1A1A1A]">{currentUser.name}</p>
                      <p className="text-[#888] text-[11px]">{currentUser.email}</p>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4EFE6] text-[#9B6B43]">
                        {currentUser.tier}
                      </span>
                    </td>
                    <td className="py-3 font-mono tabular-nums">{currentUser.totalOrders}</td>
                    <td className="py-3 font-mono tabular-nums text-emerald-800 font-bold">{currentUser.rewardPoints} pts</td>
                    <td className="py-3 text-[#777]">{currentUser.joinedDate}</td>
                    <td className="py-3 text-right">
                      <span className="text-emerald-700 font-semibold">Active VIP</span>
                    </td>
                  </tr>
                )}
                <tr className="hover:bg-[#FAF9F6]">
                  <td className="py-3">
                    <p className="font-semibold text-[#1A1A1A]">Julian Mercer</p>
                    <p className="text-[#888] text-[11px]">j.mercer@zurich-advisors.ch</p>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/5 text-[#333]">
                      Private Client
                    </span>
                  </td>
                  <td className="py-3 font-mono tabular-nums">11</td>
                  <td className="py-3 font-mono tabular-nums text-emerald-800 font-bold">2,850 pts</td>
                  <td className="py-3 text-[#777]">March 2025</td>
                  <td className="py-3 text-right">
                    <span className="text-emerald-700 font-semibold">Active VIP</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Commercial Analytics */}
      {activeAdminTab === 'analytics' && (
        <div className="bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-black/10">
            <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Commercial Performance Analytics</h2>
            <p className="text-xs text-[#7A746B] mt-0.5">Category contribution, conversion funnel, and return metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-[#FAF9F6] rounded-xl border border-black/5 space-y-4">
              <h3 className="font-semibold text-[#1A1A1A] uppercase tracking-wider">Revenue Breakdown by Category</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Apparel & Tailoring</span>
                    <span className="font-bold tabular-nums">48% ($61,650)</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5E0D6] rounded-full overflow-hidden">
                    <div className="w-[48%] h-full bg-[#1C1C1E]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Handcrafted Leather</span>
                    <span className="font-bold tabular-nums">32% ($41,100)</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5E0D6] rounded-full overflow-hidden">
                    <div className="w-[32%] h-full bg-[#9B6B43]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Architectural Living</span>
                    <span className="font-bold tabular-nums">14% ($17,980)</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5E0D6] rounded-full overflow-hidden">
                    <div className="w-[14%] h-full bg-[#758273]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Footwear & Accents</span>
                    <span className="font-bold tabular-nums">6% ($7,720)</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5E0D6] rounded-full overflow-hidden">
                    <div className="w-[6%] h-full bg-[#8E8B85]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#FAF9F6] rounded-xl border border-black/5 space-y-4">
              <h3 className="font-semibold text-[#1A1A1A] uppercase tracking-wider">Conversion & Return Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-2.5 bg-white rounded border border-black/5">
                  <span>Storefront Conversion Rate</span>
                  <strong className="text-emerald-700 font-mono">3.42% (Industry Avg: 1.8%)</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded border border-black/5">
                  <span>Cart-to-Checkout Completion</span>
                  <strong className="font-mono">72.4%</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded border border-black/5">
                  <span>Overall Product Return Rate</span>
                  <strong className="font-mono">1.1% (Low risk)</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded border border-black/5">
                  <span>Net Promoter Score (NPS)</span>
                  <strong className="text-emerald-700 font-mono">+84 (World Class)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Inventory & Low Stock Alerts */}
      {activeAdminTab === 'inventory' && (
        <div className="bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-black/10">
            <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Inventory Thresholds & Atelier Quotas</h2>
            <p className="text-xs text-[#7A746B] mt-0.5">Low-stock items requiring workshop re-orders and raw wool allocations.</p>
          </div>

          <div className="space-y-4 text-xs">
            {lowStockProducts.map(p => (
              <div key={p.id} className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">{p.title}</h4>
                    <p className="text-[#888] text-[11px]">SKU: {p.sku} · Atelier: {p.origin}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-amber-900 text-sm tabular-nums">{p.stock} units left</span>
                    <span className="text-[11px] text-[#777] block">Threshold: &le; 5</span>
                  </div>

                  <div className="flex items-center border border-black/20 rounded bg-white">
                    <button
                      onClick={() => updateProductStock(p.id, p.stock + 5)}
                      className="px-3 py-1.5 font-semibold text-xs text-[#1A1A1A] hover:bg-[#F4F2ED]"
                    >
                      +5 Restock Units
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#888] hover:text-[#1A1A1A]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-1">Add New Specimen to Archive</h3>
            <p className="text-xs text-[#7A746B] mb-4">Enter catalog attributes, pricing, and initial workshop stock.</p>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Specimen Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculptural Bronze Incense Burner"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Subtitle / Craftsmanship Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Hand-cast solid brass with natural verdigris finish"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-black/10 rounded bg-white cursor-pointer"
                  >
                    <option value="Apparel & Tailoring">Apparel & Tailoring</option>
                    <option value="Handcrafted Leather">Handcrafted Leather</option>
                    <option value="Architectural Living">Architectural Living</option>
                    <option value="Footwear & Accents">Footwear & Accents</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Retail Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-black/10 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Initial Workshop Stock</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-black/10 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Origin / Atelier</label>
                  <input
                    type="text"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    placeholder="e.g. Kyoto, Japan"
                    className="w-full px-3 py-2 border border-black/10 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Materials Composition</label>
                <input
                  type="text"
                  placeholder="e.g. 100% Solid Lost-Wax Cast Bronze"
                  value={newMaterials}
                  onChange={(e) => setNewMaterials(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Editorial Description</label>
                <textarea
                  rows={3}
                  placeholder="Detail the tactile form, weight, and aesthetic character..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black mt-2"
              >
                Publish Specimen to Archive
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
