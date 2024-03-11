import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, NavItem } from "react-bootstrap";
import CancelFormTable from "./CancelFormTable";
import CancelForm from "./CancelForm";

export default function ReviewInvoiceForm({Keys123, setKeys123123, selectValues,
  getValuesClearance}) {


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
          <Modal.Title>Magod Laser:Invoice Summary </Modal.Title>
        </Modal.Header>

        <label className="ms-5 form-label">Magod Laser Invoice </label>

        <Modal.Body>
          <div className="col-md-12 col-sm-12">
            <div className="row">
              <div className="col-md-4">
                <label className="form-label "> Invoice no</label>
                <input className="" value={selectValues.Inv_No} disabled/>
              </div>
              <div className="col-md-3">
                <label className="form-label"> Net Total</label>
                <input className="" value={selectValues.Net_Total} disabled/>
              </div>
              <div className="col-md-4">
                <label className="form-label"> Tax Amount</label>
                <input className="" value={selectValues.TaxAmount} disabled/>
              </div>

              <div className="col-md-4">
                <label className="form-label"> Date</label>
                <input className="" value={selectValues.date} disabled/>
              </div>

              <div className="col-md-3">
                <label className="form-label">Discount</label>
                <input className="" value={selectValues.Discount} disabled/>
              </div>

              <div className="col-md-4">
                <label className="form-label">Delivery Charges</label>
                <input className="" value={selectValues.Del_Chg} disabled/>
              </div>

              <div className="col-md-4">
                <label className="form-label">Type</label>
                <input className="" value={selectValues.DC_InvType} disabled/>
              </div>

              <div className="col-md-3">
                <label className="form-label">Material cost</label>
                <input className="" value={selectValues.MtrlChg} disabled/>
              </div>

              <div className="col-md-4">
                <label className="form-label">Round off</label>
                <input className="" value={selectValues.Round_Off} disabled/>
              </div>

              <div className="col-md-4">
                <label className="form-label">Dc</label>
                <input className="" value={selectValues.DC_No} disabled/>
              </div>

              <div className="col-md-3">
                <label className="form-label">Assessed value</label>
                <input className="" value={selectValues.Net_Total} disabled/>
              </div>

              <div className="col-md-4 ">
                <label className="form-label">Grand Total</label>
                <input className="" value={selectValues.GrandTotal} disabled/>
              </div>
              <div className="col-md-4 ">
                <label className="form-label">Status</label>
                <input className="" value={selectValues.DCStatus} disabled/>
              </div>

              <div className="col-md-4 mt-4">
                <Button variant="primary" type="submit">
                  Update summary
                </Button>
              </div>

              <div className="col-md-4 mt-4">
                <Button variant="primary" type="submit" onClick={handleOpen}>
                  Cancel Invoice
                </Button>
              </div>

              <div className="col-md-4">
                <label className="form-label">Customer</label>
                <input className="" value={selectValues.Cust_Name} disabled/>
              </div>

              <div className="col-md-4 ">
                <label className="form-label">GST No</label>
                <input className="" value={selectValues.GSTNo} disabled/>
              </div>
            </div>

            <div>
              <label className="form-label">Clearance Summary Details </label>

              <CancelFormTable getValuesClearance={getValuesClearance}/>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </Modal>
      {<CancelForm OpenForm={OpenForm} setOpenForm={setOpenForm} selectValues={selectValues}/>}
    </div>
  );
}
