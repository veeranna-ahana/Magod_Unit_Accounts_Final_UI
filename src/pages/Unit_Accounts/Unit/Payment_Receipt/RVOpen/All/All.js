import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../../../../../api/baseUrl';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';


export default function All() {
  const navigate = useNavigate();
  const [data, setData] = useState([])
  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const itemsPerPage = 100; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the start and end indices for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentPageData = filteredData.slice(startIndex, endIndex);
  console.log(currentPageData, 'currentPageData')
  console.log(filteredData, 'filteredData')

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearch = (event) => {
    console.log(event.target.value)
    const inputValue = event.target.value;
    setSearchInput(inputValue);

    // Filter the data based on Receipt Status, Receipt Vr No, and Transaction Type if there's a search input, otherwise, use the initial data
    const filtered = inputValue
      ? data.filter((rv) =>
        rv.ReceiptStatus.toLowerCase().includes(inputValue.toLowerCase()) ||
        rv.Recd_PVNo.toLowerCase().includes(inputValue.toLowerCase()) ||
        rv.TxnType.toLowerCase().includes(inputValue.toLowerCase())
      )
      : data;

    setFilteredData(filtered);
  };
  const AllReceipts = async () => {
    toast.success("Data Loading")
    try {
      const response = await axios.get(baseURL + '/Payment_Receipts/getallreceipts'); // Replace this URL with your API endpoint
      setData(response.data.Result);

      setFilteredData(response.data.Result)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    // Call the API function when the component mounts
    AllReceipts();
  }, []); // Empty dependency array ensures it runs only once, equivalent to componentDidMount
  console.log(data, 'syncpage')

  const [selectRow, setSelectRow] = useState('');
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index }
    //  setSelectRow(initial)


    setSelectRow(list);
    // setState(true);

  }
  const handleNavigate = (RecdPVID) => {
    navigate('/UnitAccounts/Unit/PaymentReceiptVoucher', { state: RecdPVID });
  };
  const openVoucherButton = () => {
    if (selectRow !== '') {
      navigate('/UnitAccounts/Unit/PaymentReceiptVoucher', { state: selectRow.RecdPVID })
    }
    else {
      toast.error("Select Row")
    }
  }

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }


  const [searchCustName, setSearchCustName] = useState([])
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
    <div>
      <div className="col-md-12">
        <div className="row">
          <h4 className="title">Payment Receipt Vouchers List</h4>
        </div>
      </div>


      <div className="col-md-12 row">
        <div className="col-md-3 mt-4 col-sm-12">
          <label className="form-label">Payment Receipt Vouchers</label>
        </div>


        <div className="col-md-2  ">
          <label className="form-label">Search</label>
          <input
           placeholder="RV_NO/Status/Txn_Type"
            type="text"
            onChange={handleSearch}
            value={searchInput}
          />

        </div>

        <div className="col-md-2  ">
          <label className="form-label">Search customer</label>
          <input
            
            type="text"
            placeholder="Search Customer"
            onChange={searchCustomer}
            value={searchCustName}
          />

        </div>

        <div className="col-md-2 mt-1 col-sm-12">
          <button
            className="button-style  group-button"
            style={{ width: "120px" }} onClick={openVoucherButton}
          >
            Open Voucher
          </button>
        </div>

        <div className="col-md-2 mt-1 col-sm-12">
          <button
            className="button-style  group-button"
            style={{ width: "80px" }} onClick={e => navigate('/UnitAccounts')}
          >
            Close
          </button>
        </div>


      </div>


      <hr
        style={{
          backgroundColor: "black",
          height: "3px",
          marginTop: "30px",
        }}
      />
      <div style={{ height: "300px", overflowY: "scroll", marginTop: "20px" }}>
        <Table
          striped
          className="table-data border"
          style={{ marginLeft: "5px", border: "1px" }}
        >
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: 'nowrap' }}>
              <th onClick={() => requestSort("Recd_PVNo")}>Receipt Vr No</th>
              <th onClick={() => requestSort("ReceiptStatus")}>Receipt Status</th>
              <th onClick={() => requestSort("Recd_PV_Date")}>Date</th>
              <th onClick={() => requestSort("CustName")}>Customer</th>
              <th onClick={() => requestSort("TxnType")}>Transaction Type</th>
              <th onClick={() => requestSort("Amount")} style={{ textAlign: 'right' }}>Amount</th>
              <th onClick={() => requestSort("On_account")}>On Account</th>
              <th onClick={() => requestSort("Description")}>Description</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {sortedData() ? sortedData().map((rv, key) => (
              <tr
                //  onClick={() => handleNavigate(rv.Id)} className="row-button" key={rv.Id}
                style={{ whiteSpace: 'nowrap' }}
                onDoubleClick={() => handleNavigate(rv.Id)} className={key === selectRow?.index ? 'selcted-row-clr' : ''} key={rv.RecdPVID}
                onClick={() => selectedRowFun(rv, key)}
              >
                {/* <td>
                      <input
                        type='checkbox'
                        checked={selectedItems.includes(rv.Id)}
                        onChange={() => handleCheckboxChange(rv.Id)}
                      />
                    </td> */}
                <td>{rv.Recd_PVNo}</td>
                <td>{rv.ReceiptStatus}</td>
                {/* <td>{rv.Recd_PV_Date}</td> */}
                <td>{new Date(rv.Recd_PV_Date).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                <td>{rv.CustName}</td>
                <td style={{ textAlign: 'center' }}>{rv.TxnType}</td>
                <td style={{ textAlign: 'right' }}>{formatAmount(rv.Amount)}</td>
                <td style={{ textAlign: 'right' }}>{formatAmount(rv.On_account)}</td>
                <td >{rv.Description}</td>
              </tr>
            )) : ''}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        pageCount={Math.ceil(filteredData.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </div>
  )
}
