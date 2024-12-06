import React, { useEffect, useState } from "react";
import { Table, Toast } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../../../api/baseUrl";
import ReactPaginate from "react-paginate";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default function CustomerRVList() {
  const [selectedOption, setSelectedOption] = useState([
    { Cust_name: "MAGOD LASER MACHINING PVT LTD" },
  ]);
  const [selectedCustCode, setSelectedCustCode] = useState("0000");
  const [custdata, setcustData] = useState([]);
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const itemsPerPage = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the start and end indices for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentPageData = filteredData.slice(startIndex, endIndex);

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
  console.log("filterd data", filteredData);

  const custDetails = async () => {
    try {
      const response = await axios.get(
        baseURL + "/Payment_Receipts/getcustomerdata"
      );
      // Replace this URL with your API endpoint
      // console.log(response.data.Result);
      // let optionItems = response.data.Result.map((item) =>
      //   <option value={item.Cust_Code}>{item.Cust_name}</option>
      // );
      setcustData(response.data.Result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleCustomerSelect = (e) => {
  //   if (!e.target.classList.contains("row-button")) {
  //     const selectedCustomer = e.target.value;
  //     getReceipt(e.target.value);
  //   }
  // };

  const getReceipt = async (cust_code) => {
    try {
      const response = await axios.get(
        baseURL + `/Payment_Receipts/getRVlist?customercode=${cust_code}`
      ); // Replace this URL with your API endpoint
      console.log("recd pv no", response.data.Result);
      setData(response.data.Result);
      setFilteredData(response.data.Result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Call the API function when the component mounts
    custDetails();
  }, []);

  const handleTypeaheadChange = (selectedOptions) => {
    if (selectedOptions && selectedOptions.length > 0) {
      const selectedCustomer = selectedOptions[0];
      const custName = selectedCustomer.Cust_name;

      // Set the selected customer in state
      setSelectedOption([selectedCustomer]); // Ensure it's an array

      // Set the selected Cust_Code in state
      setSelectedCustCode(selectedCustomer.Cust_Code);
      getReceipt(selectedCustomer.Cust_Code);
      console.log(
        "cutttttttttt",
        selectedCustCode,
        selectedCustCode,
        selectedCustomer.Cust_name
      );
    } else {
      // Handle the case where nothing is selected (optional)
      setSelectedOption([]); // Clear the selected customer in state
      setSelectedCustCode(""); // Clear the selected Cust_Code in state
    }
  };

  const [selectRow, setSelectRow] = useState("");
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    //  setSelectRow(initial)

    setSelectRow(list);
    // setState(true);
  };
  const handleNavigate = (RecdPVID) => {
    // navigate("/UnitAccounts/Unit/PaymentReceiptVoucher", { state: RecdPVID });
  };

  // const openVoucherButton = () => {
  //   if (selectRow !== "") {
  //     navigate("/UnitAccounts/Unit/PaymentReceiptVoucher", {
  //       state: selectRow.RecdPVID,
  //       date: selectRow.Recd_PV_Date,
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

      <div className="row mt-1">
        <div className="col-md-2">
          <label className="form-label">Payment Receipt Vouchers</label>
        </div>
        <div className="d-flex col-md-4 mt-1" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Select Customer
          </label>
          <Typeahead
            className="ip-select"
            id="basic-example"
            labelKey={(option) =>
              option && option.Cust_name ? option.Cust_name.toString() : ""
            }
            valueKey="Cust_Code"
            options={custdata}
            style={{ marginTop: "-8px" }}
            placeholder="Select Customer"
            onChange={handleTypeaheadChange}
            selected={selectedOption}
          />
        </div>
        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label">Search</label>
          <input
            className="ip-select"
            type="text"
            style={{ marginTop: "5px" }}
            onChange={handleSearch}
            value={searchInput}
          />
        </div>
        <div className="col-md-3">
          <button
            className="button-style group-button"
            onClick={openVoucherButton}
          >
            Open Voucher
          </button>

          <button
            className="button-style group-button"
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
              <th onClick={() => requestSort("ReceiptStatus")}>
                Receipt Status
              </th>
              <th onClick={() => requestSort("Recd_PV_Date")}>Date</th>
              <th onClick={() => requestSort("CustName")}>Customer</th>
              <th onClick={() => requestSort("TxnType")}>Transaction Type</th>
              <th onClick={() => requestSort("Amount")}>Amount</th>
              <th onClick={() => requestSort("On_account")}>On Account</th>
              <th onClick={() => requestSort("Description")}>Description</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {sortedData()
              ? sortedData().map((rv, key) => (
                  <tr
                    onDoubleClick={() => handleNavigate(rv.RecdPVID)}
                    className={
                      key === selectRow?.index ? "selcted-row-clr" : ""
                    }
                    key={rv.RecdPVID}
                    onClick={() => selectedRowFun(rv, key)}

                    // className={key === selectRow?.index ? 'selcted-row-clr' : ''}
                  >
                    <td>{rv.Recd_PVNo}</td>
                    <td>{rv.ReceiptStatus}</td>
                    <td>
                      {new Date(rv.Recd_PV_Date).toLocaleDateString("en-GB")}
                    </td>
                    <td>{rv.CustName}</td>
                    <td>{rv.TxnType}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(rv.Amount)}
                    </td>
                    <td style={{ textAlign: "right" }}>
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
