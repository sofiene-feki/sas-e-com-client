import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineX,
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import ProductMediaGallery from "../components/product/ProductMediaGallery";
import { FaShippingFast } from "react-icons/fa";
import { createPack, getPack, removePack, updatePack } from "../functions/pack";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cart/cartSlice";
import { openCart } from "../redux/ui/cartDrawer";
import { getAllProductTitles } from "../functions/product";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { Input, Textarea } from "../components/ui";
import { FormatDescription } from "../components/ui"; // Assuming you have this utility function
import PackInfoForm from "../components/product/PackInfoForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PackDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.userInfo);

  const modeFromState = location.state?.mode || "view";
  const [currentMode, setCurrentMode] = useState(modeFromState);
  const isEdit = currentMode === "edit";
  const isView = currentMode === "view";
  const isCreate = currentMode === "create";

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const emptyPack = {
    title: "",
    description: "",
    category: "",
    products: [], // will hold [{ _id, Title, slug, colors, sizes }]
    price: 0,
    media: [],
  };

  const [pack, setPack] = useState(isCreate ? emptyPack : null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({});

  const handleColorSelect = (productId, color) => {
    setSelections((prev) => ({
      ...prev,
      [pack._id]: {
        ...prev[pack._id],
        [productId]: {
          ...prev[pack._id]?.[productId],
          color,
        },
      },
    }));
  };

  const handleSizeSelect = (productId, size) => {
    setSelections((prev) => ({
      ...prev,
      [pack._id]: {
        ...prev[pack._id],
        [productId]: {
          ...prev[pack._id]?.[productId],
          size,
        },
      },
    }));
  };

  // gallery
  const [selectedMedia, setSelectedMedia] = useState(null);

  // per-product user choices in VIEW mode
  // { [idx]: { color: <colorObj|null>, size: <string|null> } }
  const dispatch = useDispatch();

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

    setPack((prev) => ({ ...prev, media: [...(prev.media || []), newMedia] }));
    setSelectedMedia(newMedia);
  };

  const deleteMedia = (idx) => {
    const updated = (pack.media || []).filter((_, i) => i !== idx);
    setPack((prev) => ({ ...prev, media: updated }));
    setSelectedMedia(updated[0] || null);
  };

  const handleBasicChange = (key, value) => {
    setPack((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      const formData = new FormData();
      formData.append("title", pack.title);
      formData.append("price", pack.price);
      formData.append("description", pack.description);
      formData.append("products", JSON.stringify(pack.products));
      formData.append("category", pack.category);

      if (pack.media && pack.media.length > 0) {
        pack.media.forEach((m) => {
          if (m.file) {
            formData.append("mediaFiles", m.file);
          } else if (m.src) {
            formData.append("existingMediaUrls[]", m.src);
          }
        });
      }

      const { data } = await createPack(formData);
      console.log("✅ Pack created:", data);
    } catch (err) {
      console.error(
        "❌ Error creating pack:",
        err.response?.data || err.message
      );
    }
  };

  const normalizeMediaSrc = (pack) => {
    if (!pack) return pack;

    // Normalize pack media
    const normalizedMedia = (pack.media || []).map((m) => ({
      ...m,
      src: m.src?.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
    }));

    // Normalize each product's media and colors
    const normalizedProducts = (pack.products || []).map((p) => {
      const normalizedProductMedia = (p.media || []).map((m) => ({
        ...m,
        src: m.src?.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
      }));

      const normalizedColors = (p.colors || []).map((c) => ({
        ...c,
        src: c.src?.startsWith("http") ? c.src : API_BASE_URL_MEDIA + c.src,
      }));

      return { ...p, media: normalizedProductMedia, colors: normalizedColors };
    });

    return { ...pack, media: normalizedMedia, products: normalizedProducts };
  };

  useEffect(() => {
    if (isCreate) {
      setLoading(false);
      return;
    }

    const fetchPack = async () => {
      try {
        setLoading(true);
        const { data } = await getPack(slug); // Axios call to /pack/:slug
        const normalizedPack = normalizeMediaSrc(data);
        setPack(normalizedPack);
        setSelectedMedia(normalizedPack.media?.[0] || "");
        setSelectedTitles(
          normalizedPack?.products.map((p) => ({
            Title: p.Title,
            name: p.name,
          }))
        );
        console.log("✅ Pack fetched:", normalizedPack);
      } catch (error) {
        console.error("❌ Error fetching pack:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPack();
  }, [slug, isCreate, currentMode]);

  // update/edit
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", pack.title || "");
      formData.append("description", pack.description || "");
      formData.append("category", pack.category || "");
      formData.append("price", Number(pack.price) || 0);
      formData.append(
        "products",
        JSON.stringify(pack.products.map((p) => p._id)) // only IDs
      );

      const existingMediaIds = (pack.media || [])
        .filter((m) => m._id && !m.file)
        .map((m) => m._id);

      const existingMediaUrls = (pack.media || [])
        .filter((m) => !m._id && !m.file && m.src)
        .map((m) => m.src);

      existingMediaIds.forEach((id) => formData.append("existingMediaIds[]", id));
      existingMediaUrls.forEach((url) => formData.append("existingMediaUrls[]", url));

      (pack.media || []).forEach(
        (m) => m?.file && formData.append("mediaFiles", m.file)
      );
      console.log(formData);
      await updatePack(slug, formData);

      setCurrentMode("view");
    } catch (err) {
      console.error("❌ Error updating pack:", err);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 3,
    }).format(price || 0);

  // selection helpers (VIEW mode)

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]); // all fetched titles
  const [selectedTitles, setSelectedTitles] = useState([]); // selected values
  // Fetch all product titles once
  useEffect(() => {
    setLoading(true);
    const fetchTitles = async () => {
      try {
        const res = await getAllProductTitles();
        setOptions(res);
      } catch (err) {
        console.error("❌ Error fetching titles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTitles();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await removePack(pack._id);

      // update UI by filtering out deleted product
      //  setProducts((prev) => prev.filter((p) => p.slug !== slug));

      alert("✅ Product deleted successfully");
    } catch (error) {
      console.error("❌ Failed to delete product:", error);
      alert("Failed to delete product");
    }
    navigate("/shop"); // redirect to shop page
  };

  const [error, setError] = useState("");

  const handleAddPackToCart = () => {
    const packSelections = selections[pack._id] || {};

    const selectedProducts = pack.products.map((p) => ({
      productId: p._id,
      name: p.Title,
      selectedColor: packSelections[p._id]?.color?.name ?? null,
      selectedSize: packSelections[p._id]?.size?.name ?? null,
      selectedSizePrice: packSelections[p._id]?.size?.price ?? null,
      hasColorOptions: Array.isArray(p.colors) && p.colors.length > 0,
      hasSizeOptions: Array.isArray(p.sizes) && p.sizes.length > 0,
    }));

    // Only check products that actually have options
    const invalidProduct = selectedProducts.find(
      (p) =>
        (p.hasColorOptions && !p.selectedColor) ||
        (p.hasSizeOptions && !p.selectedSize)
    );

    if (invalidProduct) {
      setError("Veuillez sélectionner toutes les options de votre pack !");
      return; // stop adding to cart
    }

    setError(""); // clear error

    const finalPrice = pack.price;

    dispatch(
      addItem({
        type: "pack",
        productId: pack._id,
        name: pack.title,
        price: finalPrice,
        image: pack.media?.[0]?.src ?? null,
        products: selectedProducts,
      })
    );

    dispatch(openCart());
  };

  return (
    <div className="py-15 md:py-20 px-2">
      {/* Header actions */}
      {user && (
        <div className="flex bg-white max-w-7xl mx-auto items-center justify-between border-b border-gray-200 pb-2 mb-6">
          <h1 className="md:text-xl text-base font-semibold text-gray-800">
            {isCreate ? "Créer un pack" : isEdit ? "Modifier pack" : ""}
          </h1>
          <div className="flex gap-2">
            {isCreate || isEdit ? (
              <>
                <button
                  onClick={() => {
                    if (currentMode === "create") navigate(-1);
                    if (currentMode === "edit") setCurrentMode("view");
                  }}
                  className="flex md:text-base text-xs items-center gap-1 md:px-4 px-2 md:py-2 py-1 
                  bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition
                  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                >
                  <HiOutlineX className="h-5 w-5" />
                  <span>Annuler</span>
                </button>

                <button
                  onClick={() => {
                    if (currentMode === "create") {
                      handleSubmit(); // 👉 create product
                    } else if (currentMode === "edit") {
                      handleUpdate(); // 👉 update product
                    }
                  }}
                  className="flex md:text-base text-xs items-center md:gap-2 gap-1 md:px-4 px-2 md:py-2 py-1 bg-green-50 text-green-600  
                           focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400 
                           rounded-xl shadow-sm hover:bg-green-100 transition"
                >
                  <HiOutlineCheck className="h-5 w-5" />
                  <span>Enregistrer</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentMode("edit")}
                  className="flex items-center md:text-base text-xs md:gap-2 gap-1 md:px-4 px-2 md:py-2 py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400"
                >
                  <HiOutlinePencil className="h-5 w-5" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center md:text-base text-xs md:gap-2 gap-1 md:px-4 px-2 md:py-2 py-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
                >
                  <HiOutlineTrash className="h-5 w-5" />
                  <span>Supprimer</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto lg:flex lg:gap-12">
        {/* LEFT: Media gallery */}
        {loading ? (
          <div className="w-full h-[400px] lg:w-1/2 md:mb-6 lg:mb-0 bg-gray-200 rounded-lg animate-pulse" />
        ) : (
          <div className="w-full lg:w-1/2 ">
            <ProductMediaGallery
              media={pack?.media}
              selectedMedia={selectedMedia}
              onSelectMedia={setSelectedMedia}
              onAddMedia={handleFileUpload}
              onDeleteMedia={deleteMedia}
              isEditable={isEdit || isCreate}
            />
          </div>
        )}

        {/* RIGHT: Pack Info */}
        <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
          {/* Title / Price / Desc */}
          {isEdit || isCreate ? (
            <>
              <PackInfoForm
                pack={pack}
                setPack={setPack}
                options={options}
                setSelectedTitles={setSelectedTitles}
                selectedTitles={selectedTitles}
                handleBasicChange={handleBasicChange}
              />
              {/* <Input
                label="Titre"
                type="text"
                value={pack?.title || ""}
                onChange={(e) => handleBasicChange("title", e.target.value)}
              /> */}

              {/* <Input
                label="Price"
                type="number"
                min="0"
                step="1"
                value={pack?.price || 0}
                onChange={(e) => handleBasicChange("price", e.target.value)}
              /> */}

              {/* <Textarea
                label="Description"
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                value={pack?.description || ""}
                onChange={(e) =>
                  handleBasicChange("description", e.target.value)
                }
              /> */}
            </>
          ) : (
            <>
              <>
                {loading ? (
                  <div className="h-8 mb-2 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
                ) : (
                  <h1 className="text-2xl break-words bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] font-bold text-gray-900 sm:text-3xl mb-2">
                    {pack?.title}
                  </h1>
                )}

                {loading ? (
                  <div className="h-8 mb-2 w-1/4 bg-gray-200 rounded-lg animate-pulse"></div>
                ) : (
                  <p className="text-3xl flex border-b border-gray-200 justify-between font-bold break-words bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] text-gray-900 mb-3">
                    <span>{formatPrice(pack?.price)}</span>
                    <span className="flex items-center gap-2">
                      {pack?.price > 0 ? (
                        <span className="text-green-600 text-xs font-semibold">
                          En stock
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs line-through">
                          Rupture de stock
                        </span>
                      )}
                      <FaShippingFast className="text-[#2c2d84] md:w-6 md:h-6 w-5 h-5 ml-3" />
                      <span className="text-xs text-[#2c2d84]">
                        Livraison rapide
                      </span>
                    </span>
                  </p>
                )}
              </>
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Description :</h3>
                {loading ? (
                  <div className="h-16 md:h-24 mb-2 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                ) : (
                  <p
                    className="text-[16px] text-gray-500 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: FormatDescription(pack?.description || ""),
                    }}
                  />
                )}
              </div>
              {pack?.products?.map((product, pi) => (
                <div
                  key={pi}
                  className="flex flex-col md:flex-row gap-4 items-start mb-6"
                >
                  {/* Media column: only first image */}
                  {product.media?.[0] && (
                    <img
                      src={product.media[0].src}
                      alt={product.media[0].alt || "media"}
                      className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-md"
                    />
                  )}

                  {/* Info column */}
                  <div className="flex-1 flex flex-col gap-2">
                    {/* Product title */}
                    <h2 className="text-lg font-semibold">{product.Title}</h2>

                    {/* Product colors */}
                    {product.colors?.length > 0 && (
                      <div className="flex gap-3">
                        {product.colors.map((c, i) => (
                          <button
                            key={i}
                            className={classNames(
                              selections[pack._id]?.[product._id]?.color
                                ?.name === c.name
                                ? "ring-2 ring-black ring-offset-2"
                                : "ring-1 ring-gray-200",
                              "w-12 h-12 md:w-16 md:h-16 rounded-full border overflow-hidden flex-shrink-0 transition"
                            )}
                            style={{ borderColor: c.value ?? "#000" }}
                            onClick={() => {
                              handleColorSelect(product._id, c);
                              if (c?.src) setSelectedMedia(c); // switch gallery preview to color image
                            }}
                          >
                            {c.src ? (
                              <img
                                src={c.src}
                                alt={c.alt || c.name}
                                className="w-full h-full object-cover rounded-full shadow"
                              />
                            ) : (
                              <div
                                className="w-full h-full rounded-full"
                                style={{ backgroundColor: c.value ?? "#000" }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Product sizes */}
                    {product.sizes?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.sizes.map((s, si) => (
                          <button
                            key={si}
                            onClick={() => handleSizeSelect(product._id, s)}
                            className={classNames(
                              selections[pack._id]?.[product._id]?.size
                                ?.name === s.name
                                ? "border-gray-900 bg-gray-900 text-white" // active
                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-500", // inactive
                              "flex-shrink-0 border rounded-md px-3 py-2 text-sm font-medium transition"
                            )}
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
          {isView && (
            <div className="sticky bottom-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-xl shadow-md md:block p-4">
              {error && (
                <p className="text-red-600 font-medium mb-2 text-center">
                  {error}
                </p>
              )}
              <button
                onClick={handleAddPackToCart}
                className="w-full flex items-center justify-center gap-3 rounded-lg 
                 bg-green-600 px-6 py-3 text-white font-semibold shadow-md 
                 hover:bg-green-700 hover:shadow-lg active:scale-95 transition"
              >
                <ShoppingCartIcon className="h-6 w-6 text-white animate-pulse" />
                Ajouter au panier
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
