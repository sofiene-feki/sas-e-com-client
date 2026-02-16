import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import { TbCameraPlus } from "react-icons/tb";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import CustomModal from "../ui/Modal";
import { Input } from "../ui";
import ProductMediaGallery from "../product/ProductMediaGallery";

import {
  createBanner,
  getBanners,
  removeBanner,
} from "../../functions/banner";

export default function Banner() {
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [newSlide, setNewSlide] = useState({
    title: "",
    img: "",
    button: "Discover Selection",
    link: "/",
    preview: "",
    file: null,
  });

  const user = useSelector((state) => state.user.userInfo);
  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const normalizeBannerSrc = (input) => {
    if (!input) return input;
    return input.map((banner) => ({
      ...banner,
      img: banner.img.startsWith("http")
        ? banner.img
        : API_BASE_URL_MEDIA + banner.img,
    }));
  };

  const fetchSlides = useCallback(async () => {
    try {
      setFetching(true);
      const { data } = await getBanners();
      const normalized = normalizeBannerSrc(data);
      setSlides(normalized);
    } catch (err) {
      console.error("❌ Error fetching banners:", err);
    } finally {
      setFetching(false);
    }
  }, [API_BASE_URL_MEDIA]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  // Luxury slow-cycle autoplay
  useEffect(() => {
    if (slides.length <= 1 || open) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSlide.file) return toast.warning("⚠️ Image is required");

    const formData = new FormData();
    formData.append("title", newSlide.title);
    formData.append("button", newSlide.button);
    formData.append("link", newSlide.link);

    if (newSlide.file) {
      formData.append("img", newSlide.file);
    } else {
      formData.append("imgUrl", newSlide.preview); // Send URL if no file (from Universe)
    }

    try {
      setLoading(true);
      const { data } = await createBanner(formData);
      toast.success("✅ Slide added successfully");
      const finalImg = data.img.startsWith("http") ? data.img : API_BASE_URL_MEDIA + data.img;
      setSlides(prev => [...prev, { ...data, img: finalImg }]);
      setNewSlide({ title: "", img: "", button: "Discover Selection", link: "/", preview: "", file: null });
      setOpen(false);
    } catch (err) {
      toast.error("❌ Failed to save slide");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Supprimer le slide "${title}" ?`)) return;
    try {
      setLoading(true);
      await removeBanner(id);
      setSlides(prev => prev.filter(s => s._id !== id));
      toast.success("✅ Slide deleted");
    } catch (err) {
      toast.error("❌ Error deleting banner");
    } finally {
      setLoading(false);
    }
  };

  if (fetching && slides.length === 0) {
    return (
      <div className="w-full h-[600px] bg-neutral-50 animate-pulse flex items-center justify-center">
        <span className="font-ui text-[10px] tracking-[0.4em] uppercase text-neutral-400">Curating Visuals...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[550px] md:h-[550px] bg-neutral-900 overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => (
          index === currentIndex && (
            <motion.div
              key={slide._id || index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* Cinematic Image w/ Ken Burns Effect */}
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover object-center grayscale-[0.1] contrast-[1.1]"
              />

              {/* Luxury Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-4xl"
                >
                  <h2 className="text-white font-editorial text-4xl md:text-7xl lg:text-8xl mb-12 tracking-tighter leading-none drop-shadow-2xl">
                    {slide.title}
                  </h2>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    <Link to={slide.link || "/shop"}>
                      <button className="group relative px-12 py-5 bg-white text-black font-ui text-[10px] tracking-[0.4em] uppercase transition-all duration-700 hover:bg-black hover:text-white border-none shadow-2xl">
                        <span className="relative z-10">{slide.button || "Explore Collection"}</span>
                      </button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="group py-2"
          >
            <div className={`h-[1px] transition-all duration-1000 ${idx === currentIndex ? "w-16 bg-white" : "w-4 bg-white/30 group-hover:bg-white/60"
              }`} />
          </button>
        ))}
      </div>

      {/* Admin Quick Action */}
      {user && (
        <button
          onClick={() => setOpen(true)}
          className="absolute bottom-8 right-8 z-40 p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500"
        >
          <TbCameraPlus className="h-5 w-5" />
        </button>
      )}

      {/* Luxury Admin Modal */}
      <CustomModal
        open={open}
        setOpen={setOpen}
        title="Curate Banner Experience"
        message={
          <div className="space-y-8 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* New Narrative */}
              <div className="space-y-6">
                <h3 className="font-ui text-[10px] tracking-[0.2em] uppercase text-neutral-400 border-b pb-2">New Cinematic Slide</h3>
                <ProductMediaGallery
                  mode="single"
                  media={newSlide.preview ? [{ src: newSlide.preview, type: "image", file: newSlide.file }] : []}
                  selectedMedia={newSlide.preview ? { src: newSlide.preview, type: "image" } : null}
                  onAddMedia={(mediaItem) => {
                    const { file, src } = mediaItem;
                    setNewSlide(p => ({
                      ...p,
                      file: file || null,
                      preview: src
                    }));
                  }}
                  onDeleteMedia={() => setNewSlide(p => ({ ...p, file: null, preview: null }))}
                  isEditable
                  galleryClassName="w-full aspect-video bg-neutral-50 rounded border-2 border-dashed border-neutral-100 flex items-center justify-center"
                />
                <div className="space-y-4">
                  <Input
                    placeholder="Grand Title (e.g. L'Essence de l'Hiver)"
                    value={newSlide.title}
                    onChange={e => setNewSlide(p => ({ ...p, title: e.target.value }))}
                  />
                  <div className="flex gap-4">
                    <Input
                      placeholder="CTA Text"
                      value={newSlide.button}
                      onChange={e => setNewSlide(p => ({ ...p, button: e.target.value }))}
                    />
                    <Input
                      placeholder="Link (e.g. /shop)"
                      value={newSlide.link}
                      onChange={e => setNewSlide(p => ({ ...p, link: e.target.value }))}
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 bg-black text-white font-ui text-[10px] tracking-widest uppercase hover:bg-neutral-800 transition disabled:opacity-50"
                  >
                    {loading ? "Archiving..." : "Publish to Banner"}
                  </button>
                </div>
              </div>

              {/* Composition Gallery */}
              <div className="space-y-4">
                <h3 className="font-ui text-[10px] tracking-[0.2em] uppercase text-neutral-400 border-b pb-2">Active Composition ({slides.length})</h3>
                <div className="grid grid-cols-1 gap-4">
                  {slides.map((s) => (
                    <div key={s._id} className="relative aspect-video overflow-hidden group">
                      <img src={s.img} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" alt="" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <div className="text-center text-white p-4">
                          <p className="font-editorial text-lg mb-1">{s.title}</p>
                          <p className="font-ui text-[8px] uppercase tracking-[0.2em] opacity-60">{s.button} • {s.link}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(s._id, s.title)}
                          className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-md text-white hover:bg-red-500 transition-colors rounded-full"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
      `}</style>
    </div>
  );
}
