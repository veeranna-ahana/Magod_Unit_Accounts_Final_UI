import React, { useEffect, useState } from "react";
// import PaymentTable from './PaymentTable';
import { useNavigate } from 'react-router-dom';
import { Col, Table } from "react-bootstrap";
import axios from "axios";
//import { colors } from "@mui/material";
import { baseURL } from '../../../../../api/baseUrl';
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";


export default function OnAccountDetailsForm() {

  const [data, setData] = useState([])

  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const [expandedGroup, setExpandedGroup] = useState(null);

  const handleRowClick = (index) => {
    setExpandedGroup(index === expandedGroup ? null : index);
  };
  console.log(expandedGroup,'expandedGroup')
  const DraftReceipts = async () => {
    try {
      const response = await axios.get(baseURL+'/Payment_Receipts/getonaccountdetails'); // Replace this URL with your API endpoint
      setData(response.data.Result);
      //console.log("onaccounst",response.data.Result)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    // Call the API function when the component mounts
    DraftReceipts();
  }, []); // Empty dependency array ensures it runs only once, equivalent to componentDidMount
  console.log(data, 'syncpage')

  
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
  
  console.log(groupedArray, 'hjjhjkjk');
  const itemsPerPage = 10; // Number of items per page
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
  const navigate=useNavigate();


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
  const openVoucherButton=()=>{
    if(selectRow!==''){
      navigate('/UnitAccounts/Unit/PaymentReceiptVoucher', { state: selectRow.RecdPVID })
      }
      else{
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
  return (
    <div>

<div className="col-md-12">
        <div className="row">
          <h4 className="title">Unit Open  Payment Receipt Vouchers</h4>
        </div>
      </div>
        <div className="">
       
        <label className="form-label">Magod Laser Machining Pvt Ltd</label>
    </div>
     <div className='row mb-3'>
                  
 <div className="col-md-8 col-sm-12"   >
     <div className="ip-box  mt-2" >
       <div className='row' >


       

         <div className="col-md-3">
         <label className="form-label" style={{whiteSpace:'nowrap'}}> On Account Details</label>
         </div>
      

         <button className="button-style mt-2 group-button" 
          style={{ width: "150px" }} onClick={openVoucherButton}>
          Open Voucher
         </button>

         <button className="button-style mt-2 group-button" 
          style={{ width: "150px" }} onClick={e=> navigate("/UnitAccounts")} >
          Close
         </button>
    
       </div>
   </div>
 </div>
</div>
<hr className="horizontal-line" />
{/* <PaymentTable/> */}
<div>
      <div className='col-md-12' style={{ overflowY: 'scroll', overflowX: 'scroll', height: '450px',  }}>
      <Table striped className="table-data border">
        <thead className="tableHeaderBGColor">
          <tr>
            <th> </th>
            <th>Cust Code</th>
            <th>Customer</th>
            <th style={{textAlign:'right'}}>OnAccount Amount</th>
            <th></th>
          </tr>
        </thead>

        <tbody className='tablebody'>
          {currentPageData.map((group, index) => (
            <React.Fragment key={index}>
              <tr>
                <td style={{ cursor: "pointer" }} onClick={() => handleRowClick(index)}>+</td>
                <td>{group.custCode}</td>
                <td>{group.custName}</td>
                <td style={{textAlign:'right'}}>{formatAmount(group.totalOnAccount)}</td>
                <td></td>
              </tr>
              {expandedGroup === index && (
                <React.Fragment>
                  <tr style={{ backgroundColor: 'AliceBlue' }}>
                    <th></th>
                    <th></th>
                    <th>RV No</th>
                    <th style={{textAlign:'right'}}>Amount</th>
                    <th style={{textAlign:'right'}}>OnAccount</th>
                    {/* Add more header columns as needed */}
                  </tr>
                  {group.items.map((item, key) => (
                    <tr
                    // key={itemIndex}
                    style={{whiteSpace:'nowrap'}}
                    onDoubleClick={() => handleNavigate(item.Id)} 
                    className={key === selectRow?.index ? 'selcted-row-clr' : ''} key={item.RecdPVID}
                    onClick={() => selectedRowFun(item, key)}
                    >
                      <td></td>
                      <td></td>
                      <td>{item.RecdPVID}</td>
                      <td style={{textAlign:'right'}}>{formatAmount(item.Amount)}</td>
                      <td style={{textAlign:'right'}}>{formatAmount(item.On_account)}</td>
                      
                    </tr>
                  ))}
                </React.Fragment>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>

        </div >
        <ReactPaginate
      previousLabel={'previous'}
      nextLabel={'next'}
      breakLabel={'...'}
      pageCount={Math.ceil(groupedArray.length / itemsPerPage)}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageChange}
      containerClassName={'pagination'}
      subContainerClassName={'pages pagination'}
      activeClassName={'active'}
    />
    </div>
    </div>
  );
}
