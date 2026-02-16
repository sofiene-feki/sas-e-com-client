import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { searchProducts } from "../../functions/product";

export default function Search({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const normalizeMediaSrc = (input) => {
    if (!input) return input;
    if (Array.isArray(input))
      return input.map((item) => normalizeMediaSrc(item));
    if (typeof input !== "object" || !input.media) return input;

    const normalizedMedia = Array.isArray(input.media)
      ? input.media.map((m) => ({
          ...m,
          src: m?.src?.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
        }))
      : [];

    return { ...input, media: normalizedMedia };
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await searchProducts({ query });
      const normalizedResults = normalizeMediaSrc(data.products || []);
      setResults(normalizedResults);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => handleSearch(), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="w-full max-w-md bg-white h-full p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          className="flex-1 px-3 py-2 text-sm border bg-gray-100 border-gray-300 rounded shadow focus:outline-none focus:ring focus:ring-indigo-300"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <svg
              className="animate-spin h-6 w-6 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        ) : results.length > 0 ? (
          results.map((product) => {
            const imageMedia = product.media.find((m) => m.type === "image");
            const imageSrc = imageMedia ? imageMedia.src : "/placeholder.png";

            return (
              <Link
                to={`/product/${product.slug}`}
                key={product._id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded transition"
                onClick={onClose} // close modal when selecting product
              >
                <img
                  src={imageSrc}
                  alt={imageMedia?.alt || product.Title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {product.Title}
                  </span>
                  {product.Price && (
                    <span className="text-sm text-gray-500">
                      {product.Price} DT
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="px-3 py-2 text-gray-500 text-sm">
            Aucun résultat trouvé
          </div>
        )}
      </div>
    </div>
  );
}
