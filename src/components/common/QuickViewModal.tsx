import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { X, Star, Check, ShoppingBag, ArrowRight } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    closeQuickView, 
    addToCart, 
    navigateTo 
  } = useEcommerce();
  
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const activeColor = product.colors[selectedColorIdx] || product.colors[0];
  const activeSize = selectedSize || product.sizes[0];

  const handleAdd = () => {
    addToCart(product, activeSize, activeColor, quantity, true);
    closeQuickView();
  };

  const handleViewFullPage = () => {
    closeQuickView();
    navigateTo('product-details', product.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#1C1C1E] transition-colors shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image Showcase */}
        <div className="w-full md:w-1/2 bg-[#F4F2ED] relative min-h-[300px] md:min-h-full">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Product Details Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8A857D] mb-1.5">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h2 className="text-xl font-bold text-[#1A1A1A] leading-tight font-serif">
              {product.title}
            </h2>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold text-[#1A1A1A] tabular-nums">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#8A857D] line-through tabular-nums">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center text-amber-500 text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-semibold ml-1 text-[#1A1A1A]">{product.rating}</span>
                <span className="text-[#8A857D] ml-1">({product.reviewCount})</span>
              </div>
            </div>

            <p className="text-xs text-[#59554F] mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector */}
            <div className="mt-5">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-medium text-[#1A1A1A]">Tone / Shade</span>
                <span className="text-[#8A857D]">{activeColor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      selectedColorIdx === idx ? 'ring-2 ring-offset-2 ring-[#1A1A1A]' : 'opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Select ${color.name}`}
                  >
                    {selectedColorIdx === idx && (
                      <Check className={`w-3.5 h-3.5 ${color.hex === '#1C1C1E' || color.hex === '#141414' ? 'text-white' : 'text-black'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-medium text-[#1A1A1A]">Dimension / Sizing</span>
                <span className="text-emerald-700 font-medium">In Stock</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                      activeSize === size
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                        : 'border-[#DCD7CE] text-[#4A453E] hover:border-[#1A1A1A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xs font-medium text-[#1A1A1A]">Quantity:</span>
              <div className="flex items-center border border-[#DCD7CE] rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-sm text-[#4A453E] hover:bg-[#F4F2ED]"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-semibold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-sm text-[#4A453E] hover:bg-[#F4F2ED]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-black/5 flex flex-col gap-2.5">
            <button
              onClick={handleAdd}
              className="w-full py-3 px-4 bg-[#1C1C1E] text-white rounded-md hover:bg-black font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Shopping Bag · ${(product.price * quantity).toLocaleString()}</span>
            </button>
            
            <button
              onClick={handleViewFullPage}
              className="w-full py-2 text-xs font-medium text-[#7A746B] hover:text-[#1A1A1A] flex items-center justify-center gap-1 transition-colors"
            >
              <span>View Full Product Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
