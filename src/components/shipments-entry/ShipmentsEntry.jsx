import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import NewCustomerModal from "../newCustomerModal/NewCustomerModal";
import "./ShipmentsEntry.css";

const BASE = mainUrl;

const ShipmentsEntry = () => {
  /* =======================
     CONSTANTS
  ======================= */
  const EMPTY_ROW = {
    ctnNo: "",
    goodsName: "",
    chineseName: "",
    quantity: "",
    weight: "",
    netWeight: "",
    expressNo: "",
    cbm: "",
  };

  const initialCustomerState = {
    name: "",
    phone: "",
    address: "",
  };

  /* =======================
     STATES
  ======================= */
  const [newCustomer, setNewCustomer] = useState(initialCustomerState);
  const [newFields, setNewFields] = useState([{ ...EMPTY_ROW }]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingShipments, setLoadingShipments] = useState(true);

  /* =======================
     TABLE HANDLERS
  ======================= */
  const updateInputFields = (index, field, value) => {
    setNewFields((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addNewShipmentRow = () => {
    setNewFields((prev) => [...prev, { ...EMPTY_ROW }]);
  };

  const deleteRow = (index) => {
    if (newFields.length > 1) {
      setNewFields((prev) => prev.filter((_, i) => i !== index));
    }
  };

  /* =======================
     SUBMIT CARTONS (MAIN)
  ======================= */
  const handleSubmitCartons = async () => {
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }
    if (!selectedShipment) {
      toast.error("Please select a shipment");
      return;
    }

    const validRows = newFields.filter((row) => row.ctnNo && row.goodsName);

    if (validRows.length === 0) {
      toast.error("Please enter at least one valid carton");
      return;
    }

    const formData = new FormData();
    formData.append("client_id", selectedCustomer.value);
    formData.append("shipment_id", selectedShipment.value); // newly added shipment_id field or  name as per backend requirement

    validRows.forEach((row) => {
      formData.append("ctn_no[]", row.ctnNo);
      formData.append("goods_name[]", row.goodsName);
      formData.append("chinese_name[]", row.chineseName);
      formData.append("goods_qty[]", row.quantity);
      formData.append("unit[]", "PCS");
      formData.append("weight[]", row.weight);
      formData.append("net_weight[]", row.netWeight);
      formData.append("express_no[]", row.expressNo);
      formData.append("cbm[]", row.cbm);
    });

    try {
      const res = await fetch(
        `${BASE}index.php/plugins/freight/save-multiple-data`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      console.log(data);
      if (data.code == 1) {
        toast.success(data.message || "Cartons saved successfully");
        setNewFields([{ ...EMPTY_ROW }]);
      } else {
        toast.error(data.message || "Failed to save cartons");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  /* =======================
     CUSTOMER CREATE
  ======================= */
  const handleCustomerInputChange = (field, value) => {
    setNewCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Name and phone are required");
      return;
    }

    const formData = new FormData();
    formData.append("client_name", newCustomer.name);
    formData.append("client_mobile", newCustomer.phone);
    formData.append("client_address", newCustomer.address);
    formData.append("client_star", "0");

    try {
      const res = await fetch(`${BASE}index.php/sell_con/saveInstantClient`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result?.message);

      toast.success("Customer created successfully!");

      setCustomers((prev) => [
        { id: result.id, text: `${newCustomer.name} : ${newCustomer.phone}` },
        ...prev,
      ]);

      setNewCustomer(initialCustomerState);
      setShowCustomerModal(false);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  /* =======================
     FETCH CUSTOMERS
  ======================= */
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const res = await fetch(`${BASE}index.php/client/ajax_clientDropdown`);
        const data = await res.json();
        setCustomers(Array.isArray(data?.result) ? data.result : []);
      } catch (err) {
        console.error(err);
        setCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  /* =======================
     FETCH SHIPMENTS ON CUSTOMER SELECT
  ======================= */
  useEffect(() => {
    const fetchShipment = async () => {
      setLoadingShipments(true);
      try {
        const res = await fetch(`${BASE}index.php/plugins/freight/shipments`); // Replace with actual endpoint to fetch shipments based on selected customer
        const data = await res.json();
        setShipments(Array.isArray(data?.result) ? data.result : []);
      } catch (err) {
        console.error(err);
        setShipments([]);
      } finally {
        setLoadingShipments(false);
      }
    };

    fetchShipment();
  }, []);

  /* ======================= SUMMARY COUNTS ======================= */
  const totalRows = newFields.length;

  const totalQuantity = newFields.reduce((sum, row) => {
    const val = parseFloat(row.quantity);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const totalWeight = newFields.reduce((sum, row) => {
    const val = parseFloat(row.weight);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const totalNetWeight = newFields.reduce((sum, row) => {
    const val = parseFloat(row.netWeight);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <>
      <section className="shipments-entry-container">
        <div className="shipments-entry-inner">
          {/* ======================= COUNT CARDS ======================= */}
          <div className="count-cards-wrapper">
            <div className="count-card count-card--rows">
              <div className="count-card__icon-wrap">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="count-card__svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"
                  />
                </svg>
              </div>
              <span className="count-card__label">Total Cartons</span>
              <span className="count-card__value">{totalRows}</span>
              <span className="count-card__sub">carton entries</span>
            </div>

            <div className="count-card count-card--qty">
              <div className="count-card__icon-wrap">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="count-card__svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M3 3h18M3 9h18M3 15h18M3 21h18"
                  />
                  <circle cx="7" cy="3" r="1" fill="currentColor" />
                  <circle cx="7" cy="9" r="1" fill="currentColor" />
                  <circle cx="7" cy="15" r="1" fill="currentColor" />
                  <circle cx="7" cy="21" r="1" fill="currentColor" />
                </svg>
              </div>
              <span className="count-card__label">Total Quantity</span>
              <span className="count-card__value">
                {totalQuantity.toLocaleString()}
                <span className="count-card__unit">PCS</span>
              </span>
              <span className="count-card__sub">across all rows</span>
            </div>

            <div className="count-card count-card--weight">
              <div className="count-card__icon-wrap">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="count-card__svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 3a3 3 0 100 6 3 3 0 000-6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M6.5 9H4a1 1 0 00-.98.804L2 19a2 2 0 002 2h16a2 2 0 002-2l-1.02-9.196A1 1 0 0019.98 9H17.5"
                  />
                </svg>
              </div>
              <span className="count-card__label">Total Weight</span>
              <span className="count-card__value">
                {totalWeight.toFixed(2)}
                <span className="count-card__unit">KG</span>
              </span>
              <span className="count-card__sub">gross weight</span>
            </div>

            <div className="count-card count-card--netweight">
              <div className="count-card__icon-wrap">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="count-card__svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M9 14l2 2 4-4"
                  />
                </svg>
              </div>
              <span className="count-card__label">Total Net Weight</span>
              <span className="count-card__value">
                {totalNetWeight.toFixed(2)}
                <span className="count-card__unit">KG</span>
              </span>
              <span className="count-card__sub">net weight</span>
            </div>
          </div>
          {/* Header section */}
          <header className="shipments-entry-header">
            <div className="header-center">
              <h1 className="header-title">Carton Entry</h1>
            </div>

            {/* Customer selection and actions */}
            <div className="customer-selection-card">
              <div className="customer-grid">
                {/*  selection - Takes 1/3 of space */}
                <div className="customer-select-wrapper">
                  {/* customer selection  */}
                  <div className="form-group">
                    <label htmlFor="customer" className="form-label">
                      Select Customer
                    </label>
                    <div className="select-wrapper">
                      <Select
                        isLoading={loadingCustomers}
                        options={customers.map((c) => ({
                          value: c.id,
                          label: c.text,
                        }))}
                        placeholder="Search customer by name or phone..."
                        onChange={(option) => setSelectedCustomer(option)}
                        isClearable
                      />
                    </div>
                  </div>
                  {/* shipment selection  */}
                  <div className="form-group">
                    <label htmlFor="customer" className="form-label">
                      Select Shipment
                    </label>
                    <div className="select-wrapper">
                      <Select
                        isLoading={loadingShipments}
                        options={shipments.map((s) => ({
                          value: s.id,
                          label: s.text,
                        }))}
                        placeholder="Search shipment by name..."
                        onChange={(option) => setSelectedShipment(option)}
                        isClearable
                      />
                    </div>
                  </div>
                </div>

                {/* Action buttons - Take 2/3 of space */}
                <div className="button-group">
                  <button
                    onClick={() => setShowCustomerModal(true)}
                    className="button button-secondary">
                    <svg
                      className="icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add New Customer
                  </button>

                  <button
                    onClick={addNewShipmentRow}
                    className="button button-secondary">
                    <svg
                      className="icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add New Carton
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Table section */}
          <div className="table-container">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr className="table-header">
                    <th className="table-header-cell" style={{ width: "8%" }}>
                      CTN No
                    </th>
                    <th className="table-header-cell" style={{ width: "17%" }}>
                      Goods Name
                    </th>
                    <th className="table-header-cell" style={{ width: "17%" }}>
                      Chinese Name
                    </th>
                    <th className="table-header-cell" style={{ width: "8%" }}>
                      Quantity
                    </th>
                    <th className="table-header-cell" style={{ width: "5%" }}>
                      Unit
                    </th>
                    <th className="table-header-cell" style={{ width: "8%" }}>
                      G Weight (kg)
                    </th>
                    <th className="table-header-cell" style={{ width: "10%" }}>
                      {" "}
                      Net Weight (kg)
                    </th>
                    <th className="table-header-cell" style={{ width: "10%" }}>
                      Express No
                    </th>
                    <th className="table-header-cell" style={{ width: "10%" }}>
                      CBM
                    </th>
                    <th className="table-header-cell" style={{ width: "5%" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {newFields.map((field, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell">
                        <input
                          type="text"
                          value={field.ctnNo}
                          onChange={(e) =>
                            updateInputFields(index, "ctnNo", e.target.value)
                          }
                          placeholder="CTN No"
                          className="input-field"
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="text"
                          value={field.goodsName}
                          onChange={(e) =>
                            updateInputFields(
                              index,
                              "goodsName",
                              e.target.value,
                            )
                          }
                          placeholder="Goods Name"
                          className="input-field"
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="text"
                          value={field.chineseName}
                          onChange={(e) =>
                            updateInputFields(
                              index,
                              "chineseName",
                              e.target.value,
                            )
                          }
                          placeholder="Chinese Name"
                          className="input-field"
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={field.quantity}
                          onChange={(e) =>
                            updateInputFields(index, "quantity", e.target.value)
                          }
                          className="input-field"
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="text"
                          placeholder="Unit"
                          value="PCS"
                          className="input-field"
                        />
                      </td>

                      <td className="table-cell">
                        <input
                          type="number"
                          placeholder="Weight"
                          value={field.weight}
                          onChange={(e) =>
                            updateInputFields(index, "weight", e.target.value)
                          }
                          className="input-field"
                        />
                      </td>
                      <td className="table-cell">
                        {" "}
                        {/*  new added  */}
                        <input
                          type="number"
                          placeholder="Net Weight"
                          value={field.netWeight}
                          onChange={(e) =>
                            updateInputFields(
                              index,
                              "netWeight",
                              e.target.value,
                            )
                          }
                          className="input-field"
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="text"
                          value={field.expressNo}
                          onChange={(e) =>
                            updateInputFields(
                              index,
                              "expressNo",
                              e.target.value,
                            )
                          }
                          placeholder="Express No"
                          className="input-field"
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          value={field.cbm}
                          onChange={(e) =>
                            updateInputFields(index, "cbm", e.target.value)
                          }
                          placeholder="CBM"
                          className="input-field"
                        />
                      </td>
                      <td className="table-cell">
                        <div className="delete-button-container">
                          <button
                            onClick={() => deleteRow(index)}
                            disabled={newFields.length === 1}
                            className={`delete-button ${newFields.length === 1 ? "disabled" : ""}`}
                            title={
                              newFields.length === 1
                                ? "Cannot delete the last row"
                                : "Delete this row"
                            }>
                            <svg
                              className="icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="table-footer">
              <div className="footer-content">
                <button onClick={handleSubmitCartons} className="submit-button">
                  <svg
                    className="icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Submit Cartons
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Creation Modal */}
      {showCustomerModal && (
        <NewCustomerModal
          newCustomer={newCustomer}
          handleCustomerInputChange={handleCustomerInputChange}
          setShowCustomerModal={setShowCustomerModal}
          handleAddCustomer={handleAddCustomer}
        />
      )}
    </>
  );
};

export default ShipmentsEntry;
