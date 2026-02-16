import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const sendServerEvent = async ({
  eventName,
  customer,
  products,
  total,
}) => {
  try {
    const event_id = uuidv4();
    const response = await axios.post(`${API_BASE_URL}/pixel/track`, {
      event_name: eventName,
      event_id,
      customer,
      products,
      total,
    });
    return response.data;
  } catch (err) {
    console.error("❌ Server CAPI failed:", err.response?.data || err.message);
    return null;
  }
};
