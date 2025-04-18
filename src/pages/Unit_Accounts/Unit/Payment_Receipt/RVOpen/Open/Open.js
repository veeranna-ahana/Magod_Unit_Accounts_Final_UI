import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../../../../api/baseUrl";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

export default function Open() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const itemsPerPage = 100; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the start and end indices for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentPageData = filteredData.slice(startIndex, endIndex);
  console.log(currentPageData, "currentPageData");
  console.log(filteredData, "filteredData");

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearch = (event) => {
    console.log(event.target.value);
    const inputValue = event.target.value;
    setSearchInput(inputValue);

    // Filter the data based on Receipt Status, Receipt Vr No, and Transaction Type if there's a search input, otherwise, use the initial data
    const filtered = inputValue
      ? data.filter(
          (rv) =>
            rv.ReceiptStatus.toLowerCase().includes(inputValue.toLowerCase()) ||
            rv.Recd_PVNo.toLowerCase().includes(inputValue.toLowerCase()) ||
            rv.TxnType.toLowerCase().includes(inputValue.toLowerCase())
        )
      : data;

    setFilteredData(filtered);
  };
  const OpenReceipts = async () => {
    try {
      const response = await axios.get(
        baseURL + "/Payment_Receipts/getopenreceipts"
      ); // Replace this URL with your API endpoint
      const results = response.data?.Result || [];
      setData(results);
      setFilteredData(results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    // Call the API function when the component mounts
    OpenReceipts();
  }, []); // Empty dependency array ensures it runs only once, equivalent to componentDidMount
  console.log(data, "syncpage");

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

  // const openVoucherButton = () => {
  //   if (selectRow !== "") {
  //     navigate("/UnitAccounts/Unit/PaymentReceiptVoucher", {
  //       state: selectRow.RecdPVID,
  //     });
  //   } else {
  //     toast.error("Select Row");
  //   }
  // };

  const openVoucherButton = () => {
    if (selectRow !== "") {
      navigate("/UnitAccounts/Unit/PaymentReceiptVoucher", {
        state: {
          rowData: selectRow.RecdPVID,
          date: selectRow.Recd_PV_Date,
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

  const [searchCustName, setSearchCustName] = useState([]);
  const searchCustomer = (event) => {
    const inputValue = event.target.value;
    setSearchCustName(inputValue);

    // Filter the data based on Receipt Status, Receipt Vr No, and Transaction Type if there's a search input, otherwise, use the initial data
    const filtered = inputValue
      ? data.filter((rv) =>
          rv.CustName.toLowerCase().includes(inputValue.toLowerCase())
        )
      : data;

    setFilteredData(filtered);
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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

        if (sortConfig.key === "Amount" || sortConfig.key === "On_account") {
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

  return (
    <>
      <div className="row">
        <h4 className="title">Payment Receipt Vouchers List</h4>
      </div>

      <div className="row">
        <div className="col-md-2 col-sm-12">
          <label className="form-label">Payment Receipt Vouchers</label>
        </div>

        <div className="d-flex col-md-3 mt-1" style={{ gap: "10px" }}>
          <label className="form-label">Search</label>
          <input
            className="in-field mt-1"
            placeholder="RV_NO/Txn_Type"
            type="text"
            onChange={handleSearch}
            value={searchInput}
          />
        </div>

        <div className="d-flex col-md-3 mt-1" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Search customer
          </label>
          <input
            class="in-field mt-1"
            type="text"
            placeholder="Search Customer"
            onChange={searchCustomer}
            value={searchCustName}
          />
        </div>

        <div className="col-md-3 col-sm-12">
          <button
            className="button-style  group-button"
            onClick={openVoucherButton}
          >
            Open Voucher
          </button>
        </div>

        <div className="col-md-1 col-sm-12">
          <button
            className="button-style  group-button"
            style={{ float: "right" }}
            onClick={(e) => navigate("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div>

      <div style={{ height: "350px", overflowY: "scroll", marginTop: "20px" }}>
        <Table
          striped
          className="table-data border"
          style={{ marginLeft: "5px", border: "1px" }}
        >
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: "nowrap" }}>
              <th onClick={() => requestSort("Recd_PVNo")}>Receipt Vr No</th>
              <th onClick={() => requestSort("Recd_PV_Date")} style={{ textAlign: "center" }}>Date</th>
              <th onClick={() => requestSort("CustName")}>Customer</th>
              <th onClick={() => requestSort("TxnType")}>Transaction Type</th>
              <th
                onClick={() => requestSort("Amount")}
                style={{ textAlign: "right" }}
              >
                Amount
              </th>
              <th onClick={() => requestSort("On_account")} style={{ textAlign: "center" }}>On Account</th>
              <th onClick={() => requestSort("Description")} style={{ textAlign: "center" }}>Description</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {sortedData()
              ? sortedData().map((rv, key) => (
                  <tr
                    // onClick={() => handleNavigate(rv.Id)} className="row-button" key={rv.Id}
                    style={{ whiteSpace: "nowrap" }}
                    onDoubleClick={() => handleNavigate(rv.Id)}
                    className={
                      key === selectRow?.index ? "selcted-row-clr" : ""
                    }
                    key={rv.RecdPVID}
                    onClick={() => selectedRowFun(rv, key)}
                  >
                    <td>{rv.Recd_PVNo}</td>
                    {/* <td>{rv.Recd_PV_Date}</td> */}
                    <td>
                      {new Date(rv.Recd_PV_Date)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </td>
                    <td>{rv.CustName}</td>
                    <td style={{ textAlign: "center" }}>{rv.TxnType}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(rv.Amount)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {formatAmount(rv.On_account)}
                    </td>
                    <td style={{ textAlign: "center" }}>{rv.Description}</td>
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
        pageCount={Math.ceil(filteredData.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </>
  );
}
