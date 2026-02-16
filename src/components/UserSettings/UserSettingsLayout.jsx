import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSettingsMain from "./UserSettingsMain";
import PixelConfig from "./configs/PixelConfig";
import GoogleConfig from "./configs/GoogleConfig";
import AnalyticsConfig from "./configs/AnalyticsConfig";
import CategoryConfig from "./configs/CategoryConfig";
import SubCategoryConfig from "./configs/SubCategoryConfig";
import PackageConfig from "./configs/PackageConfig";
import StoreConfig from "./configs/StoreConfig";
import { FaReply } from "react-icons/fa";

const VIEWS = {
  MAIN: "main",
  PIXEL: "pixel",
  GOOGLE: "google",
  ANALYTICS: "analytics",
  CATEGORY: "category",
  SUB_CATEGORY: "sub_category",
  PACKAGE: "package",
  STORE: "store",
};

// Title and Subtitle for each view
const VIEW_LABELS = {
  [VIEWS.MAIN]: { title: "Paramètres", subtitle: "" },
  [VIEWS.PIXEL]: {
    title: "Facebook Pixel",
    subtitle: "Connectez votre Pixel pour suivre les conversions et optimiser vos campagnes.",
  },
  [VIEWS.GOOGLE]: {
    title: "Google Services",
    subtitle: "Configurez les services Google pour améliorer la visibilité et les performances.",
  },
  [VIEWS.ANALYTICS]: {
    title: "Google Analytics",
    subtitle: "Analysez le trafic, le comportement des visiteurs et les performances de votre site.",
  },
  [VIEWS.CATEGORY]: {
    title: "Gestion des catégories",
    subtitle: "Créez, modifiez et supprimez des catégories pour organiser vos produits.",
  },
  [VIEWS.SUB_CATEGORY]: {
    title: "Gestion des sous-catégories",
    subtitle: "Ajoutez des sous-catégories pour affiner l’organisation de votre catalogue.",
  },
  [VIEWS.PACKAGE]: {
    title: "Gestion des packages",
    subtitle: "Créez et gérez des offres ou packs de produits pour vos promotions.",
  },
  [VIEWS.STORE]: {
    title: "Identité de la Boutique",
    subtitle: "Personnalisez le nom et le logo de votre boutique pour votre image de marque.",
  },
};

const CONFIG_COMPONENTS = {
  [VIEWS.PIXEL]: PixelConfig,
  [VIEWS.GOOGLE]: GoogleConfig,
  [VIEWS.ANALYTICS]: AnalyticsConfig,
  [VIEWS.CATEGORY]: CategoryConfig,
  [VIEWS.SUB_CATEGORY]: SubCategoryConfig,
  [VIEWS.PACKAGE]: PackageConfig,
  [VIEWS.STORE]: StoreConfig,
};

export default function UserSettingsLayout({ setUserMenuOpen, handleSignOut }) {
  const [view, setView] = useState(VIEWS.MAIN);
  const navigate = useNavigate();

  const handleCreateProduct = () => {
    navigate("/product/new", { state: { mode: "create" } });
    setUserMenuOpen(false);
  };

  const handleCreatePack = () => {
    navigate("/pack/new", { state: { mode: "create" } });
    setUserMenuOpen(false);
  };

  const ActiveComponent = CONFIG_COMPONENTS[view];
  const { title, subtitle } = VIEW_LABELS[view] || { title: "", subtitle: "" };

  return (
    <div className="relative w-full max-w-md mx-auto  rounded-2xl shadow-lg p-4 overflow-y-auto h-full bg-gray-50">
      {/* Header */}
      <div className="mb-4">
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {view === VIEWS.MAIN ? title : `${title}`}
            </h2>
          </div>

          {view !== VIEWS.MAIN && (
            <button
              onClick={() => setView(VIEWS.MAIN)}
              className="text-gray-500 flex gap-2 hover:underline"
            >
              <FaReply className="mt-1" /> Retour
            </button>
          )}

          {view === VIEWS.MAIN && (
            <button
              onClick={() => setUserMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✖
            </button>
          )}
        </div>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}

      </div>


      {/* Content */}
      {view === VIEWS.MAIN ? (
        <UserSettingsMain
          setView={setView}
          handleCreateProduct={handleCreateProduct}
          handleCreatePack={handleCreatePack}
          handleSignOut={handleSignOut}
          setUserMenuOpen={setUserMenuOpen}
        />
      ) : (
        ActiveComponent && <ActiveComponent />
      )}
    </div>
  );
}
