import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from "../ui";

import { getPacks } from "../../functions/pack";
import Pack from "../product/Pack";

export default function Packs() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const normalizeMediaSrc = (input) => {
    if (!input) return input;

    // Handle arrays (packs or products)
    if (Array.isArray(input)) {
      return input.map((item) => normalizeMediaSrc(item));
    }

    // Normalize media if exists
    const normalizedMedia = input.media
      ? input.media.map((m) => ({
          ...m,
          src: m.src.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
        }))
      : [];

    // Also normalize products inside a pack
    const normalizedProducts = input.products
      ? normalizeMediaSrc(input.products)
      : [];

    return {
      ...input,
      media: normalizedMedia,
      products: normalizedProducts,
    };
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        const { data } = await getPacks(); // data is already an array of packs
        const normalizedPacks = normalizeMediaSrc(data || []);
        setPacks(normalizedPacks);
        console.log("✅ packs fetched and normalized:", normalizedPacks);
      } catch (err) {
        console.error("❌ Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const desktopSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const mobileSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    centerMode: false,
  };

  return (
    <div className="mx-auto md:mx-18  px-0 py-10 ">
      <h2 className="text-3xl md:text-4xl font-semiBold tracking-tight text-gray-900 my-4 text-center">
        Nos pack
      </h2>

      <Slider
        className="shadow-lg md:shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white md:border md:border-gray-200"
        {...(isMobile ? mobileSettings : desktopSettings)}
      >
        {packs.map((product) => (
          <div key={product._id} className="py-3 px-2">
            <Pack product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
