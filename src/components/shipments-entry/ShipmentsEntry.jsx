import React, { useState } from "react";
import NewCustomerModal from "../newCustomerModal/NewCustomerModal";
import "./ShipmentsEntry.css"; // Import the CSS file

const BASE = "mainUrl";

const ShipmentsEntry = () => {
  const EMPTY_ROW = {
    ctnNo: "",
    goodsName: "",
    chineseName: "",
    quantity: "",
    weight: "",
    expressNo: "",
    cbm: "",
  };

  const initialCustomerState = {
    name: "",
    phone: "",
    address: "",
  };

  const [newCustomer, setNewCustomer] = useState(initialCustomerState);
  const [newFields, setNewFields] = useState([{ ...EMPTY_ROW }]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Function to handle data catching from new shipment fields
  const updateInputFields = (index, field, value) => {
    setNewFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index][field] = value;
      return updatedFields;
    });
  };

  // Function to add a new shipment row
  const addNewShipmentRow = () => {
    setNewFields((prevFields) => [{ ...EMPTY_ROW }, ...prevFields]);
  };

  // Handle input changes
  const handleCustomerInputChange = (field, value) => {
    setNewCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission with FormData
  const handleAddCustomer = () => {
    const formData = new FormData();
    formData.append("name", newCustomer.name);
    formData.append("phone", newCustomer.phone);
    formData.append("address", newCustomer.address);

    sendCustomerData(formData);
  };

  // Example API call with FormData
  const sendCustomerData = async (formData) => {
    try {
      const response = await fetch(
        `${BASE}index.php/sell_con/saveInstantClient`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Customer created:", result);
        resetForm();
        setShowCustomerModal(false);
        window.location.reload();
      } else {
        console.error("Error creating customer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewCustomer({
      name: "",
      phone: "",
      address: "",
    });
  };

  // Function to delete a row
  const deleteRow = (index) => {
    if (newFields.length > 1) {
      setNewFields((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields.splice(index, 1);
        return updatedFields;
      });
    } else {
      setNewFields([{ ...EMPTY_ROW }]);
    }
  };

  return (
    <>
      <section className="shipments-entry-container">
        <div className="shipments-entry-inner">
          {/* Header section */}
          <header className="shipments-entry-header">
            <div className="header-center">
              <h1 className="header-title">Carton Entry</h1>
            </div>

            {/* Customer selection and actions */}
            <div className="customer-selection-card">
              <div className="customer-grid">
                {/* Customer selection - Takes 1/3 of space */}
                <div className="customer-select-wrapper">
                  <div className="form-group">
                    <label htmlFor="customer" className="form-label">
                      Select Customer
                    </label>
                    <div className="select-wrapper">
                      <select
                        id="customer"
                        name="customer"
                        required
                        className="select-element"
                        defaultValue="">
                        <option value="" disabled>
                          Choose a customer...
                        </option>
                        <option value="cust_001">Shenzhen Logistics Ltd</option>
                        <option value="cust_002">Guangzhou Trading Co</option>
                        <option value="cust_003">Yiwu Import Export</option>
                        <option value="cust_004">
                          Shanghai Manufacturing Group
                        </option>
                        <option value="cust_005">Beijing Tech Solutions</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action buttons - Take 2/3 of space */}
                <div className="button-group">
                  <button
                    onClick={() => setShowCustomerModal(true)}
                    className="button button-primary">
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
                    <th className="table-header-cell" style={{ width: "9%" }}>
                      CTN No
                    </th>
                    <th className="table-header-cell" style={{ width: "18%" }}>
                      Goods Name
                    </th>
                    <th className="table-header-cell" style={{ width: "18%" }}>
                      Chinese Name
                    </th>
                    <th className="table-header-cell" style={{ width: "9%" }}>
                      Quantity
                    </th>

                    <th className="table-header-cell" style={{ width: "9%" }}>
                      Weight (kg)
                    </th>
                    <th className="table-header-cell" style={{ width: "15%" }}>
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
                            {/* <span className="text-xs font-medium">Delete</span> */}
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
                <button className="submit-button">
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
          setShowCustomerModal={setShowCustomerModal}
          newCustomer={newCustomer}
          handleCustomerInputChange={handleCustomerInputChange}
          handleAddCustomer={handleAddCustomer}
        />
      )}
    </>
  );
};

export default ShipmentsEntry;
