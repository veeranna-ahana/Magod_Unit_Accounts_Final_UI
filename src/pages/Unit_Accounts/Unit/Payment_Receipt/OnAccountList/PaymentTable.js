import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import axios from "axios";
import { colors } from "@mui/material";
import { baseURL } from '../../../../../api/baseUrl';
import ReactPaginate from 'react-paginate';


export default function PaymentTable() {
//   const [data, setData] = useState([])

//   const [searchInput, setSearchInput] = useState('');
//   const [filteredData, setFilteredData] = useState([]);

//   const [expandedGroup, setExpandedGroup] = useState(null);

//   const handleRowClick = (index) => {
//     setExpandedGroup(index === expandedGroup ? null : index);
//   };
//   console.log(expandedGroup,'expandedGroup')
//   const DraftReceipts = async () => {
//     try {
//       const response = await axios.get(baseURL+'/Payment_Receipts/getonaccountdetails'); // Replace this URL with your API endpoint
//       setData(response.data.Result);
//       console.log(response.data.Result)
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   useEffect(() => {
//     // Call the API function when the component mounts
//     DraftReceipts();
//   }, []); // Empty dependency array ensures it runs only once, equivalent to componentDidMount
//   console.log(data, 'syncpage')

  
//   const groupedData = data.reduce((groups, item) => {
//     const key = `${item.CustName}-${item.Cust_code}`;
  
//     if (!groups[key]) {
//       groups[key] = {
//         custName: item.CustName,
//         custCode: item.Cust_code,
//         totalOnAccount: 0,
//         items: [],
//       };
//     }
  
//     groups[key].items.push(item);
//     groups[key].totalOnAccount += parseFloat(item.On_account);
  
//     return groups;
//   }, {});
  
//   // Convert the groupedData map into an array
//   const groupedArray = Object.values(groupedData);
  
//   console.log(groupedArray, 'hjjhjkjk');
//   const itemsPerPage = 10; // Number of items per page
// const [currentPage, setCurrentPage] = useState(0);

// // Calculate the start and end indices for the current page
// const startIndex = currentPage * itemsPerPage;
// const endIndex = startIndex + itemsPerPage;

// // Get the data for the current page
// const currentPageData = groupedArray.slice(startIndex, endIndex);
// console.log(currentPageData,'currentPageData')

// const handlePageChange = ({ selected }) => {
//   setCurrentPage(selected);
// };
  
  return (
    <div>
      <div className='col-md-12' style={{ overflowY: 'scroll', overflowX: 'scroll', height: '450px',  }}>
      <Table striped className="table-data border">
        <thead className="tableHeaderBGColor">
          <tr>
            <th> </th>
            <th>Cust Code</th>
            <th>Customer</th>
            <th>OnAccount Amount</th>
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
                <td>{group.totalOnAccount}</td>
                <td></td>
              </tr>
              {expandedGroup === index && (
                <React.Fragment>
                  <tr style={{ backgroundColor: 'AliceBlue' }}>
                    <th></th>
                    <th></th>
                    <th>RV No</th>
                    <th>Amount</th>
                    <th>OnAccount</th>
                    {/* Add more header columns as needed */}
                  </tr>
                  {group.items.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td></td>
                      <td></td>
                      <td>{item.RecdPVID}</td>
                      <td>{item.Amount}</td>
                      <td>{item.On_account}</td>
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
  );
}
