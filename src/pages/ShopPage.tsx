import React, { useState, useMemo } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { ProductCard } from '../components/common/ProductCard';
import { 
  SlidersHorizontal, 
  Grid3X3, 
  LayoutGrid, 
  List, 
  X, 
  RotateCcw,
  Search,
  ChevronDown
} from 'lucide-react';

const CATEGORIES = [
  'All Collections',
  'Apparel & Tailoring',
  'Handcrafted Leather',
  'Architectural Living',
  'Footwear & Accents'
];

export const ShopPage: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory 
  } = useEcommerce();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>(selectedCategory || 'All Collections');
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [gridCols, setGridCols] = useState<'3' | '4' | 'list'>('4');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 8;

  // Sync state if selectedCategory from global changes
  React.useEffect(() => {
    if (selectedCategory) {
      setSelectedCat(selectedCategory);
    }
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCat !== 'All Collections' && p.category !== selectedCat) {
        return false;
      }
      // Price filter
      if (p.price > maxPrice) {
        return false;
      }
      // Stock filter
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      // Search filter
      if (searchFilter.trim() !== '') {
        const query = searchFilter.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesMat = p.materials.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesMat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // featured default
    });
  }, [products, selectedCat, maxPrice, inStockOnly, searchFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedCat('All Collections');
    setSelectedCategory(null);
    setMaxPrice(1200);
    setInStockOnly(false);
    setSearchFilter('');
    setSortBy('featured');
    setCurrentPageNum(1);
  };

  const hasActiveFilters = selectedCat !== 'All Collections' || maxPrice < 1200 || inStockOnly || searchFilter !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Breadcrumb */}
      <div className="mb-8 border-b border-black/10 pb-6">
        <div className="flex items-center gap-2 text-xs text-[#8A857D] mb-2">
          <span>Home</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#1A1A1A] font-medium">Catalog</span>
          {selectedCat !== 'All Collections' && (
            <>
              <span aria-hidden="true">/</span>
              <span className="text-[#9B6B43] font-semibold">{selectedCat}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
              {selectedCat === 'All Collections' ? 'The Complete Archive' : selectedCat}
            </h1>
            <p className="text-xs text-[#7A746B] mt-1.5 max-w-xl">
              Showing {filteredProducts.length} curated specimen designed for enduring beauty and everyday functionality.
            </p>
          </div>

          {/* Quick Category Tabs */}
          <div className="hidden xl:flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCat(cat); setCurrentPageNum(1); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap shrink-0 ${
                  selectedCat === cat
                    ? 'bg-[#1C1C1E] text-white'
                    : 'bg-[#EFECE6] text-[#59554F] hover:bg-[#E5E0D6] hover:text-[#1A1A1A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control Bar: Filters Trigger, Sort & Layout Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white hairline-border rounded-lg mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-[#F4F2ED] text-[#1A1A1A] rounded hover:bg-[#EAE5DC]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>

          {/* In-Catalog Search Bar */}
          <div className="relative min-w-[200px] sm:min-w-[260px]">
            <Search className="w-3.5 h-3.5 text-[#8A857D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchFilter}
              onChange={(e) => { setSearchFilter(e.target.value); setCurrentPageNum(1); }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF9F6] border border-black/10 rounded focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#8A857D] hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#8A857D] hidden sm:inline">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="appearance-none bg-[#FAF9F6] border border-black/10 rounded px-3 py-1.5 pr-7 text-xs font-medium text-[#1A1A1A] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#777] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Grid Layout Switcher */}
          <div className="hidden sm:flex items-center gap-1 p-0.5 bg-[#FAF9F6] border border-black/10 rounded">
            <button
              onClick={() => setGridCols('3')}
              className={`p-1.5 rounded transition-colors ${gridCols === '3' ? 'bg-white shadow-xs text-[#1A1A1A]' : 'text-[#8A857D] hover:text-[#1A1A1A]'}`}
              title="3 Columns"
              aria-label="3 Columns Grid"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGridCols('4')}
              className={`p-1.5 rounded transition-colors ${gridCols === '4' ? 'bg-white shadow-xs text-[#1A1A1A]' : 'text-[#8A857D] hover:text-[#1A1A1A]'}`}
              title="4 Columns"
              aria-label="4 Columns Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGridCols('list')}
              className={`p-1.5 rounded transition-colors ${gridCols === 'list' ? 'bg-white shadow-xs text-[#1A1A1A]' : 'text-[#8A857D] hover:text-[#1A1A1A]'}`}
              title="List View"
              aria-label="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6 bg-white hairline-border rounded-xl p-6">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Refine By</span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#9B6B43] hover:underline font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold text-[#1A1A1A] mb-3 uppercase tracking-wider">
              Category
            </h4>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCat(cat); setCurrentPageNum(1); }}
                  className={`w-full text-left py-1 text-xs transition-colors flex items-center justify-between ${
                    selectedCat === cat 
                      ? 'font-bold text-[#1A1A1A]' 
                      : 'text-[#59554F] hover:text-[#1A1A1A]'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCat === cat && <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-black/5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#1A1A1A] uppercase tracking-wider">Max Price</span>
              <span className="font-bold text-[#1A1A1A] tabular-nums">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="150"
              max="1200"
              step="50"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPageNum(1); }}
              className="w-full accent-[#1C1C1E] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#8A857D] mt-1">
              <span>$150</span>
              <span>$1,200+</span>
            </div>
          </div>

          {/* Availability */}
          <div className="pt-4 border-t border-black/5">
            <h4 className="text-xs font-semibold text-[#1A1A1A] mb-3 uppercase tracking-wider">
              Availability
            </h4>
            <label className="flex items-center gap-2 text-xs text-[#59554F] cursor-pointer hover:text-[#1A1A1A]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => { setInStockOnly(e.target.checked); setCurrentPageNum(1); }}
                className="rounded accent-[#1C1C1E]"
              />
              <span>In Stock Ready to Dispatch</span>
            </label>
          </div>

          {/* Sourcing Promise */}
          <div className="pt-4 border-t border-black/5 bg-[#FAF9F6] p-4 rounded-lg">
            <p className="text-[11px] font-semibold text-[#1A1A1A]">Heirloom Guarantee</p>
            <p className="text-[11px] text-[#7A746B] mt-1 leading-relaxed">
              Every archive item is made in small batches and numbered with an authentic maker certificate.
            </p>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-black/10">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Filters</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-[#777]" />
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">Category</h4>
                  <div className="space-y-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCat(cat); }}
                        className={`w-full text-left py-1 text-xs ${selectedCat === cat ? 'font-bold text-[#1A1A1A]' : 'text-[#666]'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5">
                  <div className="flex justify-between text-xs mb-2">
                    <span>Max Price</span>
                    <span className="font-bold">${maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="1200"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#1C1C1E]"
                  />
                </div>

                <div className="pt-4 border-t border-black/5">
                  <label className="flex items-center gap-2 text-xs text-[#59554F]">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded accent-[#1C1C1E]"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-black/10 space-y-2">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-[#1C1C1E] text-white rounded text-xs font-bold uppercase tracking-wider"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full py-2 text-xs text-[#777] hover:text-[#1A1A1A]"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Stage */}
        <div className="flex-1 min-w-0">
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 bg-white hairline-border rounded-xl p-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#F4F2ED] flex items-center justify-center text-[#8A857D] mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#1A1A1A]">No matches in this curation</h3>
              <p className="text-xs text-[#7A746B] max-w-sm mx-auto mt-1 leading-relaxed">
                We couldn't find items matching your active combination of filters and price limits.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 bg-[#1C1C1E] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-black transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {gridCols === 'list' ? (
                <div className="space-y-4">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} layout="list" />
                  ))}
                </div>
              ) : (
                <div className={`grid gap-6 ${gridCols === '3' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} layout="grid" />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 pt-6 border-t border-black/10 flex items-center justify-between text-xs text-[#59554F]">
                  <span>Showing {(currentPageNum - 1) * itemsPerPage + 1}–{Math.min(currentPageNum * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                      disabled={currentPageNum === 1}
                      className="px-3 py-1.5 border border-black/10 rounded disabled:opacity-30 hover:border-[#1A1A1A] transition-colors"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPageNum(i + 1)}
                        className={`w-8 h-8 rounded border transition-colors ${
                          currentPageNum === i + 1
                            ? 'bg-[#1C1C1E] text-white border-[#1C1C1E] font-bold'
                            : 'border-black/10 text-[#555] hover:border-[#1A1A1A]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
                      disabled={currentPageNum === totalPages}
                      className="px-3 py-1.5 border border-black/10 rounded disabled:opacity-30 hover:border-[#1A1A1A] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
