import React, { useState, useEffect, useRef } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';

const TRENDING_QUERIES = [
  'Cashmere Overcoat',
  'Ceramic Lamp',
  'Weekender Leather Bag',
  'Belgian Linen',
  'Travertine',
  'Calfskin Sneaker'
];

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    products, 
    navigateTo,
    setSelectedCategory 
  } = useEcommerce();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.materials.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    navigateTo('product-details', productId);
  };

  const handleQuickKeyword = (keyword: string) => {
    setQuery(keyword);
  };

  const handleCategoryClick = (categoryName: string) => {
    setIsSearchOpen(false);
    setSelectedCategory(categoryName);
    navigateTo('shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 md:p-10 flex justify-center items-start animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden mt-8 md:mt-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-black/10">
          <Search className="w-5 h-5 text-[#8A857D] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by product, material, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base text-[#1A1A1A] placeholder-[#999] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8A857D] hover:text-[#1A1A1A] px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-[#7A746B] hover:text-[#1A1A1A] rounded-full hover:bg-[#F4F2ED] transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Body Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="space-y-6">
              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A857D] mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_QUERIES.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleQuickKeyword(keyword)}
                      className="px-3 py-1.5 text-xs text-[#4A453E] bg-[#F4F2ED] hover:bg-[#EAE5DC] rounded transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse by Categories */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A857D] mb-3">
                  Curated Categories
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Apparel & Tailoring', 'Handcrafted Leather', 'Architectural Living', 'Footwear & Accents'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="p-3 text-left bg-[#FAF9F6] border border-black/5 rounded hover:border-[#1A1A1A] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-medium text-[#1A1A1A]">{cat}</span>
                      <ArrowRight className="w-3 h-3 text-[#999] group-hover:text-[#1A1A1A] transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div>
              <div className="flex justify-between items-center text-xs text-[#8A857D] mb-3">
                <span>Matching Products ({filteredProducts.length})</span>
                <span className="text-[11px]">Press Esc to close</span>
              </div>
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-[#FAF9F6] border border-transparent hover:border-black/5 transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded bg-[#EBE7DF] overflow-hidden shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-[#8A857D]">
                        <span>{product.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.origin}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#9B6B43] transition-colors truncate">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-[#7A746B] truncate">
                        {product.materials}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#1A1A1A] tabular-nums">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm font-medium text-[#1A1A1A]">No matches found for "{query}"</p>
              <p className="text-xs text-[#8A857D] mt-1">
                Try checking the spelling or browse our collection by category.
              </p>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  navigateTo('shop');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1C1C1E] text-white rounded hover:bg-black transition-colors"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
