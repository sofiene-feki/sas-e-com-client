import React from "react";
import ProductMediaGallery from "../product/ProductMediaGallery";
import { Input } from "../ui";

export default function CreateCategoryCard({
  name,
  setName,
  selectedMedia,
  setSelectedMedia,
  onAddMedia,
  onDeleteMedia,
  onSubmit,
  loading,
}) {
  return (
    <div className="relative bg-white py-3 border border-gray-50 px-6 rounded-lg overflow-hidden shadow-md">
      {/* Media uploader */}
      <div className="border border-gray-300 rounded-md shadow-sm mb-3">
        <ProductMediaGallery
          mode="single"
          media={selectedMedia ? [selectedMedia] : []}
          selectedMedia={selectedMedia}
          onSelectMedia={setSelectedMedia}
          onAddMedia={onAddMedia}
          onDeleteMedia={onDeleteMedia}
          isEditable
          setSelectedMedia={setSelectedMedia}
          galleryClassName="flex flex-col items-center justify-center w-full h-36 bg-gray-50 border-b border-dashed border-gray-300 rounded-b-md"
        />
      </div>

      {/* Category name input */}
      <div className="mb-3">
        <Input
          label="Category name"
          name="Title"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Luxury Bags"
          className="border w-full rounded-md px-2 py-1"
        />
      </div>

      {/* Submit button */}
      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-2 text-sm font-semibold tracking-widest uppercase rounded-md shadow border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "+ Create Category"}
      </button>
    </div>
  );
}
