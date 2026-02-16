import React, { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

import { useSelector } from "react-redux";
import {
  getAllProductTitles,
  getProductBySlug,
  getProductOfTheYear,
  setProductOfTheYear,
} from "../../functions/product";
import { FormatDescription } from "../ui"; // Assuming you have this utility function
import { Link } from "react-router-dom";

export default function SpecialOfferCard() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const distance = new Date("2025-09-31T23:59:59") - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }

    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerId);
  }, []);

  const [titles, setTitles] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // fetch product titles on mount
  useEffect(() => {
    setLoading(true);
    const fetchTitles = async () => {
      try {
        const res = await getAllProductTitles();
        setTitles(res);
      } catch (err) {
        console.error("❌ Error fetching titles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTitles();
  }, []);

  useEffect(() => {
    const fetchProductOfTheYear = async () => {
      setLoading(true);

      try {
        const prod = await getProductOfTheYear();
        setProduct(prod);
        setSelectedSlug(prod.slug); // set default selected
      } catch (error) {
        console.log("⚠️ No product of the year set yet.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductOfTheYear();
  }, []);

  const handleSelect = async (slug) => {
    setLoading(true);

    try {
      setSelectedSlug(slug);

      // get product details
      const productDetails = await getProductBySlug(slug);
      setProduct(productDetails);

      // set as product of the year
      await setProductOfTheYear(slug);
    } catch (err) {
      console.error("❌ Error handling product selection:", err);
    } finally {
      setLoading(false);
    }
  };

  const originalPrice = product?.Price;
  const promotion = product?.promotion || 0; // percentage
  const discountedPrice = +(
    originalPrice -
    (originalPrice * promotion) / 100
  ).toFixed(2);
  const savings = +(originalPrice - discountedPrice).toFixed(2);

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allImages = product?.media || [];

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="h-auto mx-auto md:mx-10 bg-white border border-gray-200 shadow-xl overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-300 relative">
      {/* ✅ Discount Ribbon - gold theme */}
      <div
        className="absolute top-4 left-4 text-white text-xs md:text-sm font-bold py-1 px-3 rounded-md shadow-lg z-10
       bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-[length:200%_200%] animate-gradientMove
       hover:scale-105 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        - {promotion}%
      </div>

      {/* Left Image Section */}
      <>
        <div className="md:w-1/2 grid grid-cols-2 h-80 gap-2">
          {/* Left column with 1 large image */}
          <div className="grid grid-rows-1 gap-2 h-80">
            {allImages.slice(0, 1).map((img, index) => (
              <div
                key={index}
                className="overflow-hidden cursor-pointer"
                onClick={() => openModal(index)}
              >
                <img
                  src={`${API_BASE_URL_MEDIA}${img.src}`}
                  alt={img.alt || product.Title || `Product Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Right column with 2 stacked images */}
          <div className="grid grid-rows-2 gap-2 h-80">
            {allImages.slice(1, 3).map((img, index) => (
              <div
                key={index}
                className="relative overflow-hidden cursor-pointer"
                onClick={() => openModal(index + 1)}
              >
                <img
                  src={`${API_BASE_URL_MEDIA}${img.src}`}
                  alt={img.alt || product.Title || `Product Image ${index + 2}`}
                  className="w-full h-60 object-cover"
                />

                {/* Overlay if more images exist */}
                {index === 1 && allImages.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold">
                    +{allImages.length - 3}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Full-screen Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <button
              className="absolute top-5 right-5 text-white text-3xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>

            {allImages.length > 1 && (
              <>
                <button
                  className="absolute left-5 text-white text-4xl font-bold"
                  onClick={prevImage}
                >
                  &#10094;
                </button>
                <button
                  className="absolute right-5 text-white text-4xl font-bold"
                  onClick={nextImage}
                >
                  &#10095;
                </button>
              </>
            )}

            <img
              src={`${API_BASE_URL_MEDIA}${allImages[currentIndex].src}`}
              alt={allImages[currentIndex].alt || product.Title}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        )}
      </>

      {/* Right Info Section */}
      <div className="md:w-1/2 flex flex-col justify-between p-2 md:p-4">
        {/* Header */}
        <div className="space-y-1 md:space-y-3">
          <div className="flex justify-between items-start">
            {/* Title + Price */}
            <div className="relative space-y-1 md:space-y-2 my-2 md:my-0">
              <h2 className="text-[#c5a23e] font-extrabold text-2xl md:text-4xl tracking-tight">
                Promotion
              </h2>

              {/* Price */}
              {loading ? (
                <div className="mt-4 h-8 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <div className="flex items-end gap-2">
                  <div className="relative flex items-start">
                    <h3 className="text-2xl md:text-4xl font-bold text-[#87a736] leading-none">
                      {discountedPrice}{" "}
                    </h3>
                    <span className="absolute -top-1 right-0 translate-x-full text-sm font-semibold text-gray-700">
                      DT
                    </span>
                  </div>

                  <span className="line-through text-gray-400 text-xl md:ml-0 ml-3 mt-1">
                    {originalPrice}{" "}
                  </span>
                  <span className="text-xs text-[#c5a23e] font-semibold">
                    Économisez {savings} DT
                  </span>
                </div>
              )}
            </div>

            {/* Countdown */}
            <div className="bg-white text-gray-800 px-3 py-2 text-center shadow-lg border border-[#c5a23e]/40 rounded-md">
              <p className="text-xs md:text-base font-medium">
                Reste:{" "}
                <span className="font-semibold">{timeLeft.days} jours</span>
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ClockSquare value={timeLeft.hours} />
                <ClockSquare value={timeLeft.minutes} />
                <ClockSquare value={timeLeft.seconds} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-4 h-8 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          ) : (
            <h3 className="text-lg md:text-xl font-bold text-black">
              {product?.Title}{" "}
            </h3>
          )}

          {loading ? (
            <div className="mt-4 h-18 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          ) : (
            <div>
              <p
                className={`text-gray-600 whitespace-pre-wrap ${
                  expanded ? "" : "line-clamp-3 md:line-clamp-6"
                }`}
                dangerouslySetInnerHTML={{
                  __html: FormatDescription(product?.Description || ""),
                }}
              />
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[#c5a23e] font-semibold hover:underline"
              >
                {expanded ? "Afficher moins" : "Afficher plus ..."}
              </button>
            </div>
          )}
        </div>

        {/* CTA */}
        {user ? (
          <select
            onChange={(e) => handleSelect(e.target.value)}
            value={selectedSlug}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400
           focus:border-[#87a736] focus:ring-2 focus:ring-[#87a736] focus:outline-none
           transition mb-4"
          >
            <option value="">-- Choose a product --</option>
            {titles.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.Title}
              </option>
            ))}
          </select>
        ) : (
          <Link to={`product/${product?.slug}`} className="block w-full">
            <button
              className="w-full flex items-center justify-center gap-3 md:mt-0 mt-2 px-6 py-2 text-white text-lg font-bold rounded-lg shadow-lg 
          bg-gradient-to-r from-[#87a736] to-[#6d8f2e]
          hover:scale-105 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-[#c5a23e]/50"
              aria-label="Acheter Medico Pillow"
            >
              <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              Acheter Maintenant
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

function ClockSquare({ label, value }) {
  const paddedValue = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="w-6 h-6 md:h-8 md:w-8 bg-gray-800 shadow-lg text-white rounded-md flex items-center justify-center font-mono font-bold text-md md:text-lg select-none">
        {paddedValue}
      </div>
      <span className="text-xs text-white">{label}</span>
    </div>
  );
}
