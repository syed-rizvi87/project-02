import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw 
} from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 250;

export const CartPage: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    navigateTo 
  } = useEcommerce();

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const discountAmount = appliedCoupon 
    ? appliedCoupon.discountPercent 
      ? (cartSubtotal * appliedCoupon.discountPercent) / 100 
      : (appliedCoupon.discountAmount || 0)
    : 0;

  const estimatedTax = Number(((cartSubtotal - discountAmount) * 0.08).toFixed(2));
  const shippingCost = amountNeeded === 0 ? 0 : 25;
  const grandTotal = Number((cartSubtotal - discountAmount + shippingCost + estimatedTax).toFixed(2));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = await applyCoupon(couponCode);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setCouponCode('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F4F2ED] flex items-center justify-center text-[#8A857D] mx-auto mb-6">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">Your Shopping Bag is Empty</h1>
        <p className="text-sm text-[#7A746B] max-w-md mx-auto mt-2 leading-relaxed">
          Discover our curated collection of small-batch tailoring, handcrafted Tuscan leather, and architectural living specimens.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-8 px-8 py-3.5 bg-[#1C1C1E] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-black transition-colors"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Free Shipping Progress Bar */}
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">
          Shopping Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)} Items)
        </h1>

        {/* Free Shipping Meter */}
        <div className="mt-4 p-4 bg-white hairline-border rounded-lg max-w-2xl">
          <div className="flex items-center justify-between text-xs mb-2">
            {amountNeeded > 0 ? (
              <span className="text-[#59554F]">
                Add <strong className="text-[#1A1A1A]">${amountNeeded}</strong> more for complimentary worldwide courier transit
              </span>
            ) : (
              <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Complimentary insured courier transit unlocked!
              </span>
            )}
            <span className="font-bold text-[#1A1A1A] tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#F0ECE4] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1C1C1E] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Cart Items List Left, Order Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="hidden sm:grid grid-cols-12 text-xs font-semibold uppercase tracking-wider text-[#8A857D] pb-3 border-b border-black/10">
            <div className="col-span-6">Specimen Details</div>
            <div className="col-span-2 text-center">Unit Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          <div className="divide-y divide-black/10">
            {cart.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center gap-4">
                
                {/* Product Info & Thumbnail */}
                <div className="sm:col-span-6 flex gap-4 w-full">
                  <div 
                    onClick={() => navigateTo('product-details', item.product.id)}
                    className="w-20 h-26 bg-[#F4F2ED] rounded-lg overflow-hidden shrink-0 cursor-pointer"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-[#8A857D]">
                        <span>{item.product.category}</span>
                        <span>·</span>
                        <span>SKU: {item.product.sku}</span>
                      </div>
                      <h3 
                        onClick={() => navigateTo('product-details', item.product.id)}
                        className="text-sm font-semibold text-[#1A1A1A] hover:text-[#9B6B43] transition-colors cursor-pointer"
                      >
                        {item.product.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-[#59554F] mt-1">
                        <span>Color: <strong>{item.selectedColor.name}</strong></span>
                        <span>·</span>
                        <span>Size: <strong>{item.selectedSize}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="self-start text-[11px] text-[#999] hover:text-rose-600 transition-colors flex items-center gap-1 mt-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="sm:col-span-2 sm:text-center text-xs text-[#59554F] tabular-nums">
                  <span className="sm:hidden font-medium text-[#1A1A1A] mr-2">Unit:</span>
                  ${item.product.price}
                </div>

                {/* Quantity Controls */}
                <div className="sm:col-span-2 flex sm:justify-center">
                  <div className="flex items-center border border-[#D5D0C6] rounded bg-white">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-xs text-[#4A453E] hover:bg-[#F4F2ED]"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs text-[#4A453E] hover:bg-[#F4F2ED]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Line Total */}
                <div className="sm:col-span-2 sm:text-right font-bold text-sm text-[#1A1A1A] tabular-nums">
                  <span className="sm:hidden font-medium text-[#8A857D] mr-2">Line Total:</span>
                  ${(item.product.price * item.quantity).toLocaleString()}
                </div>

              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs font-semibold uppercase tracking-wider text-[#4A453E] hover:text-[#1A1A1A] flex items-center gap-1.5"
            >
              <span>← Continue Browsing Catalog</span>
            </button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white hairline-border rounded-xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-serif font-bold text-[#1A1A1A] pb-3 border-b border-black/10">
            Order Summary
          </h2>

          {/* Promo Coupon Form */}
          <div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Promo <strong>{appliedCoupon.code}</strong> applied (-${discountAmount.toFixed(2)})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (AURA10 or ATELIER30)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black"
                >
                  Apply
                </button>
              </form>
            )}
            {couponFeedback && !appliedCoupon && (
              <p className="text-[11px] text-rose-600 mt-1.5">{couponFeedback.message}</p>
            )}
          </div>

          {/* Cost Line Items */}
          <div className="space-y-3 text-xs text-[#59554F] border-b border-black/10 pb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1A1A1A] tabular-nums">${cartSubtotal.toLocaleString()}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-800 font-medium">
                <span>Promotional Benefit ({appliedCoupon.code})</span>
                <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
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
              <span className="tabular-nums font-semibold text-[#1A1A1A]">${estimatedTax}</span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-baseline">
            <span className="text-base font-bold text-[#1A1A1A]">Estimated Total</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#1A1A1A] tabular-nums">
                ${grandTotal.toLocaleString()}
              </span>
              <p className="text-[10px] text-[#8A857D]">Including insured international customs transit</p>
            </div>
          </div>

          {/* Proceed to Checkout Button */}
          <button
            onClick={() => navigateTo('checkout')}
            className="w-full py-3.5 bg-[#1C1C1E] text-white rounded-md font-semibold text-xs tracking-wider uppercase hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-black/10 space-y-2 text-xs text-[#7A746B]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9B6B43]" />
              <span>256-bit bank encrypted payment security</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#9B6B43]" />
              <span>Complimentary insured shipping on orders $250+</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#9B6B43]" />
              <span>Effortless 30-day doorstep exchanges</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
