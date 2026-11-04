import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { AccountTab, Address } from '../types/ecommerce';
import { 
  User, 
  Package, 
  Compass, 
  Heart, 
  MapPin, 
  LogOut, 
  Award, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit3, 
  X,
  ExternalLink
} from 'lucide-react';

export const CustomerAccountPage: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    wishlist, 
    products, 
    activeAccountTab, 
    setActiveAccountTab, 
    trackingOrderId, 
    setTrackingOrderId,
    logoutUser, 
    navigateTo, 
    toggleWishlist, 
    addToCart,
    updateProfile,
    addAddress,
    setDefaultAddress,
    deleteAddress,
    showToast
  } = useEcommerce();

  // If not logged in, show prompt to sign in
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Client Account Access</h2>
        <p className="text-xs text-[#7A746B] mt-2 mb-6">Please sign in to view your order history, saved addresses, and tier privileges.</p>
        <button
          onClick={() => navigateTo('auth')}
          className="px-6 py-3 bg-[#1C1C1E] text-white text-xs font-semibold uppercase tracking-wider rounded"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Edit Profile Form State
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);

  // Add Address Modal State
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('Primary Residence');
  const [newAddrName, setNewAddrName] = useState(currentUser.name);
  const [newAddrPhone, setNewAddrPhone] = useState(currentUser.phone);
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrApartment, setNewAddrApartment] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrZip, setNewAddrZip] = useState('');
  const [newAddrCountry, setNewAddrCountry] = useState('United States');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  // Selected order for tracking tab
  const trackedOrder = orders.find(o => o.id === trackingOrderId) || orders[0];

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone
    });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrCity || !newAddrZip) {
      showToast('Please complete all required address fields.', 'warning');
      return;
    }
    addAddress({
      title: newAddrTitle,
      fullName: newAddrName,
      phone: newAddrPhone,
      street: newAddrStreet,
      apartment: newAddrApartment,
      city: newAddrCity,
      state: newAddrState,
      postalCode: newAddrZip,
      country: newAddrCountry,
      isDefault: newAddrIsDefault
    });
    setIsAddAddressOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Welcome Lockup */}
      <div className="mb-10 bg-white hairline-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#1C1C1E] text-[#C2A378] flex items-center justify-center text-xl font-serif font-bold shrink-0">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">
                {currentUser.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#F4EFE6] text-[#9B6B43]">
                {currentUser.tier}
              </span>
            </div>
            <p className="text-xs text-[#7A746B] mt-0.5">
              Patron since {currentUser.joinedDate} · {currentUser.rewardPoints} Atelier Privilege Points
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveAccountTab('tracking')}
            className="px-4 py-2 border border-black/10 hover:border-black rounded text-xs font-semibold text-[#1A1A1A] transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#9B6B43]" />
            <span>Track Active Shipment</span>
          </button>
          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-[#FAF9F6] text-[#555] hover:text-rose-600 rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Tabbed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar Navigation */}
        <nav className="lg:col-span-3 bg-white hairline-border rounded-xl p-3 space-y-1 text-xs font-medium">
          <button
            onClick={() => setActiveAccountTab('dashboard')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
              activeAccountTab === 'dashboard' ? 'bg-[#1C1C1E] text-white font-semibold' : 'text-[#4A453E] hover:bg-[#FAF9F6]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4" />
              <span>Patron Dashboard</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          <button
            onClick={() => setActiveAccountTab('orders')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
              activeAccountTab === 'orders' ? 'bg-[#1C1C1E] text-white font-semibold' : 'text-[#4A453E] hover:bg-[#FAF9F6]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Acquisition History</span>
            </div>
            <span className="text-[11px] opacity-75">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveAccountTab('tracking')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
              activeAccountTab === 'tracking' ? 'bg-[#1C1C1E] text-white font-semibold' : 'text-[#4A453E] hover:bg-[#FAF9F6]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4" />
              <span>Shipment Tracking</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          <button
            onClick={() => setActiveAccountTab('wishlist')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
              activeAccountTab === 'wishlist' ? 'bg-[#1C1C1E] text-white font-semibold' : 'text-[#4A453E] hover:bg-[#FAF9F6]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>Saved Wishlist</span>
            </div>
            <span className="text-[11px] opacity-75">{wishlist.length}</span>
          </button>

          <button
            onClick={() => setActiveAccountTab('addresses')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
              activeAccountTab === 'addresses' ? 'bg-[#1C1C1E] text-white font-semibold' : 'text-[#4A453E] hover:bg-[#FAF9F6]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Delivery Addresses</span>
            </div>
            <span className="text-[11px] opacity-75">{currentUser.addresses.length}</span>
          </button>

          <button
            onClick={() => setActiveAccountTab('profile')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
              activeAccountTab === 'profile' ? 'bg-[#1C1C1E] text-white font-semibold' : 'text-[#4A453E] hover:bg-[#FAF9F6]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>Personal Details</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        </nav>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* 1. Dashboard Tab */}
          {activeAccountTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-white hairline-border rounded-xl">
                  <span className="text-xs text-[#8A857D] font-medium">Completed Acquisitions</span>
                  <p className="text-3xl font-bold font-serif text-[#1A1A1A] mt-1 tabular-nums">
                    {orders.length}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">Insured & authenticated</p>
                </div>
                <div className="p-5 bg-white hairline-border rounded-xl">
                  <span className="text-xs text-[#8A857D] font-medium">Atelier Privilege Points</span>
                  <p className="text-3xl font-bold font-serif text-[#1A1A1A] mt-1 tabular-nums">
                    {currentUser.rewardPoints}
                  </p>
                  <p className="text-[11px] text-[#9B6B43] font-medium mt-1">Equivalent to $142 in credits</p>
                </div>
                <div className="p-5 bg-white hairline-border rounded-xl">
                  <span className="text-xs text-[#8A857D] font-medium">Saved Specimen Wishlist</span>
                  <p className="text-3xl font-bold font-serif text-[#1A1A1A] mt-1 tabular-nums">
                    {wishlist.length}
                  </p>
                  <p className="text-[11px] text-[#8A857D] mt-1">Reserved in private vault</p>
                </div>
              </div>

              {/* Latest Active Order Card */}
              {orders.length > 0 && (
                <div className="p-6 bg-white hairline-border rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#9B6B43]">
                        Most Recent Acquisition
                      </span>
                      <h3 className="text-base font-serif font-bold text-[#1A1A1A] mt-0.5">
                        Order #{orders[0].orderNumber} · {orders[0].status}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setTrackingOrderId(orders[0].id);
                        setActiveAccountTab('tracking');
                      }}
                      className="px-3.5 py-1.5 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors self-start sm:self-auto"
                    >
                      Track Live Progress
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    {orders[0].items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-[#FAF9F6] p-2.5 rounded-lg border border-black/5">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.title} 
                          className="w-12 h-14 object-cover rounded bg-[#EBE7DF]" 
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-[#1A1A1A]">{item.product.title}</p>
                          <p className="text-[#8A857D] text-[11px]">{item.selectedColor.name} · {item.selectedSize}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Atelier Patron Privileges */}
              <div className="p-6 bg-gradient-to-tr from-[#1E1C1A] to-[#2E2A27] text-white rounded-xl space-y-3">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#C2A378]">
                  Gold Atelier Privilege Tier
                </span>
                <h3 className="text-lg font-serif font-bold">Complimentary White-Glove Tailoring Adjustments</h3>
                <p className="text-xs text-white/80 leading-relaxed max-w-xl">
                  As a Gold Patron, every overcoat and trouser order includes complimentary custom sleeve and hem alterations through our partnered Savile Row and Milan master tailors.
                </p>
              </div>
            </div>
          )}

          {/* 2. Orders History Tab */}
          {activeAccountTab === 'orders' && (
            <div className="bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-black/10">
                <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Acquisition History</h2>
                <span className="text-xs text-[#8A857D]">{orders.length} total orders recorded</span>
              </div>

              <div className="space-y-6 divide-y divide-black/10">
                {orders.map((ord) => (
                  <div key={ord.id} className="pt-6 first:pt-0 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1A1A1A]">#{ord.orderNumber}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                            ord.status === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-800' 
                              : ord.status === 'Shipped' 
                              ? 'bg-blue-50 text-blue-800' 
                              : 'bg-amber-50 text-amber-800'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8A857D] mt-0.5">Placed on {ord.date} · {ord.shippingMethod}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#1A1A1A] tabular-nums">
                          ${ord.total.toLocaleString()}
                        </span>
                        <button
                          onClick={() => {
                            setTrackingOrderId(ord.id);
                            setActiveAccountTab('tracking');
                          }}
                          className="px-3 py-1.5 border border-black/15 hover:border-black rounded text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]"
                        >
                          Track Shipment
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ord.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-[#FAF9F6] rounded-lg border border-black/5">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.title} 
                            className="w-12 h-14 object-cover rounded bg-[#EBE7DF]" 
                          />
                          <div className="text-xs flex-1 min-w-0">
                            <p className="font-semibold text-[#1A1A1A] truncate">{item.product.title}</p>
                            <p className="text-[11px] text-[#8A857D]">{item.selectedColor.name} · {item.selectedSize} · Qty {item.quantity}</p>
                            <p className="font-semibold text-[#1A1A1A] mt-0.5 tabular-nums">${item.product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Live Order Tracking Tab */}
          {activeAccountTab === 'tracking' && trackedOrder && (
            <div className="bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#9B6B43]">
                    Live Courier Telemetry
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#1A1A1A] mt-0.5">
                    Order #{trackedOrder.orderNumber}
                  </h2>
                </div>
                <div className="text-right text-xs">
                  <span className="text-[#8A857D] block">Courier Waybill:</span>
                  <strong className="font-mono text-sm tracking-wider text-[#1A1A1A]">{trackedOrder.trackingNumber}</strong>
                </div>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#FAF9F6] rounded-lg border border-black/5">
                  <span className="text-[#8A857D]">Designated Carrier</span>
                  <p className="font-semibold text-[#1A1A1A] mt-0.5">{trackedOrder.carrier}</p>
                </div>
                <div className="p-4 bg-[#FAF9F6] rounded-lg border border-black/5">
                  <span className="text-[#8A857D]">Estimated Courier Arrival</span>
                  <p className="font-semibold text-[#1A1A1A] mt-0.5">{trackedOrder.estimatedDelivery}</p>
                </div>
                <div className="p-4 bg-[#FAF9F6] rounded-lg border border-black/5">
                  <span className="text-[#8A857D]">Destination Port</span>
                  <p className="font-semibold text-[#1A1A1A] mt-0.5">{trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Interactive Stepped Checkpoint Timeline */}
              <div className="space-y-6 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Milestone Audit Trail
                </h3>

                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2DDD5]">
                  {trackedOrder.checkpoints.map((chk, idx) => (
                    <div key={chk.id} className="relative group">
                      {/* Checkpoint Dot */}
                      <div className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        chk.completed 
                          ? 'bg-[#1C1C1E] text-white ring-4 ring-[#FAF9F6]' 
                          : 'bg-[#E2DDD5] text-white ring-4 ring-[#FAF9F6]'
                      }`}>
                        {chk.completed ? (
                          <CheckCircle2 className="w-3 h-3 text-[#C2A378]" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                      </div>

                      <div className="bg-[#FAF9F6] p-4 rounded-lg border border-black/5 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                          <h4 className="font-bold text-[#1A1A1A]">{chk.status}</h4>
                          <span className="text-[11px] text-[#8A857D] font-mono">{chk.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#9B6B43] font-medium">{chk.location}</p>
                        <p className="text-xs text-[#59554F] leading-relaxed pt-1">{chk.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Wishlist Tab */}
          {activeAccountTab === 'wishlist' && (
            <div className="bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-black/10">
                <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Saved Wishlist Specimen</h2>
                <span className="text-xs text-[#8A857D]">{wishlistProducts.length} items</span>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-8 h-8 text-[#CCC] mx-auto mb-2" />
                  <p className="text-xs text-[#7A746B]">Your private client wishlist is currently empty.</p>
                  <button
                    onClick={() => navigateTo('shop')}
                    className="mt-4 px-5 py-2 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((prod) => (
                    <div key={prod.id} className="p-4 bg-[#FAF9F6] rounded-lg border border-black/5 flex gap-4 items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={prod.images[0]} 
                          alt={prod.title} 
                          className="w-16 h-20 object-cover rounded bg-[#EBE7DF] shrink-0" 
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] text-[#8A857D] uppercase tracking-wider block">{prod.category}</span>
                          <h4 className="text-xs font-semibold text-[#1A1A1A] truncate">{prod.title}</h4>
                          <span className="text-xs font-bold text-[#1A1A1A] tabular-nums mt-1 block">${prod.price}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => addToCart(prod, prod.sizes[0], prod.colors[0], 1, true)}
                          className="px-3 py-1.5 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Bag</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(prod.id)}
                          className="text-[11px] text-[#888] hover:text-rose-600 text-center"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. Saved Addresses Tab */}
          {activeAccountTab === 'addresses' && (
            <div className="bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-black/10">
                <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Saved Consignee Addresses</h2>
                <button
                  onClick={() => setIsAddAddressOpen(true)}
                  className="px-3 py-1.5 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.addresses.map((addr) => (
                  <div 
                    key={addr.id} 
                    className={`p-5 rounded-xl border transition-all ${
                      addr.isDefault ? 'border-[#1C1C1E] bg-[#FAF9F6]' : 'border-black/10 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-[#1A1A1A]">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#1C1C1E] text-white">
                          Primary
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#59554F] leading-relaxed">
                      <strong>{addr.fullName}</strong><br />
                      {addr.street} {addr.apartment && `, ${addr.apartment}`}<br />
                      {addr.city}, {addr.state} {addr.postalCode}<br />
                      {addr.country}<br />
                      Phone: {addr.phone}
                    </p>

                    <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[#9B6B43] hover:underline font-medium"
                        >
                          Make Default
                        </button>
                      ) : (
                        <span className="text-emerald-700 text-[11px] font-medium">Default Destination</span>
                      )}

                      {currentUser.addresses.length > 1 && (
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="text-[#999] hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Profile Personal Details Tab */}
          {activeAccountTab === 'profile' && (
            <div className="bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6">
              <div className="pb-4 border-b border-black/10">
                <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Patron Profile & Security</h2>
                <p className="text-xs text-[#7A746B] mt-0.5">Manage your personal identity, contact numbers, and communication channels.</p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg text-xs">
                <div>
                  <label className="block text-[#4A453E] font-medium mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A453E] font-medium mb-1">Primary Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A453E] font-medium mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsAddAddressOpen(false)}
              className="absolute top-4 right-4 text-[#888] hover:text-[#1A1A1A]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-1">Add Delivery Destination</h3>
            <p className="text-xs text-[#7A746B] mb-4">Provide valid international consignee details for insured courier dropoff.</p>

            <form onSubmit={handleAddressSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Location Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Penthouse, Studio, Country Villa"
                  value={newAddrTitle}
                  onChange={(e) => setNewAddrTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newAddrName}
                  onChange={(e) => setNewAddrName(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="128 Ocean View Ave"
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="w-full px-3 py-2 border border-black/10 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">State / Region</label>
                  <input
                    type="text"
                    required
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className="w-full px-3 py-2 border border-black/10 rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={newAddrZip}
                    onChange={(e) => setNewAddrZip(e.target.value)}
                    className="w-full px-3 py-2 border border-black/10 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={newAddrCountry}
                    onChange={(e) => setNewAddrCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-black/10 rounded"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="makeDefault"
                  checked={newAddrIsDefault}
                  onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                  className="rounded accent-[#1C1C1E]"
                />
                <label htmlFor="makeDefault" className="text-[#59554F] cursor-pointer">
                  Set as my primary delivery destination
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black mt-2"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
