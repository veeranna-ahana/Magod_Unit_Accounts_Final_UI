import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import CancelPop from "./CancelPop";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CancelForm({ OpenForm, setOpenForm, selectValues }) {
  const [popupBox, setpopBox] = React.useState(false);
  const [cancelData, setCancelData] = useState("");
  const [lastToastTimestamp, setLastToastTimestamp] = useState(0);

  const cooldownDuration = 6000; // 5 seconds (adjust as needed)

  const handleClose = () => {
    console.log("closee");
    setOpenForm(false);
  };

  // const handleSubmit = () => {
  //   if (cancelData.length < 20) {
  //     // toast.error("Cancel reason must be at least 20 characters.");
  //     toast.error("Give Detailed reason to Include Who, Why of Cancellation at least 20 characters.");
  //   }else{
  //   setOpenForm(false);
  //   setpopBox(true);
  //   }
  // };

  const handleSubmit = () => {
    const now = Date.now();
    if (now - lastToastTimestamp >= cooldownDuration) {
      if (cancelData.length < 20) {
        // Show the toast and set the timestamp
        setLastToastTimestamp(now);

        // Display the specific error message
        toast.error(
          "Give Detailed reason to Include Who, Why of Cancellation at least 20 characters."
        );
      } else {
        setOpenForm(false);
        setpopBox(true);
      }
    }
  };

  const handleCalncelReason = (event) => {
    const cancelReason = event.target.value;
    setCancelData(cancelReason);
  };

  return (
    <div>
      <Modal size="lg" show={OpenForm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Magod Laser: Invoice Cancellation Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div className="">
              <div className="row">
                <div className="col-md-1" style={{ whiteSpace: "nowrap" }}>
                  <div className="">
                    <label className="form-label"> Invoice no</label>
                  </div>

                  <div className="">
                    <label className="form-label">Date</label>
                  </div>

                  <div className="">
                    <label className="form-label">Customer</label>
                  </div>

                  <div className="">
                    <label className="form-label">Value</label>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mt-1">
                    <input
                      className="in-field"
                      value={selectValues.Inv_No}
                      disabled
                    />
                  </div>

                  <div className="mt-2">
                    <input
                      className="in-field"
                      value={selectValues.date}
                      disabled
                    />
                  </div>

                  <div className="mt-2">
                    <input
                      className="in-field"
                      value={selectValues.Cust_Name}
                      disabled
                    />
                  </div>

                  <div className="mt-2">
                    <input
                      className="in-field"
                      value={selectValues.GrandTotal}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <label className="form-label">Reason for Cancellation </label>
                <textarea
                  className="in-field"
                  style={{ width: "500px", height: "100px", resize: "none" }}
                  type="textarea"
                  value={cancelData}
                  onChange={handleCalncelReason}
                />
              </div>

              <div className="col-md-4 mb-3">
                <button
                  className="button-style group-button"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        </Modal.Body>
      </Modal>
      {
        <CancelPop
          popupBox={popupBox}
          setpopBox={setpopBox}
          selectValues={selectValues}
          cancelData={cancelData}
        />
      }
    </div>
  );
}
