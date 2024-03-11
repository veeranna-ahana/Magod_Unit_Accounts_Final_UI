import React, { useEffect, useState } from "react";
import axios from "axios";
import MagodLogo from "../Logo/MagodLogo.png";

const styles = {
  heading: {
    fontSize: "25px",
    fontWeight: "bold",
  },
  heading1: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  heading2: {
    fontSize: "20px",
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
    marginTop: "20px",
  },
  boxContainer: {
    border: "2px solid black", // Border for the box
    padding: "10px", // Add padding inside the box
    marginBottom: "20px", // Margin at the bottom of the box
  },
};

const PaymentReceiptVoucherPdf = React.forwardRef((props, ref) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [Tabledata, setTabledata] = useState([]);

  const receiptData = props.data;
  console.log(receiptData.receipt_data, "receiptDataaaaaaaaaaaaaaaa");
  const Adjusted =
    receiptData.receipt_data.Amount - receiptData.receipt_data.On_account;

  const idx = 0;
  let total_value = 0;
  receiptData.receipt_details.forEach((element) => {
    total_value += parseInt(element.Receive_Now);
  });

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:9006/paymentreceiptvoucher")
  //     .then((res) => setTabledata(res.data));
  // }, []);

  return (
    <div>
      <div ref={ref}>
        {/* <style type="text/css" media="print">{"\
   @page {\ size:A4 landscape;\ }\
"}</style>
      */}

        <style type="text/css" media="print">
          {`
          @page {
            size: A4 portrait;
            margin-top: 50px; /* Add top margin to the printed page */ 
            @top-left {
              content: 'Page ' counter(page);
            }
           
          }

          /* Add page breaks before certain elements if necessary */
          .page-break {
            page-break-before: always;
          } 
          .page-break-after {
            page-break-before: always;
          }
          
        `}
        </style>

        <div
          className="p-0"
          style={{
            marginLeft: "35px",
            marginRight: "35px",
            marginBottom: "30px",
          }}
        >
          <div className="row">
            <div>
              <div className="row">
                <div style={{ width: "16%" }}>
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
                <div style={{ width: "60%" }}>
                  <div className="row justify-content-center">
                    <span style={styles.heading}>
                      Magod Laser Machining Pvt Ltd
                    </span>
                  </div>
                  <div className="row justify-content-center">
                    {" "}
                    <span style={styles.heading}>
                      "Payment Receipt Voucher"
                    </span>
                  </div>
                </div>
                <div>{currentPage}</div>
              </div>
            </div>
          </div>

          {/* Draw A line */}
          <div style={styles.line}></div>

          {receiptData.receipt_data ? (
            <div key={receiptData.receipt_data.RecdPVID}>
              {idx === 0 && (
                <div>
                  <div className="row" style={{ marginLeft: "125px" }}>
                    <div style={{ width: "20%" }}>
                      <span>Unit :</span>
                    </div>
                    <div style={{ width: "20%" }}>
                      <span>{}</span>
                    </div>

                    <div style={{ width: "15%" }}>
                      <span>Received From</span>
                    </div>
                    <div style={{ width: "20%" }}>
                      <span style={styles.textBold}>
                        {receiptData.receipt_data.CustName}
                      </span>
                    </div>
                  </div>

                  <div className="row" style={{ marginLeft: "70px" }}>
                    <div style={{ width: "12%" }}>
                      <span>Voucher No :</span>
                    </div>
                    <div style={{ width: "15%" }}>
                      <span style={styles.textBold}>
                        {receiptData.receipt_data.Recd_PVNo}
                      </span>
                    </div>
                  </div>

                  <div className="row" style={{ marginLeft: "120px" }}>
                    <div style={{ width: "7%" }}>
                      <span>Date :</span>
                    </div>
                    <div style={{ width: "12%" }}>
                      <span style={styles.textBold}>
                        {receiptData.receipt_data.Recd_PV_Date instanceof Date
                          ? receiptData.receipt_data.Recd_PV_Date.toLocaleDateString()
                          : receiptData.receipt_data.Recd_PV_Date}
                      </span>
                    </div>
                  </div>

                  <div className="row" style={{ marginLeft: "40px" }}>
                    <div style={{ width: "16%" }}>
                      <span>Transaction Type :</span>
                    </div>
                    <div style={{ width: "20%" }}>
                      <span style={styles.textBold}>
                        {receiptData.receipt_data.TxnType}
                      </span>
                    </div>
                    <div style={{ width: "5%" }}>
                      <span>Vide</span>
                    </div>
                    <div style={{ width: "50%" }}>
                      <span style={styles.textBold}>
                        {receiptData.receipt_data.Description}
                      </span>
                    </div>
                  </div>

                  <div className="row mt-3" style={{ marginLeft: "325px" }}>
                    <div style={{ width: "16%" }}>
                      <span>Amount :</span>
                    </div>
                    <div style={{ width: "20%" }}>
                      <span style={styles.textBold}>
                        {receiptData.receipt_data.Amount}
                      </span>
                    </div>
                  </div>

                  <div className="row" style={{ marginLeft: "320px" }}>
                    <div style={{ width: "16%" }}>
                      <span>Adjusted :</span>
                    </div>
                    <div style={{ width: "20%" }}>
                      <span style={styles.textBold}>{Adjusted}</span>
                    </div>
                  </div>

                  <div className="row" style={{ marginLeft: "300px" }}>
                    <div style={{ width: "19%" }}>
                      <span>On Account :</span>
                    </div>
                    <div style={{ width: "20%" }}>
                      <span style={styles.textBold}>
                        {receiptData.receipt_data.On_account}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}

          <div style={styles.line2}></div>

          <div className="row" style={{ marginLeft: "5%" }}>
            <div style={{ width: "10%" }}>
              <span style={styles.textBold}>Srl</span>
            </div>
            <div style={{ width: "25%" }}>
              <span style={styles.textBold}>Invoice No and Type</span>
            </div>
            <div style={{ width: "15%" }}>
              <span style={styles.textBold}>Invoiced</span>
            </div>
            <div style={{ width: "15%" }}>
              <span style={styles.textBold}>Received</span>
            </div>
            <div style={{ width: "15%" }}>
              <span style={styles.textBold}>Receive Now</span>
            </div>
            <div style={{ width: "15%" }}>
              <span style={styles.textBold}>Reference No</span>
            </div>
          </div>

          <div style={styles.line}></div>

          {receiptData.receipt_details.length > 0 ? (
            receiptData.receipt_details.map((item, idx) => (
              <div>
                <div className="row" style={{ marginLeft: "5%" }}>
                  <div style={{ width: "10%" }}>
                    <span>{item.idx}</span>
                  </div>
                  <div style={{ width: "25%" }}>
                    <span>{item.Inv_No}</span>
                  </div>
                  <div style={{ width: "15%" }}>
                    <span>{item.Inv_Amount}</span>
                  </div>
                  <div style={{ width: "15%" }}>
                    <span>{item.Amt_received}</span>
                  </div>
                  <div style={{ width: "15%" }}>
                    <span>{item.Receive_Now}</span>
                  </div>
                  <div style={{ width: "15%" }}>
                    <span>{item.RefNo}</span>
                  </div>
                </div>
                <div style={styles.line}></div>
              </div>
            ))
          ) : (
            <div></div>
          )}
          {/* <div  style={styles.line}></div> */}

          {receiptData.receipt_details.length != 0 ? (
            <div className="row" style={{ marginLeft: "5%" }}>
              <div style={{ width: "10%" }}>
                <span></span>
              </div>
              <div style={{ width: "25%" }}>
                <span></span>
              </div>
              <div style={{ width: "15%" }}>
                <span></span>
              </div>
              <div style={{ width: "15%" }}>
                <span></span>
              </div>
              <div style={{ width: "15%" }}>
                <span>{total_value}</span>
              </div>
              <div style={{ width: "15%" }}>
                <span></span>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {Tabledata.map((item, idx) => (
            <div key={idx}>
              {idx === 0 && (
                <div className="row" style={{ marginLeft: "30px" }}>
                  <div style={{ width: "30%" }}>
                    <span style={styles.textBold}>Prepared By</span>
                  </div>
                  <div style={{ width: "30%" }}>
                    <span>{item.preparedby}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default PaymentReceiptVoucherPdf;
