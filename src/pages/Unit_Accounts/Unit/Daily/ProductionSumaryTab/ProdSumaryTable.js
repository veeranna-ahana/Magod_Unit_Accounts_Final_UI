import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

export default function ProdSumaryTable({ getValuesPrdSum }) {
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
    const dataCopy = [...getValuesPrdSum];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "TotalQty" ||
          sortConfig.key === "TotalValue" ||
          sortConfig.key === "TotalWeight" ||
          sortConfig.key === "Ex_Not_no"
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
    if (getValuesPrdSum.length > 0) {
      selectedRowFun(getValuesPrdSum[0], 0);
    } else {
      setSelectRow([]);
    }
  }, [getValuesPrdSum]);

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

  // console.log("ppppp",getValuesPrdSum);

  return (
    <div>
      <div
        className=""
        style={{ overflowY: "scroll", overflowX: "scroll", height: "370px" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: "nowrap" }}>
              <th>withTax</th>
              <th onClick={() => requestSort("InvoiceType")}>Invoice type</th>
              <th>cleared under</th>
              <th onClick={() => requestSort("Material")}>Material</th>
              <th onClick={() => requestSort("Excise_CL_no")}>Exise_CL_no</th>
              <th onClick={() => requestSort("TotalQty")}>TotalQty</th>
              <th onClick={() => requestSort("TotalValue")}>TotalValue</th>
              <th onClick={() => requestSort("TotalWeight")}>TotalWeight</th>
              <th>ID</th>
              <th>UnitName</th>
              <th onClick={() => requestSort("Ex_Not_no")}>Ex_Not_no</th>
              {/* <th>Material</th>
              <th>Excise_CL_no</th> */}
              <th>ShortNotNo</th>
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
                  <td>
                    {item.WithTax === 1 ? (
                      <input type="checkbox" value={item.WithTax} checked />
                    ) : (
                      <input type="checkbox" value={item.WithTax} disabled />
                    )}
                  </td>
                  <td>{item.InvoiceType}</td>
                  <td></td>
                  <td>{item.Material}</td>
                  <td>{item.Excise_CL_no}</td>
                  <td style={{ textAlign: "right" }}>{item.TotalQty}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.TotalValue)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.TotalWeight)}
                  </td>
                  <td></td>
                  <td></td>
                  <td>{item.Ex_Not_no}</td>
                  {/* <td>{item.Material}</td>
              <td>{item.Excise_CL_no}</td> */}
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
