import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../functions/order"; // updated axios functions
import logo from "../assets/bragaouiBlack.png";
import { PrinterIcon } from "@heroicons/react/24/outline";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin] = useState(true); // replace with real auth logic
  const [updating, setUpdating] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      setOrder((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (!order) return <div className="p-6">Commande introuvable.</div>;

  const customer = order.customer || {};
  const items = order.items || [];

  return (
    <div
      className="max-w-4xl mx-auto bg-white md:p-4 p-1 print:shadow-none print:p-0 print:rounded-none print:max-w-full print:text-black"
      ref={invoiceRef}
    >
      <div className="print:hidden flex my-3 px-1 justify-end items-center gap-x-3">
        {/* Back Button */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
        >
          ← <span className="ml-1">Retour aux commandes</span>
        </button>

        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 bg-[#2c2d84] text-white text-sm font-medium rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#2c2d84] focus:ring-offset-2 transition-all duration-200"
        >
          <PrinterIcon className="h-5 w-5 mr-2" />
          Imprimer
        </button>
      </div>

      {/* Header */}
      <div className=" bg-white md:p-8 p-2 shadow-md rounded-lg border border-gray-300 ">
        {" "}
        <div className="flex items-center justify-between border-b  mb-4 print:border-none">
          <img src={logo} alt="Logo" className="md:h-12 h-8 w-auto mb-2" />
          <div className="text-right text-sm text-gray-600 print:text-black">
            <p>Réf #: {order._id}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {/* Client Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Informations Client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <p>
              <span className="font-medium">Nom:</span> {customer.fullName}
            </p>
            <p>
              <span className="font-medium">Téléphone:</span> {customer.phone}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {customer.email || "-"}
            </p>
            <p>
              <span className="font-medium">Adresse:</span> {customer.address}
            </p>
            <p>
              <span className="font-semibold">Statut:</span>{" "}
              {isAdmin ? (
                <select
                  className="ml-2 border rounded px-2 py-1 text-sm"
                  value={order.status}
                  onChange={handleStatusChange}
                  disabled={updating}
                >
                  <option value="En attente">En attente</option>
                  <option value="Confirmée">Confirmée</option>
                  <option value="Expédiée">Expédiée</option>
                  <option value="Livrée">Livrée</option>
                  <option value="Annulée">Annulée</option>
                </select>
              ) : (
                <span className="ml-2">{order.status}</span>
              )}
            </p>
          </div>
        </div>
        {/* Order Summary */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Résumé de la commande</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border text-left">Produit</th>
                <th className="p-2 border text-right">Prix Unitaire</th>
                <th className="p-2 border text-center">Qté</th>
                <th className="p-2 border text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const basePrice = Number(item.price) || 0;
                const sizePrice = Number(item.selectedSize?.price) || 0;
                const unitPrice = basePrice + sizePrice;
                const totalPrice = unitPrice * (item.quantity || 1);

                return (
                  <tr key={idx} className="border-t">
                    <td className="p-2 border text-center">{idx + 1}</td>
                    <td className="p-2 border text-left">
                      {/* If it's a pack, show sub-products */}
                      {item.type === "pack" ? (
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <ul className="ml-3 mt-1 list-disc text-sm text-gray-600">
                            {item.products.map((p, pIdx) => (
                              <li key={pIdx}>
                                {p.name}
                                {p.selectedSize && (
                                  <span className="ml-2 text-gray-500">
                                    | Taille: {p.selectedSize}
                                  </span>
                                )}
                                {p.selectedColor && (
                                  <span className="ml-2 text-gray-500">
                                    | Couleur: {p.selectedColor}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        // Normal product
                        <div>
                          <div>{item.name}</div>
                          {item.selectedColor && (
                            <div className="text-xs text-gray-500">
                              Couleur: {item.selectedColor}
                            </div>
                          )}
                          {item.selectedSize && (
                            <div className="text-xs text-gray-500">
                              Taille: {item.selectedSize}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Example price/qty column (if you want to keep them) */}
                                        <td className="p-2 border text-center">{unitPrice} dt</td>
                    <td className="p-2 border text-center">{item.quantity}</td>
                    <td className="p-2 border text-center">{totalPrice} dt</td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan="4" className="p-2 text-right font-bold border">
                  Total:
                </td>
                <td className="p-2 text-right font-bold border">
                  {items
                    .reduce((acc, item) => {
                      const base = Number(item.price) || 0;
                      const size = Number(item.selectedSize?.price) || 0;
                      return acc + (base + size) * (item.quantity || 1);
                    }, 0)
                    .toLocaleString("fr-TN", { minimumFractionDigits: 3 })}{" "}
                  dt
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="mt-8 md:text-sm text-xs flex justify-between text-center text-gray-500 print:text-black print:mt-12">
          <p className="mb-1"></p>
          <p className="mb-1">
            Tél : +216 12 345 678{" "}
            <span className="ml-2">Email : contact@artisantBargaoui.tn</span>
          </p>
        </div>
      </div>

      {/* Buttons */}

      {/* Footer */}
    </div>
  );
}
