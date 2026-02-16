import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getProductsByCategory } from "../functions/product";
import { getPacksByCategory } from "../functions/pack";

import Header from "../components/shop/header";
import Filters from "../components/shop/filters";
import Product from "../components/product/Product";
import Pack from "../components/product/Pack";
import Pagination from "../components/shop/Pagination";
import { LoadingProduct } from "../components/ui";
import { setCurrentPage } from "../redux/shopFilters/pageOptions";

export default function Category() {
  const { Category } = useParams();
  const filter = useSelector((state) => state.filters);

  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { currentPage, productsPerPage, sortOption } = useSelector(
    (state) => state.pageOptions,
  );
  const view = useSelector((state) => state.view.view);
  const dispatch = useDispatch();

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;
  const SITE_URL = "https://www.clindoeilstore.com";

  const formattedCategory = decodeURIComponent(Category)
    .replace(/-/g, " ")
    .trim();

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const normalizeMediaSrc = (input) => {
    if (!input) return input;

    if (Array.isArray(input)) {
      return input.map(normalizeMediaSrc);
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
    const fetchData = async () => {
      setLoading(true);
      // console.log("🔄 Fetching products and packs for category:", Category);
      try {
        const productData = await getProductsByCategory({
          category: Category,
          page: currentPage,
          itemsPerPage: productsPerPage,
          filters: filter.selected,
          sort: sortOption,
        });
        console.log("Fetched products for category:", productData);
        setProducts(normalizeMediaSrc(productData.data.products || []));
        setTotalPages(productData.data.totalPages);
        setTotalProducts(productData.data.totalProducts);

        const packData = await getPacksByCategory({
          category: Category,
          page: currentPage,
          itemsPerPage: productsPerPage,
          sort: sortOption,
        });

        setPacks(normalizeMediaSrc(packData.packs || []));
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [Category, currentPage, productsPerPage, sortOption, filter]);

  const start = currentPage * productsPerPage + 1;
  const end = Math.min((currentPage + 1) * productsPerPage, totalProducts);

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Header
          setMobileFiltersOpen={setMobileFiltersOpen}
          formattedCategory={formattedCategory}
          totalProducts={totalProducts}
        />

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <Filters
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />

            {loading ? (
              <div className="lg:col-span-3">
                <LoadingProduct length={3} cols={3} />
              </div>
            ) : (
              <div className="lg:col-span-3">
                <div
                  className={
                    view === "list"
                      ? "flex flex-col space-y-4"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 xl:gap-x-8"
                  }
                >
                  {packs.map((pack) => (
                    <Pack
                      key={pack._id}
                      product={pack}
                      loading={loading}
                      productsPerPage={productsPerPage}
                    />
                  ))}

                  {products.map((product) => (
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
          </div>
        </section>
      </main>
    </>
  );
}
