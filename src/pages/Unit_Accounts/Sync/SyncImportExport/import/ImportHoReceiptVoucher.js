import React, {useEffect, useState} from 'react'
import { Table } from "react-bootstrap";
import ReactPaginate from 'react-paginate';

export default function ImportHoReceiptVoucher({data}) {
  const itemsPerPage = 100; // Number of items per page
const [currentPage, setCurrentPage] = useState(0);

// Calculate the start and end indices for the current page
const startIndex = currentPage * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

// Get the data for the current page
const currentPageData = data.slice(startIndex, endIndex);
console.log(currentPageData,'currentPageData')

const handlePageChange = ({ selected }) => {
  setCurrentPage(selected);
};
  return (
    <div>
    <div className="mt-4" style={{height:"400px",overflowY: "scroll",overflowX:"scroll"}}>
      <Table striped className="table-data border">
        <thead className="tableHeaderBGColor">
          <tr>
            <th>Type</th>
            <th style={{whiteSpace:"nowrap"}}>HO RV No</th>
            <th>Date</th>
            <th>Amount</th>
            <th>On_Account</th>
            <th style={{whiteSpace:"nowrap"}}>Customer Name</th>
          </tr>
        </thead>
        <tbody className="tablebody">
        {currentPageData ? currentPageData.map((rv) => (
            <tr key={rv.RecdPVID}>
            <td>{rv.TxnType}</td>
            <td>{rv.HOPrvId}</td>
            <td>{rv.Recd_PV_Date}</td>
            <td>{rv.Amount}</td>
            <td>{rv.On_account}</td>
            <td>{rv.CustName}</td>
          </tr>
          )): ''}
        </tbody>
      </Table>
    </div>
    <ReactPaginate
    previousLabel={'previous'}
    nextLabel={'next'}
    breakLabel={'...'}
    pageCount={Math.ceil(data.length / itemsPerPage)}
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
