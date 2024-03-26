import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, NavItem } from "react-bootstrap";
import CancelFormTable from "./CancelFormTable";
import CancelForm from "./CancelForm";

export default function ReviewInvoiceForm({
  Keys123,
  setKeys123123,
  selectValues,
  getValuesClearance,
}) {
  const [OpenForm, setOpenForm] = React.useState(false);

  const handleClose = () => {
    setKeys123123(false);
  };

  const handleOpen = () => {
    setKeys123123(false);
    setOpenForm(true);
  };
  return (
    <div>
      <Modal show={Keys123} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Magod Laser:Invoice Summary{" "}
          </Modal.Title>
        </Modal.Header>

        <label className="ms-4 form-label">Magod Laser Invoice </label>

        <Modal.Body>
          <>
            <div className="row">
              <div className="d-flex col-md-4" style={{ gap: "10px" }}>
                <div>
                  <label
                    className="form-label"
                    // style={{ whiteSpace: "nowrap" }}
                  >
                    Invoice no
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.Inv_No}
                    disabled
                  />
                </div>
              </div>
              <div className="d-flex col-md-4" style={{ gap: "40px" }}>
                <div>
                  <label
                    className="form-label"
                    // style={{ whiteSpace: "nowrap" }}
                  >
                    {" "}
                    Net Total
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.Net_Total}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "40px" }}>
                <div>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {" "}
                    Tax Amount
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.TaxAmount}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "40px" }}>
                <div>
                  <label
                    className="form-label"
                    // style={{ whiteSpace: "nowrap" }}
                  >
                    {" "}
                    Date
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.date}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "42px" }}>
                <div>
                  <label
                    className="form-label"
                    // style={{ whiteSpace: "nowrap" }}
                  >
                    Discount
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.Discount}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "10px" }}>
                <div>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Delivery Charges
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.Del_Chg}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "40px" }}>
                <div>
                  <label className="form-label">Type</label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.DC_InvType}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "20px" }}>
                <div>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Material cost
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.MtrlChg}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "50px" }}>
                <div>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Round off
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.Round_Off}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "50px" }}>
                <div>
                  <label className="form-label">Dc</label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.DC_No}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "10px" }}>
                <div>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Assessed value
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.Net_Total}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "40px" }}>
                <div>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Grand Total
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.GrandTotal}
                    disabled
                  />
                </div>
              </div>
              <div className="d-flex col-md-4" style={{ gap: "30px" }}>
                <div>
                  <label
                    className="form-label"
                    // style={{ whiteSpace: "nowrap" }}
                  >
                    Status
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.DCStatus}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "40px" }}>
                <div>
                  <label className="form-label">Customer</label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.Cust_Name}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-4" style={{ gap: "62px" }}>
                <div>
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    GST No
                  </label>
                </div>
                <div>
                  <input
                    className="in-field mt-2"
                    value={selectValues.GSTNo}
                    disabled
                  />
                </div>
              </div>

              <div
                className="d-flex col-md-4 mt-1"
                style={{ marginLeft: "510px" }}
              >
                <div>
                  <button className="button-style group-button" type="button">
                    Update summary
                  </button>
                </div>
                <div>
                  <button
                    className="button-style group-button"
                    type="button"
                    onClick={handleOpen}
                  >
                    Cancel Invoice
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Clearance Summary Details </label>

              <CancelFormTable getValuesClearance={getValuesClearance} />
            </div>
          </>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </Modal>
      {
        <CancelForm
          OpenForm={OpenForm}
          setOpenForm={setOpenForm}
          selectValues={selectValues}
        />
      }
    </div>
  );
}
