import React, { useEffect } from "react";

const EcwidStore = () => {
  useEffect(() => {
    // Prevent duplicate loading
    if (!window.__ecwidScriptLoaded) {
      const script = document.createElement("script");
      script.src =
        "https://app.ecwid.com/script.js?68968013&data_platform=code&data_date=2026-02-09";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);

      script.onload = () => {
        window.__ecwidScriptLoaded = true;

        // --- Store widget ---
        if (window.xProductBrowser) {
          window.xProductBrowser(
            "categoriesPerRow=3",
            "views=grid(20,3) list(60) table(60)",
            "categoryView=grid",
            "searchView=list",
            "id=my-store-68968013",
          );
        }

        // --- Categories widget ---
        if (window.xCategoriesV2) {
          window.xCategoriesV2("id=my-categories-68968013");
        }

        // --- Search widget ---
        if (window.xSearch) {
          window.xSearch("id=my-search-68968013");
        }

        // --- Cart widget ---
        if (window.Ecwid) {
          window.Ecwid.init();
        }
      };
    }
  }, []);

  return (
    <div className="space-y-10">
      {/* Categories */}
      <div id="my-categories-68968013"></div>

      {/* Search */}
      <div id="my-search-68968013"></div>

      {/* Cart widget */}
      <div className="ec-cart-widget"></div>

      {/* Main Product Browser */}
      <div id="my-store-68968013"></div>
    </div>
  );
};

export default EcwidStore;
