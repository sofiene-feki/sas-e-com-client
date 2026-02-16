import React from "react";
import ProfileSection from "./sections/ProfileSection";
import OrdersSection from "./sections/OrdersSection";
import ShopManagementSection from "./sections/ShopManagementSection";
import ServicesSection from "./sections/ServicesSection";

export default function UserSettingsMain({
  setView,
  handleCreateProduct,
  handleSignOut,
  setUserMenuOpen,
  handleCreatePack,
}) {
  return (
    <div className="space-y-3 pb-8">
      <ProfileSection />
      <OrdersSection setUserMenuOpen={setUserMenuOpen} />
      <ShopManagementSection
        setView={setView}
        handleCreateProduct={handleCreateProduct}
        handleCreatePack={handleCreatePack}
      />
      <ServicesSection setView={setView} />

      {/* Sign Out Button */}
      <div className="p-4">
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
