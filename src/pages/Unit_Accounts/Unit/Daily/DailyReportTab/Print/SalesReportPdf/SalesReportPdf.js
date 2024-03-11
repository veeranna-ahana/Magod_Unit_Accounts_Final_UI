import React, { useEffect, useState } from "react";
import axios from "axios";
import MagodLogo from "../../../../../../../Logo/MagodLogo.png";
// import MagodLogo from '../Logo/MagodLogo.png'

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

const SalesReportPdf = React.forwardRef((props, ref) => {
  const values = props.groupedArray;
  const date = props.date;
  const taxValues = props.getValuesTax;

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  const netTotal = values
    .reduce((acc, item) => acc + parseFloat(item.netTotal || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalTax = values
    .reduce((acc, item) => acc + parseFloat(item.tax || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalAmt = values
    .reduce((acc, item) => acc + parseFloat(item.total || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalDiscount = values
    .reduce((acc, item) => acc + parseFloat(item.discount || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalTpt = values
    .reduce((acc, item) => acc + parseFloat(item.tptcharges || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalValue = values
    .reduce((acc, item) => acc + parseFloat(item.valueAdded || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalMaterial = values
    .reduce((acc, item) => acc + parseFloat(item.materialCost || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalTaxAmt = taxValues
    .reduce((acc, item) => acc + parseFloat(item.TaxAmount || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Function to calculate the sum of columns for all items in values
  const calculateTotalSum = (values) => {
    const totalSumColumns = {
      Net: 0,
      MtrlChg: 0,
      Discount: 0,
      AssessableValue: 0,
      TotalTaxes: 0,
      Transport: 0,
      InvTotal: 0,
      RoundOff: 0,
      GrandTotal: 0,
    };

    const itemSums = [];

    values.forEach((group) => {
      const groupSumColumns = {
        Net: 0,
        MtrlChg: 0,
        Discount: 0,
        AssessableValue: 0,
        TotalTaxes: 0,
        Transport: 0,
        InvTotal: 0,
        RoundOff: 0,
        GrandTotal: 0,
      };

      group.items.forEach((item) => {
        groupSumColumns.Net += parseFloat(item.Net_Total);
        groupSumColumns.MtrlChg += parseFloat(item.MtrlChg);
        groupSumColumns.Discount += parseFloat(item.Discount);
        groupSumColumns.AssessableValue += parseFloat(item.AssessableValue);
        groupSumColumns.TotalTaxes += parseFloat(item.TaxAmount);
        groupSumColumns.Transport += parseFloat(item.TptCharges);
        groupSumColumns.InvTotal += parseFloat(item.InvTotal);
        groupSumColumns.RoundOff += parseFloat(item.Round_Off);
        groupSumColumns.GrandTotal += parseFloat(item.GrandTotal);

        // Update totalSumColumns as well
        totalSumColumns.Net += parseFloat(item.Net_Total);
        totalSumColumns.MtrlChg += parseFloat(item.MtrlChg);
        totalSumColumns.Discount += parseFloat(item.Discount);
        totalSumColumns.AssessableValue += parseFloat(item.AssessableValue);
        totalSumColumns.TotalTaxes += parseFloat(item.TaxAmount);
        totalSumColumns.Transport += parseFloat(item.TptCharges);
        totalSumColumns.InvTotal += parseFloat(item.InvTotal);
        totalSumColumns.RoundOff += parseFloat(item.Round_Off);
        totalSumColumns.GrandTotal += parseFloat(item.GrandTotal);
      });

      // Push the sum for the group to itemSums array
      itemSums.push(groupSumColumns);
    });

    return { totalSumColumns, itemSums };
  };

  // Outside JSX
  const { totalSumColumns, itemSums } = calculateTotalSum(values);

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div>
      <div ref={ref}>
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
          {values.map((item, idx) => (
            <div key={idx}>
              {idx === 0 && (
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
                            <b>jigani</b>
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
                            <b>{item.preparedby}</b>
                          </span>
                          <span>
                            <b>{item.approvedby}</b>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* Invoice Summary Table */}
          <div style={styles.line1}></div>
          {values.map((item, idx) => (
            <div key={idx}>
              {idx === 0 && (
                <div>
                  <span>
                    <b>
                      <u> Invoice Summary </u>
                    </b>
                  </span>
                </div>
              )}
            </div>
          ))}
          <div style={styles.line2}></div>
          <div className="row">
            <div style={{ width: "10%", marginLeft: "7%" }}>
              <span>Type</span>
            </div>
            <div style={{ width: "10%", textAlign: "right" }}>
              <span>Net Billing</span>
            </div>
            <div style={{ width: "10%", textAlign: "right" }}>
              <span>Total Taxes</span>
            </div>
            <div style={{ width: "10%", textAlign: "right" }}>
              <span>Grand Total</span>
            </div>
            <div style={{ width: "10%", textAlign: "right" }}>
              <span>Discount</span>
            </div>
            <div style={{ width: "10%", textAlign: "right" }}>
              <span>Transport</span>
            </div>
            <div style={{ width: "15%", textAlign: "right" }}>
              <span>Value Added</span>
            </div>
            <div style={{ width: "15%", textAlign: "right" }}>
              <span>Material Value</span>
            </div>
          </div>
          <div style={styles.line}></div>
          {values.map((item, idx) => (
            <div className="row">
              <div style={{ width: "10%", marginLeft: "7%" }}>
                <span>{item.invType}</span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span>{formatAmount(item.netTotal)}</span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span>{formatAmount(item.tax)}</span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span>{formatAmount(item.total)}</span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span>{formatAmount(item.discount)}</span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span>{formatAmount(item.tptcharges)}</span>
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                <span>{formatAmount(item.valueAdded)}</span>
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                <span>{formatAmount(item.materialCost)}</span>
              </div>
            </div>
          ))}
          <div style={styles.line}></div>
          <div>
            <div className="row">
              <div style={{ width: "10%", marginLeft: "7%" }}>
                <span style={styles.textBold}></span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span style={styles.textBold}>{netTotal}</span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span style={styles.textBold}>{totalTax}</span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span style={styles.textBold}>{totalAmt}</span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span style={styles.textBold}>{totalDiscount}</span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span style={styles.textBold}>{totalTpt}</span>
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                <span style={styles.textBold}>{totalValue}</span>
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                <span style={styles.textBold}>{totalMaterial}</span>
              </div>
            </div>
          </div>
          <div style={styles.line1}></div>
          {/* Tax Summary Table */}
          <div>
            <div>
              <span>
                <b>
                  <u> Tax Summary </u>
                </b>
              </span>
            </div>
          </div>
          <div style={styles.line2}></div>
          <div className="row">
            <div style={{ width: "15%", marginLeft: "7%" }}>
              <span>Type</span>
            </div>
            <div style={{ width: "15%", textAlign: "right" }}>
              <span>Invoice Value</span>
            </div>
            <div style={{ width: "15%", textAlign: "right" }}>
              <span>Tax Name</span>
            </div>
            <div style={{ width: "15%", textAlign: "right" }}>
              <span>Taxable Amount </span>
            </div>
            <div style={{ width: "15%", textAlign: "right" }}>
              <span>Percent</span>
            </div>
            <div style={{ width: "10%", textAlign: "right" }}>
              <span>Total Tax</span>
            </div>
          </div>
          <div style={styles.line}></div>
          {taxValues.map((item, idx) => (
            <div className="row">
              <div style={{ width: "15%", marginLeft: "7%" }}>
                <span>{item.InvoiceType}</span>
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                <span>{formatAmount(item.InvoiceValue)}</span>
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                <span>{item.TaxName}</span>
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                <span>{formatAmount(item.TaxableAmount)}</span>
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                <span>{item.TaxPercent}</span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span>{formatAmount(item.TaxAmount)}</span>
              </div>
            </div>
          ))}
          <div style={styles.line}></div>
          <div>
            <div className="row">
              <div style={{ width: "15%", marginLeft: "7%" }}>
                <span></span>
              </div>
              <div style={{ width: "15%" }}>
                <span></span>
              </div>
              <div style={{ width: "15%" }}>
                <span></span>
              </div>
              <div style={{ width: "15%" }}>
                <span></span>
              </div>
              <div style={{ width: "15%" }}>
                <span></span>
              </div>
              <div style={{ width: "10%", textAlign: "right" }}>
                <span style={styles.textBold}>{totalTaxAmt}</span>
              </div>
            </div>
          </div>
          <div style={styles.line1}></div>

          {/*Tables*/}
          {values.map((group, idx) => (
            <div key={idx}>
              <div>
                <span>
                  <b>
                    <u> {group.invType} </u>
                  </b>
                </span>
              </div>

              <div style={styles.line2}></div>
              <div className="row">
                <div
                  style={{ width: "8%", marginLeft: "2%", textAlign: "right" }}
                >
                  <span>Inv No</span>
                </div>
                <div style={{ width: "8%", textAlign: "right" }}>
                  <span>Net</span>
                </div>
                <div style={{ width: "9%", textAlign: "right" }}>
                  <span>Material</span>
                </div>
                <div style={{ width: "9%", textAlign: "right" }}>
                  <span>Discount</span>
                </div>
                <div style={{ width: "14%", textAlign: "right" }}>
                  <span>Assessable Value</span>
                </div>
                <div style={{ width: "10%", textAlign: "right" }}>
                  <span>Total Taxes</span>
                </div>
                <div style={{ width: "10%", textAlign: "right" }}>
                  <span>Transport</span>
                </div>
                <div style={{ width: "10%", textAlign: "right" }}>
                  <span>Inv Total</span>
                </div>
                <div style={{ width: "10%", textAlign: "right" }}>
                  <span>Round Off</span>
                </div>
                <div style={{ width: "10%", textAlign: "right" }}>
                  <span>Grand Total</span>
                </div>
              </div>

              <div style={styles.line}></div>

              {group.items.map((item, index) => (
                <div key={index}>
                  <div className="row">
                    <div
                      style={{
                        width: "8%",
                        marginLeft: "2%",
                        textAlign: "right",
                      }}
                    >
                      <span>{item.Inv_No}</span>
                    </div>
                    <div style={{ width: "8%", textAlign: "right" }}>
                      <span>{formatAmount(item.Net_Total)}</span>
                    </div>
                    <div style={{ width: "9%", textAlign: "right" }}>
                      <span>{formatAmount(item.MtrlChg)}</span>
                    </div>
                    <div style={{ width: "9%", textAlign: "right" }}>
                      <span>{formatAmount(item.Discount)}</span>
                    </div>
                    <div style={{ width: "14%", textAlign: "right" }}>
                      <span>{formatAmount(item.AssessableValue)}</span>
                    </div>
                    <div style={{ width: "10%", textAlign: "right" }}>
                      <span>{formatAmount(item.TaxAmount)}</span>
                    </div>
                    <div style={{ width: "10%", textAlign: "right" }}>
                      <span>{formatAmount(item.TptCharges)}</span>
                    </div>
                    <div style={{ width: "10%", textAlign: "right" }}>
                      <span>{formatAmount(item.InvTotal)}</span>
                    </div>
                    <div style={{ width: "10%", textAlign: "right" }}>
                      <span>{item.Round_Off}</span>
                    </div>
                    <div style={{ width: "10%", textAlign: "right" }}>
                      <span>{formatAmount(item.GrandTotal)}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div style={styles.line}></div>

              <div className="row">
                <div style={{ width: "8%", marginLeft: "2%" }}>
                  <span style={styles.textBold}></span>
                </div>
                {itemSums[idx] && (
                  <React.Fragment>
                    <div style={{ width: "8%" }}>
                      <span style={styles.textBold}>
                        {parseFloat(itemSums[idx].Net)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                    <div style={{ width: "9%", textAlign: "right" }}>
                      <span style={styles.textBold}>
                        {parseFloat(itemSums[idx].MtrlChg)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                    <div style={{ width: "9%", textAlign: "right" }}>
                      <span style={styles.textBold}>
                        {parseFloat(itemSums[idx].Discount)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                    <div style={{ width: "14%", textAlign: "right" }}>
                      <span style={styles.textBold}>
                        {parseFloat(itemSums[idx].AssessableValue)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                    <div style={{ width: "10%", textAlign: "right" }}>
                      <span style={styles.textBold}>
                        {parseFloat(itemSums[idx].TotalTaxes)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                    <div style={{ width: "10%", textAlign: "right" }}>
                      <span style={styles.textBold}>
                        {parseFloat(itemSums[idx].Transport)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                    <div style={{ width: "10%", textAlign: "right" }}>
                      <span style={styles.textBold}>
                        {parseFloat(itemSums[idx].InvTotal)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                    <div style={{ width: "10%", textAlign: "right" }}>
                      <span style={styles.textBold}>
                        {parseFloat(itemSums[idx].RoundOff)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                    <div style={{ width: "10%", textAlign: "right" }}>
                      <span style={styles.textBold}>
                        {parseFloat(itemSums[idx].GrandTotal)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                  </React.Fragment>
                )}
              </div>
              <div style={styles.line}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default SalesReportPdf;
