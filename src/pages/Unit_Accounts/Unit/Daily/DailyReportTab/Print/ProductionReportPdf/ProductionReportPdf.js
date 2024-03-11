import React, { useEffect, useState } from "react";
import axios from "axios";
import MagodLogo from "../../../../../../../Logo/MagodLogo.png";

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

const ProductionReportPdf = React.forwardRef((props, ref) => {
  const proData = props.getValuesPrdSum;
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

  const WithTax = [];
  const WithOutTax = [];

  for (let i = 0; i < proData.length; i++) {
    if (proData[i].WithTax === 1) {
      WithTax.push(proData[i]);
    } else {
      WithOutTax.push(proData[i]);
    }
  }

  const totalQtySum = WithOutTax.reduce(
    (acc, item) => acc + parseInt(item.TotalQty || 0, 10),
    0
  );

  const totalWeightSum = WithOutTax.reduce(
    (acc, item) => acc + parseFloat(item.TotalWeight || 0),
    0
  )
    .toFixed(3)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalValueSum = WithOutTax.reduce(
    (acc, item) => acc + parseFloat(item.TotalValue || 0),
    0
  )
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  //with tax
  const totalQtySumm = WithTax.reduce(
    (acc, item) => acc + parseInt(item.TotalQty || 0, 10),
    0
  );

  const totalWeightSumm = WithTax.reduce(
    (acc, item) => acc + parseFloat(item.TotalWeight || 0),
    0
  )
    .toFixed(3)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalValueSumm = WithTax.reduce(
    (acc, item) => acc + parseFloat(item.TotalValue || 0),
    0
  )
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalQTySum = totalQtySum + totalQtySumm;
  const totalWgtSum = (
    parseFloat(totalWeightSumm.replace(/,/g, "")) +
    parseFloat(totalWeightSum.replace(/,/g, ""))
  )
    .toFixed(3)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const totalVluSum = (
    parseFloat(totalValueSum.replace(/,/g, "")) +
    parseFloat(totalValueSumm.replace(/,/g, ""))
  )
    .toFixed(3)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  //With tax
  function organizeDataByInvoiceType(dataArray) {
    const organizedData = [];

    dataArray.forEach((item) => {
      const invoiceType = item.InvoiceType;
      let foundType = organizedData.find(
        (entry) => entry.InvType === invoiceType
      );

      if (!foundType) {
        foundType = { InvType: invoiceType, data: [] };
        organizedData.push(foundType);
      }

      foundType.data.push({
        Ex_Not_no: item.Ex_Not_no,
        Excise_CL_no: item.Excise_CL_no,
        InvoiceType: item.InvoiceType,
        Material: item.Material,
        TotalQty: item.TotalQty,
        TotalValue: item.TotalValue,
        TotalWeight: item.TotalWeight,
        WithTax: item.WithTax,
      });
    });

    return organizedData;
  }

  // Assuming 'WithTax' is the correct array name
  const resultWithTax = organizeDataByInvoiceType(WithTax);

  // Output the result
  console.log("withTax", resultWithTax);

  //'WithOutTax'
  const resultWithOutTax = organizeDataByInvoiceType(WithOutTax);

  console.log("withOuttax", resultWithOutTax);

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
            size: A4 landscape;
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
                  <div className="row justify-content-center">
                    <span style={styles.heading}>
                      Production and Clearance Summary
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
                  <div className="col-md-3 col-sm-12">
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

          <div className="row" style={{ marginLeft: "250px" }}>
            <div style={{ width: "20%" }}>
              <span>Excise_Cl_No</span>
            </div>
            <div style={{ width: "20%" }}>
              <span> Material</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>Total Qty</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>Total Weight</span>
            </div>
            <div style={{ width: "15%", textAlign: "right" }}>
              <span>Total Value</span>
            </div>
          </div>

          <div style={styles.line}></div>

          <div style={{ width: "20%", marginLeft: "2%" }}>
            <span>Cleared Without Tax</span>
          </div>
          <div style={styles.line}></div>
          {/* <div style={{ width: "20%", marginLeft: "8%" }}>
            <span>ExciseRegd - 214/86</span>
          </div>
          <div style={styles.line}></div> */}

          {resultWithOutTax.map((group, index) => (
            <div key={index}>
              <div style={{ width: "20%", marginLeft: "8%" }}>
                <span>ExciseRegd - 214/86</span>
              </div>
              <div style={styles.line}></div>
              <div style={{ width: "20%", marginLeft: "18%" }}>
                <span>{group.InvType}</span>
              </div>
              <div style={styles.line}></div>
              {group.data.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="row"
                  style={{ marginLeft: "250px" }}
                >
                  <div style={{ width: "20%" }}>
                    <span>{item.Excise_CL_no}</span>
                  </div>
                  <div style={{ width: "20%" }}>
                    <span>{item.Material}</span>
                  </div>
                  <div style={{ width: "20%", textAlign: "right" }}>
                    <span>{item.TotalQty}</span>
                  </div>
                  <div style={{ width: "20%", textAlign: "right" }}>
                    <span>{formatAmount(item.TotalWeight)}</span>
                  </div>
                  <div style={{ width: "20%", textAlign: "right" }}>
                    <span>{formatAmount(item.TotalValue)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* {WithOutTax.map((item, idx) => (
            <div>
              <div style={{ width: "20%", marginLeft: "18%" }}>
                <span>{item.InvoiceType}</span>
              </div>

              <div style={styles.line}></div>
              <div className="row" style={{ marginLeft: "250px" }}>
                <div style={{ width: "20%" }}>
                  <span>{item.Excise_CL_no}</span>
                </div>
                <div style={{ width: "20%" }}>
                  <span>{item.Material}</span>
                </div>
                <div style={{ width: "20%", textAlign: "right" }}>
                  <span>{item.TotalQty}</span>
                </div>
                <div style={{ width: "20%", textAlign: "right" }}>
                  <span>{formatAmount(item.TotalWeight)}</span>
                </div>
                <div style={{ width: "20%", textAlign: "right" }}>
                  <span>{formatAmount(item.TotalValue)}</span>
                </div>
              </div>
            </div>
          ))} */}
          <div style={styles.line}></div>
          <div className="row" style={{ marginLeft: "250px" }}>
            <div style={{ width: "20%" }}>
              <span></span>
            </div>
            <div style={{ width: "20%" }}>
              <span></span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>{totalQtySum}</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>{totalWeightSum}</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>{totalValueSum}</span>
            </div>
          </div>
          <div style={styles.line}></div>

          {/* with tax */}

          <div style={{ width: "20%", marginLeft: "2%" }}>
            <span>Cleared With Tax</span>
          </div>
          <div style={styles.line}></div>
          {/* <div style={{ width: "20%", marginLeft: "8%" }}>
            <span>Excise JobWork</span>
          </div>

          <div style={styles.line}></div> */}

          {resultWithTax.map((group, index) => (
            <div key={index}>
              <div style={{ width: "20%", marginLeft: "8%" }}>
                <span>Excise JobWork</span>
              </div>
              <div style={styles.line}></div>
              <div style={{ width: "20%", marginLeft: "18%" }}>
                <span>{group.InvType}</span>
              </div>
              <div style={styles.line}></div>
              {group.data.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="row"
                  style={{ marginLeft: "250px" }}
                >
                  <div style={{ width: "20%" }}>
                    <span>{item.Excise_CL_no}</span>
                  </div>
                  <div style={{ width: "20%" }}>
                    <span>{item.Material}</span>
                  </div>
                  <div style={{ width: "20%", textAlign: "right" }}>
                    <span>{item.TotalQty}</span>
                  </div>
                  <div style={{ width: "20%", textAlign: "right" }}>
                    <span>{formatAmount(item.TotalWeight)}</span>
                  </div>
                  <div style={{ width: "20%", textAlign: "right" }}>
                    <span>{formatAmount(item.TotalValue)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* {WithTax.map((item, idx) => (
            <div>
              <div style={{ width: "20%", marginLeft: "18%" }}>
                <span>{item.InvoiceType}</span>
              </div>

              <div style={styles.line}></div>
              <div className="row" style={{ marginLeft: "250px" }}>
                <div style={{ width: "20%" }}>
                  <span>{item.Excise_CL_no}</span>
                </div>
                <div style={{ width: "20%" }}>
                  <span>{item.Material}</span>
                </div>
                <div style={{ width: "20%", textAlign: "right" }}>
                  <span>{item.TotalQty}</span>
                </div>
                <div style={{ width: "20%", textAlign: "right" }}>
                  <span>{formatAmount(item.TotalWeight)}</span>
                </div>
                <div style={{ width: "20%", textAlign: "right" }}>
                  <span>{formatAmount(item.TotalValue)}</span>
                </div>
              </div>
            </div>
          ))} */}
          <div style={styles.line}></div>
          <div className="row" style={{ marginLeft: "250px" }}>
            <div style={{ width: "20%" }}>
              <span></span>
            </div>
            <div style={{ width: "20%" }}>
              <span></span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>{totalQtySumm}</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>{totalWeightSumm}</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>{totalValueSumm}</span>
            </div>
          </div>

          <div style={styles.line}></div>
          <div className="row" style={{ marginLeft: "250px" }}>
            <div style={{ width: "20%" }}>
              <span></span>
            </div>
            <div style={{ width: "20%" }}>
              <span></span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>{totalQTySum}</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>{totalWgtSum}</span>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
              <span>{totalVluSum}</span>
            </div>
          </div>
          <div style={styles.line}></div>
        </div>
      </div>
    </div>
  );
});

export default ProductionReportPdf;
