import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import rsVideo from "../../assets/rs.mp4";

const SOUND_KEY = "luxury_video_sound_preference";

export default function HomeVideoSection({ title, subtitle, triggerRef }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  // Sync state and handle visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => { });
          setPlaying(true);
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !video.muted;
    video.muted = newMuted;
    setMuted(newMuted);
    localStorage.setItem(SOUND_KEY, String(!newMuted));
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[85vh] bg-black overflow-hidden group">
      {/* Cinematic Background Video */}
      <video
        ref={videoRef}
        src={rsVideo}
        autoPlay
        loop
        playsInline
        muted={muted}
        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
      />

      {/* Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Editorial Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20">
        <div className="max-w-4xl space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-[10px] md:text-xs font-ui tracking-[0.4em] uppercase text-white/70 mb-4 block">
              {subtitle || "Current Vision"}
            </span>
            <h2 className="font-editorial text-4xl md:text-7xl lg:text-8xl text-white leading-none tracking-tight">
              {title}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex items-center gap-6"
          >
            {/* Minimalist Controls */}
            <button
              onClick={togglePlay}
              className="group flex items-center gap-3 text-white"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                {playing ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-1" />}
              </div>
              <span className="font-ui text-[10px] uppercase tracking-widest hidden sm:block">
                {playing ? "Pause Film" : "Play Film"}
              </span>
            </button>

            <button
              onClick={toggleMute}
              className="text-white/60 hover:text-white transition-colors"
            >
              {muted ? <SpeakerXMarkIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator for video section */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
        <div className="w-[1px] h-10 bg-white/50 relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 40] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-white"
          />
        </div>
      </div>
    </section>
  );
}
