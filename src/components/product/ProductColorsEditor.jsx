import React, { useState, useEffect, useRef } from "react";
import { Input } from "../ui";
import { TrashIcon, PlayIcon } from "@heroicons/react/24/outline";
import { TbCameraPlus } from "react-icons/tb";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaRegImage, FaUpload } from "react-icons/fa";
import CustomModal from "../ui/Modal";
import { getAllMedia } from "../../functions/media";

export default function ProductColorsEditor({
  product,
  setProduct,
  handleChangeProduct,
}) {
  const [open, setOpen] = useState(false);
  const [mediaGallery, setMediaGallery] = useState([]);
  const [activeColorIndex, setActiveColorIndex] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getAllMedia()
      .then((res) => setMediaGallery(res.data))
      .catch(console.error);
  }, []);

  const handleRemoveColor = (i) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== i),
    }));
  };

  const handleAddColor = () => {
    setProduct((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), { name: "", value: "", media: [] }],
    }));
  };

  const handleMediaSelection = (data, index = activeColorIndex) => {
    let newMedia = null;

    if (data.target && data.target.files) {
      // Local files
      const files = Array.from(data.target.files);
      if (!files.length) return;

      const newItems = files.map(file => ({
        src: URL.createObjectURL(file),
        alt: file.name,
        type: file.type.includes("video") ? "video" : "image",
        file: file,
      }));

      const updatedColors = [...product.colors];
      updatedColors[index] = {
        ...updatedColors[index],
        media: [...(updatedColors[index].media || []), ...newItems],
      };

      setProduct((prev) => ({ ...prev, colors: updatedColors }));
    } else {
      // Server media
      const updatedColors = [...product.colors];
      updatedColors[index] = {
        ...updatedColors[index],
        media: [...(updatedColors[index].media || []), data],
      };
      setProduct((prev) => ({ ...prev, colors: updatedColors }));
    }
    setOpen(false);
  };

  const handleRemoveMedia = (colorIndex, mediaIndex) => {
    const updatedColors = [...product.colors];
    updatedColors[colorIndex].media = updatedColors[colorIndex].media.filter((_, idx) => idx !== mediaIndex);

    setProduct((prev) => ({
      ...prev,
      colors: updatedColors,
    }));
  };

  return (
    <div className="space-y-6">
      {product.colors?.map((c, i) => (
        <div key={i} className="flex flex-col gap-4 bg-white p-4 border border-neutral-100 transition-all hover:border-neutral-200">
          <div className="flex items-center gap-4">
            <Input
              type="text"
              value={c.name}
              onChange={(e) => handleChangeProduct(e, i, "name", "colors")}
              placeholder="Finish Name (e.g. Onyx)"
              className="flex-1 font-ui text-[10px] tracking-widest uppercase border-neutral-100 focus:border-neutral-900"
            />
            <Input
              type="number"
              value={c.quantity ?? ""}
              onChange={(e) => handleChangeProduct(e, i, "quantity", "colors")}
              placeholder="Stock"
              className="w-20 font-ui text-[10px] tracking-widest border-neutral-100 focus:border-neutral-900"
            />

            <label className="relative flex items-center justify-center">
              <input
                type="color"
                value={c.value || "#000000"}
                onChange={(e) => handleChangeProduct(e, i, "value", "colors")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="w-8 h-8 rounded-full border border-neutral-200 transition-transform active:scale-95"
                style={{ background: c.value || "conic-gradient(from 0deg, #eee, #333)" }}
              />
            </label>

            <button
              onClick={() => handleRemoveColor(i)}
              className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:text-red-500 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Color Specific Media Collection */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-50 mt-2">
            {c.media?.map((m, mIdx) => (
              <div key={mIdx} className="relative w-12 h-16 group">
                {m.type === "video" ? (
                  <div className="w-full h-full bg-black flex items-center justify-center border border-neutral-100">
                    <PlayIcon className="w-4 h-4 text-white opacity-40" />
                  </div>
                ) : (
                  <img src={m.src} alt="" className="w-full h-full object-cover border border-neutral-100" />
                )}
                <button
                  onClick={() => handleRemoveMedia(i, mIdx)}
                  className="absolute -top-1 -right-1 bg-white shadow-sm text-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </div>
            ))}

            <Menu as="div" className="relative">
              <MenuButton className="w-12 h-16 flex items-center justify-center border border-dashed border-neutral-200 hover:border-neutral-900 transition-colors cursor-pointer group">
                <TbCameraPlus className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900" />
              </MenuButton>
              <MenuItems transition className="absolute z-50 top-full left-0 mt-2 w-48 origin-top-left rounded-sm bg-white p-1 shadow-2xl border border-neutral-100 ring-1 ring-black/5 focus:outline-none transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0">
                <MenuItem>
                  <button
                    onClick={() => {
                      setActiveColorIndex(i);
                      setOpen(true);
                    }}
                    className="group flex w-full items-center gap-3 px-3 py-3 font-ui text-[9px] tracking-widest uppercase text-neutral-600 hover:bg-neutral-50 transition"
                  >
                    <FaRegImage className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
                    Universe Gallery
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => {
                      setActiveColorIndex(i);
                      fileInputRef.current?.click();
                    }}
                    className="group flex w-full items-center gap-3 px-3 py-3 font-ui text-[9px] tracking-widest uppercase text-neutral-600 hover:bg-neutral-50 transition border-t border-neutral-50"
                  >
                    <FaUpload className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
                    Local Archive
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddColor}
        className="w-full py-4 border border-dashed border-neutral-200 font-ui text-[10px] tracking-[0.3em] uppercase text-neutral-400 hover:border-neutral-900 hover:text-neutral-900 transition-all"
      >
        + Add Narrative Variant
      </button>

      {/* Shared Universe Modal */}
      <CustomModal
        open={open}
        setOpen={setOpen}
        title="Archive Selections"
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

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleMediaSelection}
        className="hidden"
      />
    </div>
  );
}
