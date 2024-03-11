import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Table3 from "./Table3";

export default function InvoiceTable1({
  matchedInvoices,
  unmatchedInvoices,
  invPaymentVrList,
}) {
  console.log("iii", matchedInvoices);
  console.log("jj", unmatchedInvoices);
  console.log("kkk", invPaymentVrList);

  const [selectRow, setSelectRow] = useState([]);

  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    setSelectRow(list);
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Find the object in cmdInvPaymentVrList with the matching dc_inv_no
  const selectedPaymentVr = invPaymentVrList.find(
    (paymentVr) => paymentVr.dc_inv_no === selectRow.DC_Inv_No
  );

  return (
    <>
      <div className="">
        <label className="form-label">
          Missing /Mismatch Invoice Count {unmatchedInvoices.length}
        </label>
      </div>
      <div className="row">
        <div
          className="col-md-6"
          style={{ height: "300px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <div className="row">
            <div className=" col-md-5">
              <div>
                <label className="form-label">Unit Information</label>{" "}
              </div>
            </div>
            <button
              className="button-style mt-2 group-button"
              style={{ width: "80px" }}
            >
              Filter
            </button>
          </div>
          <Table striped className="table-data border mt-1">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th>Inv Type</th>
                <th>Inv No</th>
                <th>Date</th>
                <th>Inv Total</th>
                <th>Amt Received</th>
                <th>Customer</th>
                <th>Inv Status</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              {/* Render rows for matchedInvoices */}
              {matchedInvoices?.map((item, index) => (
                <tr
                  onClick={() => selectedRowFun(item, index)}
                  className={
                    index === selectRow?.index ? "selcted-row-clr" : ""
                  }
                  key={`matched-${item.DC_Inv_No}`}
                  style={{ backgroundColor: "#92ec93", whiteSpace: "nowrap" }}
                >
                  <td>{item.DC_InvType}</td>
                  <td>{item.Inv_No}</td>
                  <td>{formatDate(item.Dc_inv_Date)}</td>
                  <td>{item.InvTotal}</td>
                  <td>{item.PymtAmtRecd}</td>
                  <td>{item.Cust_Name}</td>
                  <td>{item.DCStatus}</td>
                </tr>
              ))}

              {/* Render rows for unmatchedInvoices */}
              {unmatchedInvoices?.map((item) => (
                <tr
                  key={`unmatched-${item.DC_Inv_No}`}
                  style={{ backgroundColor: "#f48483", whiteSpace: "nowrap" }}
                >
                  <td>{item.DC_InvType}</td>
                  <td>{item.Inv_No}</td>
                  <td>{formatDate(item.Dc_inv_Date)}</td>
                  <td>{item.InvTotal}</td>
                  <td>{item.PymtAmtRecd}</td>
                  <td>{item.Cust_Name}</td>
                  <td>{item.DCStatus}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div
          className="col-md-6"
          style={{ height: "300px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <div className="row">
            <div className="  col-md-5">
              <div>
                <label className="form-label"> HO Information</label>{" "}
              </div>
            </div>
            <button
              className="button-style mt-2 group-button"
              style={{ width: "80px" }}
            >
              Filter
            </button>
          </div>

          <Table striped className="table-data border mt-1">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th>Inv Type</th>
                <th>Inv No</th>
                <th>Date</th>
                <th>Inv Total</th>
                <th>Amt Received</th>
                <th>Customer</th>
                <th>Inv Status</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

      {/* Table3 and table4 */}

      <div className="row">
        <div
          className="col-md-6"
          style={{ height: "300px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th>VoucherNo</th>
                <th>TxnType</th>
                <th>Receive_Now</th>
                <th>VoucherStatus</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              <tr style={{ whiteSpace: "nowrap" }}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div
          className="col-md-6"
          style={{ height: "300px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr>
                <th>VoucherNo</th>
                <th>TxnType</th>
                <th>Receive_Now</th>
                <th>VoucherStatus</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
