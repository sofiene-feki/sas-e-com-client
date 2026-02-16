import React, { useEffect, useState, useMemo } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { products } from "../constants/products";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cart/cartSlice";
import { openCart } from "../redux/ui/cartDrawer";
import {
  HiOutlineX,
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import ProductMediaGallery from "../components/product/ProductMediaGallery";
import ProductInfoForm from "../components/product/ProductInfoForm";
import ProductSizesEditor from "../components/product/ProductSizesEditor";
import ProductColorsEditor from "../components/product/ProductColorsEditor";
import {
  getProduct,
  productCreate,
  removeProduct,
  updateProduct,
} from "../functions/product";
import { FormatDescription } from "../components/ui"; // Assuming you have this utility function
import { FaShippingFast } from "react-icons/fa";
import HorizontalSlider from "../components/ui/HorizontalSlider";
import { useFacebookPixel } from "../hooks/useFacebookPixel";
import { sendServerEvent } from "../functions/fbCapi";
import { BsCartPlus } from "react-icons/bs";
import { BsCartCheck } from "react-icons/bs";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;
const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
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
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
export default function ProductDetails() {
  const { slug } = useParams(); // 👈 make sure your route param is `:slug`
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const { trackViewContent, trackAddToCart } = useFacebookPixel();

  const modeFromState = location.state?.mode || "view"; // default is view
  const [currentMode, setCurrentMode] = useState(modeFromState);

  const isEdit = currentMode === "edit";
  const isView = currentMode === "view";
  const isCreate = currentMode === "create";

  const emptyProduct = {
    Title: "",
    Price: 0,
    promotion: 0,
    Quantity: 0,
    sold: 0,
    Description: "",
    Category: "",
    subCategory: "",
    media: [],
    colors: [],
    sizes: [],
  };

  const [product, setProduct] = useState(isCreate ? emptyProduct : null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (product?._id) {
      trackViewContent(product);

      // Optional: send server-side CAPI for ViewContent
      sendServerEvent({
        eventName: "ViewContent",
        products: [
          {
            _id: product._id,
            quantity: 1,
            price: product.Price,
            category: product.Category?.name || "Unknown",
          },
        ],
        total: product.Price,
      });
    }
  }, [product, trackViewContent]);

  // Normalize both media and colors
  const normalizeMediaSrc = (product) => {
    if (!product) return product;

    const normalizedMedia = (product.media || []).map((m) => ({
      ...m,
      src: m.src.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
    }));

    const normalizedColors = (product.colors || []).map((c) => ({
      ...c,
      src: c.src && !c.src.startsWith("http") ? API_BASE_URL_MEDIA + c.src : c.src,
      media: (c.media || []).map(m => ({
        ...m,
        src: m.src.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src
      }))
    }));

    return { ...product, media: normalizedMedia, colors: normalizedColors };
  };

  useEffect(() => {
    setLoading(true);

    const fetchProduct = async () => {
      try {
        if (!isCreate) {
          const { data } = await getProduct(slug);
          const normalizedProduct = normalizeMediaSrc(data);
          setProduct(normalizedProduct);

          // Default selections
          const initialColor = normalizedProduct.colors?.[0] || null;
          setSelectedColor(initialColor);
          setSelectedMedia(
            initialColor?.media?.[0] ||
            normalizedProduct.media?.[0] ||
            null
          );

          console.log("✅ Product fetched:", normalizedProduct);
        }
      } catch (error) {
        console.error("❌ Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isCreate, slug]);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Keep selections in sync when product changes
  useEffect(() => {
    if (product && !selectedMedia) {
      setSelectedMedia(product?.media?.[0] || null);
      setSelectedColor(product?.colors?.[0] || null);
      setSelectedSize(product?.sizes?.[0] || null);
    }
  }, [product, selectedMedia]);

  // Discovery: Narrative Flow (Color-specific image exclusivity)
  const allMedia = useMemo(() => {
    if (!product) return [];

    // Priority 1: Currently selected color's exclusive collection
    if (selectedColor?.media?.length > 0) {
      return selectedColor.media;
    }

    // Priority 2: Initial state fallback to first color's collection
    if (product.colors?.[0]?.media?.length > 0) {
      return product.colors[0].media;
    }

    // Priority 3: Global product media
    return product.media || [];
  }, [product, selectedColor]);

  const originalPrice = product?.Price;
  const promotion = product?.promotion || 0; // percentage
  const discountedPrice = +(
    originalPrice -
    (originalPrice * promotion) / 100
  ).toFixed(2);
  const savings = +(originalPrice - discountedPrice).toFixed(2);

  // Discovery: Inventory State Matrix
  const isAvailable = useMemo(() => {
    // Priority 1: Size-specific inventory
    if (selectedSize && selectedSize.quantity !== undefined) {
      return Number(selectedSize.quantity) > 0;
    }
    // Priority 2: Color-specific inventory (if sizes are not utilized)
    if ((!product?.sizes || product.sizes.length === 0) && selectedColor && selectedColor.quantity !== undefined) {
      return Number(selectedColor.quantity) > 0;
    }
    // Priority 3: Global product stock
    return Number(product?.Quantity || 0) > 0;
  }, [product, selectedSize, selectedColor]);

  const handleAddToCart = () => {
    const finalPrice = promotion > 0 ? discountedPrice : originalPrice;

    // ✅ Update Redux cart
    dispatch(
      addItem({
        productId: product._id,
        name: product.Title,
        price: finalPrice,
        image: selectedMedia?.src,
        selectedSize: selectedSize?.name ?? null,
        selectedSizePrice: selectedSize?.price ?? null,
        selectedColor: selectedColor?.name ?? null,
        colors: product.colors,
        sizes: product.sizes,
      }),
    );

    dispatch(openCart());

    // ✅ Client-side FB tracking
    trackAddToCart(product, finalPrice);

    // ✅ Server-side CAPI tracking
    sendServerEvent({
      eventName: "AddToCart",
      products: [
        {
          _id: product._id,
          quantity: 1,
          price: finalPrice,
          category: product.Category?.name || "Unknown",
        },
      ],
      total: finalPrice,
    });
  };

  const handleBuyNow = () => {
    const finalPrice = promotion > 0 ? discountedPrice : originalPrice;

    // ✅ Update Redux cart
    dispatch(
      addItem({
        productId: product._id,
        name: product.Title,
        price: finalPrice,
        image: selectedMedia?.src,
        selectedSize: selectedSize?.name ?? null,
        selectedSizePrice: selectedSize?.price ?? null,
        selectedColor: selectedColor?.name ?? null,
        colors: product.colors,
        sizes: product.sizes,
      }),
    );
    navigate("/checkout"); // Redirect to cart page

    // ✅ Client-side FB tracking
    // trackAddToCart(product, finalPrice);

    // ✅ Server-side CAPI tracking
    // sendServerEvent({
    //   eventName: "AddToCart",
    //   products: [
    //     {
    //       _id: product._id,
    //       quantity: 1,
    //       price: finalPrice,
    //       category: product.Category?.name || "Unknown",
    //     },
    //   ],
    //   total: finalPrice,
    // });
  };

  // Media functions
  const handleFileUpload = (mediaItem) => {
    // If it's a raw event (legacy check, though refactored), we handle it
    let newMedia = mediaItem;

    // Safety check if somehow an event slips through
    if (mediaItem.target && mediaItem.target.files) {
      const file = mediaItem.target.files[0];
      const url = URL.createObjectURL(file);
      newMedia = {
        src: url,
        alt: file.name,
        type: file.type.includes("video") ? "video" : "image",
        file: file,
      };
    }

    setProduct((prev) => ({ ...prev, media: [...prev.media, newMedia] }));
    setSelectedMedia(newMedia);
  };

  const deleteMedia = (idx) => {
    const updatedMedia = product.media.filter((_, i) => i !== idx);
    setProduct((prev) => ({ ...prev, media: updatedMedia }));
    setSelectedMedia(updatedMedia[0] || null);
  };

  // Generic handler for colors/sizes
  const handleChangeProduct = (e, idx, key, type) => {
    const value = e.target.value;
    setProduct((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === idx ? { ...item, [key]: value } : item,
      ),
    }));
    console.log(`Updated `, product);
  };

  const handleSubmit = async () => {
    try {
      setActionLoading(true);

      // Aggregation Logic: Sync total quantity with variants
      let totalVariantQuantity = 0;
      if (product.sizes?.length > 0) {
        totalVariantQuantity = product.sizes.reduce((acc, s) => acc + (Number(s.quantity) || 0), 0);
      } else if (product.colors?.length > 0) {
        totalVariantQuantity = product.colors.reduce((acc, c) => acc + (Number(c.quantity) || 0), 0);
      }

      const formData = new FormData();

      // Basic fields
      formData.append("Title", product.Title || "");
      formData.append("Price", Number(product.Price) || 0);
      formData.append("promotion", Number(product.promotion) || 0);
      formData.append("Description", product.Description || "");
      formData.append("Quantity", totalVariantQuantity || product.Quantity || 0);
      formData.append("sold", product.sold || 0);
      if (product.Category) formData.append("Category", product.Category);
      if (product.subCategory) formData.append("subCategory", product.subCategory);

      // Variants: Colors
      if (Array.isArray(product.colors)) {
        const colorsPayload = product.colors.map(c => ({
          name: c.name,
          value: c.value,
          quantity: Number(c.quantity) || 0
        }));
        formData.append("colors", JSON.stringify(colorsPayload));

        product.colors.forEach((c, i) => {
          (c.media || []).forEach(m => {
            if (m.file) formData.append(`colorMediaFiles[${i}]`, m.file);
          });
        });
      }

      // Variants: Sizes
      if (Array.isArray(product.sizes)) {
        formData.append("sizes", JSON.stringify(product.sizes));
      }

      // Media Gallery
      product.media?.forEach((m) => {
        if (m.file) {
          formData.append("mediaFiles", m.file);
        } else if (m.src) {
          // Picking from global gallery
          formData.append("existingMediaUrls[]", m.src);
        }
      });

      await toast.promise(productCreate(formData), {
        pending: `⏳ Création de "${product.Title}"...`,
        success: `✨ "${product.Title}" créé avec succès`,
        error: {
          render({ data }) {
            return data?.response?.data?.error || data?.message || `❌ Échec de la création`;
          },
        },
      });

      navigate("/shop");
    } catch (err) {
      console.error("❌ Product creation error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setActionLoading(true);

      // Aggregation Logic: Sync total quantity with variants
      let totalVariantQuantity = 0;
      if (product.sizes?.length > 0) {
        totalVariantQuantity = product.sizes.reduce((acc, s) => acc + (Number(s.quantity) || 0), 0);
      } else if (product.colors?.length > 0) {
        totalVariantQuantity = product.colors.reduce((acc, c) => acc + (Number(c.quantity) || 0), 0);
      }

      const formData = new FormData();

      // Basic fields
      formData.append("Title", product.Title || "");
      formData.append("Price", Number(product.Price) || 0);
      formData.append("promotion", Number(product.promotion) || 0);
      formData.append("Description", product.Description || "");
      formData.append("Quantity", totalVariantQuantity || product.Quantity || 0);
      formData.append("sold", product.sold || 0);
      if (product.Category) formData.append("Category", product.Category);
      if (product.subCategory)
        formData.append("subCategory", product.subCategory);

      // -------------------------
      // Colors handling
      if (Array.isArray(product.colors)) {
        const colorsPayload = product.colors.map((c) => ({
          _id: c._id,
          name: c.name,
          value: c.value,
          quantity: Number(c.quantity) || 0,
          // Keep track of existing color media IDs if backend supports per-color media management
          existingMedia: (c.media || []).filter(m => m._id && !m.file).map(m => m._id)
        }));

        formData.append("colors", JSON.stringify(colorsPayload));

        // ✅ Multi-file support per color variant
        product.colors.forEach((c, i) => {
          (c.media || []).forEach((m) => {
            if (m.file) {
              formData.append(`colorMediaFiles[${i}]`, m.file);
            }
          });
        });
      }
      if (Array.isArray(product.sizes)) {
        formData.append("sizes", JSON.stringify(product.sizes));
      }
      // -------------------------
      // Media handling
      // -------------------------
      const existingMediaIds = product.media
        .filter((m) => m._id && !m.file)
        .map((m) => m._id);

      const existingMediaUrls = product.media
        .filter((m) => !m._id && !m.file && m.src)
        .map((m) => m.src);

      const newFiles = product.media.filter((m) => m.file); // new uploads

      // Append new media files
      newFiles.forEach((m) => formData.append("mediaFiles", m.file));

      // Append existing media IDs
      existingMediaIds.forEach((id) =>
        formData.append("existingMediaIds[]", id),
      );

      // Append existing media URLs (picked from gallery)
      existingMediaUrls.forEach((url) =>
        formData.append("existingMediaUrls[]", url),
      );

      // -------------------------
      // Optional single files
      // -------------------------
      if (product.imageFile) formData.append("imageFile", product.imageFile);
      if (product.pdf) formData.append("pdf", product.pdf);
      if (product.video) formData.append("video", product.video);

      // -------------------------
      // Debug FormData contents
      // -------------------------
      console.log("📦 FormData contents before sending:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      // -------------------------
      // Send to server
      // -------------------------
      await toast.promise(updateProduct(slug, formData), {
        pending: `⏳ Mise à jour de "${product.Title}"...`,
        success: `✅ "${product.Title}" mis à jour avec succès`,
        error: {
          render({ data }) {
            return (
              data?.response?.data?.error ||
              data?.message ||
              `❌ Échec de la mise à jour de "${product.Title}"`
            );
          },
        },
      });
      setCurrentMode("view");
    } catch (err) {
      console.error(
        "❌ Error updating product:",
        err.response?.data || err.message,
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setActionLoading(true);

      await toast.promise(removeProduct(slug), {
        pending: `⏳ Suppression de "${product.Title}"...`,
        success: `🗑️ "${product.Title}" supprimé avec succès`,
        error: {
          render({ data }) {
            return (
              data?.response?.data?.error ||
              data?.message ||
              `❌ Échec de la suppression de "${product.Title}"`
            );
          },
        },
      });
      // update UI by filtering out deleted product
      //  setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (error) {
      console.error("❌ Failed to delete product:", error);
      alert("Failed to delete product");
    } finally {
      setActionLoading(false);
      navigate("/shop"); // redirect to shop page
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 3,
    }).format(price);
  };

  return (
    <div className="md:py-6 py-0">
      {product && !loading && (
        <Helmet>
          <title>{product.Title} | Clin d'Oeil Store</title>
          <meta
            name="description"
            content={product.Description.slice(0, 160)}
          />

          {/* Open Graph / Social sharing */}
          <meta property="og:title" content={product.Title} />
          <meta
            property="og:description"
            content={product.Description.slice(0, 160)}
          />
          <meta property="og:type" content="product" />
          <meta
            property="og:url"
            content={`https://www.clindoeilstore.com/product/${slug}`}
          />
          <meta
            property="og:image"
            content={selectedMedia?.src || "/logo.png"}
          />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={product.Title} />
          <meta
            name="twitter:description"
            content={product.Description.slice(0, 160)}
          />
          <meta
            name="twitter:image"
            content={selectedMedia?.src || "/logo.png"}
          />

          {/* JSON-LD structured data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.Title,
              image: product.media?.map((m) => m.src) || [],
              description: product.Description,
              sku: product._id,
              brand: {
                "@type": "Brand",
                name: "Clin d'Oeil Store",
              },
              offers: {
                "@type": "Offer",
                url: `https://www.clindoeilstore.com/product/${slug}`,
                priceCurrency: "TND",
                price: discountedPrice,
                availability:
                  product.Quantity > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
              },
            })}
          </script>
        </Helmet>
      )}

      {user && (
        <div className="sticky top-14 z-[60] bg-white/90 backdrop-blur-md border-b border-neutral-100 py-4 px-6 mb-12">
          <div className="max-w-[1700px] mx-auto flex items-center justify-between">
            <h1 className="font-ui text-[9px] tracking-[0.4em] uppercase text-neutral-900">
              {isCreate ? "Curate New Perspective" : isEdit ? "Refine Product Narrative" : "Product Management"}
            </h1>

            <div className="flex gap-4">
              {isCreate || isEdit ? (
                <>
                  <button
                    onClick={() => (currentMode === "create" ? navigate(-1) : setCurrentMode("view"))}
                    className="px-6 py-2 bg-neutral-100 text-neutral-600 font-ui text-[9px] tracking-[0.2em] uppercase hover:bg-neutral-200 transition"
                  >
                    Discard Changes
                  </button>
                  <button
                    onClick={() => (currentMode === "create" ? handleSubmit() : handleUpdate())}
                    className="flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white font-ui text-[9px] tracking-[0.2em] uppercase hover:bg-black transition disabled:opacity-50"
                  >
                    {actionLoading ? <Spinner /> : <HiOutlineCheck className="w-3 h-3" />}
                    {actionLoading ? "Processing..." : "Publish Changes"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentMode("edit")}
                    className="flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white font-ui text-[9px] tracking-[0.2em] uppercase hover:bg-black transition"
                  >
                    <HiOutlinePencil className="w-3 h-3" />
                    Modify Piece
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 font-ui text-[9px] tracking-[0.2em] uppercase hover:bg-red-100 transition"
                  >
                    <HiOutlineTrash className="w-3 h-3" />
                    Remove Archive
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-[1700px] mx-auto px-4 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

          {/* LEFT: Media Composition (Vertical stack on desktop) */}
          <div className="w-full lg:w-[65%] order-2 lg:order-1">
            {loading ? (
              <div className="aspect-[3/4] bg-neutral-100 animate-pulse rounded-sm" />
            ) : (
              <div className="space-y-6">
                {/* Desktop View: Artistic Scroll */}
                <div className="hidden lg:flex flex-col gap-6">
                  {allMedia.map((m, idx) => (
                    <div
                      key={idx}
                      id={`media-${idx}`}
                      className="w-full bg-neutral-50 overflow-hidden"
                    >
                      {m.type === "image" ? (
                        <InnerImageZoom
                          src={m.src}
                          zoomSrc={m.src}
                          className="w-full object-cover transition-transform duration-[3000ms] hover:scale-105"
                        />
                      ) : (
                        <video src={m.src} controls className="w-full" />
                      )}
                    </div>
                  ))}

                  {/* Unified Media Addition for Admin */}
                  {(isEdit || isCreate) && (
                    <div className="w-full pt-8 mt-8 border-t border-neutral-100 animate-in fade-in duration-1000">
                      <h4 className="font-ui text-[10px] tracking-[0.4em] uppercase text-neutral-400 mb-8 text-center italic">Gallery Composition</h4>
                      <ProductMediaGallery
                        media={product?.media || []}
                        selectedMedia={selectedMedia}
                        onSelectMedia={setSelectedMedia}
                        onAddMedia={handleFileUpload}
                        onDeleteMedia={deleteMedia}
                        isEditable={true}
                      />
                    </div>
                  )}
                </div>

                {/* Mobile View: Classic Slider/Gallery */}
                <div className="lg:hidden">
                  <ProductMediaGallery
                    media={allMedia}
                    selectedMedia={selectedMedia}
                    onSelectMedia={setSelectedMedia}
                    onAddMedia={handleFileUpload}
                    onDeleteMedia={deleteMedia}
                    isEditable={isEdit || isCreate}
                    setSelectedMedia={setSelectedMedia}
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Product Narrative & Acquisition (Sticky) */}
          <div className="w-full lg:w-[35%] lg:sticky lg:top-32 h-fit order-1 lg:order-2 space-y-12">
            {isEdit || isCreate ? (
              <div className="bg-neutral-50 p-8 border border-neutral-100 rounded-sm space-y-12">
                <section>
                  <h4 className="font-ui text-[9px] tracking-[0.4em] uppercase text-neutral-400 mb-6">Core Narrative</h4>
                  <ProductInfoForm product={product} setProduct={setProduct} />
                </section>

                <section>
                  <h4 className="font-ui text-[9px] tracking-[0.4em] uppercase text-neutral-400 mb-6">Color Calibration</h4>
                  <ProductColorsEditor
                    product={product}
                    setProduct={setProduct}
                    handleChangeProduct={handleChangeProduct}
                  />
                </section>

                <section>
                  <h4 className="font-ui text-[9px] tracking-[0.4em] uppercase text-neutral-400 mb-6">Dimensional Scale</h4>
                  <ProductSizesEditor
                    product={product}
                    setProduct={setProduct}
                    handleChangeProduct={handleChangeProduct}
                  />
                </section>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Header: Identity & Category */}
                <div className="space-y-4">
                  <span className="font-ui text-[10px] md:text-xs tracking-[0.4em] uppercase text-neutral-400 block">
                    {product?.Category?.name || "Archive Collection"}
                  </span>
                  {loading ? (
                    <div className="h-16 w-3/4 bg-neutral-100 animate-pulse" />
                  ) : (
                    <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-neutral-900 leading-[1.1] tracking-tight">
                      {product?.Title}
                    </h1>
                  )}
                </div>

                {/* Pricing: Value Definition */}
                <div className="flex items-center justify-between pb-8 border-b border-neutral-100">
                  <div className="flex items-baseline gap-4">
                    {promotion > 0 ? (
                      <>
                        <span className="font-ui text-sm line-through text-neutral-300">
                          {formatPrice(originalPrice)}
                        </span>
                        <span className="font-ui text-2xl tracking-widest text-neutral-900 font-bold">
                          {formatPrice(discountedPrice)}
                        </span>
                      </>
                    ) : (
                      <span className="font-ui text-2xl tracking-widest text-neutral-900 font-bold">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-ui text-[9px] tracking-[0.2em] uppercase px-3 py-1 ${isAvailable ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"}`}>
                      {isAvailable ? "Available" : "Restocking"}
                    </span>
                    {promotion > 0 && (
                      <span className="font-ui text-[9px] tracking-[0.2em] uppercase text-neutral-400">
                        Limited Time −{promotion}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Selection Trace: Variants */}
                <div className="space-y-12">
                  {/* Color Calibration */}
                  {product?.colors?.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-50">
                        <label className="font-ui text-[9px] tracking-[0.3em] uppercase text-neutral-900">Palette</label>
                        <span className="font-body text-[10px] text-neutral-400 uppercase tracking-widest">{selectedColor?.name}</span>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-2">
                        {product.colors?.map((c, i) => {
                          const isColorAvailable = c.quantity !== undefined ? Number(c.quantity) > 0 : true;
                          return (
                            <button
                              key={i}
                              onClick={() => {
                                setSelectedColor(c);
                                if (c?.media?.length > 0) {
                                  setSelectedMedia(c.media[0]);
                                }
                              }}
                              className={`group relative w-12 h-12 rounded-full overflow-hidden transition-all duration-700 ring-offset-4 ${selectedColor?.name === c.name ? "ring-1 ring-neutral-900 shadow-xl scale-110" : "ring-0 hover:ring-1 hover:ring-neutral-200"
                                } ${!isColorAvailable ? "opacity-30 grayscale cursor-not-allowed" : ""}`}
                            >
                              {c.src ? (
                                <img src={c.src} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              ) : (
                                <div className="w-full h-full" style={{ backgroundColor: c.value ?? "#000" }} />
                              )}
                              {!isColorAvailable && (
                                <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                                  <div className="w-full h-[1px] bg-neutral-900 -rotate-45" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dimension: Sizes */}
                  {product?.sizes?.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-50">
                        <label className="font-ui text-[9px] tracking-[0.3em] uppercase text-neutral-900">Silhouette</label>
                        <span className="font-body text-[10px] text-neutral-400 uppercase tracking-widest">{selectedSize?.name}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-3 pt-2">
                        {product.sizes?.map((s, i) => {
                          const isSizeAvailable = s.quantity !== undefined ? Number(s.quantity) > 0 : true;
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedSize(s)}
                              disabled={!isSizeAvailable}
                              className={`py-3 font-ui text-[10px] tracking-widest border transition-all duration-700 relative overflow-hidden ${selectedSize?.name === s.name
                                ? "bg-neutral-900 text-white border-neutral-900 shadow-xl scale-[1.02]"
                                : "border-neutral-100 text-neutral-400 hover:border-neutral-400"
                                } ${!isSizeAvailable ? "opacity-40 cursor-not-allowed bg-neutral-50" : ""}`}
                            >
                              <span className={!isSizeAvailable ? "line-through grayscale" : ""}>{s.name}</span>
                              {!isSizeAvailable && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-[120%] h-[1px] bg-neutral-200 rotate-[25deg]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Acquisition: Purchase Actions */}
                <div className="flex flex-col gap-4 pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                    className="group relative w-full py-6 bg-neutral-900 text-white font-ui text-[11px] tracking-[0.6em] uppercase transition-all duration-700 hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 overflow-hidden shadow-xl"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <BsCartPlus className="w-4 h-4" />
                      {isAvailable ? "Add to Archive" : "Reservations Full"}
                    </span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 opacity-10 transition-transform duration-700 ease-out" />
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!isAvailable}
                    className="w-full py-6 bg-white text-neutral-900 border border-neutral-200 font-ui text-[11px] tracking-[0.6em] uppercase transition-all duration-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 disabled:opacity-50"
                  >
                    {isAvailable ? "Express Order" : "Restocking Flow"}
                  </button>
                </div>

                {/* Narrative: Description */}
                <div className="pt-12 space-y-6">
                  <h4 className="font-ui text-[9px] tracking-[0.4em] uppercase text-neutral-900 border-b border-neutral-100 pb-3">The Perspective</h4>
                  <div
                    className="font-body text-neutral-500 text-sm leading-relaxed whitespace-pre-line prose prose-neutral max-w-none"
                    dangerouslySetInnerHTML={{ __html: FormatDescription ? FormatDescription(product?.Description) : product?.Description }}
                  />
                </div>

                {/* Assurance: Benefits */}
                <div className="grid grid-cols-1 gap-8 pt-10 border-t border-neutral-100">
                  <div className="flex gap-5 items-start">
                    <FaShippingFast className="w-5 h-5 text-neutral-900 mt-0.5" />
                    <div className="space-y-1">
                      <span className="block font-ui text-[9px] tracking-[0.2em] uppercase text-neutral-900">Tunisia Concierge</span>
                      <p className="text-[11px] text-neutral-400 font-body leading-relaxed">Complimentary premium delivery across the entire territory. Artisanal handling guaranteed.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Dialogue */}
        <div className="pt-32 pb-16 text-center border-t border-neutral-50 mt-24">
          <span className="font-ui text-[9px] tracking-[0.5em] uppercase text-neutral-300">Clin d'Oeil Curated Collections</span>
        </div>
      </div>
    </div>
  );
}
