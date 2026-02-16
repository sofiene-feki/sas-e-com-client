import React, { useEffect, useMemo, useRef, useState } from "react";
import { TbCameraPlus } from "react-icons/tb";
import { TrashIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaRegImage, FaUpload } from "react-icons/fa";
import Slider from "react-slick";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

import CustomModal from "../ui/Modal";
import HorizontalSlider from "../ui/HorizontalSlider";
import { getAllMedia } from "../../functions/media";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductMediaGallery({
  media = [],
  selectedMedia,
  onSelectMedia,
  onAddMedia,
  onDeleteMedia,
  isEditable = false,
  galleryClassName = "",
  setSelectedMedia,
  mode = "multiple", // "single" | "multiple"
}) {
  /* ---------------------------------- */
  /* Helpers */
  /* ---------------------------------- */
  const safeMedia = Array.isArray(media) ? media : [];
  const isSingle = mode === "single";

  /* ---------------------------------- */
  /* Refs / State */
  /* ---------------------------------- */
  const fileInputRef = useRef(null);
  const sliderRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [mediaGallery, setMediaGallery] = useState([]);

  /* ---------------------------------- */
  /* Effects */
  /* ---------------------------------- */
  useEffect(() => {
    getAllMedia()
      .then((res) => setMediaGallery(res.data))
      .catch(console.error);
  }, []);

  /* ---------------------------------- */
  /* Media Logic */
  /* ---------------------------------- */
  const sliderData = useMemo(() => {
    if (isSingle) {
      if (selectedMedia) return [selectedMedia];
      if (safeMedia.length > 0) return [safeMedia[0]];
      return [];
    }
    if (!selectedMedia) return safeMedia;

    return [
      selectedMedia,
      ...safeMedia.filter((m) => m.src !== selectedMedia.src),
    ];
  }, [safeMedia, selectedMedia, isSingle]);

  const activeMedia = isSingle ? (sliderData[0] || null) : selectedMedia;

  useEffect(() => {
    if (!isSingle && sliderRef.current && selectedMedia) {
      sliderRef.current.slickGoTo(0);
    }
  }, [selectedMedia, isSingle]);

  /* ---------------------------------- */
  /* Actions */
  /* ---------------------------------- */
  const handleSingleClick = () => {
    if (!isEditable) return;
    fileInputRef.current?.click();
  };

  const handleMediaSelection = (data) => {
    let newMedia = null;

    if (data.target && data.target.files) {
      // Local file
      const file = data.target.files[0];
      if (!file) return;
      newMedia = {
        src: URL.createObjectURL(file),
        file: file,
        type: file.type.includes("video") ? "video" : "image",
        alt: file.name
      };
    } else {
      // Server media (Universe)
      newMedia = data;
    }

    if (isSingle) {
      setSelectedMedia(newMedia);
    } else {
      onAddMedia(newMedia);
      onSelectMedia?.(newMedia);
    }
    setOpen(false);
  };

  /* ---------------------------------- */
  /* Slider Settings */
  /* ---------------------------------- */
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,

    appendDots: (dots) => {
      const total = dots.length;
      const current =
        dots.findIndex((dot) => dot.props.className?.includes("slick-active")) +
        1;

      return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/60 backdrop-blur-sm border border-neutral-100 px-6 py-2">
          <div className="flex items-center gap-8 text-[9px] tracking-[0.4em] font-ui uppercase select-none text-neutral-900">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="hover:opacity-40 transition"
            >
              <GoChevronLeft className="w-4 h-4" />
            </button>

            <span>{current} / {total}</span>

            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="hover:opacity-40 transition"
            >
              <GoChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    },

    beforeChange: (oldIndex, newIndex) => {
      onSelectMedia(sliderData[newIndex]);
    },
  };

  /* ---------------------------------- */
  /* Render Helpers */
  /* ---------------------------------- */
  const MediaAddMenu = ({ children, isPlaceholder = false }) => (
    <Menu as="div" className="relative shrink-0">
      <MenuButton className={isPlaceholder
        ? `${galleryClassName} w-full flex flex-col items-center justify-center cursor-pointer group`
        : "w-20 h-28 border border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 hover:border-neutral-900 transition-colors group"
      }>
        {isPlaceholder ? (
          <>
            <TbCameraPlus className="h-10 w-10 mb-4 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
            <span className="font-ui text-[10px] tracking-[0.4em] uppercase text-neutral-400 group-hover:text-neutral-900 transition-colors">Select Narrative Piece</span>
          </>
        ) : (
          <>
            <TbCameraPlus className="h-5 w-5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
            <span className="text-[8px] tracking-[0.2em] uppercase text-neutral-400 group-hover:text-neutral-900 transition-colors">Add Piece</span>
          </>
        )}
      </MenuButton>

      <MenuItems
        transition
        className="absolute z-[110] mt-2 w-48 origin-top-left rounded-sm bg-white p-1 shadow-2xl border border-neutral-100 ring-1 ring-black/5 focus:outline-none transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        style={{
          bottom: isPlaceholder ? 'auto' : '100%',
          left: 0,
          marginBottom: isPlaceholder ? 0 : '12px',
          marginTop: isPlaceholder ? '12px' : 0
        }}
      >
        <MenuItem>
          <button
            onClick={() => setOpen(true)}
            className="group flex w-full items-center gap-3 px-3 py-3 font-ui text-[9px] tracking-widest uppercase text-neutral-600 hover:bg-neutral-50 transition"
          >
            <FaRegImage className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
            Universe Gallery
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group flex w-full items-center gap-3 px-3 py-3 font-ui text-[9px] tracking-widest uppercase text-neutral-600 hover:bg-neutral-50 transition border-t border-neutral-50"
          >
            <FaUpload className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
            Local Archive
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );

  /* ---------------------------------- */
  /* Render */
  /* ---------------------------------- */
  return (
    <div className="w-full">
      {/* MAIN MEDIA */}
      <div>
        {sliderData.length > 0 ? (
          <>
            {/* Single OR Desktop Media */}
            <div
              className={`relative bg-black rounded-lg ${!isSingle ? "hidden lg:block" : ""
                } ${isSingle && isEditable ? "cursor-pointer hover:opacity-90" : ""
                }`}
            >
              {/* If Single and Editable, use the Menu instead of just click */}
              {isSingle && isEditable ? (
                <Menu as="div" className="relative">
                  <MenuButton className="w-full">
                    {/* Image display */}
                    {activeMedia?.type === "image" ? (
                      <div className="w-full aspect-[4/5] overflow-hidden rounded-lg">
                        <InnerImageZoom
                          src={activeMedia.src}
                          zoomSrc={activeMedia.src}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video overflow-hidden rounded-lg">
                        <video
                          src={activeMedia?.src}
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </MenuButton>
                  <MenuItems transition className="absolute top-4 left-4 z-[110] w-48 origin-top-left rounded-sm bg-white p-1 shadow-2xl border border-neutral-100 ring-1 ring-black/5 focus:outline-none transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0">
                    <MenuItem>
                      <button onClick={() => setOpen(true)} className="group flex w-full items-center gap-3 px-3 py-3 font-ui text-[9px] tracking-widest uppercase text-neutral-600 hover:bg-neutral-50 transition">
                        <FaRegImage className="w-3.5 h-3.5 text-neutral-400" /> Universe Gallery
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button onClick={() => fileInputRef.current?.click()} className="group flex w-full items-center gap-3 px-3 py-3 font-ui text-[9px] tracking-widest uppercase text-neutral-600 hover:bg-neutral-50 transition border-t border-neutral-50">
                        <FaUpload className="w-3.5 h-3.5 text-neutral-400" /> Local Archive
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              ) : (
                <>
                  {/* Standard Display */}
                  {activeMedia?.type === "image" ? (
                    <div className="w-full aspect-[4/5] overflow-hidden rounded-lg">
                      <InnerImageZoom
                        src={activeMedia.src}
                        zoomSrc={activeMedia.src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video overflow-hidden rounded-lg">
                      <video
                        src={activeMedia?.src}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </>
              )}

              {/* DELETE BUTTON (SINGLE MODE) */}
              {isSingle && isEditable && activeMedia && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMedia?.();
                  }}
                  className="absolute top-3 right-3 z-[120] bg-black/60 hover:bg-black text-white rounded-full p-2 transition"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile slider (MULTIPLE ONLY) */}
            {!isSingle && (
              <div className="block lg:hidden pb-12">
                <Slider ref={sliderRef} {...settings}>
                  {sliderData.map((m, i) => (
                    <div key={i} className="outline-none">
                      <div className="relative w-full h-[500px] bg-neutral-50">
                        {m.type === "image" ? (
                          <InnerImageZoom
                            src={m.src}
                            zoomSrc={m.src}
                            fullscreenOnMobile={true}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-black flex items-center justify-center">
                            <video src={m.src} controls className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </>
        ) : (
          <div className="w-full">
            {isEditable ? (
              <MediaAddMenu isPlaceholder={true} />
            ) : (
              <div className={`${galleryClassName} flex flex-col items-center justify-center`}>
                <TbCameraPlus className="h-10 w-10 mb-2 text-gray-400" />
                <p>No media</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* THUMBNAILS (MULTIPLE ONLY) */}
      {!isSingle && (safeMedia.length > 0 || isEditable) && (
        <div className="mt-8">
          <HorizontalSlider scrollAmount={150}>
            {safeMedia.map((item, idx) => (
              <div key={idx} className="relative group shrink-0">
                <button
                  onClick={() => onSelectMedia(item)}
                  className={`w-20 h-28 border transition-all duration-700 overflow-hidden ${selectedMedia?.src === item.src
                    ? "border-neutral-900 shadow-md scale-105"
                    : "border-neutral-100 hover:border-neutral-300"
                    }`}
                >
                  {item.type === "image" ? (
                    <img src={item.src} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <PlayIcon className="h-6 w-6 text-white opacity-40" />
                    </div>
                  )}
                </button>

                {isEditable && (
                  <button
                    onClick={() => onDeleteMedia(idx)}
                    className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm text-neutral-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}

            {/* ADD MEDIA ENTRY */}
            {isEditable && (
              <MediaAddMenu isPlaceholder={false} />
            )}
          </HorizontalSlider>
        </div>
      )}

      {/* MEDIA MODAL */}
      <CustomModal
        open={open}
        setOpen={setOpen}
        title="Select from Universe"
        message={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
            {mediaGallery.map((url, i) => {
              const isVideo = url.match(/\.(mp4|mov|m4v)$/i);
              return (
                <div
                  key={i}
                  className="relative group aspect-[3/4] overflow-hidden bg-neutral-100 cursor-pointer border border-transparent hover:border-neutral-900 transition-all shadow-sm"
                  onClick={() => {
                    handleMediaSelection({
                      src: url,
                      type: isVideo ? "video" : "image",
                      alt: url.split("/").pop()
                    });
                  }}
                >
                  {isVideo ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <video src={url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <PlayIcon className="h-8 w-8 text-white opacity-60" />
                      </div>
                    </div>
                  ) : (
                    <img src={url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 font-ui text-[8px] tracking-widest uppercase bg-white px-3 py-1.5 shadow-xl">Select</span>
                  </div>
                </div>
              );
            })}
          </div>
        }
      />

      {/* FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        hidden
        onChange={handleMediaSelection}
      />
    </div>
  );
}
