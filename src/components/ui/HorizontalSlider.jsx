import React, { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function HorizontalSlider({
  children,
  scrollAmount = 150,
  showArrows = true,
  className = "",
}) {
  const sliderRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = slider;
      setCanScroll(scrollWidth > clientWidth);
      setAtStart(scrollLeft <= 0);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    };

    checkScroll();
    slider.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      slider.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [children]);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Scrollable container */}
      <div
        ref={sliderRef}
        className="flex gap-3 px-2 py-2 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {children}
      </div>

      {/* Arrows */}
      {showArrows && canScroll && (
        <>
          {!atStart && (
            <button
              onClick={scrollLeft}
              className="absolute top-1/2 left-2 -translate-y-1/2 z-20 
                bg-white/80 rounded-full p-2 shadow-xl hover:bg-gray-100 
                transition flex items-center justify-center"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-700" />
            </button>
          )}

          {!atEnd && (
            <button
              onClick={scrollRight}
              className="absolute top-1/2 right-2 -translate-y-1/2 z-20 
                bg-white/80 rounded-full p-2 shadow-xl hover:bg-gray-100 
                transition flex items-center justify-center"
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-700" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
