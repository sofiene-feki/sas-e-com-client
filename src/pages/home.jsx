import React, { useRef } from "react";
import { Helmet } from "react-helmet-async";
import Banner from "../components/home/Banner";
import CategoryGrid from "../components/home/CategoryGrid";
import HomeVideoSection from "../components/home/HomeVideoSection";
import NewArrivals from "../components/home/NewArrivals";
import Story from "../components/home/Story";
import BrandStatement from "../components/home/BrandStatement";
import HorizontalBrandScroll from "../components/home/brandLogo";
import BestSellers from "../components/home/BestSellers";
import StoreSetupGuide from "../components/home/StoreSetupGuide";
import { getNewArrivals } from "../functions/product";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Home = () => {
  const triggerRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const checkStore = async () => {
      try {
        const { data } = await getNewArrivals("all");
        if (!data.products || data.products.length === 0) {
          setIsEmpty(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkStore();
  }, []);

  return (
    <div className="bg-white">
      <Helmet>
        <title>Clin d’Oeil Store – Mode Femme, Vêtements Tendance</title>
        <meta
          name="description"
          content="Découvrez Clin d’Oeil Store : boutique en ligne de vêtements tendance pour femmes, nouvelles collections et styles élégants en Tunisie."
        />
        <link rel="canonical" href="https://www.clindoeilstore.com/" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Clin d’Oeil Store – Mode Femme, Vêtements Tendance"
        />
        <meta
          property="og:description"
          content="Découvrez Clin d’Oeil Store : boutique en ligne de vêtements tendance pour femmes, nouvelles collections et styles élégants en Tunisie."
        />
        <meta property="og:url" content="https://www.clindoeilstore.com/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.clindoeilstore.com/og-home.jpg"
        />
      </Helmet>

      {/* 1. Cinematic Entry */}
      <Banner />

      {/* {isEmpty && isAuthenticated && <StoreSetupGuide />} */}

      {/* 2. Brand Trust - Subtle Loop */}
      <HorizontalBrandScroll />

      {/* 3. The Collections - Conceptual Grid */}
      <CategoryGrid />

      {/* 4. The Latest - Studio Arrivals */}
      <NewArrivals />

      {/* 5. Campaign Video - Immersive Experience */}
      <HomeVideoSection
        title="Timeless Sophistication"
        subtitle="Campaign 2026"
        triggerRef={triggerRef}
      />
      {/* 6. The Favorites - Curated Selection */}
      <BestSellers />
      {/* 7. Living Archive - Immersive Reels */}
      <Story />
      {/* 8. The Philosophy - Minimalist Conclusion */}
      <BrandStatement />
    </div>
  );
};

export default Home;
