import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

export default function Product({ product, loading }) {
  if (loading) {
    return (
      <div className="bg-neutral-50 aspect-[4/5.5] animate-pulse" />
    );
  }

  // Media selection
  const images = product.media?.filter((m) => m.type === "image") || [];
  const imageSrc = images[0]?.src || "https://via.placeholder.com/300";
  const hoverImageSrc = images[1]?.src || imageSrc; // Fallback to same if only one

  const originalPrice = product.Price;
  const promotion = product.promotion || 0;
  const discountedPrice = (
    originalPrice -
    (originalPrice * promotion) / 100
  ).toFixed(2);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 3,
    }).format(price);
  };

  return (
    <div className="group relative bg-white">
      <Link
        to={`/product/${product.slug}`}
        className="flex flex-col h-full"
      >
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[4/5.5] overflow-hidden bg-white">
          {/* Main Image */}
          <img
            src={imageSrc}
            alt={product.Title}
            className={`w-full h-full object-cover transition-all duration-[1200ms] ease-out-expo ${images.length > 1 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`}
          />

          {/* Hover Image (Revealed on hover if available) */}
          {images.length > 1 && (
            <img
              src={hoverImageSrc}
              alt={`${product.Title} - alternate`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-[1200ms] ease-out-expo scale-110 group-hover:scale-100"
            />
          )}

          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black-[0.02] transition-colors duration-700" />

          {/* Promotion Badge - Minimalist Tag style */}
          {promotion > 0 && (
            <div className="absolute top-4 left-0 z-10">
              <span className="px-3 py-1.5 bg-neutral-900 text-white font-ui text-[9px] tracking-[0.2em] uppercase">
                −{promotion}%
              </span>
            </div>
          )}

          {/* New Arrival Tag */}
          {product.isNew && (
            <div className="absolute top-4 right-4 z-10">
              <span className="font-ui text-[8px] tracking-[0.3em] uppercase text-neutral-400 bg-white/80 backdrop-blur-sm px-2 py-1 border border-neutral-100">
                New
              </span>
            </div>
          )}
        </div>

        {/* CONTENT AREA */}
        <div className="pt-6 pb-2 px-1 flex flex-col gap-4">
          <div className="space-y-1.5">
            {/* Title - Editorial Serif */}
            <h3 className="font-editorial text-lg md:text-xl text-neutral-900 leading-tight tracking-tight uppercase group-hover:tracking-wider transition-all duration-1000 truncate">
              {product.Title}
            </h3>

            {/* Category / Collection */}
            <div className="flex items-center justify-between">
              <span className="font-ui text-[9px] tracking-[0.4em] uppercase text-neutral-400">
                {product.Category?.name || "The Archive"}
              </span>

              {/* Minimalist Price for Single Price products */}
              {promotion === 0 && (
                <span className="font-ui text-[12px] tracking-widest text-neutral-900 font-medium whitespace-nowrap">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Price & Colors for Promoted products or just Colors */}
          <div className="flex items-center justify-between gap-4 h-6">
            <div className="flex items-baseline gap-2.5">
              {promotion > 0 && (
                <>
                  <span className="font-ui text-[10px] tracking-tight line-through text-neutral-300">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="font-ui text-[13px] tracking-widest text-neutral-900 font-bold">
                    {formatPrice(discountedPrice)}
                  </span>
                </>
              )}
            </div>

            {/* Color Variations - Delicate dots */}
            <div className="flex items-center gap-1.5">
              {product.colors?.slice(0, 3).map((color, i) => (
                <span
                  key={i}
                  title={color.name}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-100 ring-1 ring-transparent hover:ring-neutral-900 transition-all duration-500 cursor-pointer"
                  style={{ backgroundColor: color.value }}
                />
              ))}
              {product.colors?.length > 3 && (
                <span className="font-ui text-[8px] text-neutral-400 tracking-tighter">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
