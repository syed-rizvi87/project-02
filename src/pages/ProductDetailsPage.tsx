import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../services/api';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Check, 
  Ruler, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  MessageSquarePlus,
  Maximize2,
  X
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateTo,
    showToast 
  } = useEcommerce();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string>('materials');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Review Form state
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');

  const isFavorited = isInWishlist(product.id);
  const activeColor = product.colors[selectedColorIdx] || product.colors[0];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, activeColor, quantity, true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewComment.trim()) {
      showToast('Please provide a title and your impressions.', 'warning');
      return;
    }
    try {
      await api.submitReview(product.id, {
        author: newReviewAuthor || 'Julian M.',
        location: 'Verified Patron',
        rating: newReviewRating,
        title: newReviewTitle,
        comment: newReviewComment,
        verified: true
      });
      showToast('Your verified evaluation has been recorded in the database.', 'success');
    } catch (err) {
      showToast('Your evaluation has been submitted for moderation.', 'success');
    }
    setIsReviewModalOpen(false);
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .concat(products.filter(p => p.id !== product.id))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#8A857D] mb-8">
        <button onClick={() => navigateTo('home')} className="hover:text-[#1A1A1A]">Home</button>
        <span aria-hidden="true">/</span>
        <button onClick={() => navigateTo('shop')} className="hover:text-[#1A1A1A]">Catalog</button>
        <span aria-hidden="true">/</span>
        <span className="hover:text-[#1A1A1A]">{product.category}</span>
        <span aria-hidden="true">/</span>
        <span className="text-[#1A1A1A] font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid (Sticky Gallery Left, Sticky Contiguous Purchase Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Visual Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Visual Viewport */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F4F2ED] hairline-border group">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#1C1C1E] shadow-sm backdrop-blur-sm transition-colors"
              aria-label="Enlarge image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  selectedImageIdx === idx ? 'border-[#1C1C1E] shadow-sm' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.title} view ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>

          {/* Additional Artisanal Story Snippet */}
          <div className="hidden lg:block mt-8 p-6 bg-[#FAF9F6] hairline-border rounded-xl">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9B6B43]">
              Provenance & Origin
            </h4>
            <p className="text-xs text-[#59554F] mt-1.5 leading-relaxed">
              Every specimen of {product.title} is handcrafted in {product.origin}. Finished with hand-beveled edges and individual master guild inspection serial numbers.
            </p>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div>
            {/* Unboxed Metadata */}
            <div className="flex items-center justify-between text-xs text-[#8A857D] mb-2">
              <span className="uppercase tracking-widest">{product.category}</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] leading-tight">
              {product.title}
            </h1>
            <p className="text-xs text-[#7A746B] mt-1 leading-relaxed">
              {product.subtitle}
            </p>

            {/* Rating Summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#1A1A1A] tabular-nums">{product.rating}</span>
              <span className="text-xs text-[#8A857D]">({product.reviewCount} verified reviews)</span>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 mt-4 pt-4 border-t border-black/10">
              <span className="text-2xl font-bold text-[#1A1A1A] tabular-nums">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#8A857D] line-through tabular-nums">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-semibold text-emerald-800">
                  Save ${(product.originalPrice - product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Color Swatches Selection */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1A1A1A]">Curated Color:</span>
              <span className="text-[#7A746B]">{activeColor.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((color, idx) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    selectedColorIdx === idx 
                      ? 'ring-2 ring-offset-2 ring-[#1C1C1E]' 
                      : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Select ${color.name}`}
                >
                  {selectedColorIdx === idx && (
                    <Check className={`w-4 h-4 ${color.hex === '#1C1C1E' || color.hex === '#141414' ? 'text-white' : 'text-black'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size / Dimension Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1A1A1A]">Sizing / Spec:</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-[#9B6B43] hover:underline flex items-center gap-1 font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-3 text-xs font-semibold rounded border text-center transition-colors ${
                    selectedSize === size
                      ? 'border-[#1C1C1E] bg-[#1C1C1E] text-white shadow-sm'
                      : 'border-[#DCD7CE] text-[#4A453E] hover:border-[#1A1A1A]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Indicator */}
          <div className="text-xs flex items-center gap-2 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-emerald-900 font-medium">
              In Stock · Dispatches from Biella within 24 hours
            </span>
            {product.stock <= 5 && (
              <span className="text-amber-800 font-semibold">({product.stock} left in atelier)</span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#D5D0C6] rounded bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-sm text-[#4A453E] hover:bg-[#F4F2ED]"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2.5 text-xs font-bold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2.5 text-sm text-[#4A453E] hover:bg-[#F4F2ED]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-[#1C1C1E] text-white rounded font-semibold text-xs tracking-wider uppercase hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag · ${(product.price * quantity).toLocaleString()}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 border rounded transition-colors ${
                  isFavorited 
                    ? 'border-[#1C1C1E] bg-[#1C1C1E] text-[#C2A378]' 
                    : 'border-[#D5D0C6] text-[#1A1A1A] hover:border-[#1A1A1A]'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Quick 1-click Express Checkout simulation */}
            <button
              onClick={() => {
                addToCart(product, selectedSize, activeColor, quantity, false);
                navigateTo('checkout');
              }}
              className="w-full py-2.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              Direct Express Checkout
            </button>
          </div>

          {/* Guarantees Strip */}
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-black/10 text-center text-[11px] text-[#59554F]">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#9B6B43]" />
              <span>Complimentary insured shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#9B6B43]" />
              <span>30-Day doorstep return</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#9B6B43]" />
              <span>Certified authenticity</span>
            </div>
          </div>

          {/* Detailed Specifications Accordions */}
          <div className="space-y-2 pt-2">
            {/* Accordion 1: Description & Materials */}
            <div className="border border-black/10 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'materials' ? '' : 'materials')}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-[#1A1A1A]"
              >
                <span>Materials & Master Craftsmanship</span>
                {activeAccordion === 'materials' ? <ChevronUp className="w-4 h-4 text-[#777]" /> : <ChevronDown className="w-4 h-4 text-[#777]" />}
              </button>
              {activeAccordion === 'materials' && (
                <div className="p-4 pt-0 text-xs text-[#59554F] leading-relaxed border-t border-black/5 space-y-2">
                  <p>{product.description}</p>
                  <p><strong className="text-[#1A1A1A]">Composition:</strong> {product.materials}</p>
                  <p><strong className="text-[#1A1A1A]">Tailoring Atelier:</strong> {product.origin}</p>
                </div>
              )}
            </div>

            {/* Accordion 2: Sizing & Dimensions */}
            <div className="border border-black/10 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'sizing' ? '' : 'sizing')}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-[#1A1A1A]"
              >
                <span>Dimensions & Proportions</span>
                {activeAccordion === 'sizing' ? <ChevronUp className="w-4 h-4 text-[#777]" /> : <ChevronDown className="w-4 h-4 text-[#777]" />}
              </button>
              {activeAccordion === 'sizing' && (
                <div className="p-4 pt-0 text-xs text-[#59554F] leading-relaxed border-t border-black/5 space-y-2">
                  <p>{product.dimensions || 'Tailored to true European luxury standard measurements.'}</p>
                  <p>Our model is 187cm / 6\'1" wearing size 40 / M.</p>
                </div>
              )}
            </div>

            {/* Accordion 3: Care & Maintenance */}
            <div className="border border-black/10 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'care' ? '' : 'care')}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-[#1A1A1A]"
              >
                <span>Care & Preservation</span>
                {activeAccordion === 'care' ? <ChevronUp className="w-4 h-4 text-[#777]" /> : <ChevronDown className="w-4 h-4 text-[#777]" />}
              </button>
              {activeAccordion === 'care' && (
                <div className="p-4 pt-0 text-xs text-[#59554F] leading-relaxed border-t border-black/5 space-y-2">
                  <p>{product.care}</p>
                  <p>Includes breathable archival garment bag and natural cedar hanger.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Customer Ratings & Reviews Section */}
      <section className="mt-20 pt-12 border-t border-black/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9B6B43]">
              Patron Feedback
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] mt-1">
              Ratings & Evaluations
            </h2>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-5 py-2.5 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Write an Evaluation</span>
          </button>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white hairline-border rounded-xl p-8 mb-8">
          <div className="text-center md:border-r border-black/10 pr-4">
            <span className="text-5xl font-bold font-serif text-[#1A1A1A] tabular-nums">{product.rating}</span>
            <div className="flex justify-center text-amber-500 my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-[#8A857D]">Based on {product.reviewCount} client evaluations</p>
          </div>

          <div className="md:col-span-2 space-y-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-12 text-[#555]">5 Stars</span>
              <div className="flex-1 h-2 bg-[#F4F2ED] rounded-full overflow-hidden">
                <div className="w-[88%] h-full bg-[#1C1C1E] rounded-full" />
              </div>
              <span className="w-8 text-right font-medium tabular-nums">88%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-[#555]">4 Stars</span>
              <div className="flex-1 h-2 bg-[#F4F2ED] rounded-full overflow-hidden">
                <div className="w-[10%] h-full bg-[#1C1C1E] rounded-full" />
              </div>
              <span className="w-8 text-right font-medium tabular-nums">10%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-[#555]">3 Stars</span>
              <div className="flex-1 h-2 bg-[#F4F2ED] rounded-full overflow-hidden">
                <div className="w-[2%] h-full bg-[#1C1C1E] rounded-full" />
              </div>
              <span className="w-8 text-right font-medium tabular-nums">2%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-[#555]">2 Stars</span>
              <div className="flex-1 h-2 bg-[#F4F2ED] rounded-full overflow-hidden">
                <div className="w-[0%] h-full bg-[#1C1C1E] rounded-full" />
              </div>
              <span className="w-8 text-right font-medium tabular-nums">0%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-[#555]">1 Star</span>
              <div className="flex-1 h-2 bg-[#F4F2ED] rounded-full overflow-hidden">
                <div className="w-[0%] h-full bg-[#1C1C1E] rounded-full" />
              </div>
              <span className="w-8 text-right font-medium tabular-nums">0%</span>
            </div>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {(product.reviews && product.reviews.length > 0) ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="p-6 bg-white hairline-border rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold text-[#1A1A1A]">{rev.author}</span>
                    <span className="text-[#8A857D]">({rev.location})</span>
                  </div>
                  <span className="text-[#8A857D] text-[11px]">{rev.date}</span>
                </div>
                <h4 className="text-sm font-semibold text-[#1A1A1A]">{rev.title}</h4>
                <p className="text-xs text-[#59554F] leading-relaxed">{rev.comment}</p>
                <div className="flex items-center gap-4 pt-2 text-[11px] text-[#8A857D]">
                  <span className="text-emerald-700 font-medium">✓ Verified Purchase</span>
                  <span>·</span>
                  <span>{rev.helpfulCount} found this helpful</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 bg-white hairline-border rounded-xl text-center">
              <p className="text-xs text-[#7A746B]">No written reviews yet for this edition. Be the first to evaluate.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Grid */}
      <section className="mt-20 pt-12 border-t border-black/10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9B6B43]">
              Curated Pairings
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] mt-1">
              Complete The Aesthetic
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold uppercase tracking-wider text-[#4A453E] hover:text-[#1A1A1A]"
          >
            View Entire Archive
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map(rel => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-[#888] hover:text-[#1A1A1A]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-1">Garment Measurement Guide</h3>
            <p className="text-xs text-[#7A746B] mb-4">European standard sizing measured flat in centimeters (cm).</p>
            
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/10 text-[#8A857D]">
                    <th className="py-2">Size</th>
                    <th className="py-2">Chest (cm)</th>
                    <th className="py-2">Shoulder (cm)</th>
                    <th className="py-2">Length (cm)</th>
                    <th className="py-2">Sleeve (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-[#333]">
                  <tr><td className="py-2 font-semibold">38 / S</td><td>104</td><td>46</td><td>110</td><td>64</td></tr>
                  <tr><td className="py-2 font-semibold">40 / M</td><td>108</td><td>47.5</td><td>112</td><td>65</td></tr>
                  <tr><td className="py-2 font-semibold">42 / L</td><td>112</td><td>49</td><td>114</td><td>66</td></tr>
                  <tr><td className="py-2 font-semibold">44 / XL</td><td>116</td><td>50.5</td><td>116</td><td>67</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-[#7A746B] mt-4">
              Complimentary size exchanges are fulfilled with priority courier pickup.
            </p>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 p-4 sm:p-10 flex items-center justify-center cursor-zoom-out"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={product.images[selectedImageIdx] || product.images[0]}
            alt={product.title}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-md"
          />
        </div>
      )}

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-[#888] hover:text-[#1A1A1A]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-1">Evaluate {product.title}</h3>
            <p className="text-xs text-[#7A746B] mb-4">Share your thoughts on craftsmanship, tactile feel, and fit.</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 text-amber-500"
                    >
                      <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-current' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Julian M."
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exquisite drape and warmth"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Detailed Impressions</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the fabric weight, finish, and pairing..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1C1C1E] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black"
              >
                Submit Evaluation
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
