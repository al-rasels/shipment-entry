import React from "react";
import "./NewCustomerModal.css"; // Import the CSS file

const NewCustomerModal = ({
  newCustomer,
  handleCustomerInputChange,
  setShowCustomerModal,
  handleAddCustomer,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Create New Customer</h2>
            <button
              onClick={() => setShowCustomerModal(false)}
              className="close-button">
              <svg
                className="close-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="modal-form">
            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                value={newCustomer.name}
                onChange={(e) =>
                  handleCustomerInputChange("name", e.target.value)
                }
                className="form-input"
                placeholder="Enter customer name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) =>
                  handleCustomerInputChange("phone", e.target.value)
                }
                className="form-input"
                placeholder="+86 123 4567 8900"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                value={newCustomer.address}
                onChange={(e) =>
                  handleCustomerInputChange("address", e.target.value)
                }
                className="form-textarea"
                placeholder="Enter complete address"
                rows="3"
              />
            </div>
          </div>

          <div className="modal-buttons">
            <button
              onClick={() => setShowCustomerModal(false)}
              className="cancel-button">
              Cancel
            </button>
            <button onClick={handleAddCustomer} className="create-button">
              Create Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCustomerModal;
