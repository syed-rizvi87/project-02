import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { api } from '../../services/api';
import { ArrowRight, CheckCircle2, Shield, Truck, RotateCcw, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setSelectedCategory, showToast } = useEcommerce();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }
    try {
      await api.subscribeNewsletter(email);
    } catch (err) {
      // optimistic
    }
    setIsSubscribed(true);
    showToast('Welcome to the Atelier Private Journal. $30 benefit code sent.', 'success');
  };

  const handleCategoryNav = (cat: string) => {
    setSelectedCategory(cat);
    navigateTo('shop');
  };

  return (
    <footer className="bg-[#141416] text-[#FAF9F6] border-t border-white/10 pt-16 pb-12 mt-20">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-y border-white/10 text-xs">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#C2A378] shrink-0" />
            <div>
              <p className="font-semibold text-white">Insured Global Transit</p>
              <p className="text-[#8E8B85] mt-0.5">Complimentary courier on orders over $250</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-[#C2A378] shrink-0" />
            <div>
              <p className="font-semibold text-white">European Master Guilds</p>
              <p className="text-[#8E8B85] mt-0.5">Handcrafted in Biella, Florence & Kyoto</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-[#C2A378] shrink-0" />
            <div>
              <p className="font-semibold text-white">Curated 30-Day Returns</p>
              <p className="text-[#8E8B85] mt-0.5">Doorstep pickup & complimentary exchanges</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#C2A378] shrink-0" />
            <div>
              <p className="font-semibold text-white">Authenticity Guaranteed</p>
              <p className="text-[#8E8B85] mt-0.5">Individual wax seal & serial documentation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 pb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-serif font-bold tracking-wider text-white">
              AURA ATELIER
            </h3>
            <p className="text-xs text-[#A8A49C] leading-relaxed max-w-sm">
              An architectural design house and material laboratory. We champion raw natural fibres, heirloom leather craftsmanship, and contemplative living objects created to outlast seasonal trends.
            </p>
            
            <div className="pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C2A378] block mb-2">
                Join The Private Atelier Journal
              </span>
              {isSubscribed ? (
                <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded text-xs text-[#C2A378]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Invitation registered. Check your inbox for $30 benefit code: <strong>ATELIER30</strong></span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for private releases..."
                    className="flex-1 px-3 py-2 text-xs bg-white/5 border border-white/15 rounded text-white placeholder-white/40 focus:outline-none focus:border-[#C2A378]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FAF9F6] text-[#141416] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#E5E0D6] transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Catalog Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A49C]">
              <li>
                <button 
                  onClick={() => handleCategoryNav('Apparel & Tailoring')}
                  className="hover:text-white transition-colors"
                >
                  Apparel & Tailoring
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('Handcrafted Leather')}
                  className="hover:text-white transition-colors"
                >
                  Handcrafted Leather
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('Architectural Living')}
                  className="hover:text-white transition-colors"
                >
                  Architectural Living
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('Footwear & Accents')}
                  className="hover:text-white transition-colors"
                >
                  Footwear & Accents
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory(null); navigateTo('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  View All Archive
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Concierge
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A49C]">
              <li>
                <button onClick={() => navigateTo('account', undefined, 'orders')} className="hover:text-white transition-colors">
                  Order Status & Tracking
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('cart')} className="hover:text-white transition-colors">
                  Shopping Bag
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('account', undefined, 'wishlist')} className="hover:text-white transition-colors">
                  Saved Client Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('account', undefined, 'addresses')} className="hover:text-white transition-colors">
                  Shipping & Customs
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="hover:text-[#C2A378] transition-colors text-white/70">
                  Staff Admin Access
                </button>
              </li>
            </ul>
          </div>

          {/* Craftsmanship Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Origins & Ethics
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A49C]">
              <li><span className="hover:text-white transition-colors cursor-pointer">Biella Wool Guild</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Tuscan Vegetable Tanneries</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Kyoto Ceramic Studios</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Circular Fiber Lifecycle</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Carbon Neutral Logistics</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© 2026 AURA Atelier Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white/70 cursor-pointer">Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-white/70 cursor-pointer">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-white/70 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
