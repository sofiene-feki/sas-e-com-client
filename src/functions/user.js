import axios from "axios";

export const uploadProfileImage = async (formData) => {
    return await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/upload-profile-image`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
