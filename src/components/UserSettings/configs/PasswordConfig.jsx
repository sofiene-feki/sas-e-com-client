import React, { useState } from "react";
import { auth } from "../../../service/firebase";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { toast } from "react-toastify";
import { FaLock, FaSave } from "react-icons/fa";

export default function PasswordConfig() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Les nouveaux mots de passe ne correspondent pas");
        }

        setLoading(true);
        try {
            const user = auth.currentUser;
            if (user && user.email) {
                // Re-authenticate first
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);

                // Update password
                await updatePassword(user, newPassword);
                toast.success("Mot de passe mis à jour avec succès !");

                // Clear fields
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            toast.error("Erreur : " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-ui tracking-widest uppercase text-gray-400 mb-2">
                        Mot de passe actuel
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm"
                        placeholder="••••••••"
                    />
                </div>

                <div className="h-[1px] w-full bg-neutral-100 my-2" />

                <div>
                    <label className="block text-[10px] font-ui tracking-widest uppercase text-gray-400 mb-2">
                        Nouveau mot de passe
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-ui tracking-widest uppercase text-gray-400 mb-2">
                        Confirmer le nouveau mot de passe
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
                disabled={loading}
                className="w-full py-4 bg-neutral-900 text-white rounded-xl font-ui text-[10px] tracking-[0.3em] uppercase hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
                <FaSave /> {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </button>

            <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-4">
                <FaLock className="text-red-400 w-10 h-10 shrink-0" />
                <div>
                    <h4 className="text-xs font-bold text-red-900 mb-1">Sécurité</h4>
                    <p className="text-[10px] text-red-800 leading-relaxed">
                        Pour votre sécurité, le changement de mot de passe nécessite une re-authentification avec votre mot de passe actuel.
                    </p>
                </div>
            </div>
        </form>
    );
}
