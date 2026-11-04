import React, { useState } from 'react';
import { Product } from '../../types/ecommerce';
import { useEcommerce } from '../../context/EcommerceContext';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { 
    navigateTo, 
    toggleWishlist, 
    isInWishlist, 
    addToCart,
    openQuickView 
  } = useEcommerce();
  
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const activeColor = product.colors[selectedColorIdx] || product.colors[0];

  const handleCardClick = () => {
    navigateTo('product-details', product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], activeColor, 1, true);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  if (layout === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="group flex flex-col sm:flex-row items-center gap-6 p-4 bg-white hairline-border rounded-lg transition-all duration-200 hover:shadow-sm cursor-pointer"
      >
        <div className="relative w-full sm:w-48 h-56 bg-[#F5F3EF] overflow-hidden rounded-md shrink-0">
          {!imageError ? (
            <img 
              src={product.images[0]} 
              alt={product.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#EBE7DF] text-[#7A746B] p-4 text-center">
              <span className="text-xs font-serif tracking-widest uppercase mb-1">AURA ATELIER</span>
              <span className="text-sm font-medium">{product.title}</span>
            </div>
          )}
          
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isFavorited 
                ? 'bg-[#1C1C1E] text-[#C2A378]' 
                : 'bg-white/80 backdrop-blur-sm text-[#1A1A1A] hover:bg-white'
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1">
          <div>
            {/* Clean unboxed metadata */}
            <div className="flex items-center gap-2 text-xs text-[#8A857D] mb-1">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.origin}</span>
              {product.stock <= 5 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-700 font-medium">Only {product.stock} left</span>
                </>
              )}
            </div>

            <h3 className="text-base font-semibold text-[#1A1A1A] group-hover:text-[#9B6B43] transition-colors truncate">
              {product.title}
            </h3>
            
            <p className="text-xs text-[#6B655B] line-clamp-2 mt-1.5 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-medium text-[#1A1A1A] ml-1 tabular-nums">{product.rating}</span>
              </div>
              <span className="text-xs text-[#8A857D]">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-[#1A1A1A] tabular-nums">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#8A857D] line-through tabular-nums">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickView}
                className="px-3 py-1.5 text-xs font-medium text-[#4A453E] hover:text-[#1A1A1A] border border-[#DCD7CE] rounded hover:border-[#1A1A1A] transition-colors"
              >
                Quick View
              </button>
              <button
                onClick={handleQuickAdd}
                className="px-4 py-1.5 text-xs font-medium bg-[#1C1C1E] text-white rounded hover:bg-[#333] transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col h-full bg-white hairline-border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] w-full bg-[#F4F2ED] overflow-hidden">
        {!imageError ? (
          <img 
            src={product.images[0]} 
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#EBE7DF] text-[#7A746B] p-4 text-center">
            <span className="text-xs font-serif tracking-widest uppercase mb-1">AURA ATELIER</span>
            <span className="text-xs font-medium line-clamp-2">{product.title}</span>
          </div>
        )}

        {/* Top Badges (Subtle unboxed status or single tag) */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {product.isNew && (
            <span className="bg-white/90 backdrop-blur-sm text-[11px] font-semibold tracking-wider uppercase text-[#1C1C1E] px-2 py-0.5 rounded-sm">
              New Arrival
            </span>
          )}
          {product.originalPrice && !product.isNew && (
            <span className="bg-[#1C1C1E]/90 text-[11px] font-semibold text-white px-2 py-0.5 rounded-sm">
              Save ${product.originalPrice - product.price}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isFavorited 
              ? 'bg-[#1C1C1E] text-[#C2A378]' 
              : 'bg-white/80 backdrop-blur-sm text-[#1A1A1A] hover:bg-white hover:text-black shadow-sm'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isFavorited ? 'fill-current scale-110' : ''}`} />
        </button>

        {/* Quick Actions Hover Strip */}
        <div 
          className={`absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={handleQuickView}
            className="flex-1 py-2 px-2 text-xs font-medium bg-white/95 text-[#1C1C1E] rounded shadow-sm hover:bg-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-2 text-xs font-medium bg-[#1C1C1E]/95 text-white rounded shadow-sm hover:bg-black transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="flex-1 flex flex-col justify-between p-4 bg-white">
        <div>
          {/* Unboxed clean metadata with · separator */}
          <div className="flex items-center justify-between text-xs text-[#8A857D] mb-1">
            <span className="truncate">{product.category}</span>
            {product.stock <= 5 && (
              <span className="text-amber-800 text-[11px] font-medium shrink-0">
                {product.stock} left
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#9B6B43] transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-[#6B655B] line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Bottom Swatches & Price */}
        <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between">
          {/* Color swatches */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.slice(0, 3).map((color, idx) => (
              <button
                key={color.name}
                onClick={() => setSelectedColorIdx(idx)}
                className={`w-3.5 h-3.5 rounded-full transition-transform ${
                  selectedColorIdx === idx ? 'ring-1 ring-offset-1 ring-[#1A1A1A] scale-110' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Select color ${color.name}`}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-[#8A857D]">+{product.colors.length - 3}</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            {product.originalPrice && (
              <span className="text-xs text-[#8A857D] line-through tabular-nums">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-sm font-bold text-[#1A1A1A] tabular-nums">
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
