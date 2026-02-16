import React from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function CategoryCard({ category, onDelete, onEdit }) {
  const image =  category.image; // support old & new
    const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-md">
        {image ? (
          <img
            src={`${API_BASE_URL_MEDIA}${image}`}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm tracking-wide">
            NO IMAGE
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent transition" />
      </div>

      {/* Content */}
      <div className="px-3 py-2 border-t border-gray-200 rounded-b-md flex items-center justify-between shadow-sm">
        <h4 className="text-sm font-semibold tracking-widest uppercase text-gray-900">
          {category.name}
        </h4>

        {/* Actions */}
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-900 hover:text-white transition"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onDelete}
            className="p-2 rounded-full bg-gray-100 hover:bg-red-600 hover:text-white transition"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
