import React, { useState, useEffect } from "react";
import { getStoreSettings, updateStoreSettings } from "../../../functions/storeSettings";
import { toast } from "react-toastify";
import { FaFacebook, FaSave } from "react-icons/fa";

export default function PixelConfig() {
  const [fbPixelId, setFbPixelId] = useState("");
  const [fbAccessToken, setFbAccessToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await getStoreSettings();
      setFbPixelId(data.fbPixelId || "");
      setFbAccessToken(data.fbAccessToken || "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStoreSettings({ fbPixelId, fbAccessToken });
      toast.success("Paramètres Facebook Pixel mis à jour !");
    } catch (err) {
      toast.error("Échec de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-ui tracking-widest uppercase text-gray-400 mb-2">
            Facebook Pixel ID
          </label>
          <input
            type="text"
            value={fbPixelId}
            onChange={(e) => setFbPixelId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm"
            placeholder="123456789012345"
          />
        </div>

        <div>
          <label className="block text-[10px] font-ui tracking-widest uppercase text-gray-400 mb-2">
            Conversions API Access Token
          </label>
          <textarea
            value={fbAccessToken}
            onChange={(e) => setFbAccessToken(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm"
            placeholder="EAAB..."
          />
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full py-4 bg-neutral-900 text-white rounded-xl font-ui text-[10px] tracking-[0.3em] uppercase hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <FaSave /> {loading ? "Sauvegarde..." : "Sauvegarder les Paramètres"}
      </button>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-4">
        <FaFacebook className="text-blue-600 w-10 h-10 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-blue-900 mb-1">Recommandation</h4>
          <p className="text-[10px] text-blue-800 leading-relaxed">
            Utilisez l'API de conversion pour capturer les événements que le Pixel ne peut pas suivre en raison des bloqueurs de publicité.
          </p>
        </div>
      </div>
    </form>
  );
}
