import React, { useEffect, useState } from "react";
// import PaymentTable from './PaymentTable';
import { useNavigate } from "react-router-dom";
import { Col, Table } from "react-bootstrap";
import axios from "axios";
//import { colors } from "@mui/material";
import { baseURL } from "../../../../../api/baseUrl";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

export default function OnAccountDetailsForm() {
  const [data, setData] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [expandedGroup, setExpandedGroup] = useState(null);

  const handleRowClick = (index) => {
    setExpandedGroup(index === expandedGroup ? null : index);
  };
  console.log(expandedGroup, "expandedGroup");
  const DraftReceipts = async () => {
    try {
      const response = await axios.get(
        baseURL + "/Payment_Receipts/getonaccountdetails"
      ); // Replace this URL with your API endpoint
      setData(response.data.Result);
      //console.log("onaccounst",response.data.Result)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    // Call the API function when the component mounts
    DraftReceipts();
  }, []); // Empty dependency array ensures it runs only once, equivalent to componentDidMount
  console.log(data, "syncpage");

  const groupedData = data.reduce((groups, item) => {
    const key = `${item.CustName}-${item.Cust_code}`;

    if (!groups[key]) {
      groups[key] = {
        custName: item.CustName,
        custCode: item.Cust_code,
        totalOnAccount: 0,
        items: [],
      };
    }

    groups[key].items.push(item);
    groups[key].totalOnAccount += parseFloat(item.On_account);

    return groups;
  }, {});

  // Convert the groupedData map into an array
  const groupedArray = Object.values(groupedData);

  console.log(groupedArray, "hjjhjkjk");
  const itemsPerPage = 13; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the start and end indices for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentPageData = groupedArray.slice(startIndex, endIndex);

  //console.log(currentPageData,'currentPageData')

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const navigate = useNavigate();

  const [selectRow, setSelectRow] = useState("");
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    //  setSelectRow(initial)

    setSelectRow(list);
    // setState(true);
  };
  const handleNavigate = (RecdPVID) => {
    navigate("/UnitAccounts/Unit/PaymentReceiptVoucher", { state: RecdPVID });
  };
  const openVoucherButton = () => {
    if (selectRow !== "") {
      navigate("/UnitAccounts/Unit/PaymentReceiptVoucher", {
        // state: selectRow.RecdPVID,
        state: {
          rowData: selectRow.RecdPVID,
          // date: selectRow.Recd_PV_Date,
        },
      });
    } else {
      toast.error("Select Row");
    }
  };

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  //ascending and descinding
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Sorting function
  const sortedData = [...currentPageData].sort((a, b) => {
    if (!sortConfig.key) return 0; // No sorting applied initially

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Function to handle column header click for sorting
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  //ascending and descending for expanded group
  const [expandedSortConfig, setExpandedSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortExpandedGroupItems = (items) => {
    if (!expandedSortConfig.key) return items;
    return [...items].sort((a, b) => {
      const aValue = a[expandedSortConfig.key];
      const bValue = b[expandedSortConfig.key];
      if (aValue < bValue) {
        return expandedSortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return expandedSortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const handleExpandedSort = (key) => {
    setExpandedSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  return (
    <>
      <div className="row">
        <h4 className="title">Unit Open Payment Receipt Vouchers</h4>
      </div>

      <div className="row mb-2">
        <div className="col-md-3">
          <label className="form-label">Magod Laser Machining Pvt Ltd</label>
        </div>
        <div className="col-md-2">
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            {" "}
            On Account Details
          </label>
        </div>
        <div className="col-md-4">
          <button
            className="button-style mt-2 group-button"
            onClick={openVoucherButton}
          >
            Open Voucher
          </button>
        </div>
        <div className="col-md-3">
          <button
            className="button-style mt-2 group-button"
            style={{ float: "right" }}
            onClick={(e) => navigate("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div>

      {/* <PaymentTable/> */}
      <div>
        <div
          className=""
          style={{ overflowY: "scroll", overflowX: "scroll", height: "360px" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              {/* <tr>
                <th> </th>
                <th>Cust Code</th>
                <th>Customer</th>
                <th style={{ textAlign: "right" }}>OnAccount Amount</th>
                <th></th>
              </tr> */}
              <tr>
                <th></th>
                <th
                  onClick={() => handleSort("custCode")}
                  style={{ cursor: "pointer" }}
                >
                  Cust Code{" "}
                  {sortConfig.key === "custCode"
                    ? sortConfig.direction === "ascending"
                      ? ""
                      : ""
                    : ""}
                </th>
                <th
                  onClick={() => handleSort("custName")}
                  style={{ cursor: "pointer" }}
                >
                  Customer{" "}
                  {sortConfig.key === "custName"
                    ? sortConfig.direction === "ascending"
                      ? ""
                      : ""
                    : ""}
                </th>
                <th
                  onClick={() => handleSort("totalOnAccount")}
                  style={{ textAlign: "right", cursor: "pointer" }}
                >
                  OnAccount Amount{" "}
                  {sortConfig.key === "totalOnAccount"
                    ? sortConfig.direction === "ascending"
                      ? ""
                      : ""
                    : ""}
                </th>
                <th></th>
              </tr>
            </thead>

            <tbody className="tablebody">
              {sortedData.map((group, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(index)}
                    >
                      +
                    </td>
                    <td>{group.custCode}</td>
                    <td>{group.custName}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(group.totalOnAccount)}
                    </td>
                    <td></td>
                  </tr>
                  {expandedGroup === index && (
                    <React.Fragment>
                      <tr style={{ backgroundColor: "AliceBlue" }}>
                        <th></th>
                        <th></th>
                        <th
                          onClick={() => handleExpandedSort("RecdPVID")}
                          style={{ cursor: "pointer" }}
                        >
                          RV No{" "}
                          {expandedSortConfig.key === "RecdPVID"
                            ? expandedSortConfig.direction === "ascending"
                              ? ""
                              : ""
                            : ""}
                        </th>
                        <th
                          onClick={() => handleExpandedSort("Amount")}
                          style={{ textAlign: "right", cursor: "pointer" }}
                        >
                          Amount{" "}
                          {expandedSortConfig.key === "Amount"
                            ? expandedSortConfig.direction === "ascending"
                              ? ""
                              : ""
                            : ""}
                        </th>
                        <th
                          onClick={() => handleExpandedSort("On_account")}
                          style={{ textAlign: "right", cursor: "pointer" }}
                        >
                          OnAccount{" "}
                          {expandedSortConfig.key === "On_account"
                            ? expandedSortConfig.direction === "ascending"
                              ? ""
                              : ""
                            : ""}
                        </th>
                      </tr>
                      {sortExpandedGroupItems(group.items).map((item, key) => (
                        <tr
                          style={{ whiteSpace: "nowrap" }}
                          onDoubleClick={() => handleNavigate(item.Id)}
                          className={
                            key === selectRow?.index ? "selcted-row-clr" : ""
                          }
                          key={item.RecdPVID}
                          onClick={() => selectedRowFun(item, key)}
                        >
                          <td></td>
                          <td></td>
                          <td>{item.RecdPVID}</td>
                          <td style={{ textAlign: "right" }}>
                            {formatAmount(item.Amount)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {formatAmount(item.On_account)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={Math.ceil(groupedArray.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>
    </>
  );
}
