import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  PlayIcon,
  TrashIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import CustomModal from "../ui/Modal";
import { Input, Textarea } from "../ui";
import {
  createStorySlide,
  deleteStorySlide,
  getStorySlides,
} from "../../functions/storySlide";
import { ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInView } from "react-intersection-observer";

const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

const storySliderSettings = {
  dots: false,
  infinite: false,
  speed: 800,
  cssEase: "cubic-bezier(0.23, 1, 0.32, 1)",
  slidesToShow: 3.5,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <StoryNextArrow />,
  prevArrow: <StoryPrevArrow />,
  responsive: [
    {
      breakpoint: 1536,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1.25,
        centerMode: false,
      }
    }
  ]
};

function StoryNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute -top-12 right-0 flex items-center gap-2 cursor-pointer group z-20"
      onClick={onClick}
    >
      <span className="font-ui text-[10px] tracking-[0.3em] text-neutral-400 group-hover:text-black transition-colors">NEXT</span>
      <div className="flex items-center">
        <div className="w-8 h-px bg-neutral-200 group-hover:bg-black transition-all duration-700" />
        <ChevronRightIcon className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors -ml-1" />
      </div>
    </div>
  );
}

function StoryPrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute -top-12 right-32 flex items-center gap-2 cursor-pointer group z-20"
      onClick={onClick}
    >
      <div className="flex items-center">
        <ChevronLeftIcon className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors -mr-1" />
        <div className="w-8 h-px bg-neutral-200 group-hover:bg-black transition-all duration-700" />
      </div>
      <span className="font-ui text-[10px] tracking-[0.3em] text-neutral-400 group-hover:text-black transition-colors">PREV</span>
    </div>
  );
}

const CreateStoryCard = React.memo(({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group aspect-[9/16] overflow-hidden bg-neutral-50 cursor-pointer border-2 border-dashed border-neutral-200 hover:border-neutral-900 transition-all duration-700 flex flex-col items-center justify-center p-8"
      onClick={onClick}
    >
      <div className="w-16 h-16 rounded-full border border-neutral-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-all duration-500">
        <PlusIcon className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
      </div>
      <div className="text-center">
        <span className="block font-ui text-[10px] tracking-[0.4em] uppercase text-neutral-400 group-hover:text-neutral-900 transition-colors mb-2">Curate</span>
        <h3 className="font-editorial text-lg md:text-xl text-neutral-900 uppercase tracking-tight">New Moment</h3>
      </div>
    </motion.div>
  );
});

const StoryCard = React.memo(({ slide, index, userInfo, onDelete, onClick }) => {
  const videoRef = useRef(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      videoRef.current?.play().catch(() => { });
    } else {
      videoRef.current?.pause();
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.8 }}
      className="relative group aspect-[9/16] overflow-hidden bg-neutral-50 cursor-pointer"
      onClick={onClick}
    >
      <video
        ref={videoRef}
        src={slide.videoUrl}
        muted
        playsInline
        loop
        preload="none"
        className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
      />

      {/* Editorial Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
        <span className="block font-ui text-[9px] tracking-[0.3em] uppercase text-white/60 mb-2">View Narrative</span>
        <h3 className="text-white font-editorial text-sm md:text-base leading-tight uppercase tracking-wide">{slide.title}</h3>
      </div>

      {userInfo && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(slide._id);
          }}
          className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
        >
          <TrashIcon className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
});

function FullscreenReels({ slides, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [muted, setMuted] = useState(true);
  const current = slides[index];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const handleNext = () => index < slides.length - 1 && setIndex(index + 1);
  const handlePrev = () => index > 0 && setIndex(index - 1);

  const onDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.y < -threshold) handleNext();
    else if (info.offset.y > threshold) handlePrev();
  };

  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center touch-none"
    >
      {/* Dismiss */}
      <button onClick={onClose} className="absolute top-8 right-8 text-white/50 z-[110] hover:text-white transition-colors p-2">
        <XMarkIcon className="w-8 h-8" />
      </button>

      {/* Reel Container */}
      <div className="relative h-full w-full max-w-[550px] bg-[#0a0a0a] overflow-hidden flex flex-col">
        <motion.div
          className="relative flex-1"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={onDragEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <video
                src={current.videoUrl}
                autoPlay
                muted={muted}
                playsInline
                loop
                className="w-full h-full object-cover"
              />

              {/* Luxury Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

              {/* Text Content */}
              <div className="absolute inset-x-0 bottom-0 p-10 pb-20 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <span className="text-[10px] font-ui tracking-[0.4em] uppercase text-white/40 mb-3 block">Archive Moment</span>
                  <h2 className="font-editorial text-3xl md:text-4xl mb-4 tracking-tight leading-tight">{current.title}</h2>
                  <p className="font-body text-xs md:text-sm text-white/60 line-clamp-3 leading-relaxed mb-8 max-w-[85%]">
                    {current.description}
                  </p>

                  {current.cta && (
                    <a
                      href={current.link}
                      className="inline-block px-6 py-3 border border-white/20 text-[10px] font-ui tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500"
                    >
                      {current.cta}
                    </a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Side Controls */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center z-50">
          <button
            onClick={() => setMuted(!muted)}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            {muted ? <SpeakerXMarkIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Indicators */}
        <div className="absolute top-10 inset-x-0 px-10 flex gap-2 z-50">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 transition-all duration-500 ${i === index ? "bg-white" : "bg-white/20"}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Helper Controls */}
      <div className="fixed inset-y-0 right-10 hidden xl:flex flex-col justify-center gap-6">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white disabled:opacity-20 hover:bg-white/10 transition-colors"
        >
          <ChevronUpIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          disabled={index === slides.length - 1}
          className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white disabled:opacity-20 hover:bg-white/10 transition-colors"
        >
          <ChevronDownIcon className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Story() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [slides, setSlides] = useState([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [newSlide, setNewSlide] = useState({
    title: "",
    description: "",
    cta: "",
    link: "",
    video: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (newSlide.video) {
      const url = URL.createObjectURL(newSlide.video);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [newSlide.video]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getStorySlides();
        const data = (res.data || []).map(s => ({
          ...s,
          videoUrl: s.videoUrl?.startsWith('http')
            ? s.videoUrl
            : `${API_BASE_URL_MEDIA}/${s.videoUrl?.replace(/\\/g, "/")}`
        }));
        setSlides(data);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newSlide.video) return alert("Select a video");
      const formData = new FormData();
      formData.append("title", newSlide.title);
      formData.append("description", newSlide.description);
      formData.append("cta", newSlide.cta || "");
      formData.append("link", newSlide.link || "");
      formData.append("video", newSlide.video);
      await createStorySlide(formData);
      setOpen(false);
      const res = await getStorySlides();
      setSlides(res.data || []);
      setNewSlide({ title: "", description: "", cta: "", link: "", video: null });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm("Delete this story?")) return;
    try {
      await deleteStorySlide(slideId);
      setSlides(prev => prev.filter(s => s._id !== slideId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] md:text-xs font-ui tracking-[0.4em] uppercase text-neutral-400 mb-4 block">
              The Living Archive
            </span>
            <h2 className="font-editorial text-4xl md:text-6xl text-neutral-900 mb-4">
              Moments of Elegance
            </h2>
            <p className="font-body text-neutral-500 text-sm md:text-base leading-relaxed">
              Experience the craftsmanship and stories behind our curated collections through cinematic vignettes.
            </p>
          </div>
        </div>

        {/* Stories Slider */}
        <div className="story-slider-container">
          <Slider {...storySliderSettings}>
            {userInfo && (
              <div className="px-2 md:px-3">
                <CreateStoryCard onClick={() => setOpen(true)} />
              </div>
            )}
            {slides.map((slide, i) => (
              <div key={slide._id} className="px-2 md:px-3">
                <StoryCard
                  slide={slide}
                  index={i}
                  userInfo={userInfo}
                  onDelete={handleDelete}
                  onClick={() => {
                    setStartIndex(i);
                    setFullscreen(true);
                  }}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <style jsx global>{`
        .story-slider-container .slick-list {
          overflow: visible;
          padding: 0 !important;
        }
        .story-slider-container .slick-track {
          display: flex !important;
          gap: 0;
        }
        .story-slider-container .slick-slide {
          height: auto !important;
        }
      `}</style>

      <AnimatePresence>
        {fullscreen && (
          <FullscreenReels
            slides={slides}
            startIndex={startIndex}
            onClose={() => setFullscreen(false)}
          />
        )}
      </AnimatePresence>

      <CustomModal
        open={open}
        setOpen={setOpen}
        title="Create Story Vignette"
        message={
          <div className="p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-[9/16] bg-neutral-50 rounded-lg flex items-center justify-center border border-dashed border-neutral-200 relative overflow-hidden group">
                {previewUrl ? (
                  <video src={previewUrl} className="w-full h-full object-cover" controls />
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                      <PlayIcon className="w-5 h-5 text-neutral-400" />
                    </div>
                    <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                      Upload Campaign Film
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={e => setNewSlide({ ...newSlide, video: e.target.files[0] })}
                />
              </div>
              <div className="space-y-6">
                <Input label="Moment Title" placeholder="Ethereal Summer" value={newSlide.title} onChange={e => setNewSlide({ ...newSlide, title: e.target.value })} />
                <Textarea label="Narrative" placeholder="Describe the essence of this moment..." value={newSlide.description} onChange={e => setNewSlide({ ...newSlide, description: e.target.value })} />
                <button
                  onClick={handleSubmit}
                  className="w-full py-5 bg-black text-white font-ui text-[10px] tracking-[0.4em] uppercase hover:bg-neutral-800 transition shadow-2xl"
                >
                  Publish Archive Moment
                </button>
              </div>
            </div>
          </div>
        }
      />
    </section>
  );
}
