import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getNewArrivals } from "../../functions/product";
import Product from "../product/Product";
import { LoadingProduct } from "../ui";
import { Link } from "react-router-dom";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const normalizeMediaSrc = (input) => {
    if (!input) return input;
    if (Array.isArray(input)) {
      return input.map((product) => normalizeMediaSrc(product));
    }
    if (!input.media) return input;
    const normalizedMedia = input.media.map((m) => ({
      ...m,
      src: m.src.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
    }));
    return { ...input, media: normalizedMedia };
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const { data } = await getNewArrivals("all");
        const normalizedProducts = normalizeMediaSrc(data.products || []);
        setProducts(normalizedProducts.slice(0, 4));
      } catch (err) {
        console.error("❌ Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="w-full bg-neutral-50 py-10 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* ===== SECTION HEADER ===== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] md:text-xs font-ui tracking-[0.4em] uppercase text-neutral-400 mb-4 block">
              Latest from the Studio
            </span>
            <h2 className="font-editorial text-4xl md:text-6xl text-neutral-900 mb-4 tracking-tight">
              New Arrivals
            </h2>
            <p className="font-body text-neutral-500 text-sm md:text-base leading-relaxed">
              Explore our latest creations, where contemporary design meets artisanal precision.
            </p>
          </div>
          <Link
            to="/shop"
            className="group flex items-center gap-4 font-ui text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-300"
          >
            <span className="border-b border-neutral-200 pb-1 group-hover:border-black transition-colors">See the Gallery</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-lg"
            >→</motion.span>
          </Link>
        </div>

        {/* ===== PRODUCTS GRID ===== */}
        {loading ? (
          <LoadingProduct length={4} cols={4} />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
          >
            {products.map((product) => (
              <motion.div key={product._id || product.slug} variants={itemVariants}>
                <Product product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
