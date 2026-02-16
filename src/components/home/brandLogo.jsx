import React, { useEffect, useState } from "react";
import logoBlack from "../../assets/bragaouiBlack.png";
import { getStoreSettings } from "../../functions/storeSettings";

export default function HorizontalBrandScroll() {
  const [storeSettings, setStoreSettings] = useState(null);
  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await getStoreSettings();
        setStoreSettings(data);
      } catch (err) {
        console.error("Error loading brand settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const logo = storeSettings?.logo
    ? `${API_BASE_URL_MEDIA}${storeSettings.logo}`
    : logoBlack;

  const name = storeSettings?.storeName || "CLIN D’OEIL";

  // Repeating the brand identity for the infinite loop
  const brands = Array(10).fill({ name, logo });
  const scrollingBrands = [...brands, ...brands];

  return (
    <div className="w-full bg-white border-y border-neutral-100 py-4 overflow-hidden relative shadow-sm">
      {/* Edge Fades for Luxury Feel */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex animate-infinite-scroll whitespace-nowrap">
        {scrollingBrands.map((brand, index) => (
          <div
            key={index}
            className="flex items-center justify-center mx-12 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-700"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-8 md:h-10 w-auto object-contain "
            />
            <span className="ml-4 text-[10px] md:text-xs font-ui tracking-[0.4em] uppercase text-neutral-900 border-l border-neutral-200 pl-4">
              {brand.name}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          display: inline-flex;
          animation: infinite-scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
