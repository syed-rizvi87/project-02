import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    navigateTo, 
    cartTotalCount, 
    wishlist, 
    setIsCartOpen, 
    setIsSearchOpen,
    setSelectedCategory,
    currentUser,
    logoutUser
  } = useEcommerce();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleNavClick = (page: any, categoryName?: string) => {
    if (categoryName !== undefined) {
      setSelectedCategory(categoryName || null);
    }
    navigateTo(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md hairline-b transition-all">
      {/* Slim Top Announcement Bar (≤ 40px, dismissible) */}
      {isAnnouncementVisible && (
        <div className="bg-[#1C1C1E] text-white px-4 py-2 text-[11px] font-medium tracking-wide flex items-center justify-between">
          <div className="mx-auto flex items-center gap-2 text-center truncate">
            <span>Complimentary insured shipping on orders over $250</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="hidden sm:inline">Crafted in Italy, Japan & Scotland</span>
          </div>
          <button
            onClick={() => setIsAnnouncementVisible(false)}
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Navigation Bar — 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-[#1A1A1A] hover:opacity-85 transition-opacity whitespace-nowrap shrink-0"
          >
            AURA ATELIER
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
            <button
              onClick={() => handleNavClick('shop', '')}
              className={`hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0 ${
                currentPage === 'shop' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-1' : ''
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Apparel & Tailoring')}
              className="hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0"
            >
              Apparel
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Handcrafted Leather')}
              className="hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0"
            >
              Leather Goods
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Architectural Living')}
              className="hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0"
            >
              Living Objects
            </button>
            <button
              onClick={() => handleNavClick('account', undefined)}
              className="hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0"
            >
              Orders & Tracking
            </button>
          </nav>

          {/* Zone 3: Primary Action & Functionalities */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#4A453E] hover:text-[#1A1A1A] hover:bg-black/5 rounded-full transition-colors"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (currentUser) {
                  navigateTo('account', undefined, 'wishlist');
                } else {
                  navigateTo('account', undefined, 'wishlist');
                }
              }}
              className="relative p-2 text-[#4A453E] hover:text-[#1A1A1A] hover:bg-black/5 rounded-full transition-colors"
              aria-label="View wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#9B6B43]" />
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#1C1C1E] hover:bg-black/5 rounded-full transition-colors flex items-center"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartTotalCount > 0 && (
                <span className="ml-1 text-[11px] font-bold tabular-nums">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 pl-2 text-xs font-medium text-[#4A453E] hover:text-[#1A1A1A] border border-black/10 rounded-full hover:border-black/30 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span className="truncate max-w-[80px]">
                  {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#777]" />
              </button>

              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl hairline-border py-2 z-50 text-xs"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-black/5">
                        <p className="font-semibold text-[#1A1A1A]">{currentUser.name}</p>
                        <p className="text-[11px] text-[#8A857D] truncate">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => navigateTo('account', undefined, 'dashboard')}
                        className="w-full text-left px-4 py-2 hover:bg-[#FAF9F6] text-[#333]"
                      >
                        Client Dashboard
                      </button>
                      <button
                        onClick={() => navigateTo('account', undefined, 'orders')}
                        className="w-full text-left px-4 py-2 hover:bg-[#FAF9F6] text-[#333]"
                      >
                        Order History & Tracking
                      </button>
                      <button
                        onClick={() => navigateTo('account', undefined, 'wishlist')}
                        className="w-full text-left px-4 py-2 hover:bg-[#FAF9F6] text-[#333]"
                      >
                        Wishlist ({wishlist.length})
                      </button>
                      <button
                        onClick={() => navigateTo('account', undefined, 'addresses')}
                        className="w-full text-left px-4 py-2 hover:bg-[#FAF9F6] text-[#333]"
                      >
                        Saved Delivery Addresses
                      </button>
                      <div className="border-t border-black/5 my-1" />
                      <button
                        onClick={logoutUser}
                        className="w-full text-left px-4 py-2 hover:bg-[#FAF9F6] text-rose-600 font-medium"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigateTo('auth')}
                        className="w-full text-left px-4 py-2.5 font-semibold text-[#1A1A1A] hover:bg-[#FAF9F6]"
                      >
                        Sign In / Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Admin Switcher Action */}
            <button
              onClick={() => navigateTo('admin')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded transition-colors whitespace-nowrap shrink-0 ${
                currentPage === 'admin' 
                  ? 'bg-[#1C1C1E] text-white' 
                  : 'bg-[#EAE5DC] text-[#4A453E] hover:bg-[#DFD9CD] hover:text-[#1A1A1A]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Suite</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#1A1A1A] hover:bg-black/5 rounded-md"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#1A1A1A]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white hairline-b px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3 text-sm font-medium text-[#1A1A1A]">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2 border-b border-black/5"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop', '')}
              className="text-left py-2 border-b border-black/5"
            >
              Shop All Catalog
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Apparel & Tailoring')}
              className="text-left py-2 border-b border-black/5"
            >
              Apparel & Tailoring
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Handcrafted Leather')}
              className="text-left py-2 border-b border-black/5"
            >
              Handcrafted Leather
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Architectural Living')}
              className="text-left py-2 border-b border-black/5"
            >
              Architectural Living
            </button>
            <button
              onClick={() => handleNavClick('account', undefined)}
              className="text-left py-2 border-b border-black/5 flex items-center justify-between"
            >
              <span>Customer Account & Orders</span>
              <span className="text-xs text-[#8A857D]">{currentUser ? currentUser.name : 'Sign In'}</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left py-2 text-[#9B6B43] font-semibold flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard Suite</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
