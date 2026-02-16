import { useEffect, useState } from "react";
import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import logoBlack from "./assets/bragaouiBlack.png";
import Header from "./components/header/Header";
import Cart from "./components/cart/Cart";
import Footer from "./components/footer/Footer";
import { ToastContainer } from "react-toastify";
import { initFacebookPixel } from "./service/fbPixel";
import { initGoogleAnalytics, initGoogleTagManager, initGoogleAds } from "./service/googleTracking";
import HeaderTop from "./components/header/HeaderTop";
import { getStoreSettings } from "./functions/storeSettings";
const LazyHome = lazy(() => import("./pages/home"));
const LazyShop = lazy(() => import("./pages/shop"));
const LazyAbout = lazy(() => import("./pages/about"));
const LazyContact = lazy(() => import("./pages/contact"));
const LazyCheckoutPage = lazy(() => import("./pages/checkout"));
const LazyProductDetails = lazy(() => import("./pages/productDetails"));
const LazyCategory = lazy(() => import("./pages/catrgory"));
const LazyLogin = lazy(() => import("./pages/login"));
const LazyOrders = lazy(() => import("./pages/Orders"));
const LazyOrderDetail = lazy(() => import("./pages/OrderDetail"));
const LazyPackDetails = lazy(() => import("./pages/PackDetails"));
const LazyPrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const LazyReturnsRefunds = lazy(() => import("./pages/ReturnsRefunds"));
const LazyTermsOfService = lazy(() => import("./pages/TermsOfService"));

function App() {
  const location = useLocation();
  const [storeLogo, setStoreLogo] = useState("");

  // Pages where we DON'T want the header and headerBottom to show
  const hideHeaderPaths = ["/login"];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  useEffect(() => {
    const initApp = async () => {
      try {
        const { data } = await getStoreSettings();
        if (data.logo) setStoreLogo(`${import.meta.env.VITE_API_BASE_URL_MEDIA}${data.logo}`);

        // Dynamic Pixel Initialization
        if (data.fbPixelId) {
          initFacebookPixel(data.fbPixelId);
        } else {
          initFacebookPixel(); // Fallback to env
        }

        // Dynamic Google Initialization
        if (data.googleAnalyticsId) initGoogleAnalytics(data.googleAnalyticsId);
        if (data.googleTagManagerId) initGoogleTagManager(data.googleTagManagerId);
        if (data.googleAdsId) initGoogleAds(data.googleAdsId);

      } catch (err) {
        console.error("Initialization error:", err);
        initFacebookPixel(); // Fallback on error
      }
    };
    initApp();
  }, []);
  return (
    <>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh", // 100% of the viewport height
            }}
          >
            <div>
              <img
                src={storeLogo || logoBlack}
                alt="Loading"
                style={{ width: "auto", height: "100px" }}
              />
            </div>
            <div className="loader">clin-doeil loading...</div>
          </div>
        }
      >
        {shouldShowHeader && <Header />}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        // transition={Bounce}
        />
        <Cart />

        <Routes>
          <Route path="/" element={<LazyHome />} />
          <Route path="login" element={<LazyLogin />} />
          <Route path="about" element={<LazyAbout />} />
          <Route path="contact" element={<LazyContact />} />
          <Route path="/terms-of-service" element={<LazyTermsOfService />} />
          <Route path="/privacy-policy" element={<LazyPrivacyPolicy />} />
          <Route path="/returns-refunds" element={<LazyReturnsRefunds />} />
          <Route path="shop" element={<LazyShop />} />
          <Route path="orders" element={<LazyOrders />} />
          <Route path="category/:Category" element={<LazyCategory />} />
          <Route path="Checkout" element={<LazyCheckoutPage />} />
          <Route path="/product/:slug" element={<LazyProductDetails />} />
          <Route path="/order/:id" element={<LazyOrderDetail />} />
          <Route path="/pack/:slug" element={<LazyPackDetails />} />
          <Route path="/*" element={"rawa7"} />
        </Routes>

        <Footer />
      </Suspense>
    </>
  );
}

export default App;
