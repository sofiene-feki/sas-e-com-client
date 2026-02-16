import React, { useState, useEffect } from "react";
import { getProducts as apiGetProducts } from "../../../functions/product";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ProductMediaGallery from "../../product/ProductMediaGallery";

export default function PackageConfig() {
  const [products, setProducts] = useState([]);
  const [currentPick, setCurrentPick] = useState("");            // selected product _id in picker
  const [selectedProducts, setSelectedProducts] = useState([]);  // [{ id, title, color, sizes }]
  const [price, setPrice] = useState("");
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // pack-level media
  const [media, setMedia] = useState([]);                        // [{src, alt, type, file?}]
  const [selectedMedia, setSelectedMedia] = useState(null);

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await apiGetProducts();
        const list = Array.isArray(data) ? data : data?.products;
        setProducts(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Erreur lors du chargement des produits", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getProduct = (id) => products.find((p) => p._id === id);

  // add product; store full colors array (as provided) and all size names (array of strings)
  const addCurrentPick = () => {
    if (!currentPick) return;
    const p = getProduct(currentPick);
    if (!p) return;

    const sizeNames = Array.isArray(p.sizes)
      ? p.sizes.map((s) => s?.name).filter(Boolean)
      : [];

    const colors = Array.isArray(p.colors) ? p.colors : [];

    setSelectedProducts((prev) => {
      if (prev.some((it) => it.id === p._id)) return prev; // avoid duplicates
      return [
        ...prev,
        {
          id: p._id,
          title: p.Title || p.title || p.name || "Produit",
          color: colors,     // keep as-is (array of color objects)
          sizes: sizeNames,  // array of size names
        },
      ];
    });

    setCurrentPick("");
  };

  const removePicked = (id) => {
    setSelectedProducts((prev) => prev.filter((it) => it.id !== id));
  };

  // media handlers
  const handleFileUpload = (mediaItem) => {
    let newMedia = mediaItem;

    // Safety check if somehow an event slips through
    if (mediaItem.target && mediaItem.target.files) {
      const file = mediaItem.target.files[0];
      const url = URL.createObjectURL(file);
      newMedia = {
        src: url,
        alt: file.name,
        type: file.type.includes("video") ? "video" : "image",
        file,
      };
    }

    setMedia((prev) => [...prev, newMedia]);
    setSelectedMedia(newMedia);
  };

  const deleteMedia = (idx) => {
    setMedia((prev) => {
      const removed = prev[idx];
      const next = prev.filter((_, i) => i !== idx);

      setSelectedMedia((sel) => {
        if (!sel) return next[0] || null;
        if (removed && sel.src === removed.src) return next[0] || null;
        return sel;
      });

      return next;
    });
  };

  const remainingOptions = products.filter(
    (p) => !selectedProducts.some((it) => it.id === p._id)
  );

  const canSubmit =
    titre.trim().length > 0 &&
    selectedProducts.length > 0 &&
    Number(price) > 0;

  const handleAddPack = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      title: titre.trim(),
      description: description.trim(),
      products: selectedProducts.map(({ title, color, sizes }) => ({
        title,
        color,   // array (as stored)
        sizes,   // array of size names
      })),
      price: Number(price),
      media: selectedMedia, // you’re currently sending only the selected item
    };

    try {
      setLoading(true);
      // TODO: await createPack(payload)
      console.log("Creating pack with:", payload);

      // reset
      setTitre("");
      setDescription("");
      setPrice("");
      setSelectedProducts([]);
      setCurrentPick("");
      setMedia([]);
      setSelectedMedia(null);
    } catch (err) {
      console.error("Erreur lors de l'ajout du pack", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h2 className="text-lg font-bold">Gestion des packs</h2>

      <form onSubmit={handleAddPack} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Titre du pack
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            placeholder="Entrer le titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
        </div>

        {/* Sélecteur produit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ajouter des produits
          </label>
          <div className="flex gap-2 mt-1">
            <select
              value={currentPick}
              onChange={(e) => setCurrentPick(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2"
              disabled={loading || remainingOptions.length === 0}
            >
              <option value="">
                {remainingOptions.length
                  ? "-- Choisir un produit --"
                  : "Aucun produit restant"}
              </option>
              {remainingOptions.map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.Title || prod.title || prod.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="bg-[#87a736] text-white px-4 py-2 rounded shadow-sm disabled:opacity-50"
              onClick={addCurrentPick}
              disabled={!currentPick}
            >
              add prod
            </button>
          </div>
        </div>

        {/* Produits sélectionnés */}
        {selectedProducts.length > 0 && (
          <div className="space-y-3">
            {selectedProducts.map((it) => (
              <div
                key={it.id}
                className="flex md:flex-row md:items-center md:justify-between gap-3 bg-gray-50 p-3 rounded-lg"
              >
                <div className="font-medium">{it.title}</div>
                <button
                  type="button"
                  onClick={() => removePicked(it.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                  title="Retirer"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Prix */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prix du pack (TND)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            placeholder="Ex: 99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Galerie média */}
        <ProductMediaGallery
          media={media}
          selectedMedia={selectedMedia}
          onSelectMedia={setSelectedMedia}
          onAddMedia={handleFileUpload}
          onDeleteMedia={deleteMedia}
          isEditable={true}   // boolean (not string)
        />

        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Ajout..." : "Ajouter le pack"}
        </button>
      </form>
    </div>
  );
}
