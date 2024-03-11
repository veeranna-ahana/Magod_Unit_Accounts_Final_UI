import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

export default function HoRvListTable({getValuesHo, getValuesHoDe}) {

  const [selectRowDe, setSelectRowDe] = useState([]);
  const [selectRow, setSelectRow] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [sortConfigDetails, setSortConfigDetails] = useState({ key: null, direction: null });

  // sorting function for table headings of the table first
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...getValuesHo];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "Amount" ||
          sortConfig.key === "On_account" ||
          sortConfig.key === "TaxAmount" ||
          sortConfig.key === "TaxableAmount"
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

  // sorting function for table headings of the table second
  const requestSortDetails = (key) => {
    let direction = "asc";
    if (sortConfigDetails.key === key && sortConfigDetails.direction === "asc") {
      direction = "desc";
    }
    setSortConfigDetails({ key, direction });
  };

  const sortedDataDetails = () => {
    const dataCopy = [...getValuesHoDe];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfigDetails.key];
        let valueB = b[sortConfigDetails.key];

        // Convert only for the "intiger" columns
        if (
          sortConfigDetails.key === "Inv_Amount" ||
          sortConfigDetails.key === "Amt_received" ||
          sortConfigDetails.key === "Receive_Now" ||
          sortConfigDetails.key === "RefNo"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigDetails.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigDetails.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopy;
  };

  useEffect(() => {
    if (getValuesHoDe.length>0) {
      selectedRowFunDe(getValuesHoDe[0], 0);
    } else {
      setSelectRowDe([])
    }
  }, [getValuesHoDe]);

  const selectedRowFunDe = (item, index) => {
    let list = { ...item, index: index };
    setSelectRowDe(list);
  };

  useEffect(() => {
    if (getValuesHo.length>0) {
      selectedRowFun(getValuesHo[0], 0);
    } else {
      setSelectRow([])
    }
  }, [getValuesHo]);

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

  // console.log("in table", getValuesHo[0].Inv_No);

  return (
    <div>
      <div className="row col-md-12">
        <div className="col-md-6">
        <div>
          <label className="form-label">HO Receipt Voucher List</label>
        </div>
        <div
          className=""
          style={{ overflowY: "scroll", overflowX: "scroll", height: "400px" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th onClick={() => requestSort("CustName")}>Cust Name</th>
                <th onClick={() => requestSort("TxnType")}>Txn Type</th>
                <th onClick={() => requestSort("Amount")}>Amount</th>
                <th onClick={() => requestSort("Description")}>Description</th>
                <th onClick={() => requestSort("On_account")}>On_account</th>
                <th>HORef</th>
                <th>HORef Date</th>
                <th onClick={() => requestSort("ReceiptStatus")}>Status</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              {sortedData()?.map((item,key)=>{
                return(
                <tr style={{ whiteSpace: "nowrap" }}
                onClick={() => selectedRowFun(item, key)} 
                className={key === selectRow?.index ? "selcted-row-clr" : ""}>
                <td>{item.CustName}</td>
                <td>{item.TxnType}</td>
                <td style={{textAlign:'right'}}>{formatAmount(item.Amount)}</td>
                <td>{item.Description}</td>
                <td style={{textAlign:'right'}}>{formatAmount(item.On_account)}</td>
                <td>{item.HORef}</td>
                <td>{item.HO_RefDate}</td>
                <td>{item.ReceiptStatus}</td>
                </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
        </div>

        <div className="col-md-6">
          <div>
            <label className="form-label">HO Receipt Details </label>
          </div>
          <div
            className=""
            style={{
              overflowY: "scroll",
              overflowX: "scroll",
              height: "400px",
            }}
          >
            <Table striped className="table-data border">
              <thead className="tableHeaderBGColor">
                <tr style={{ whiteSpace: "nowrap" }}>
                  <th onClick={() => requestSortDetails("Inv_No")}>Invoice No</th>
                  <th onClick={() => requestSortDetails("Inv_date")}>Date</th>
                  <th onClick={() => requestSortDetails("Inv_Type")}> Type</th>
                  <th onClick={() => requestSortDetails("Inv_Amount")}>Invoice Amount</th>
                  <th onClick={() => requestSortDetails("Amt_received")}>Received</th>
                  <th onClick={() => requestSortDetails("Receive_Now")}>Receive Now</th>
                  <th>Updated</th>
                  <th onClick={() => requestSortDetails("RefNo")}>Ref No</th>
                </tr>
              </thead>

              <tbody className="tablebody">
                {sortedDataDetails()?.map((item, key)=>{
                  return(
                    <tr style={{ whiteSpace: "nowrap" }} 
                     onClick={() => selectedRowFunDe(item, key)} 
                    className={key === selectRowDe?.index ? "selcted-row-clr" : ""}>
                      <td>{item.Inv_No}</td>
                      <td>{item.Inv_date}</td>
                      <td>{item.Inv_Type}</td>
                      <td style={{textAlign:'right'}}>{formatAmount(item.Inv_Amount)}</td>
                      <td style={{textAlign:'right'}}>{formatAmount(item.Amt_received)}</td>
                      <td style={{textAlign:'right'}}>{formatAmount(item.Receive_Now)}</td>
                      <td></td>
                      <td>{item.RefNo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
