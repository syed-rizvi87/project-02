import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { Order } from '../types/ecommerce';
import { 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  PackageCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    appliedCoupon, 
    placeOrder, 
    currentUser, 
    navigateTo 
  } = useEcommerce();

  // Completed order state if order is placed
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states initialized with user data if logged in
  const defaultAddr = currentUser?.addresses?.find(a => a.isDefault) || currentUser?.addresses?.[0];
  
  const [contactEmail, setContactEmail] = useState(currentUser?.email || 'eleanor.vance@atelier-arch.com');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+1 (415) 890-3321');
  
  const [firstName, setFirstName] = useState(currentUser ? currentUser.name.split(' ')[0] : 'Eleanor');
  const [lastName, setLastName] = useState(currentUser ? currentUser.name.split(' ').slice(1).join(' ') : 'Vance');
  const [street, setStreet] = useState(defaultAddr?.street || '742 Montgomery Street');
  const [apartment, setApartment] = useState(defaultAddr?.apartment || 'Penthouse 4B');
  const [city, setCity] = useState(defaultAddr?.city || 'San Francisco');
  const [state, setState] = useState(defaultAddr?.state || 'CA');
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || '94111');
  const [country, setCountry] = useState(defaultAddr?.country || 'United States');

  // Delivery method
  const isFreeEligible = cartSubtotal >= 250;
  const [shippingMethodId, setShippingMethodId] = useState<'standard' | 'express' | 'overnight'>('standard');

  const shippingCost = shippingMethodId === 'standard' 
    ? (isFreeEligible ? 0 : 15)
    : shippingMethodId === 'express' ? 28 : 45;

  const shippingMethodName = shippingMethodId === 'standard'
    ? (isFreeEligible ? 'DHL Express Insured Worldwide (Complimentary)' : 'Standard Insured Courier')
    : shippingMethodId === 'express'
    ? 'DHL Express Priority Air (1-2 Days)'
    : 'Overnight White-Glove VIP Courier';

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'applepay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 ···· ···· 8492');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [cardHolder, setCardHolder] = useState('ELEANOR VANCE');

  // Discount calculation
  const discountAmount = appliedCoupon 
    ? appliedCoupon.discountPercent 
      ? (cartSubtotal * appliedCoupon.discountPercent) / 100 
      : (appliedCoupon.discountAmount || 0)
    : 0;

  const taxAmount = Number(((cartSubtotal - discountAmount) * 0.08).toFixed(2));
  const grandTotal = Number((cartSubtotal - discountAmount + shippingCost + taxAmount).toFixed(2));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    try {
      const order = await placeOrder(
        {
          fullName: `${firstName} ${lastName}`.trim(),
          email: contactEmail,
          phone: contactPhone,
          street,
          apartment,
          city,
          state,
          postalCode,
          country
        },
        paymentMethod === 'card' 
          ? `Card ending in ···· ${cardNumber.slice(-4) || '8492'}` 
          : paymentMethod === 'applepay' ? 'Apple Pay (Biometric Verified)' : 'Cash on Delivery (COD upon courier signature)',
        shippingMethodName,
        shippingCost
      );

      setCompletedOrder(order);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  // If order is completed, show Order Confirmation Receipt Screen
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white hairline-border rounded-2xl p-8 sm:p-12 shadow-sm space-y-8 animate-in fade-in duration-300">
          
          <div className="text-center space-y-3 pb-6 border-b border-black/10">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2">
              <PackageCheck className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9B6B43]">
              Acquisition Confirmed
            </span>
            <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">
              Thank You for Your Patronage
            </h1>
            <p className="text-xs text-[#7A746B] max-w-md mx-auto leading-relaxed">
              Order <strong className="text-[#1A1A1A] font-semibold">{completedOrder.orderNumber}</strong> has been received and allocated to our master packaging atelier.
            </p>
          </div>

          {/* Quick Tracking Summary Banner */}
          <div className="bg-[#FAF9F6] p-4 sm:p-6 rounded-xl border border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
            <div>
              <span className="text-[#8A857D] block">Airway Bill Tracking Number:</span>
              <strong className="text-[#1A1A1A] font-mono text-sm tracking-wider">{completedOrder.trackingNumber}</strong>
              <p className="text-[11px] text-emerald-800 font-medium mt-1">Carrier: {completedOrder.carrier} · Insured Priority</p>
            </div>
            <button
              onClick={() => navigateTo('account', undefined, 'tracking', completedOrder.id)}
              className="px-4 py-2 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Track Live Checkpoints</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Order Details Breakdown */}
          <div className="space-y-4 text-xs text-[#59554F]">
            <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">Purchased Items</h3>
            <div className="divide-y divide-black/5 border-y border-black/5">
              {completedOrder.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.title} 
                      className="w-12 h-14 object-cover rounded bg-[#F4F2ED]" 
                    />
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{item.product.title}</p>
                      <p className="text-[11px] text-[#8A857D]">{item.selectedColor.name} · {item.selectedSize} · Qty {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#1A1A1A] tabular-nums">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-2 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-semibold text-[#1A1A1A]">${completedOrder.subtotal.toLocaleString()}</span>
              </div>
              {completedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Discount</span>
                  <span className="tabular-nums">-${completedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({completedOrder.shippingMethod})</span>
                <span>{completedOrder.shippingCost === 0 ? 'Complimentary' : `$${completedOrder.shippingCost}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="tabular-nums font-semibold text-[#1A1A1A]">${completedOrder.tax}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1A1A1A] pt-2 border-t border-black/10">
                <span>Grand Total</span>
                <span className="tabular-nums">${completedOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address Confirmation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/10 text-xs">
            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-1">Insured Consignee Destination</h4>
              <p className="text-[#59554F] leading-relaxed">
                {completedOrder.shippingAddress.fullName}<br />
                {completedOrder.shippingAddress.street} {completedOrder.shippingAddress.apartment && `, ${completedOrder.shippingAddress.apartment}`}<br />
                {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} {completedOrder.shippingAddress.postalCode}<br />
                {completedOrder.shippingAddress.country}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-1">Payment Method & Verification</h4>
              <p className="text-[#59554F] leading-relaxed">
                {completedOrder.paymentMethod}<br />
                Confirmation email dispatched to: <strong>{completedOrder.shippingAddress.email}</strong><br />
                Courier SMS notifications: {completedOrder.shippingAddress.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-black/10">
            <button
              onClick={() => navigateTo('account', undefined, 'orders')}
              className="flex-1 py-3 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors text-center"
            >
              View In Client Account
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className="flex-1 py-3 border border-black/20 text-[#1A1A1A] rounded text-xs font-semibold uppercase tracking-wider hover:border-[#1A1A1A] transition-colors text-center"
            >
              Continue Browsing
            </button>
          </div>

        </div>
      </div>
    );
  }

  // If cart is empty and no completed order, redirect or show note
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">No active items in bag</h2>
        <p className="text-xs text-[#7A746B] mt-2">Please add specimens to your shopping bag before proceeding to checkout.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 px-6 py-2.5 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Breadcrumb Header */}
      <div className="mb-8 border-b border-black/10 pb-4">
        <div className="flex items-center gap-2 text-xs text-[#8A857D] mb-1">
          <button onClick={() => navigateTo('cart')} className="hover:text-[#1A1A1A]">Bag</button>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">Secure Checkout</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">
          Finalize Acquisition
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Columns: Forms & Steps */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Quick Express Checkout Option */}
          <div className="p-6 bg-white hairline-border rounded-xl space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A857D] block text-center">
              Express Digital Checkout
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`py-3 px-4 rounded text-xs font-bold transition-all border ${
                  paymentMethod === 'applepay' ? 'bg-[#1C1C1E] text-white border-black' : 'bg-[#FAF9F6] text-[#1A1A1A] border-black/10 hover:border-black'
                }`}
              >
                 Apple Pay / G Pay
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-4 rounded text-xs font-bold transition-all border ${
                  paymentMethod === 'card' ? 'bg-[#1C1C1E] text-white border-black' : 'bg-[#FAF9F6] text-[#1A1A1A] border-black/10 hover:border-black'
                }`}
              >
                Credit / Debit Card
              </button>
            </div>
          </div>

          {/* 1. Customer Contact */}
          <div className="p-6 bg-white hairline-border rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
                1. Client Contact Information
              </h3>
              {!currentUser && (
                <button
                  type="button"
                  onClick={() => navigateTo('auth')}
                  className="text-xs text-[#9B6B43] hover:underline font-medium"
                >
                  Already have an account? Sign In
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#4A453E] font-medium mb-1">Email for Receipt & Tracking</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
              <div>
                <label className="block text-[#4A453E] font-medium mb-1">Mobile Phone for Delivery SMS</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="p-6 bg-white hairline-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-black/5">
              2. Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#4A453E] font-medium mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
              <div>
                <label className="block text-[#4A453E] font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#4A453E] font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="742 Montgomery Street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#4A453E] font-medium mb-1">Apartment, Suite, Unit (Optional)</label>
                <input
                  type="text"
                  placeholder="Penthouse 4B"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#4A453E] font-medium mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#4A453E] font-medium mb-1">State / Province</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#4A453E] font-medium mb-1">Postal / ZIP Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#4A453E] font-medium mb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A] bg-white cursor-pointer"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Germany">Germany</option>
                  <option value="Japan">Japan</option>
                  <option value="Canada">Canada</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Delivery Method */}
          <div className="p-6 bg-white hairline-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-black/5">
              3. Delivery Service Level
            </h3>

            <div className="space-y-3 text-xs">
              <label 
                className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                  shippingMethodId === 'standard' ? 'border-[#1C1C1E] bg-[#FAF9F6]' : 'border-black/10 hover:border-black/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethodId === 'standard'}
                    onChange={() => setShippingMethodId('standard')}
                    className="accent-[#1C1C1E]"
                  />
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">Standard Insured Global Transit</p>
                    <p className="text-[#7A746B] text-[11px]">3 to 5 business days via DHL Worldwide</p>
                  </div>
                </div>
                <span className="font-bold tabular-nums">
                  {isFreeEligible ? <span className="text-emerald-800 font-semibold">Complimentary</span> : '$15'}
                </span>
              </label>

              <label 
                className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                  shippingMethodId === 'express' ? 'border-[#1C1C1E] bg-[#FAF9F6]' : 'border-black/10 hover:border-black/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethodId === 'express'}
                    onChange={() => setShippingMethodId('express')}
                    className="accent-[#1C1C1E]"
                  />
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">DHL Express Priority Air</p>
                    <p className="text-[#7A746B] text-[11px]">1 to 2 business days expedited air customs clearance</p>
                  </div>
                </div>
                <span className="font-bold tabular-nums">$28</span>
              </label>

              <label 
                className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                  shippingMethodId === 'overnight' ? 'border-[#1C1C1E] bg-[#FAF9F6]' : 'border-black/10 hover:border-black/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethodId === 'overnight'}
                    onChange={() => setShippingMethodId('overnight')}
                    className="accent-[#1C1C1E]"
                  />
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">Overnight White-Glove VIP Courier</p>
                    <p className="text-[#7A746B] text-[11px]">Guaranteed next morning delivery before 10:30 AM</p>
                  </div>
                </div>
                <span className="font-bold tabular-nums">$45</span>
              </label>
            </div>
          </div>

          {/* 4. Payment Method Details */}
          <div className="p-6 bg-white hairline-border rounded-xl space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-black/5">
              4. Payment Method
            </h3>

            {/* Payment Options Radio Buttons */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded border text-left flex flex-col justify-between ${
                  paymentMethod === 'card' ? 'border-[#1C1C1E] bg-[#FAF9F6] font-semibold' : 'border-black/10 hover:border-black/30'
                }`}
              >
                <span>Credit Card</span>
                <span className="text-[10px] text-[#777]">Visa / Master / Amex</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`p-3 rounded border text-left flex flex-col justify-between ${
                  paymentMethod === 'applepay' ? 'border-[#1C1C1E] bg-[#FAF9F6] font-semibold' : 'border-black/10 hover:border-black/30'
                }`}
              >
                <span>Apple / G-Pay</span>
                <span className="text-[10px] text-[#777]">Instant 1-Touch</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded border text-left flex flex-col justify-between ${
                  paymentMethod === 'cod' ? 'border-[#1C1C1E] bg-[#FAF9F6] font-semibold' : 'border-black/10 hover:border-black/30'
                }`}
              >
                <span>Cash on Delivery</span>
                <span className="text-[10px] text-[#777]">COD Verification</span>
              </button>
            </div>

            {/* Interactive Card Details Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-2">
                {/* Visual Card Preview Widget */}
                <div className="p-5 rounded-xl bg-gradient-to-tr from-[#1E1E24] to-[#393945] text-white shadow-md max-w-sm mx-auto space-y-4 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] tracking-widest uppercase font-sans font-bold text-[#C2A378]">AURA ATELIER CLIENT</span>
                    <CreditCard className="w-5 h-5 text-white/70" />
                  </div>
                  <div className="text-base tracking-widest text-center pt-2">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between items-end text-[10px] pt-2">
                    <div>
                      <span className="text-white/40 block text-[9px]">CARDHOLDER</span>
                      <span>{cardHolder || 'CLIENT NAME'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9px]">EXPIRES</span>
                      <span>{cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="col-span-2">
                    <label className="block text-[#4A453E] font-medium mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 8492 1092 8492"
                      className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#4A453E] font-medium mb-1">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="08/28"
                      className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#4A453E] font-medium mb-1">Security CVC</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="892"
                      className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A] font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[#4A453E] font-medium mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="ELEANOR VANCE"
                      className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 bg-[#FAF9F6] border border-black/10 rounded-lg text-xs text-[#59554F] space-y-2">
                <p className="font-semibold text-[#1A1A1A]">Cash on Delivery Terms:</p>
                <p>
                  You will inspect and sign for your parcel upon courier delivery. Please have the exact payment of <strong>${grandTotal.toLocaleString()}</strong> ready in local currency or contactless mobile terminal at your door.
                </p>
              </div>
            )}

            {paymentMethod === 'applepay' && (
              <div className="p-4 bg-black/5 rounded-lg text-center text-xs text-[#59554F]">
                <p className="font-medium text-[#1A1A1A]">Biometric Express Authorization</p>
                <p className="text-[11px] text-[#777] mt-1">
                  Clicking "Authorize & Place Order" will prompt your browser Face ID / Touch ID terminal.
                </p>
              </div>
            )}
          </div>

          {/* Submit Order Action Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#1C1C1E] text-white rounded-lg font-semibold text-xs tracking-wider uppercase hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Securing Transaction & Allocating Inventory...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#C2A378]" />
                  <span>Authorize & Place Order · ${grandTotal.toLocaleString()}</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-[#8A857D] mt-2">
              By authorizing, you agree to AURA Atelier terms of sale and privacy protocols.
            </p>
          </div>

        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="lg:col-span-5 bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
          <h2 className="text-base font-serif font-bold text-[#1A1A1A] pb-3 border-b border-black/10">
            Acquisition Summary ({cart.length} Editions)
          </h2>

          {/* Mini item list */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-black/5">
            {cart.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 rounded bg-[#F4F2ED] overflow-hidden shrink-0">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.title}
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1C1C1E] text-white text-[10px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1A1A1A] line-clamp-1">{item.product.title}</h4>
                    <p className="text-[11px] text-[#8A857D]">{item.selectedColor.name} · {item.selectedSize}</p>
                  </div>
                </div>
                <span className="font-bold text-[#1A1A1A] tabular-nums shrink-0">
                  ${(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Cost Line Items */}
          <div className="space-y-2 text-xs text-[#59554F] border-t border-black/10 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1A1A1A] tabular-nums">${cartSubtotal.toLocaleString()}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-800 font-medium">
                <span>Voucher Benefit ({appliedCoupon.code})</span>
                <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Insured Transit</span>
              <span>
                {shippingCost === 0 ? (
                  <span className="text-emerald-800 font-semibold">Complimentary</span>
                ) : (
                  <span className="tabular-nums font-semibold text-[#1A1A1A]">${shippingCost}</span>
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Sales Tax (8%)</span>
              <span className="tabular-nums font-semibold text-[#1A1A1A]">${taxAmount}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-baseline pt-4 border-t border-black/10">
            <span className="text-sm font-bold text-[#1A1A1A]">Total Due</span>
            <span className="text-2xl font-bold text-[#1A1A1A] tabular-nums">
              ${grandTotal.toLocaleString()}
            </span>
          </div>

          <div className="pt-2 text-[11px] text-[#7A746B] space-y-2">
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#9B6B43]" />
              <span>Insured by Lloyd's of London throughout transit</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#9B6B43]" />
              <span>Delivered in sustainable wax-sealed presentation box</span>
            </p>
          </div>
        </div>

      </form>
    </div>
  );
};
