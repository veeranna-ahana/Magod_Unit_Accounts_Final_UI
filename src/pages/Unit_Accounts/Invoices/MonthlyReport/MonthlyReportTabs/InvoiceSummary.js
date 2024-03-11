import React, { useState } from "react";
import { Table } from "react-bootstrap";

export default function InvoiceSummary({ getMonthInvReport }) {
  const [selectRow, setSelectRow] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // sorting function for table headings of the table 
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...getMonthInvReport];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];
   
        // Convert only for the "intiger" columns
        if (
         sortConfig.key === "GrandTotal" || 
         sortConfig.key === "PymtAmtRecd" || 
         sortConfig.key === "MtrlChg" || 
         sortConfig.key === "Discount" || 
         sortConfig.key === "Del_Chg" || 
         sortConfig.key === "TptCharges" || 
         sortConfig.key === "TaxAmount" || 
         sortConfig.key === "InvTotal" || 
         sortConfig.key === "MaterialValue"
         ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }
   
        if (valueA < valueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopy;
  };

  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    setSelectRow(list);
  };

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  return (
    <div>
      <div
        style={{
          height: "260px",
          overflowY: "scroll",
          overflowX: "scroll",
          marginTop: "20px",
        }}
      >
        <Table striped className="table-data border" style={{ border: "1px" }}>
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: "nowrap" }}>
              <th onClick={() => requestSort("Cust_Name")}>Customer Name</th>
              <th onClick={() => requestSort("Inv_No")}>Invoice No</th>
              <th onClick={() => requestSort("DC_InvType")}>Invoice Type</th>
              <th onClick={() => requestSort("GrandTotal")}>Grand Total</th>
              <th onClick={() => requestSort("PymtAmtRecd")}>Received</th>
              <th onClick={() => requestSort("MaterialValue")}>Value Added</th>
              <th onClick={() => requestSort("MtrlChg")}>Material Value</th>
              <th onClick={() => requestSort("Discount")}>Discount</th>
              <th onClick={() => requestSort("Del_Chg")}>Delivery Chg</th>
              <th onClick={() => requestSort("TptCharges")}>Transport Charges</th>
              <th onClick={() => requestSort("TaxAmount")}>Tax Amount</th>
              <th onClick={() => requestSort("InvTotal")}>Inv Total</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {sortedData()?.map((item, key) => {
              return (
                <tr
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => selectedRowFun(item, key)}
                  className={key === selectRow?.index ? "selcted-row-clr" : ""}
                >
                  <td>{item.Cust_Name}</td>
                  <td>{item.Inv_No}</td>
                  <td>{item.DC_InvType}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(item.GrandTotal)}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(item.PymtAmtRecd)}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(item.MaterialValue)}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(item.MtrlChg)}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(item.Discount)}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(item.Del_Chg)}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(item.TptCharges)}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(item.TaxAmount)}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(item.InvTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
