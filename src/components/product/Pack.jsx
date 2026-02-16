import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";
import {
  CheckCircleIcon,
  CheckIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { openCart } from "../../redux/ui/cartDrawer";
import { addItem } from "../../redux/cart/cartSlice";
import { useDispatch } from "react-redux";
import Slider from "react-slick";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Pack({ product, productsPerPage, loading }) {
  const view = useSelector((state) => state.view.view);
  const dispatch = useDispatch();
  // Get first image media for preview, fallback to placeholder if none
  const mainMedia = product.media?.find((m) => m.type === "image");
  const imageSrc = mainMedia
    ? mainMedia.src
    : "https://via.placeholder.com/300";
  const imageAlt = mainMedia ? mainMedia.alt : product.name;

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    customPaging: function (i) {
      // Use color from product.colors or default if main image
      if (i === 0) {
        return (
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#ccc", // main image dot color
            }}
          ></div>
        );
      }
      const color = product.colors?.[i - 1]; // Because first dot is main image
      return (
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: color?.value || "#ccc",
          }}
        ></div>
      );
    },
    appendDots: (dots) => (
      <ul style={{ display: "flex", justifyContent: "center" }}>{dots}</ul>
    ),
  };

  // Get first color name or empty string
  const firstColor = product.colors?.[0] || "";
  const firstSize = product.sizes?.[0] || "M";

  const handleAddToCart = () => {
    console.log("Adding to cart:", imageSrc);
    dispatch(
      addItem({
        productId: product._id,
        name: product.Title,
        price: firstSize?.price ?? product.Price,
        image: imageSrc,
        selectedSize: firstSize?.name ?? null,
        selectedSizePrice: firstSize?.price ?? null,
        selectedColor: firstColor?.name ?? null,
        colors: product.colors,
        sizes: product.sizes,
      })
    );
    dispatch(openCart());
  };

  // Default grid view
  return (
    <div>
      {loading ? (
        <div className="group relative pt-2 border border-gray-50 rounded-md cursor-pointer animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-square w-full rounded-t-md bg-gray-100" />

          {/* Info Skeleton */}
          <div className="p-2 bg-white">
            <div className="mt-2 flex justify-between">
              <div className="h-5 w-3/4 bg-gray-100 rounded"></div>
              <div className="h-5 w-1/4 bg-gray-100 rounded"></div>
            </div>

            {/* Button Skeleton */}
            <div className="mt-2 h-10 w-full bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      ) : (
        <div className="group relative border border-[#e5e7eb]/40 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
          {/* Image */}
          <div className="w-full h-64 overflow-hidden relative">
            <img
              src={imageSrc}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4" dir="rtl">
            {/* Title */}
            <h3 className="text-lg font-bold text-[#0d1b2a] mb-3 line-clamp-1">
              {product.title}
            </h3>

            {/* Product list */}
            <ul className="space-y-1 mb-4">
              {product.products.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#d4af37]/20 text-[#d4af37]">
                    <CheckIcon className="w-4 h-4" />
                  </span>
                  <span className="truncate">{p.Title}</span>
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="mb-4">
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f5d76e] text-[#0d1b2a] font-bold text-lg shadow-md">
                {product.price} د.ت
              </span>
            </div>

            {/* CTA */}
            <Link key={product._id} to={`/pack/${product.slug}`}>
              {" "}
              <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f5d76e] text-[#0d1b2a] font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                عرض التفاصيل
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
