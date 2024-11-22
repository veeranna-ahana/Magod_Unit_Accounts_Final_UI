import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

export default function TaxSummaryTable({ getValuesTax }) {
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
    const dataCopy = [...getValuesTax];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "InvoiceValue" ||
          sortConfig.key === "TaxPercent" ||
          sortConfig.key === "TaxAmount" ||
          sortConfig.key === "TaxableAmount"
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

  useEffect(() => {
    if (getValuesTax.length > 0) {
      selectedRowFun(getValuesTax[0], 0);
    } else {
      setSelectRow([]);
    }
  }, [getValuesTax]);

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
        className=""
        style={{ overflowY: "scroll", overflowX: "scroll", height: "350px" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr>
              <th onClick={() => requestSort("InvoiceType")}>Invoice type</th>
              <th>with Tax</th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("InvoiceValue")}
              >
                Invoice Value
              </th>
              <th onClick={() => requestSort("TaxName")}>Tax Name</th>
              <th onClick={() => requestSort("TaxPercent")}>Tax %</th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("TaxableAmount")}
              >
                Taxable Amount
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("TaxAmount")}
              >
                TaxAmount
              </th>
              <th>TaxGp</th>
            </tr>
          </thead>

          <tbody className="tablebody" style={{ alignItems: "center" }}>
            {sortedData()?.map((item, key) => {
              const taxPercent = parseFloat(item.TaxPercent);
              const formattedTaxPercent =
                taxPercent % 1 !== 0
                  ? taxPercent.toFixed(2)
                  : taxPercent.toFixed(0);
              return (
                <tr
                  onClick={() => selectedRowFun(item, key)}
                  className={key === selectRow?.index ? "selcted-row-clr" : ""}
                >
                  <td>{item.InvoiceType}</td>
                  <td>
                    {item.WithTax === 1 ? (
                      <input type="checkbox" value={item.WithTax} checked />
                    ) : (
                      <input type="checkbox" value={item.WithTax} disabled />
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.InvoiceValue)}
                  </td>
                  <td>{item.TaxName}</td>
                  <td style={{ textAlign: "right" }}>{formattedTaxPercent}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.TaxableAmount)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.TaxAmount)}
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
