import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 250;

export const QuickCartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotalCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo
  } = useEcommerce();

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const discountAmount = appliedCoupon 
    ? appliedCoupon.discountPercent 
      ? (cartSubtotal * appliedCoupon.discountPercent) / 100 
      : (appliedCoupon.discountAmount || 0)
    : 0;

  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

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

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const handleViewFullCart = () => {
    setIsCartOpen(false);
    navigateTo('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#1C1C1E]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#1C1C1E]">
                Shopping Bag ({cartTotalCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#7A746B] hover:text-[#1A1A1A] transition-colors rounded-full hover:bg-[#F4F2ED]"
              aria-label="Close cart drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#FAF9F6] px-6 py-3 border-b border-black/5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {amountNeeded > 0 ? (
                <span className="text-[#59554F]">
                  Add <strong className="text-[#1A1A1A] font-semibold">${amountNeeded}</strong> more for complimentary delivery
                </span>
              ) : (
                <span className="text-emerald-800 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  You've unlocked complimentary insured delivery!
                </span>
              )}
              <span className="text-[11px] font-semibold text-[#1A1A1A]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E6E1D8] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1C1C1E] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F4F2ED] flex items-center justify-center text-[#8A857D] mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Your shopping bag is empty</h3>
                <p className="text-xs text-[#7A746B] max-w-xs mt-1.5 leading-relaxed">
                  Explore our curated seasonal collection of refined apparel, handcrafted leather, and architectural objects.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="mt-6 px-6 py-2.5 text-xs font-semibold tracking-wider uppercase bg-[#1C1C1E] text-white rounded hover:bg-black transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#FAF9F6] rounded-lg border border-black/5 relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#EBE7DF] rounded overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Item Specs */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#1A1A1A] truncate">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#999] hover:text-rose-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#7A746B] mt-1">
                        <span>{item.selectedColor.name}</span>
                        <span aria-hidden="true">/</span>
                        <span>{item.selectedSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#D5D0C6] rounded bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#555] hover:bg-[#F4F2ED]"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#555] hover:bg-[#F4F2ED]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-bold text-[#1A1A1A] tabular-nums">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Actions & Summary (Only if items exist) */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-black/5 bg-[#FAF9F6]">
              {/* Promo Code Input */}
              <div className="mb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-${discountAmount.toFixed(2)})</span>
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
                      placeholder="Promo code (e.g. AURA10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#D5D0C6] rounded bg-white text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#1A1A1A]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-medium bg-[#1C1C1E] text-white rounded hover:bg-black transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && !appliedCoupon && (
                  <p className="text-[11px] text-rose-600 mt-1">{couponFeedback.message}</p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 text-xs text-[#59554F] mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1A1A1A] tabular-nums">${cartSubtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{amountNeeded === 0 ? 'Complimentary' : 'Calculated at checkout'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-2 border-t border-black/5">
                  <span>Total</span>
                  <span className="tabular-nums">${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout & Full Cart Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleProceedCheckout}
                  className="w-full py-3 px-4 bg-[#1C1C1E] text-white rounded-md hover:bg-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleViewFullCart}
                  className="w-full py-2 text-xs font-medium text-[#7A746B] hover:text-[#1A1A1A] transition-colors text-center"
                >
                  View Full Shopping Cart & Taxes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
