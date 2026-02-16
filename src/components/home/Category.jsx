import React from "react";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { NextArrow, PrevArrow } from "../ui";

const categories = [
  {
    name: "Women",
    image: "",
    link: "/category/femme",
  },
  {
    name: "Men",
    image: "",
    link: "/category/men",
  },
  {
    name: "Kids",
    image: "",
    link: "/category/kids",
  },
];
// ✅ Arrows

function MobileNextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-2 -translate-y-1/2 z-20 
                 bg-white rounded-full p-4 shadow-xl hover:bg-gray-100 
                 transition flex items-center justify-center"
    >
      <ChevronRightIcon className="w-5 h-5 text-gray-700" />
    </button>
  );
}

function MobilePrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-2 -translate-y-1/2 z-20 
                 bg-white rounded-full p-4 shadow-xl hover:bg-gray-100 
                 transition flex items-center justify-center"
    >
      <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
    </button>
  );
}

export default function Category() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect window size on mount and resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop slider settings
  const desktopSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  // Mobile slider settings
  const mobileSettings = {
    dots: false, // Facebook style usually doesn't use dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <MobileNextArrow />,
    prevArrow: <MobilePrevArrow />,
  };

  return (
    <section className="mx-auto md:mx-10  px-0 py-0">
      <h2 className="text-3xl md:text-4xl font-serif text-center my-4">
        Shop by Category
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.slice(0, 2).map((cat) => (
          <Link
            key={cat.name}
            to={cat.link}
            className="relative group overflow-hidden  shadow-lg"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full md:h-[700px] h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-500"
            />

            {/* Top blur title */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/30 backdrop-blur-md px-2 py-1 ">
              <h3 className="text-white  font-semibold">{cat.name}</h3>
            </div>

            {/* Bottom blur button */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <button className="bg-white/30 backdrop-blur-md text-white px-6 py-2  border border-white hover:bg-white/50 transition">
                Shop {cat.name}
              </button>
            </div>
          </Link>
        ))}

        {/* Kids - Full width */}
        <Link
          to={categories[2].link}
          className="relative group overflow-hidden  shadow-lg md:col-span-2"
        >
          <img
            src={categories[2].image}
            alt={categories[2].name}
            className="w-full md:h-[700px] h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-500"
          />

          {/* Top blur title */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/30 backdrop-blur-md text-center px-2 py-1 ">
            <h3 className="text-white  font-semibold">{categories[2].name}</h3>
          </div>

          {/* Bottom blur button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <button className="bg-white/30 backdrop-blur-md text-white px-6 py-2  border border-white hover:bg-white/50 transition">
              Shop {categories[2].name}
            </button>
          </div>
        </Link>
      </div>
    </section>
  );
}
