import React, { useEffect, useState } from "react";
import axios from "axios";
import MagodLogo from "../../../../../../../Logo/MagodLogo.png";
import { baseURL } from "../../../../../../../api/baseUrl";

const styles = {
  heading: {
    fontSize: "25px",
    fontWeight: "bold",
  },
  textBold: {
    fontWeight: "bold",
  },
  line: {
    height: "1px",
    backgroundColor: "black",
    margin: "0px 0px",
  },
  line1: {
    height: "1px",
    backgroundColor: "black",
    marginBottom: "20px",
  },
  line2: {
    height: "1px",
    backgroundColor: "black",
    marginTop: "10px",
  },
  boxContainer: {
    border: "2px solid black", // Border for the box
    padding: "10px", // Add padding inside the box
    marginBottom: "20px", // Margin at the bottom of the box
  },
};

const ReceiptReportPdf = React.forwardRef((props, ref) => {
  const taxValues = props.getPdfTaxValuess;
  const taxCustValues = props.groupedCustTaxArray;
  const CustomersTaxValues = props.getCustTax;
  const totalTax = props.overallTotal;
  const totalOnAccountValue = props.overallOnAccountTotal;
  const date = props.date;

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  const totalAmtRecd = taxValues
    .reduce((acc, item) => acc + parseFloat(item.Total || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalOnAccount = taxValues
    .reduce((acc, item) => acc + parseFloat(item.On_account || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalTaxAmt = CustomersTaxValues.reduce(
    (acc, item) => acc + parseFloat(item.Amount || 0),
    0
  )
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalOnAccAmt = CustomersTaxValues.reduce(
    (acc, item) => acc + parseFloat(item.On_account || 0),
    0
  )
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  console.log("hello", taxCustValues);

  return (
    <div>
      <div ref={ref}>
        <style type="text/css" media="print">
          {`
          @page {
            size: A4 portrait;
            margin-top: 50px; /* Add top margin to the printed page */ 
           
          }

          /* Add page breaks before certain elements if necessary */
          .page-break {
            page-break-before: always;
          }  
        `}
        </style>

        <div
          className="p-0 page"
          style={{
            marginLeft: "35px",
            marginRight: "35px",
            marginBottom: "30px",
          }}
        >
          <div className="row">
            <div>
              <div className="row">
                <div className="col-md-2 col-sm-12">
                  <img
                    src={MagodLogo}
                    alt="ML logo"
                    style={{
                      width: "50%",
                      marginLeft: "20%",
                      marginBottom: "2%",
                    }}
                  />
                </div>
                <div
                  className="col-md-7 col-sm-12 justify-content-center"
                  style={{ marginLeft: "70px" }}
                >
                  <div className="row justify-content-center">
                    <span style={styles.heading}>
                      Magod Laser Machining Pvt Ltd
                    </span>
                    {/* <span style={styles.heading}>{item.typeofform}</span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Draw A line */}
          <div style={styles.line}></div>
          <div>
            <div className="row" style={{ marginLeft: "10px" }}>
              <div className="col-md-6 col-sm-12">
                <div className="row">
                  <div className="col-md-2 col-sm-12">
                    <div className="d-flex flex-column">
                      <span>
                        <b>Unit</b>
                      </span>
                      <span>
                        <b>Date</b>
                      </span>
                    </div>
                  </div>
                  <div className="col-md-1 col-sm-12">
                    <div className="d-flex flex-column">
                      <span>:</span>
                      <span>:</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="d-flex flex-column">
                      <span>
                        <b>Jigani</b>
                      </span>
                      <span>
                        <b>{formatDate(date)}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <div className="d-flex flex-column">
                      <span>
                        <b>Prepared By</b>
                      </span>
                      <span>
                        <b>Approved By</b>
                      </span>
                    </div>
                  </div>
                  <div className="col-md-1 col-sm-12">
                    <div className="d-flex flex-column">
                      <span>:</span>
                      <span>:</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="d-flex flex-column">
                      <span>
                        <b></b>
                      </span>
                      <span>
                        <b></b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.line}></div>

          <div className="row" style={{ marginLeft: "200px" }}>
            <div style={{ width: "30%" }}>
              <span>Txn Type</span>
            </div>
            <div style={{ width: "40%", textAlign: "right" }}>
              <span>Amount Received</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>On Account</span>
            </div>
          </div>

          <div style={styles.line}></div>

          {taxValues.map((item, idx) => (
            <div className="row" style={{ marginLeft: "200px" }}>
              <div style={{ width: "30%" }}>
                <span>{item.TxnType}</span>
              </div>
              <div style={{ width: "40%", textAlign: "right" }}>
                <span>{formatAmount(item.Total)}</span>
              </div>
              <div style={{ width: "20%", textAlign: "right" }}>
                <span>{formatAmount(item.On_account)}</span>
              </div>
            </div>
          ))}

          <div style={styles.line}></div>

          <div className="row" style={{ marginLeft: "200px" }}>
            <div style={{ width: "30%" }}>
              <span></span>
            </div>
            <div style={{ width: "40%", textAlign:'right' }}>
              <span>{totalAmtRecd}</span>
            </div>
            <div style={{ width: "20%", textAlign:'right' }}>
              <span>{totalOnAccount}</span>
            </div>
          </div>

          <div style={styles.line1}></div>

          <div className="row" style={{ marginLeft: "200px" }}>
            <div style={{ width: "30%" }}>
              <span>Txn Type</span>
            </div>
            <div style={{ width: "40%", textAlign: "right" }}>
              <span>Amount Received</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>On Account</span>
            </div>
          </div>
          <div style={styles.line}></div>

          {taxCustValues.map((group, idx) => (
            <div>
              <div style={{ width: "40%" }}>
                <span>
                  <b>{group.custName}</b>
                </span>
              </div>

              {/* <div  style={styles.line}></div> */}
              {group.items.map((item, index) => (
                <div className="row" style={{ marginLeft: "200px" }}>
                  <div style={{ width: "30%" }}>
                    <span>{item.TxnType}</span>
                  </div>
                  <div style={{ width: "40%", textAlign: "right" }}>
                    <span>{formatAmount(item.Amount)}</span>
                  </div>
                  <div style={{ width: "20%", textAlign: "right" }}>
                    <span>{formatAmount(item.On_account)}</span>
                  </div>
                </div>
              ))}

              <div style={styles.line}></div>
              <div className="row" style={{ marginLeft: "200px" }}>
                <div style={{ width: "30%" }}>
                  <span></span>
                </div>
                <div style={{ width: "40%", textAlign: "right" }}>
                  <span>{group.total}</span>
                </div>
                <div style={{ width: "20%", textAlign: "right" }}>
                  <span>{group.onAccountTotal}</span>
                </div>
              </div>
              <div style={styles.line}></div>
            </div>
          ))}

          <div>
            <div style={styles.line}></div>
            <div className="row" style={{ marginLeft: "200px" }}>
              <div style={{ width: "30%" }}>
                <span></span>
              </div>
              <div style={{ width: "40%", textAlign: "right" }}>
                <span>{totalTax}</span>
              </div>
              <div style={{ width: "20%", textAlign: "right" }}>
                <span>{totalOnAccountValue}</span>
              </div>
            </div>
          </div>

          <div className="row mt-4" style={{ marginLeft: "30px" }}>
            <div style={{ width: "20%" }}>
              <span>RVr No</span>
            </div>
            <div style={{ width: "20%" }}>
              <span>Customer</span>
            </div>
            <div style={{ width: "20%" }}>
              <span>Txn Type</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>Amount</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>On Account</span>
            </div>
          </div>
          <div style={styles.line}></div>

          {CustomersTaxValues.map((item, idx) => (
            <div className="row" style={{ marginLeft: "30px" }}>
              <div style={{ width: "20%" }}>
                <span>{item.Recd_PVNO}</span>
              </div>
              <div style={{ width: "20%" }}>
                <span>{item.CustName}</span>
              </div>
              <div style={{ width: "20%" }}>
                <span>{item.TxnType}</span>
              </div>
              <div style={{ width: "20%", textAlign: "right" }}>
                <span>{formatAmount(item.Amount)}</span>
              </div>
              <div style={{ width: "20%", textAlign: "right" }}>
                <span>{formatAmount(item.On_account)}</span>
              </div>
            </div>
          ))}

          <div style={styles.line}></div>

          <div className="row" style={{ marginLeft: "30px" }}>
            <div style={{ width: "10%" }}>
              <span></span>
            </div>
            <div style={{ width: "30%" }}>
              <span></span>
            </div>
            <div style={{ width: "20%" }}>
              <span></span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>{totalTaxAmt}</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>{totalOnAccAmt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReceiptReportPdf;
