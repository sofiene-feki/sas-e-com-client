import React from "react";

export default function LoadingProduct({ length, cols = 4 }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-8 md:gap-10`}>
      {Array.from({ length: length }).map((_, idx) => (
        <div key={idx} className="space-y-5 animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-[4/5.5] bg-neutral-100" />

          <div className="space-y-3 px-1">
            {/* Title Skeleton */}
            <div className="h-5 bg-neutral-100 w-3/4" />

            {/* Tag Skeleton */}
            <div className="h-2 bg-neutral-100 w-1/4" />

            {/* Price Skeleton */}
            <div className="flex justify-between items-center py-2">
              <div className="h-4 bg-neutral-100 w-1/3" />
              <div className="h-3 bg-neutral-100 w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
