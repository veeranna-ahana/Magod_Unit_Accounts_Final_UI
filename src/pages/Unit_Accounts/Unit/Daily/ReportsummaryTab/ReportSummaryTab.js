import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import SalesReportPdf from "../DailyReportTab/Print/SalesReportPdf/SalesReportPdf";

export default function ReportSummaryTab({
  getValuesReport,
  getValuesReceiptReport,
  groupedTaxArray,
  groupedArray,
}) {
  const [getTaxExpandValues, setGetTaxExpandedValues] = useState(null);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [selectRow, setSelectRow] = useState([]);
  const [selectRowInv, setSelectRowInv] = useState([]);
  const [selectRowRe, setSelectRowRe] = useState([]);
  const [selectRowTax, setSelectRowTax] = useState([]);
  const [sortByTotalReport, setSortByTotalReport] = useState({
    data: getValuesReport,
    ascending: true,
  });
  const [sortByTotalReceiptReport, setSortByTotalReceiptReport] = useState({
    data: getValuesReceiptReport,
    ascending: true,
  });

  
  

  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    setSelectRow(list);
  };

  const selectedRowFunInv = (item, index) => {
    let list = { ...item, index: index };
    setSelectRowInv(list);
  };

  const selectedRowFunTax = (item, index) => {
    let list = { ...item, index: index };
    setSelectRowTax(list);
  };

  const selectedRowFunRe = (item, index) => {
    let list = { ...item, index: index };
    setSelectRowRe(list);
  };

  const handleRowClick = (index) => {
    // setExpandedGroup(index === expandedGroup ? null : index);
    if (expandedGroup === index) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(index);
    }
  };

  const handleRowTaxClick = (index) => {
    // setGetTaxExpandedValues(index === getTaxExpandValues ? null : index);
    if (getTaxExpandValues === index) {
      setGetTaxExpandedValues(null);
    } else {
      setGetTaxExpandedValues(index);
    }
  };

  const totalSum = getValuesReport
    .reduce((acc, item) => acc + parseFloat(item.Total4), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalValue = getValuesReceiptReport
    .reduce((acc, item) => acc + parseFloat(item.Total), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log("getValuesReport",getValuesReport);

  useEffect(() => {
    // Update data and sort by Total (Report)
    const sortedData = [...getValuesReport].sort((a, b) =>
      sortByTotalReport.ascending ? a.Total - b.Total : b.Total - a.Total
    );
    setSortByTotalReport({
      data: sortedData,
      ascending: !sortByTotalReport.ascending,
    });
  }, [getValuesReport]);

  useEffect(() => {
    // Update data and sort by Total (Receipt Report)
    const sortedData = [...getValuesReceiptReport].sort((a, b) =>
      sortByTotalReceiptReport.ascending ? a.Total - b.Total : b.Total - a.Total
    );
    setSortByTotalReceiptReport({
      data: sortedData,
      ascending: !sortByTotalReceiptReport.ascending,
    });
  }, [getValuesReceiptReport]);

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  return (
    <>
      <div className="row">
        <div
          className="col-md-5"
          style={{ overflowY: "scroll", overflowX: "scroll", height: "350px" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr>
                <th>Invoice</th>
                <th></th>
                <th></th>
                <th></th>
                {/* <th></th> */}
              </tr>
              <tr>
                <th></th>
                <th>Type</th>
                <th style={{ textAlign: "right" }}>Count</th>
                <th style={{ textAlign: "right" }}>Total</th>
                {/* <th>Net</th> */}
              </tr>
            </thead>
            <tbody className="tablebody">
              {sortByTotalReport.data.map((item, key) => {
                return (
                  <tr
                    onClick={() => selectedRowFun(item, key)}
                    className={
                      key === selectRow?.index ? "selcted-row-clr" : ""
                    }
                  >
                    <td></td>
                    <td>
                      <b>{item.InvType}</b>
                    </td>
                    <td style={{ textAlign: "right" }}>{item.invCount}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(item.Total4)}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td></td>
                <td style={{ textAlign: "right" }}>
                  <b>Total</b>
                </td>
                <td style={{ textAlign: "right" }}>{totalSum}</td>
              </tr>
              <tr>
                <th>Receipts</th>
                <th></th>
                <th></th>
                <th></th>
                {/* <th></th> */}
              </tr>
              {sortByTotalReceiptReport.data.map((item, key) => {
                return (
                  <tr
                    onClick={() => selectedRowFunRe(item, key)}
                    className={
                      key === selectRowRe?.index ? "selcted-row-clr" : ""
                    }
                  >
                    <td></td>
                    <td>
                      <b>{item.TxnType}</b>
                    </td>
                    <td style={{ textAlign: "right" }}>{item.receiptCount}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(item.Total)}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td></td>
                <td style={{ textAlign: "right" }}>
                  <b>Total</b>
                </td>
                <td style={{ textAlign: "right" }}>{totalValue}</td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div
          className="col-md-7 mb-5"
          style={{ overflowY: "scroll", overflowX: "scroll", height: "350px" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th></th>
                <th></th>
                <th>Invoice Type</th>
                <th style={{ textAlign: "right" }}>Count</th>
                <th style={{ textAlign: "right" }}>Total</th>
                <th style={{ textAlign: "right" }}>Net</th>
                <th style={{ textAlign: "right" }}>Tax</th>
                <th style={{ textAlign: "right" }}>Value Added</th>
                <th style={{ textAlign: "right" }}>Material cost</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              {groupedArray.map((group, index) => (
                <React.Fragment key={index}>
                  <tr
                    style={{
                      backgroundColor:
                        expandedGroup === index ? "#909feb" : "transparent",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(index)}
                    >
                      {expandedGroup === index ? "-" : "+"}
                    </td>
                    <td>invoice</td>
                    <td>{group.invType}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(group.count)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(group.total)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(group.netTotal)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(group.tax)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(group.valueAdded)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(group.materialCost)}
                    </td>
                  </tr>

                  {expandedGroup === index && (
                    <React.Fragment>
                      <tr
                        style={{
                          backgroundColor: "AliceBlue",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style={{ textAlign: "right" }}>Invoice No</th>
                        <th style={{ textAlign: "right" }}>Invoice Total</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>

                        {/* Add more header columns as needed */}
                      </tr>

                      {group.items.map((item, itemIndex) => (
                        <tr
                          key={itemIndex}
                          onClick={() => selectedRowFunInv(item, itemIndex)}
                          className={
                            itemIndex === selectRowInv?.index
                              ? "selcted-row-clr"
                              : ""
                          }
                        >
                          <td></td>
                          <td></td>
                          <td></td>
                          <td style={{ textAlign: "right" }}>{item.Inv_No}</td>
                          <td style={{ textAlign: "right" }}>
                            {formatAmount(item.GrandTotal)}
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      ))}
                    </React.Fragment>
                  )}
                </React.Fragment>
              ))}

              <tr>
                <th></th>
                <th></th>
                <th>Receipt type</th>
                <th style={{ textAlign: "right" }}>Count</th>
                <th style={{ textAlign: "right" }}>Total</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>

              {groupedTaxArray.map((group, index) => (
                <React.Fragment key={index}>
                  <tr
                    style={{
                      backgroundColor:
                        getTaxExpandValues === index
                          ? "#909feb"
                          : "transparent",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRowTaxClick(index)}
                    >
                      {getTaxExpandValues === index ? "-" : "+"}
                    </td>
                    <td>Receipt</td>
                    <td>{group.invType}</td>
                    <td style={{ textAlign: "right" }}>{group.count}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatAmount(group.total)}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  {getTaxExpandValues === index && (
                    <React.Fragment>
                      <tr
                        style={{
                          backgroundColor: "AliceBlue",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style={{ textAlign: "right" }}>RV No</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>

                        {/* Add more header columns as needed */}
                      </tr>

                      {group.items.map((item, itemIndex) => (
                        <tr
                          key={itemIndex}
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() => selectedRowFunTax(item, itemIndex)}
                          className={
                            itemIndex === selectRowTax?.index
                              ? "selcted-row-clr"
                              : ""
                          }
                        >
                          <td></td>
                          <td></td>
                          <td></td>
                          <td style={{ textAlign: "right" }}>
                            {item.Recd_PVNO}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {formatAmount(item.Amount)}
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      ))}
                    </React.Fragment>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
