import React, { useState, useEffect } from "react";
import { getStoreSettings, updateStoreSettings } from "../../../functions/storeSettings";
import { toast } from "react-toastify";
import { FaChartBar, FaSave, FaTags, FaBullhorn } from "react-icons/fa";

export default function AnalyticsConfig() {
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [googleTagManagerId, setGoogleTagManagerId] = useState("");
  const [googleAdsId, setGoogleAdsId] = useState("");
  const [googleAdsConversionLabel, setGoogleAdsConversionLabel] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await getStoreSettings();
      setGoogleAnalyticsId(data.googleAnalyticsId || "");
      setGoogleTagManagerId(data.googleTagManagerId || "");
      setGoogleAdsId(data.googleAdsId || "");
      setGoogleAdsConversionLabel(data.googleAdsConversionLabel || "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStoreSettings({
        googleAnalyticsId,
        googleTagManagerId,
        googleAdsId,
        googleAdsConversionLabel
      });
      toast.success("Paramètres de tracking mis à jour !");
    } catch (err) {
      toast.error("Échec de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        {/* Google Analytics GA4 */}
        <div className="group">
          <div className="flex items-center gap-2 mb-2">
            <FaChartBar className="text-indigo-500 w-3 h-3" />
            <label className="block text-[10px] font-ui tracking-widest uppercase text-gray-400 font-bold">
              Google Analytics GA4 (Measurement ID)
            </label>
          </div>
          <input
            type="text"
            value={googleAnalyticsId}
            onChange={(e) => setGoogleAnalyticsId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm shadow-sm"
            placeholder="G-XXXXXXXXXX"
          />
        </div>

        {/* Google Tag Manager */}
        <div className="group">
          <div className="flex items-center gap-2 mb-2">
            <FaTags className="text-blue-500 w-3 h-3" />
            <label className="block text-[10px] font-ui tracking-widest uppercase text-gray-400 font-bold">
              Google Tag Manager
            </label>
          </div>
          <input
            type="text"
            value={googleTagManagerId}
            onChange={(e) => setGoogleTagManagerId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm shadow-sm"
            placeholder="GTM-XXXXXXX"
          />
        </div>

        {/* Google Ads Section */}
        <div className="pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-2 mb-4">
            <FaBullhorn className="text-amber-500 w-4 h-4" />
            <span className="font-ui text-[11px] tracking-[0.2em] uppercase font-bold text-neutral-800">Configuration Google Ads</span>
          </div>

          <div className="space-y-4">
            <div className="group">
              <label className="block text-[9px] tracking-widest uppercase text-gray-400 font-bold mb-2">
                Conversion ID
              </label>
              <input
                type="text"
                value={googleAdsId}
                onChange={(e) => setGoogleAdsId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm shadow-sm"
                placeholder="AW-XXXXXXXXXX"
              />
            </div>

            <div className="group">
              <label className="block text-[9px] tracking-widest uppercase text-gray-400 font-bold mb-2">
                Conversion Label (Optionnel)
              </label>
              <input
                type="text"
                value={googleAdsConversionLabel}
                onChange={(e) => setGoogleAdsConversionLabel(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm shadow-sm"
                placeholder="AbC-DeF-GhI"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-ui text-[10px] tracking-[0.3em] uppercase hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <FaSave /> {loading ? "Sauvegarde..." : "Enregistrer l'écosystème Google"}
      </button>

      <div className="bg-neutral-900 p-6 rounded-[2rem] text-white overflow-hidden relative">
        <div className="relative z-10">
          <h4 className="font-editorial text-lg italic mb-2 tracking-tight">Data Intelligence</h4>
          <p className="text-[10px] text-white/50 leading-relaxed font-light tracking-wide uppercase">
            La centralisation de vos tags permet une analyse holistique de votre audience et une optimisation précise de votre ROI publicitaire.
          </p>
        </div>
        <FaChartBar className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
      </div>
    </form>
  );
}
