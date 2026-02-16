import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../redux/shopFilters/pageOptions";
import Filters from "../components/shop/filters";
import Header from "../components/shop/header";
import Product from "../components/product/Product";
import Pagination from "../components/shop/Pagination";
import { getProducts } from "../functions/product";
import { LoadingProduct } from "../components/ui";
import EcwidStore from "../components/ecwid/ecwid";

export default function Shop() {
  const SITE_URL = "https://www.clindoeilstore.com";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState();
  const [totalPages, setTotalPages] = useState();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const view = useSelector((state) => state.view.view);
  const { currentPage, productsPerPage, sortOption } = useSelector(
    (state) => state.pageOptions,
  );
  const filter = useSelector((state) => state.filters);

  const dispatch = useDispatch();

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const start = currentPage * productsPerPage + 1;
  const end = Math.min((currentPage + 1) * productsPerPage, totalProducts);

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const normalizeMediaSrc = (input) => {
    if (!input) return input;
    if (Array.isArray(input)) {
      return input.map((product) => normalizeMediaSrc(product));
    }
    if (!input.media) return input;

    return {
      ...input,
      media: input.media.map((m) => ({
        ...m,
        src: m.src.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
      })),
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await getProducts({
          page: currentPage,
          itemsPerPage: productsPerPage,
          sort: sortOption,
          filters: filter.selected,
        });

        setProducts(normalizeMediaSrc(data.products));
        setTotalPages(data.totalPages);
        setTotalProducts(data.total);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, productsPerPage, sortOption, filter]);

  useEffect(() => {
    dispatch(setCurrentPage(0));
  }, [filter.selected, dispatch]);

  return (
    <>
      <Helmet>
        <title>
          Boutique Mode Femme | Clin d’Oeil Store – Vêtements Tendance
        </title>
        <meta
          name="description"
          content="Découvrez la boutique en ligne Clin d’Oeil Store : vêtements tendance, mode femme, nouvelles collections et styles élégants disponibles en Tunisie."
        />
        <link rel="canonical" href="https://www.clindoeilstore.com/shop" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Boutique Mode Femme | Clin d’Oeil Store"
        />
        <meta
          property="og:description"
          content="Découvrez la boutique en ligne Clin d’Oeil Store : vêtements tendance pour femmes."
        />
        <meta property="og:url" content="https://www.clindoeilstore.com/shop" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.clindoeilstore.com/og-shop.jpg"
        />
      </Helmet>

      <main className="mx-auto max-w-7xl px-4 md:py-10 sm:px-6 lg:px-8">
        <Header
          setMobileFiltersOpen={setMobileFiltersOpen}
          formattedCategory=""
          totalProducts={totalProducts}
        />

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Produits
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <Filters
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />

            {loading ? (
              <div className="lg:col-span-3">
                <LoadingProduct length={9} cols={3} />
              </div>
            ) : (
              <div className="lg:col-span-3">
                <div
                  className={
                    view === "list"
                      ? "flex flex-col space-y-4"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-2 xl:gap-x-8"
                  }
                >
                  {products?.map((product) => (
                    <Product
                      key={product._id}
                      product={product}
                      loading={loading}
                      productsPerPage={productsPerPage}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center mt-8">
                  <Pagination
                    currentPage={currentPage}
                    pageCount={totalPages}
                    onPageChange={handlePageChange}
                  />
                  <p className="text-gray-500 mt-8">
                    {start} à {end} sur {totalProducts} produits
                  </p>
                </div>
              </div>
            )}
            <div className="lg:col-span-3">
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
