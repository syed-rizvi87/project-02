import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../services/api';
import { 
  MOCK_CATEGORIES, 
  HERO_IMAGE, 
  PROMO_BANNER_IMAGE 
} from '../data/mockData';
import { 
  ArrowRight, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, navigateTo, setSelectedCategory, showToast } = useEcommerce();
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'new' | 'trending'>('bestsellers');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Filter products by tab
  const displayedProducts = products.filter(p => {
    if (activeTab === 'bestsellers') return p.isBestSeller;
    if (activeTab === 'new') return p.isNew || p.id === 'prod-001';
    if (activeTab === 'trending') return p.isTrending;
    return true;
  }).slice(0, 4);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    navigateTo('shop');
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please provide a valid email.', 'warning');
      return;
    }
    try {
      await api.subscribeNewsletter(newsletterEmail);
    } catch (err) {
      // optimistic
    }
    setNewsletterSubmitted(true);
    showToast('Your $30 voucher code "ATELIER30" has been activated.', 'success');
  };

  return (
    <div className="space-y-24 md:space-y-32">
      
      {/* 1. Hero Campaign Banner (Split or Cinematic 16:9 Focal Anchor) */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-2xl overflow-hidden bg-[#1C1C1E] min-h-[580px] lg:min-h-[640px] flex items-end">
          {/* Background Photography */}
          <img
            src={HERO_IMAGE}
            alt="AURA Atelier Modern Luxury Showroom"
            className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 transition-transform duration-1000 hover:scale-102"
          />

          {/* Measured Contrast Scrim for WCAG AA compliance */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

          {/* Hero Content Overlay */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl text-white">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C2A378] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autumn / Winter 2026 Collection</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1] text-balance">
              The Art of Considered Living.
            </h1>

            <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              Heirloom cashmere tailoring, vegetable-tanned Tuscan leather, and architectural stoneware objects crafted to outlast transient fashion cycles.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => { setSelectedCategory(null); navigateTo('shop'); }}
                className="px-7 py-3.5 bg-[#FAF9F6] text-[#141416] text-xs font-bold uppercase tracking-wider rounded hover:bg-[#E5E0D6] transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>Explore The Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => { setSelectedCategory('Apparel & Tailoring'); navigateTo('shop'); }}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md text-xs font-semibold uppercase tracking-wider rounded transition-colors border border-white/20"
              >
                View Tailoring
              </button>
            </div>
          </div>
        </div>

        {/* Value Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-white hairline-border rounded-lg text-center">
            <span className="text-xs font-semibold text-[#1A1A1A] block">100% Traceable</span>
            <span className="text-[11px] text-[#7A746B]">Certified European mills</span>
          </div>
          <div className="p-4 bg-white hairline-border rounded-lg text-center">
            <span className="text-xs font-semibold text-[#1A1A1A] block">Heirloom Quality</span>
            <span className="text-[11px] text-[#7A746B]">Handcrafted by master guilds</span>
          </div>
          <div className="p-4 bg-white hairline-border rounded-lg text-center">
            <span className="text-xs font-semibold text-[#1A1A1A] block">Complimentary Shipping</span>
            <span className="text-[11px] text-[#7A746B]">On global orders over $250</span>
          </div>
          <div className="p-4 bg-white hairline-border rounded-lg text-center">
            <span className="text-xs font-semibold text-[#1A1A1A] block">Private Concierge</span>
            <span className="text-[11px] text-[#7A746B]">30-day effortless returns</span>
          </div>
        </div>
      </section>

      {/* 2. Curated Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9B6B43]">
              Curated Taxonomy
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-1">
              Explore by Discipline
            </h2>
          </div>
          <button
            onClick={() => { setSelectedCategory(null); navigateTo('shop'); }}
            className="text-xs font-semibold uppercase tracking-wider text-[#4A453E] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="group relative h-96 rounded-xl overflow-hidden hairline-border bg-[#EBE7DF] cursor-pointer flex flex-col justify-end p-6 transition-all duration-300 hover:shadow-lg"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="relative z-10 text-white">
                <span className="text-[11px] uppercase tracking-wider text-[#C2A378] font-semibold">
                  {category.itemCount} Curated Pieces
                </span>
                <h3 className="text-lg font-bold font-serif text-white mt-1 group-hover:text-[#FAF9F6] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-white/70 line-clamp-2 mt-1 leading-relaxed">
                  {category.description}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                  <span>Discover Collection</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Curated Showcase Tabs (Best-Sellers / New Arrivals / Trending) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-black/10 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9B6B43]">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-1">
              Seasonal Highlights
            </h2>
          </div>

          {/* Interactive filter tabs (clean segmented controls) */}
          <div className="flex items-center gap-1 p-1 bg-[#EAE6DE] rounded-lg">
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'bestsellers' 
                  ? 'bg-white text-[#1C1C1E] shadow-sm font-semibold' 
                  : 'text-[#59554F] hover:text-[#1A1A1A]'
              }`}
            >
              Best-Selling Pieces
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'new' 
                  ? 'bg-white text-[#1C1C1E] shadow-sm font-semibold' 
                  : 'text-[#59554F] hover:text-[#1A1A1A]'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'trending' 
                  ? 'bg-white text-[#1C1C1E] shadow-sm font-semibold' 
                  : 'text-[#59554F] hover:text-[#1A1A1A]'
              }`}
            >
              Trending Now
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => { setSelectedCategory(null); navigateTo('shop'); }}
            className="px-8 py-3.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all text-xs font-semibold uppercase tracking-wider rounded"
          >
            Explore Complete Catalog ({products.length} Items)
          </button>
        </div>
      </section>

      {/* 4. Editorial Promotional Campaign Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-[#1E1C1A] min-h-[460px] lg:min-h-[500px] flex items-center">
          <img
            src={PROMO_BANNER_IMAGE}
            alt="Terra Spring Summer Collection Campaign"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

          <div className="relative z-10 p-8 sm:p-14 max-w-xl text-white">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C2A378]">
              The Terra Campaign · SS26
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2 leading-tight">
              Pure Unbleached Fibres. Organic Textures.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-white/80 leading-relaxed">
              Designed for effortless movement in sun-soaked climates. Tailored from undyed Belgian flax, breathable wild silk, and naturally tanned Tuscan calfskin.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => { setSelectedCategory('Apparel & Tailoring'); navigateTo('shop'); }}
                className="px-6 py-3 bg-[#FAF9F6] text-[#141416] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#E5E0D6] transition-colors flex items-center gap-2"
              >
                <span>Shop The Editorial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Craftsmanship & Ethical Origin Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white hairline-border rounded-2xl p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#9B6B43]">
                Our Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1A1A] mt-2 leading-tight">
                Crafted slowly by artisans, not automated machines.
              </h2>
              <p className="text-sm text-[#59554F] mt-4 leading-relaxed">
                In a world saturated with ephemeral fast fashion, AURA Atelier collaborates exclusively with multi-generational family workshops across Northern Italy, the Scottish Highlands, and historical Kyoto.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#9B6B43] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#1A1A1A]">Zero-Waste Vegetable Tanning</h4>
                    <p className="text-xs text-[#7A746B] mt-0.5">Tanned with natural chestnut and mimosa bark extracts, creating leather that breathes and patinas gracefully.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#9B6B43] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#1A1A1A]">Rare Hand-Flat Scottish Looms</h4>
                    <p className="text-xs text-[#7A746B] mt-0.5">Cashmere spun from pure mountain spring water in Loch Leven, yielding unmatched softness and zero synthetic blends.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#9B6B43] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#1A1A1A]">Stoneware Clay From Kyoto Basin</h4>
                    <p className="text-xs text-[#7A746B] mt-0.5">Formed by master ceramists with mineral-rich sediment, fired in traditional wood-burning climbing kilns.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF9F6] hairline-border">
                <img
                  src={HERO_IMAGE}
                  alt="Artisan Tailoring Workshop"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#1C1C1E] text-white p-6 rounded-lg shadow-xl hidden sm:block max-w-xs">
                <span className="text-2xl font-bold font-serif text-[#C2A378]">100%</span>
                <p className="text-xs text-white/80 mt-1 font-medium">
                  Committed to natural materials, plastic-free biodegradable packaging, and lifetime repair service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews & Verified Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9B6B43]">
            Verified Client Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-1">
            Words From Our Private Patrons
          </h2>
          <p className="text-xs text-[#7A746B] mt-2">
            Independent testimonials from verified clients across 28 countries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white hairline-border rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] font-serif">
                "The Cashmere Overcoat is a work of architectural art."
              </h4>
              <p className="text-xs text-[#59554F] mt-2 leading-relaxed">
                "The weight of the double-faced wool is substantial yet moves fluidly. The oat tone is warm and neutral, pairing seamlessly with both charcoal suits and raw denim."
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-[#1A1A1A]">Julian M.</p>
                <p className="text-[#8A857D] text-[11px]">Zurich, Switzerland</p>
              </div>
              <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Client
              </span>
            </div>
          </div>

          <div className="p-6 bg-white hairline-border rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] font-serif">
                "The Tuscan weekender bag smells extraordinary."
              </h4>
              <p className="text-xs text-[#59554F] mt-2 leading-relaxed">
                "The scent of the vegetable-tanned leather is intoxicating. Already taken on four flights; fits effortlessly in overhead compartments and looks better with every scratch."
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-[#1A1A1A]">David L.</p>
                <p className="text-[#8A857D] text-[11px]">London, United Kingdom</p>
              </div>
              <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Client
              </span>
            </div>
          </div>

          <div className="p-6 bg-white hairline-border rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] font-serif">
                "The ceramic vessel lamp transforms ambient evening light."
              </h4>
              <p className="text-xs text-[#59554F] mt-2 leading-relaxed">
                "The texture of the clay catches grazing light stunningly. The washi parchment shade casts the warmest 2700K diffused glow. Arrived impeccably packed with wax seals."
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-[#1A1A1A]">Marcus K.</p>
                <p className="text-[#8A857D] text-[11px]">Copenhagen, Denmark</p>
              </div>
              <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Client
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Newsletter Invitation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF9F6] hairline-border rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9B6B43]">
            Private Privileges
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-2">
            Receive $30 Toward Your First Order
          </h2>
          <p className="text-xs sm:text-sm text-[#7A746B] mt-2 max-w-md mx-auto leading-relaxed">
            Subscribe to our seasonal release digest for preview access to small-batch tailoring and limited interior editions.
          </p>

          {newsletterSubmitted ? (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 max-w-md mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Privilege activated! Use code <strong>ATELIER30</strong> at checkout for $30 off.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 text-xs bg-white border border-[#D5D0C6] rounded focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#1C1C1E] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-black transition-colors"
              >
                Claim Privilege
              </button>
            </form>
          )}

          <p className="text-[11px] text-[#999] mt-3">
            By joining, you agree to our privacy policy. Unsubscribe anytime in one click.
          </p>
        </div>
      </section>

    </div>
  );
};
