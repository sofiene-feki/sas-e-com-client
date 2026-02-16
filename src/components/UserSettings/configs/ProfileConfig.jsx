import React, { useState, useRef } from "react";
import { auth } from "../../../service/firebase";
import { updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { authSuccess } from "../../../redux/user/userSlice";
import { toast } from "react-toastify";
import { FaUser, FaSave, FaCamera } from "react-icons/fa";
import { uploadProfileImage } from "../../../functions/user";

export default function ProfileConfig() {
    const { userInfo } = useSelector((state) => state.user);
    const [displayName, setDisplayName] = useState(userInfo?.displayName || "");
    const [currentPhoto, setCurrentPhoto] = useState(userInfo?.photoURL || "");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let finalPhotoURL = currentPhoto;

            // 1. Upload new image if selected
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);
                const { data } = await uploadProfileImage(formData);
                finalPhotoURL = `${import.meta.env.VITE_API_BASE_URL_MEDIA}${data.imageUrl}`;
            }

            // 2. Update Firebase Profile
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName,
                    photoURL: finalPhotoURL,
                });

                // 3. Update Redux state
                const updatedUser = {
                    ...userInfo,
                    displayName,
                    photoURL: finalPhotoURL,
                };
                dispatch(authSuccess(updatedUser));
                setCurrentPhoto(finalPhotoURL);
                setImageFile(null);
                setPreview("");

                toast.success("Profil mis à jour avec succès !");
            }
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la mise à jour : " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-neutral-100 shadow-xl bg-neutral-50 relative">
                        {preview || currentPhoto ? (
                            <img
                                src={preview || currentPhoto}
                                className="w-full h-full object-cover"
                                alt="Profile"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-50">
                                <FaUser className="w-10 h-10" />
                            </div>
                        )}

                        {/* Overlay */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
                        >
                            <FaCamera className="text-white w-6 h-6" />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform"
                    >
                        <FaCamera className="w-3.5 h-3.5" />
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <p className="text-[9px] tracking-widest uppercase text-neutral-400 mt-4 font-medium">Avatar de l'Archive</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-[10px] font-ui tracking-widest uppercase text-neutral-400 mb-2 font-bold">
                        Nom d'affichage
                    </label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm shadow-sm"
                        placeholder="Votre nom"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-ui tracking-widest uppercase text-neutral-400 mb-2 opacity-50 font-bold">
                        Adresse Email
                    </label>
                    <input
                        type="email"
                        value={userInfo?.email}
                        disabled
                        className="w-full px-4 py-4 bg-neutral-100 border border-transparent rounded-2xl font-ui text-sm cursor-not-allowed text-neutral-500 italic"
                    />
                </div>
            </div>

            <button
                disabled={loading}
                className="w-full py-4 bg-neutral-900 text-white rounded-[1.5rem] font-ui text-[10px] tracking-[0.3em] uppercase hover:bg-black transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
                <FaSave className="text-xs" /> {loading ? "Mise à jour..." : "Enregistrer les modifications"}
            </button>

            <div className="bg-neutral-50 p-5 rounded-[1.5rem] border border-neutral-100 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-300 shadow-sm">
                    <FaUser className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider mb-1">Authenticité</h4>
                    <p className="text-[10px] text-neutral-500 leading-relaxed font-light">
                        Votre identité visuelle au sein de l'Archive renforce la confiance de vos collaborateurs et clients.
                    </p>
                </div>
            </div>
        </form>
    );
}
