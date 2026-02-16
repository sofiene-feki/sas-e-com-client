import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Disclosure, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBoxOpen,
  FaCog,
  FaPlus,
  FaStore,
  FaChevronRight,
  FaFacebook,
  FaGoogle,
  FaChartLine,
  FaSignOutAlt
} from "react-icons/fa";
import {
  HiOutlineCube,
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineGlobeAlt,
  HiOutlineLogout
} from "react-icons/hi";

// Import modular configs
import PixelConfig from "../UserSettings/configs/PixelConfig";
import GoogleConfig from "../UserSettings/configs/GoogleConfig";
import AnalyticsConfig from "../UserSettings/configs/AnalyticsConfig";
import CategoryConfig from "../UserSettings/configs/CategoryConfig";
import SubCategoryConfig from "../UserSettings/configs/SubCategoryConfig";
import PackageConfig from "../UserSettings/configs/PackageConfig";
import StoreConfig from "../UserSettings/configs/StoreConfig";
import ProfileConfig from "../UserSettings/configs/ProfileConfig";
import PasswordConfig from "../UserSettings/configs/PasswordConfig";

const UserSettingsContent = ({ setUserMenuOpen, handleSignOut }) => {
  const [view, setView] = useState("main");
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleCreateProduct = () => {
    navigate("/product/new", { state: { mode: "create" } });
    setUserMenuOpen(false);
  };

  const VIEWS = {
    MAIN: "main",
    PIXEL: "pixel",
    GOOGLE: "google",
    ANALYTICS: "analytics",
    CATEGORY: "category",
    SUB_CATEGORY: "sub_category",
    PACKAGE: "package",
    STORE: "store",
    PROFILE: "profile",
    PASSWORD: "password",
  };

  const VIEW_LABELS = {
    [VIEWS.MAIN]: { title: "Espace Créateur", subtitle: "Gérez votre boutique et vos archives" },
    [VIEWS.PIXEL]: { title: "Facebook Pixel", subtitle: "Optimisation des conversions publicitaires" },
    [VIEWS.GOOGLE]: { title: "Search Console", subtitle: "Visibilité et indexation Google" },
    [VIEWS.ANALYTICS]: { title: "Analytics", subtitle: "Analyse du trafic et des comportements" },
    [VIEWS.CATEGORY]: { title: "Collections", subtitle: "Organisation des structures de catégories" },
    [VIEWS.SUB_CATEGORY]: { title: "Sous-Collections", subtitle: "Raffinement de l'arborescence" },
    [VIEWS.PACKAGE]: { title: "Packs Offres", subtitle: "Gestion des offres groupées" },
    [VIEWS.STORE]: { title: "Identité visuelle", subtitle: "Branding et logo de l'enseigne" },
    [VIEWS.PROFILE]: { title: "Profil Utilisateur", subtitle: "Mise à jour de vos informations personnelles" },
    [VIEWS.PASSWORD]: { title: "Sécurité", subtitle: "Changement de votre mot de passe" },
  };

  const renderConfig = () => {
    switch (view) {
      case VIEWS.PIXEL: return <PixelConfig />;
      case VIEWS.GOOGLE: return <GoogleConfig />;
      case VIEWS.ANALYTICS: return <AnalyticsConfig />;
      case VIEWS.CATEGORY: return <CategoryConfig />;
      case VIEWS.SUB_CATEGORY: return <SubCategoryConfig />;
      case VIEWS.PACKAGE: return <PackageConfig />;
      case VIEWS.STORE: return <StoreConfig />;
      case VIEWS.PROFILE: return <ProfileConfig />;
      case VIEWS.PASSWORD: return <PasswordConfig />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-ui selection:bg-neutral-100">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100 p-6 flex justify-between items-center text-neutral-900 shadow-sm">
        <div className="animate-in fade-in slide-in-from-left-2 duration-500">
          <h2 className="font-editorial text-2xl tracking-tight leading-none italic font-medium">
            {VIEW_LABELS[view]?.title || "Paramètres"}
          </h2>
          <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-2 font-medium">
            {VIEW_LABELS[view]?.subtitle || ""}
          </p>
        </div>
        <button
          onClick={() => setUserMenuOpen(false)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-50 hover:scale-110 transition-all duration-300 group"
        >
          <span className="text-2xl font-light group-hover:rotate-90 transition-transform duration-300">×</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-neutral-50/30">
        {view === VIEWS.MAIN ? (
          <div className="p-6 space-y-8 animate-in fade-in zoom-in-95 duration-700">
            {/* Account Quick Glance - Editorial Style */}
            <div className="relative overflow-hidden bg-neutral-900 rounded-[2rem] p-8 text-white mb-2 shadow-2xl border border-neutral-800">
              <div className="relative z-10 flex flex-col gap-6">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-inner overflow-hidden">
                  {userInfo?.photoURL ? (
                    <img src={userInfo.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <HiOutlineUser className="w-7 h-7 font-light" />
                  )}
                </div>
                <div>
                  <h3 className="font-editorial text-xl tracking-tight italic">Espace Privé</h3>
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => setView(VIEWS.PROFILE)}
                      className="text-[9px] text-white/60 tracking-[0.2em] uppercase hover:text-white transition-colors"
                    >
                      Modifier Profil
                    </button>
                    <button
                      onClick={() => setView(VIEWS.PASSWORD)}
                      className="text-[9px] text-white/60 tracking-[0.2em] uppercase hover:text-white transition-colors"
                    >
                      Sécurité
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3" />
                  </div>
                  <span className="text-[8px] tracking-widest uppercase opacity-40">65% Setup</span>
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <FaPlus className="w-8 h-8 font-thin" />
              </div>
            </div>

            {/* Navigation Grid */}
            <div className="space-y-8 pb-10">
              {/* Section: Boutique */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <Label uppercase>Atelier Architect</Label>
                <div className="mt-4 grid gap-3">
                  <ActionCard
                    icon={<FaPlus className="w-3.5 h-3.5" />}
                    label="Nouveau Produit"
                    desc="Publication dans l'archive"
                    onClick={handleCreateProduct}
                  />
                  <ActionCard
                    icon={<FaStore className="w-3.5 h-3.5" />}
                    label="Identité visuelle"
                    desc="Logo & Branding system"
                    onClick={() => setView(VIEWS.STORE)}
                  />
                  <ActionCard
                    icon={<HiOutlineCube className="w-3.5 h-3.5" />}
                    label="Architecture Collections"
                    desc="Menus & Hiérarchie"
                    onClick={() => setView(VIEWS.CATEGORY)}
                  />
                </div>
              </div>

              {/* Section: Commandes */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <Label uppercase>Écosystème Digital</Label>
                <div className="mt-4 grid gap-3">
                  <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="block">
                    <ActionCard
                      icon={<HiOutlineShoppingBag className="w-3.5 h-3.5" />}
                      label="Flux de Commandes"
                      desc="Suivi des ventes temps réel"
                    />
                  </Link>
                  <ActionCard
                    icon={<FaFacebook className="w-3.5 h-3.5" />}
                    label="Meta Marketing"
                    desc="Configuration Pixel & CAPI"
                    onClick={() => setView(VIEWS.PIXEL)}
                  />
                  <ActionCard
                    icon={<FaChartLine className="w-3.5 h-3.5" />}
                    label="Analyses & Tracking"
                    desc="GA4, GTM & Google Ads"
                    onClick={() => setView(VIEWS.ANALYTICS)}
                  />
                  <ActionCard
                    icon={<HiOutlineGlobeAlt className="w-3.5 h-3.5" />}
                    label="Console de Recherche"
                    desc="Indexation & SEO Google"
                    onClick={() => setView(VIEWS.GOOGLE)}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 pb-20 animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
            <button
              onClick={() => setView(VIEWS.MAIN)}
              className="group flex items-center gap-3 text-[10px] font-ui tracking-[0.3em] uppercase text-neutral-400 hover:text-neutral-900 transition-all mb-10"
            >
              <div className="w-6 h-6 rounded-full border border-neutral-100 flex items-center justify-center group-hover:border-neutral-900 transition-colors">
                <span className="text-sm transition-transform group-hover:-translate-x-0.5">←</span>
              </div>
              Retour au Dashboard
            </button>
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-neutral-100">
              {renderConfig()}
            </div>
          </div>
        )}
      </div>

      {/* Persistent Footer */}
      {view === VIEWS.MAIN && (
        <div className="p-6 border-t border-neutral-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <button
            onClick={handleSignOut}
            className="group flex items-center justify-center gap-3 w-full py-4 bg-neutral-50 text-neutral-400 border border-transparent rounded-2xl font-ui text-[10px] tracking-[0.3em] uppercase hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all duration-300 active:scale-[0.98]"
          >
            <HiOutlineLogout className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            Clôturer session
          </button>
        </div>
      )}
    </div>
  );
};

// --- Sub-components (Local) ---

const Label = ({ children, uppercase = true }) => (
  <div className="flex items-center gap-4">
    <span className={`block font-ui text-[9px] ${uppercase ? "tracking-[0.4em] uppercase" : ""} text-neutral-300 font-semibold whitespace-nowrap`}>
      {children}
    </span>
    <div className="h-[1px] w-full bg-neutral-100" />
  </div>
);

const ActionCard = ({ icon, label, desc, onClick }) => (
  <button
    onClick={onClick}
    className="group flex items-center justify-between w-full p-5 bg-white border border-neutral-100/60 rounded-[1.25rem] hover:border-neutral-900 hover:bg-neutral-50/50 transition-all duration-500 text-left shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-xl"
  >
    <div className="flex items-center gap-5">
      <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-50 border border-neutral-100 text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-all duration-500 shadow-sm">
        {icon}
      </div>
      <div>
        <span className="block font-ui text-sm font-medium text-neutral-800 tracking-tight transition-transform duration-500 group-hover:translate-x-1">{label}</span>
        {desc && <span className="block text-[10px] text-neutral-400 mt-0.5 font-light tracking-wide">{desc}</span>}
      </div>
    </div>
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-50 opacity-0 group-hover:opacity-100 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-500 translate-x-4 group-hover:translate-x-0">
      <FaChevronRight className="w-2.5 h-2.5" />
    </div>
  </button>
);

export default UserSettingsContent;
