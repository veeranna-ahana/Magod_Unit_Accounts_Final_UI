import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { baseURL } from "../../../../../api/baseUrl";

export default function PaymentReceipntTables({ getValues, date }) {
  const [selectRow, setSelectRow] = useState([]);
  const [selectRowVo, setSelectRowVo] = useState([]);
  const [getVoucherData, setGetVoucherData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [sortConfigDetails, setSortConfigDetails] = useState({
    key: null,
    direction: null,
  });

  // sorting function for table headings of the table first
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...getValues];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "Amount" ||
          sortConfig.key === "On_account" ||
          sortConfig.key === "Sync_HOId" ||
          sortConfig.key === "Cust_code" ||
          sortConfig.key === "HOPrvId" ||
          sortConfig.key === "TallyUpdate" ||
          sortConfig.key === "RecdPVID"
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
    if (
      sortConfigDetails.key === key &&
      sortConfigDetails.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfigDetails({ key, direction });
  };

  const sortedDataDetails = () => {
    const dataCopy = [...getVoucherData];

    if (sortConfigDetails.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfigDetails.key];
        let valueB = b[sortConfigDetails.key];

        // Convert only for the "intiger" columns
        if (
          sortConfigDetails.key === "RecdPvSrl" ||
          sortConfigDetails.key === "Sync_HOId" ||
          sortConfigDetails.key === "Inv_Amount" ||
          sortConfigDetails.key === "Amt_received" ||
          sortConfigDetails.key === "Receive_Now" ||
          sortConfigDetails.key === "TallyUpdate" ||
          sortConfigDetails.key === "RecdPVID"
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
    if (getValues.length > 0) {
      selectedRowFun(getValues[0], 0);
    } else {
      setSelectRow([]);
    }
  }, [getValues]);

  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    setSelectRow(list);

    const id = item.RecdPVID;

    axios
      .post(baseURL + `/dailyReport/paymentVoucherDetails`, {
        date: date,
        id: id,
      })
      .then((res) => {
        setGetVoucherData(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  const selectedRowFunVo = (item, index) => {
    let list = { ...item, index: index };
    setSelectRowVo(list);
  };

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  // console.log('payment', getValues);
  // console.log('payment', getVoucherData);

  return (
    <>
      <div>
        <label className="form-label">Receipt Voucher List </label>
      </div>

      <div
        className=""
        style={{ overflowY: "scroll", overflowX: "scroll", height: "160px" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: "nowrap" }}>
              <th onClick={() => requestSort("Recd_PVNo")}>Recd_PVNo</th>
              <th onClick={() => requestSort("CustName")}>Cust Name</th>
              <th onClick={() => requestSort("TxnType")}>Txn Type</th>
              <th onClick={() => requestSort("Amount")}>Amount</th>
              <th onClick={() => requestSort("On_account")}>On Account</th>
              <th onClick={() => requestSort("Description")}>Description</th>
              {/* <th>Id</th> */}
              <th onClick={() => requestSort("UnitName")}>Unitname</th>
              <th onClick={() => requestSort("RecdPVID")}>RecdPVID</th>
              <th>Selected</th>
              <th onClick={() => requestSort("Sync_HOId")}>Sync_Hold</th>
              <th onClick={() => requestSort("RecdPVID")}>Unit_Uid</th>
              <th onClick={() => requestSort("date")}>Recd_PV_Date</th>
              <th onClick={() => requestSort("ReceiptStatus")}>
                Receipt Status
              </th>
              <th onClick={() => requestSort("Cust_code")}>Cust_code</th>
              <th>Adjusted</th>
              <th onClick={() => requestSort("Cust_code")}>DocuNo</th>
              <th onClick={() => requestSort("HORef")}>HORef</th>
              <th onClick={() => requestSort("HOPrvId")}>HOPrvId</th>
              <th onClick={() => requestSort("TallyUpdate")}>Tally_UId</th>
              <th>Updated</th>
            </tr>
          </thead>

          <tbody className="tablebody">
            {sortedData()?.map((item, key) => {
              return (
                <tr
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => selectedRowFun(item, key)}
                  className={key === selectRow?.index ? "selcted-row-clr" : ""}
                >
                  <td
                    style={{
                      backgroundColor:
                        item.UpDated > 0 ? "#92ec93" : "transparent",
                    }}
                  >
                    {item.Recd_PVNo}
                  </td>
                  <td>{item.CustName}</td>
                  <td>{item.TxnType}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.Amount)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.On_account)}
                  </td>
                  <td>{item.Description}</td>
                  {/* <td>{item.Cust_code}</td> */}
                  <td>{item.UnitName}</td>
                  <td>{item.RecdPVID}</td>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{item.Sync_HOId}</td>
                  <td>{item.RecdPVID}</td>
                  <td>{item.date}</td>
                  <td>{item.ReceiptStatus}</td>
                  <td>{item.Cust_code}</td>
                  <td></td>
                  <td>{item.DocuNo}</td>
                  <td>{item.HORef}</td>
                  <td>{item.HOPrvId}</td>
                  <td>{item.TallyUpdate}</td>
                  <td>
                    <input type="checkbox" />
                  </td>

                  {/* <td>{item.Sync_HOId}</td> */}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <div>
        <label className="form-label">Voucher Details</label>
      </div>

      <div
        className=""
        style={{ overflowY: "scroll", overflowX: "scroll", height: "130px" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: "nowrap" }}>
              <th onClick={() => requestSortDetails("Inv_No")}>Invoice No</th>
              <th onClick={() => requestSortDetails("date")}>Date</th>
              <th onClick={() => requestSortDetails("Inv_Amount")}>Invoiced</th>
              <th onClick={() => requestSortDetails("Receive_Now")}>
                Received
              </th>
              <th onClick={() => requestSortDetails("RefNo")}>Ref No</th>
              {/* <th>Id</th> */}
              <th>PvrId</th>
              <th onClick={() => requestSortDetails("UnitName")}>Unitname</th>
              <th onClick={() => requestSortDetails("RecdPVID")}>RecdPVID</th>
              <th onClick={() => requestSortDetails("PVSrlID")}>PVSrlID</th>
              <th onClick={() => requestSortDetails("Unit_UId")}>Unit_Uid</th>
              <th>HoPvrId</th>
              <th onClick={() => requestSortDetails("RecdPvSrl")}>RecdPvSrl</th>
              <th onClick={() => requestSortDetails("Sync_HOId")}>Sync_Hold</th>
              <th onClick={() => requestSortDetails("Dc_inv_no")}>Dc_inv_no</th>
              <th onClick={() => requestSortDetails("Inv_No")}>Inv_No</th>
              <th onClick={() => requestSortDetails("Inv_Type")}>Inv_Type</th>
              <th onClick={() => requestSortDetails("Inv_Amount")}>
                Inv_Amount
              </th>
              <th onClick={() => requestSortDetails("Amt_received")}>
                Amt_received
              </th>
              <th onClick={() => requestSortDetails("Receive_Now")}>
                Receive_now
              </th>
              <th>InvUpdated</th>
              <th onClick={() => requestSortDetails("date")}>Inv_date</th>
              <th>Updated</th>
              <th onClick={() => requestSortDetails("RefNo")}>Ref No</th>
              <th>Voucher_type</th>
              <th>PreFix</th>
              <th>LedgerName</th>
            </tr>
          </thead>

          <tbody className="tablebody">
            {sortedDataDetails()?.map((item, key) => {
              return (
                <tr
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => selectedRowFunVo(item, key)}
                  className={
                    key === selectRowVo?.index ? "selcted-row-clr" : ""
                  }
                >
                  <td>{item.Inv_No}</td>
                  <td>{item.date}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.Inv_Amount)}
                  </td>
                  <td>{item.Receive_Now}</td>
                  <td>{item.RefNo}</td>
                  {/* <td></td> */}
                  <td></td>
                  <td>{item.UnitName}</td>
                  <td>{item.RecdPVID}</td>
                  <td>{item.PVSrlID}</td>
                  <td>{item.Unit_UId}</td>
                  <td></td>
                  <td>{item.RecdPvSrl}</td>
                  <td>{item.Sync_HOId}</td>
                  <td>{item.Dc_inv_no}</td>
                  <td>{item.Inv_No}</td>
                  <td>{item.Inv_Type}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.Inv_Amount)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.Amt_received)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.Receive_Now)}
                  </td>
                  <td>
                    {item.InvUpdated === 1 ? (
                      <input type="checkbox" value={item.InvUpdated} checked />
                    ) : (
                      <input type="checkbox" value={item.InvUpdated} disabled />
                    )}
                  </td>
                  <td>{item.date}</td>
                  <td>
                    {item.UpDated === 1 ? (
                      <input type="checkbox" value={item.UpDated} checked />
                    ) : (
                      <input type="checkbox" value={item.UpDated} disabled />
                    )}
                  </td>
                  <td>{item.RefNo}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
}
