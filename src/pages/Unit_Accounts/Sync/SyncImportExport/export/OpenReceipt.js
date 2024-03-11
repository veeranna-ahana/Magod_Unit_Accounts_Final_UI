import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";

export default function OpenReceipt({ data }) {
  const [selectRow, setSelectRow] = useState([]);
  const itemsPerPage = 200; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);
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
    const dataCopy = [...currentPageData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "Amount" ||
          sortConfig.key === "On_account" ||
          sortConfig.key === "Amount" ||
          sortConfig.key === "Id"
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

  // Calculate the start and end indices for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentPageData = data.slice(startIndex, endIndex);
  console.log(currentPageData, "currentPageData");

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const handleCheckboxChange = (itemId) => {
    if (data && Array.isArray(data)) {
      // Check if data is not undefined and is an array
      if (selectedItems.includes(itemId)) {
        // Item is already selected, so remove it from selectedItems
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((RecdPVID) => RecdPVID !== itemId)
        );
      } else {
        // Item is not selected, so add it to selectedItems
        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemId]);
      }
    }
  };

  // Get the selected data based on selectedItems
  const selectedData = data
    ? data.filter((item) => selectedItems.includes(item.RecdPVID))
    : "";
  //console.log(selectedData, 'selectedData')

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

  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    setSelectRow(list);
  };

  return (
    <div>
      <div
        className="mt-4"
        style={{ height: "400px", overflowY: "scroll", overflowX: "scroll" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr>
              <th onClick={() => requestSort("TxnType")}>Type</th>
              <th onClick={() => requestSort("Recd_PV_Date")}>RV No</th>
              <th onClick={() => requestSort("Recd_PV_Date")}>Recd_PV</th>
              <th onClick={() => requestSort("Amount")}>Amount</th>
              <th onClick={() => requestSort("On_account")}>On Account</th>
              <th onClick={() => requestSort("CustName")}>Customer</th>
              <th onClick={() => requestSort("Id")}>Id</th>
              <th onClick={() => requestSort("UnitName")}>Unit Name</th>
              <th onClick={() => requestSort("RecdPVID")}>Recd PVID</th>
              <th onClick={() => requestSort("Sync_HOId")}>Sync_HOId</th>
              <th onClick={() => requestSort("Unit_UId")}>Unit_UId</th>
              <th onClick={() => requestSort("Recd_PVNo")}>Recd_PVNo</th>
              <th onClick={() => requestSort("Recd_PV_Date")}>Recd_PV_Date</th>
              <th onClick={() => requestSort("ReceiptStatus")}>Receipt Status</th>
              <th onClick={() => requestSort("Cust_code")}>Cust_code</th>
              <th onClick={() => requestSort("CustName")}>Cust Name</th>
              <th onClick={() => requestSort("Amount")}>Amount</th>
              <th>Adjusted</th>
              <th onClick={() => requestSort("DocuNo")}>Document No</th>
              <th onClick={() => requestSort("Description")}>Description</th>
              <th onClick={() => requestSort("HORef")}>HO Ref</th>
              <th onClick={() => requestSort("HOPrvId")}>HO PrvId</th>
              <th onClick={() => requestSort("TallyUpdate")}>Tally_UId</th>
              <th>Updated</th>
              <th onClick={() => requestSort("On_account")}>On_account</th>
              <th onClick={() => requestSort("TxnType")}>Txn Type</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {sortedData()
              ? sortedData().map((item, key) => (
                  <tr
                    key={item.RecdPVID}
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => selectedRowFun(item, key)}
                    className={
                      key === selectRow?.index ? "selcted-row-clr" : ""
                    }
                  >
                    {/* Render table cells with corresponding data */}
                    <td>{item.TxnType}</td>
                    <td>{formatDate(item.Recd_PV_Date)}</td>
                    <td>{item.Recd_PV_Date}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(item.Amount)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(item.On_account)}
                    </td>
                    <td>{item.CustName}</td>
                    <td>{item.Id}</td>
                    <td>{item.UnitName}</td>
                    <td>{item.RecdPVID}</td>
                    <td>{item.Sync_HOId}</td>
                    <td>{item.Unit_UId}</td>
                    <td>{item.Recd_PVNo}</td>
                    <td>{item.Recd_PV_Date}</td>
                    <td>{item.ReceiptStatus}</td>
                    <td>{item.Cust_code}</td>
                    <td>{item.CustName}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(item.Amount)}
                    </td>
                    <td></td>
                    <td>{item.DocuNo}</td>
                    <td>{item.Description}</td>
                    <td>{item.HORef}</td>
                    <td>{item.HOPrvId}</td>
                    <td>{item.TallyUpdate}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.RecdPVID)}
                        onChange={() => handleCheckboxChange(item.RecdPVID)}
                      />
                    </td>
                    <td>{item.On_account}</td>
                    <td>{item.TxnType}</td>
                    {/* Add the remaining cells based on your data structure */}
                  </tr>
                ))
              : ""}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={Math.ceil(data.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}
