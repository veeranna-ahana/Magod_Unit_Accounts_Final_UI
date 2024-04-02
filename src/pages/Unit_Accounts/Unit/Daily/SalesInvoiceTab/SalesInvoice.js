import { Tab } from "bootstrap";
import React, { useEffect, useState } from "react";
import { Tabs } from "react-bootstrap";
import { Table } from "react-bootstrap";
import ReviewInvoiceForm from "./ReviewInvoice/ReviewInvoiceForm";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../../../api/baseUrl";

export default function SalesInvoice({ getValuesSales, date }) {
  const [selectRow, setSelectRow] = useState([]);
  const [getValuesSalesDe, setGetValuesSalesDe] = useState([]);
  const [selectRowDe, setSelectRowDe] = useState([]);
  const [getValuesClearance, setGetValuesClearance] = useState([]);
  const [selectValues, setSelectValues] = useState([]);
  const [Keys123, setKeys123123] = React.useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [sortConfigDetails, setSortConfigDetails] = useState({
    key: null,
    direction: null,
  });

  const [lastToastTimestamp, setLastToastTimestamp] = useState(0);
  const cooldownDuration = 6000;

  // sorting function for table headings of the table first
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...getValuesSales];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "Net_Total" ||
          sortConfig.key === "TaxAmount" ||
          sortConfig.key === "GrandTotal"
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
    const dataCopy = [...getValuesSalesDe];

    if (sortConfigDetails.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfigDetails.key];
        let valueB = b[sortConfigDetails.key];

        // Convert only for the "integer" columns
        if (
          sortConfigDetails.key === "TaxAmt" ||
          sortConfigDetails.key === "TaxPercent" ||
          sortConfigDetails.key === "TaxableAmount" ||
          sortConfigDetails.key === "dc_invTaxId" ||
          sortConfigDetails.key === "Dc_inv_No" ||
          sortConfigDetails.key === "DcTaxID" ||
          sortConfigDetails.key === "Unit_UId"
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
    if (getValuesSales.length > 0) {
      selectedRowFun(getValuesSales[0], 0);
    } else {
      setSelectRow([]);
    }
  }, [getValuesSales]);

  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    setSelectRow(list);
    setSelectValues(list);

    let id = item.DC_Inv_No;
    // console.log(("id", id)); //2147288334

    axios
      .post(baseURL + `/dailyReport/salesInvoiceDetails`, {
        date: date,
        id: id,
      })
      .then((res) => {
        setGetValuesSalesDe(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    //Clearance summary API

    axios
      .post(baseURL + `/dailyReport/clearanceDetails`, { date: date, id: id })
      .then((res) => {
        setGetValuesClearance(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  const openBox = () => {
    console.log(selectRow);
    const now = Date.now();
    if (now - lastToastTimestamp >= cooldownDuration) {
      if (selectRow.length === 0) {
        setLastToastTimestamp(now);
        toast.error("Please select a row.");
      } else {
        setKeys123123(true);
      }
    }
  };

  const selectedRowFunDe = (item, index) => {
    let list = { ...item, index: index };
    setSelectRowDe(list);
  };

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  // console.log("Sales Inv", getValuesSales);
  // console.log("Sales Inv", getValuesSalesDe);
  // console.log('selected d', selectRowDe);

  return (
    <>
      <div className="mb-1">
        <button className="button-style group-button" onClick={openBox}>
          Review Invoice
        </button>
      </div>
      {
        //  Keys123 &&
        <ReviewInvoiceForm
          Keys123={Keys123}
          setKeys123123={setKeys123123}
          selectValues={selectValues}
          getValuesClearance={getValuesClearance}
        />
      }

      <div
        className=""
        style={{ overflowY: "scroll", overflowX: "scroll", height: "160px" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: "nowrap" }}>
              <th onClick={() => requestSort("DC_InvType")}>Type</th>
              <th onClick={() => requestSort("Inv_No")}>Invoice no</th>
              <th onClick={() => requestSort("Cust_Name")}>Name</th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("Net_Total")}
              >
                Net Total
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("TaxAmount")}
              >
                Tax amount
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("GrandTotal")}
              >
                Grand Total
              </th>
              <th onClick={() => requestSort("DCStatus")}>DC Status</th>
            </tr>
          </thead>

          <tbody className="tablebody">
            {sortedData()?.map((item, key) => {
              return (
                <tr
                  style={{
                    whiteSpace: "nowrap",
                    backgroundColor:
                      item.DCStatus === "Cancelled" ? "#f48483" : "transparent",
                  }}
                  onClick={() => selectedRowFun(item, key)}
                  className={key === selectRow?.index ? "selcted-row-clr" : ""}
                >
                  <td>{item.DC_InvType}</td>
                  <td
                    style={{
                      backgroundColor:
                        item.UpDated > 0 ? "#92ec93" : "transparent",
                    }}
                  >
                    {item.Inv_No}
                  </td>
                  <td>{item.Cust_Name}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.Net_Total)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.TaxAmount)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.GrandTotal)}
                  </td>
                  <td>{item.DCStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <div
        className=""
        style={{ overflowY: "scroll", overflowX: "scroll", height: "160px" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: "nowrap" }}>
              <th onClick={() => requestSortDetails("Tax_Name")}>Tax Name</th>
              <th onClick={() => requestSortDetails("TaxableAmount")}>
                Taxable amount
              </th>
              <th onClick={() => requestSortDetails("TaxPercent")}>Tax %</th>
              <th onClick={() => requestSortDetails("TaxAmt")}>Tax amount</th>
              <th onClick={() => requestSortDetails("AcctHead")}>AcctHead</th>
              <th>InvTax Id</th>
              <th>Sync_Hold</th>
              <th onClick={() => requestSortDetails("Unit_UId")}>Unit_Uid</th>
              <th>Updated</th>
              <th onClick={() => requestSortDetails("UnitName")}>UnitName</th>
              <th onClick={() => requestSortDetails("dc_invTaxId")}>
                dc_nv_Taxid
              </th>
              <th onClick={() => requestSortDetails("Dc_inv_No")}>Dc_inv_No</th>
              <th onClick={() => requestSortDetails("DcTaxID")}>DcTaxId</th>
              <th>TaxId</th>
              <th>TaxOn</th>
              {/* <th>TaxPercent</th>
              <th>TaxAmt</th> */}
              <th>ToWords</th>
              <th onClick={() => requestSortDetails("InvType")}> InvType</th>
              <th>InvId</th>
            </tr>
          </thead>

          <tbody className="tablebody">
            {sortedDataDetails()?.map((item, key) => {
              const taxPercent = parseFloat(item.TaxPercent);
              const formattedTaxPercent =
                taxPercent % 1 !== 0
                  ? taxPercent.toFixed(2)
                  : taxPercent.toFixed(0);
              return (
                <tr
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => selectedRowFunDe(item, key)}
                  className={
                    key === selectRowDe?.index ? "selcted-row-clr" : ""
                  }
                >
                  <td
                    style={{
                      backgroundColor:
                        item.UpDated > 0 ? "#92ec93" : "transparent",
                    }}
                  >
                    {item.Tax_Name}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.TaxableAmount)}
                  </td>
                  <td>{formattedTaxPercent}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.TaxAmt)}
                  </td>
                  <td>{item.AcctHead}</td>
                  <td></td>
                  <td></td>
                  <td>{item.Unit_UId}</td>
                  <td>
                    <input type="checkbox" />
                  </td>
                  {/* <td>{item.UpDated}</td> */}
                  <td>{item.UnitName}</td>
                  <td>{item.dc_invTaxId}</td>
                  <td>{item.Dc_inv_No}</td>
                  <td>{item.DcTaxID}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  {/* <td>{item.TaxAmt}</td> */}
                  {/* <td></td> */}
                  <td>{item.InvType}</td>
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
