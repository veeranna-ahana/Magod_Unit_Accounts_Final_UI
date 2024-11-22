import React, { useState } from "react";
import { Table } from "react-bootstrap";

export default function MachineUtilisation({ getMachineSummary }) {
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
    const dataCopy = [...getMachineSummary];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (sortConfig.key === "TotalTime") {
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

  return (
    <div>
      <div
        style={{
          height: "350px",
          width: "800px",
          overflowY: "scroll",
          overflowX: "scroll",
        }}
      >
        <Table striped className="table-data border" style={{ border: "1px" }}>
          <thead className="tableHeaderBGColor">
            <tr>
              <th onClick={() => requestSort("Machine")}>Machine</th>
              <th onClick={() => requestSort("Operation")}>Operation</th>
              <th
                onClick={() => requestSort("TotalTime")}
                style={{ textAlign: "right" }}
              >
                Machine Hours
              </th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {sortedData()?.length > 0 ? (
              sortedData()?.map((item, key) => {
                return (
                  <tr
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => selectedRowFun(item, key)}
                    className={
                      key === selectRow?.index ? "selcted-row-clr" : ""
                    }
                  >
                    <td>{item.Machine}</td>
                    <td>{item.Operation}</td>
                    <td style={{ textAlign: "right" }}>{item.TotalTime}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Data not found!
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
