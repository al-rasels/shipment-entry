import React, { useState } from "react";
import NewCustomerModal from "../newCustomerModal/NewCustomerModal";

const ShipmentsEntry = () => {
  const EMPTY_ROW = {
    ctnNo: "",
    goodsName: "",
    chineseName: "",
    quantity: "",
    unit: "",
    weight: "",
    expressNo: "",
    cbm: "",
  };

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

  const addNewShipmentRow = () => {
    setNewFields((prevFields) => [{ ...EMPTY_ROW }, ...prevFields]);
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
      // If it's the last row, just reset it
      setNewFields([{ ...EMPTY_ROW }]);
    }
  };

  return (
    <>
      <section className="bg-linear-to-br from-gray-50 to-blue-50 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-7xl w-full p-6 bg-white rounded-2xl shadow-xl">
          {/* Header section */}
          <header className="mb-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Carton Entry
              </h1>
            </div>

            {/* Customer selection and actions */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
              <div className="grid grid-cols-2 gap-6 items-center">
                {/* Customer selection */}
                <div className="space-y-2">
                  <label
                    htmlFor="customer"
                    className="block text-sm font-medium text-gray-700">
                    Select Customer
                  </label>
                  <div className="relative">
                    <select
                      id="customer"
                      name="customer"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 outline-none focus:ring-blue-200 transition-all duration-200 bg-white appearance-none cursor-pointer">
                      <option value="">Choose a customer...</option>
                      <option value="cust_001">Shenzhen Logistics Ltd</option>
                      <option value="cust_002">Guangzhou Trading Co</option>
                      <option value="cust_003">Yiwu Import Export</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-5">
                  <button
                    onClick={() => setShowCustomerModal(true)}
                    className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-8 py-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer">
                    <svg
                      className="w-5 h-5"
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
                    className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer">
                    <svg
                      className="w-5 h-5"
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
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-linear-to-r from-blue-700 to-blue-500">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[9%]">
                      CTN No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[18%]">
                      Goods Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[18%]">
                      Chinese Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[9%]">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[6%]">
                      Unit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[9%]">
                      Weight (kg)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[14%]">
                      Express No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[9%]">
                      CBM
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[8%]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {newFields.map((field, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={field.ctnNo}
                          onChange={(e) =>
                            updateInputFields(index, "ctnNo", e.target.value)
                          }
                          placeholder="CTN No"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={field.quantity}
                          onChange={(e) =>
                            updateInputFields(index, "quantity", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          placeholder="Unit"
                          value={field.unit}
                          onChange={(e) =>
                            updateInputFields(index, "unit", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          placeholder="Weight"
                          value={field.weight}
                          onChange={(e) =>
                            updateInputFields(index, "weight", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={field.cbm}
                          onChange={(e) =>
                            updateInputFields(index, "cbm", e.target.value)
                          }
                          placeholder="CBM"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex justify-center">
                          <button
                            onClick={() => deleteRow(index)}
                            disabled={newFields.length === 1}
                            className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-1 ${
                              newFields.length === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 text-white hover:shadow-md cursor-pointer"
                            }`}
                            title={
                              newFields.length === 1
                                ? "Cannot delete the last row"
                                : "Delete this row"
                            }>
                            <svg
                              className="w-4 h-4"
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
                            <span className="text-xs font-medium">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4 border-t border-gray-200">
              <div className="mx-auto max-w-max">
                <button className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-8 py-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer">
                  <svg
                    className="w-5 h-5"
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
        <NewCustomerModal setShowCustomerModal={setShowCustomerModal} />
      )}
    </>
  );
};;;;;;;;

export default ShipmentsEntry;



 