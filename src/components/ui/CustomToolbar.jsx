import React, { useRef, useState } from "react";
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
  ExportPrint,
} from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterListIcon from "@mui/icons-material/FilterList";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
//import clsx from "clsx";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import { ExportCsv } from "@mui/x-data-grid";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import styled from "@emotion/styled";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { createOrder } from "../../functions/order";
import Input from "./Input";
import { HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import { LiaShippingFastSolid } from "react-icons/lia";

const StyledQuickFilter = styled(QuickFilter)({
  display: "grid",
  alignItems: "center",
  minWidth: 0, // allow shrinking on mobile
  flex: 1,
});

const StyledToolbarButton = styled(ToolbarButton)(({ theme, ownerState }) => ({
  gridArea: "1 / 1",
  width: "min-content",
  height: "min-content",
  zIndex: 1,
  opacity: ownerState.expanded ? 0 : 1,
  pointerEvents: ownerState.expanded ? "none" : "auto",
  //  transition: theme.transitions.create(["opacity"]),
}));

const StyledTextField = styled(TextField)(({ theme, ownerState }) => ({
  gridArea: "1 / 1",
  overflowX: "clip",
  backgroundColor: "white",
  width: ownerState.expanded ? "100%" : "var(--trigger-width)",
  opacity: ownerState.expanded ? 1 : 0,
  // transition: theme.transitions.create(["width", "opacity"]),
}));

export default function CustomToolbar({
  products,
  handleSubmitOrders,
  handleSendSelectedRows,
  loadingSelectedRows,
}) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false); // <- track search expand
  const [modalOpen, setModalOpen] = useState(false); // <-- modal state

  const [order, setOrder] = useState({
    clientName: "",
    adresse: "",
    phone: "",
    products: [],
  });

  const handleOrderFieldChange = (field, value) => {
    setOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (index, value) => {
    const updated = [...order.products];
    updated[index].productId = value;
    updated[index].sizeId = ""; // reset size when product changes
    setOrder((prev) => ({ ...prev, products: updated }));
  };

  const handleSizeChange = (index, value) => {
    const updated = [...order.products];
    updated[index].sizeId = value;
    setOrder((prev) => ({ ...prev, products: updated }));
  };

  const handleAddProductRow = () => {
    setOrder((prev) => ({
      ...prev,
      products: [...prev.products, { productId: "", sizeId: "" }],
    }));
  };

  const handleRemoveProductRow = (index) => {
    const updated = [...order.products];
    updated.splice(index, 1);
    setOrder((prev) => ({ ...prev, products: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Transform products in order.products to match API structure
    const items = order.products.map((p) => {
      const product = products.find((prod) => prod._id === p.productId);
      const size = product?.sizes.find((s) => s._id === p.sizeId);

      return {
        productId: p.productId,
        name: product?.Title,
        size: size?.name,
        price: size?.price,
        quantity: 1, // Add dynamic quantity later if needed
      };
    });

    // 2. Build customer object
    const customer = {
      fullName: order.clientName,
      address: order.adresse,
      phone: order.phone,
    };

    // 3. Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = 0; // Modify based on your rules
    const paymentMethod = "cod"; // Or dynamic
    const total = subtotal + shipping;

    // 4. Final order object
    const orderData = {
      customer,
      items,
      subtotal,
      shipping,
      paymentMethod,
      total,
    };

    try {
      // ✅ Send order to server using your API function
      const response = await createOrder(orderData);
      console.log("✅ Order placed successfully:", response);

      // Show success dialog or toast
      setIsOpen(true);

      // Optionally reset form
      setOrder({
        clientName: "",
        adresse: "",
        email: "",
        phone: "",
        products: [{ productId: "", sizeId: "" }],
      });
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }

    handleModalClose();
  };

  const exportMenuTriggerRef = useRef(null);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  return (
    <Toolbar sx={{ px: 0, py: 0 }}>
      <div className="w-full h-full px-1 md:px-2 flex items-center justify-between bg-gray-100">
        <div className="gap-2">
          <button
            onClick={handleModalOpen} // <-- open modal
            className={`items-center gap-1 px-2  md:px-2 py-2 bg-white border border-blue-400 hover:bg-blue-100 text-blue-700 rounded-xl shadow-sm text-xs md:text-xs transition
            ${searchExpanded ? "hidden sm:inline-flex" : "inline-flex"}`}
          >
            <PlusIcon className="w-4 h-4 " />
            Crée
          </button>
          <button
            disabled={loadingSelectedRows}
            onClick={handleSendSelectedRows}
            className={`items-center gap-1 px-2 md:px-2 py-2 rounded-xl shadow-sm text-xs md:text-xs transition ml-2
    ${
      loadingSelectedRows
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-white text-blue-700 border border-blue-400 hover:bg-blue-100"
    }
    ${searchExpanded ? "hidden sm:inline-flex" : "inline-flex"}
  `}
          >
            <LiaShippingFastSolid className="w-4 h-4 " />
            {loadingSelectedRows ? "Envoi..." : "Synchro"}
          </button>
        </div>

        <div className="flex items-center px-1 md:px-2">
          <div
            className={` ${
              searchExpanded ? "hidden sm:inline-flex" : "inline-flex"
            }`}
          >
            <Tooltip title="Columns">
              <ColumnsPanelTrigger render={<ToolbarButton />}>
                <ViewColumnIcon className="text-blue-700" />
              </ColumnsPanelTrigger>
            </Tooltip>
            <Tooltip title="Filters">
              <FilterPanelTrigger
                render={(props, state) => (
                  <ToolbarButton {...props} color="default">
                    <Badge
                      badgeContent={state.filterCount}
                      color="primary"
                      variant="dot"
                    >
                      <FilterListIcon className="text-blue-700" />
                    </Badge>
                  </ToolbarButton>
                )}
              />
            </Tooltip>

            <Tooltip title="Export">
              <ToolbarButton
                ref={exportMenuTriggerRef}
                id="export-menu-trigger"
                aria-controls="export-menu"
                aria-haspopup="true"
                aria-expanded={exportMenuOpen ? "true" : undefined}
                onClick={() => setExportMenuOpen(true)}
              >
                <FileDownloadIcon className="text-blue-700" />
              </ToolbarButton>
            </Tooltip>
          </div>

          <StyledQuickFilter>
            <QuickFilterTrigger
              render={(triggerProps, state) => {
                // update parent state on expand/collapse
                if (searchExpanded !== state.expanded)
                  setSearchExpanded(state.expanded);

                return (
                  <Tooltip title="Search" enterDelay={0}>
                    <StyledToolbarButton
                      {...triggerProps}
                      ownerState={{ expanded: state.expanded }}
                      color="default"
                      aria-disabled={state.expanded}
                    >
                      <SearchIcon className="text-blue-700" />
                    </StyledToolbarButton>
                  </Tooltip>
                );
              }}
            />
            <QuickFilterControl
              render={({ ref, ...controlProps }, state) => (
                <StyledTextField
                  {...controlProps}
                  ownerState={{ expanded: state.expanded }}
                  inputRef={ref}
                  aria-label="Search"
                  placeholder="Search..."
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: state.value ? (
                        <InputAdornment position="end">
                          <QuickFilterClear
                            edge="end"
                            size="small"
                            aria-label="Clear search"
                            material={{ sx: { marginRight: -0.75 } }}
                          >
                            <CancelIcon fontSize="small" />
                          </QuickFilterClear>
                        </InputAdornment>
                      ) : null,
                      ...controlProps.slotProps?.input,
                    },
                    ...controlProps.slotProps,
                  }}
                />
              )}
            />
          </StyledQuickFilter>
        </div>
        <Dialog
          open={modalOpen}
          onClose={handleModalClose}
          maxWidth="sm"
          sx={{ p: 0 }}
          fullWidth
        >
          <DialogTitle>
            {" "}
            <span className="text-lg font-semibold ">Nouvelle Commande</span>
          </DialogTitle>

          <DialogContent>
            <form id="commande-form" onSubmit={handleSubmit}>
              {/* Client Details */}

              <Input
                label="Nom du client"
                type="text"
                value={order.clientName}
                onChange={(e) =>
                  handleOrderFieldChange("clientName", e.target.value)
                }
                placeholder="Nom du client"
                className="border w-full mb-2 p-1"
              />
              <Input
                type="text"
                value={order.adresse}
                onChange={(e) =>
                  handleOrderFieldChange("adresse", e.target.value)
                }
                label="Adresse"
                className="border w-full mb-2 p-1"
                placeholder="Adresse"
              />

              <Input
                type="text"
                value={order.phone}
                onChange={(e) =>
                  handleOrderFieldChange("phone", e.target.value)
                }
                label="Téléphone"
                className="border w-full mb-2 p-1"
                placeholder="Téléphone"
              />

              {/* Dynamic Product Rows */}
              <div style={{ marginTop: "15px" }}>
                <div className="flex items-center gap-2 mb-4">
                  {" "}
                  <h4 className="text-lg font-semibold ">Produits</h4>
                  <button
                    type="button"
                    onClick={handleAddProductRow}
                    className="flex items-center  gap-2 px-2 py-1 text-xs rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400"
                  >
                    <PlusIcon className="h-5 w-5" />

                    <span> Ajouter un produit</span>
                  </button>
                </div>

                {order.products.map((item, index) => {
                  const selectedProduct = products.find(
                    (p) => p._id === item.productId
                  );

                  return (
                    <div
                      key={index}
                      className="relative bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200 mb-3"
                    >
                      {/* Remove button (X) */}
                      {order.products.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProductRow(index)}
                          className="absolute top-0 right-0 text-red-600 hover:text-red-800 
                 p-1 rounded-medium bg-red-50 hover:bg-red-100 
                 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
                        >
                          ✕
                        </button>
                      )}

                      {/* Product Select */}
                      <div className="flex flex-col md:flex-row gap-3 md:items-center">
                        <div className="w-full md:w-1/2">
                          <label className="block text-gray-600 text-sm font-medium mb-1">
                            Produit
                          </label>
                          <select
                            value={item.productId}
                            onChange={(e) =>
                              handleProductChange(index, e.target.value)
                            }
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm 
          placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 
          focus:outline-none transition bg-white"
                          >
                            <option value="">Sélectionnez un produit</option>
                            {products.map((product) => (
                              <option key={product._id} value={product._id}>
                                {product.Title}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Size Select */}
                        <div className="w-full md:w-1/2">
                          <label className="block text-gray-600 text-sm font-medium mb-1">
                            Taille
                          </label>
                          <select
                            value={item.sizeId}
                            onChange={(e) =>
                              handleSizeChange(index, e.target.value)
                            }
                            disabled={!selectedProduct}
                            className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 
          focus:outline-none transition
          ${!selectedProduct ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                          >
                            <option value="">Sélectionnez une taille</option>
                            {selectedProduct?.sizes?.map((size) => (
                              <option key={size._id} value={size._id}>
                                {size.name} - {size.price} DT
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add new product row */}
              </div>
            </form>
          </DialogContent>

          <DialogActions className="flex justify-end mt-3 px-4 py-3">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleModalClose}
              className="flex items-center gap-1 px-4 py-2 
               bg-gray-200 text-gray-700 rounded-lg 
               hover:bg-gray-300 transition 
               focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
            >
              <HiOutlineX className="h-5 w-5" />
              <span>Annuler</span>
            </button>

            {/* Create Button */}
            <button
              type="submit"
              form="commande-form"
              className="flex items-center gap-2 px-4 py-2 
               bg-green-50 text-green-600  
               rounded-xl shadow-sm 
               hover:bg-green-100 transition
               focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400"
            >
              <HiOutlineCheck className="h-5 w-5" />
              <span>Enregistrer</span>
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </Toolbar>
  );
}
