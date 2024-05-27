import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../api/baseUrl";
import { Typeahead } from "react-bootstrap-typeahead";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Table } from "react-bootstrap";
import InvoiceTable1 from "./InvoiceTab/InvoiceTable1";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

import { xml2js, js2xml } from "xml-js";
import MailModal from "../MailModal";

export default function ShowSyncStatus() {
  const version = "Unit";
  const navigate = useNavigate();
  const [unitdata, setunitData] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [getName, setGetName] = useState("Jigani");
  const [getUnitInvoice, setGetUnitInvoice] = useState([]);
  const [getUnitInvoiceForExport, setGetUnitInvoiceForExport] = useState([]);
  const [getHOInvoice, setGetHOInvoice] = useState([]);
  const [unitName, setUnitName] = useState("");
  const fileInputRef = useRef(null);
  const [key, setKey] = useState("Inv");
  const [selectRow, setSelectRow] = useState([]);
  const [invPaymentVrList, setInvPaymentVrList] = useState([]);
  const [invPaymentVrListHO, setInvPaymentVrListHO] = useState([]);
  const [selectedVrList, setSelectedVrList] = useState([]);
  const [selectRowHO, setSelectRowHO] = useState([]);
  const [selectedRowColor, setSelectedRowColor] = useState("");
  const [unitOpenInvoices, setUnitOpenInvoices] = useState([]);
  const [openVoucher, setOpenVoucher] = useState([]);
  const [unmatchedCount, setUnmatchedCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const arrayToXML = (data) => {
    const openInvoicesData = data.unitOpenInvoices || [];
    const openVoucherData = data.openVoucher || [];

    const options = {
      compact: true,
      ignoreComment: true,
      spaces: 4,
    };
    const xmlData = {
      AccountsDS: {
        MagodUnits: {
          UnitName: "Jigani",
          CashInHand: 0,
        },
        unit_invoices_list: openInvoicesData.map((item, index) => ({
          Id: 0 - index,
          Sync_HOId: item.Sync_HOId,
          Unit_UId: item.Unit_Uid,
          Selected: false,
          UnitName: item.unitName,
          DC_Inv_No: item.DC_Inv_No,
          ScheduleId: item.ScheduleId,
          Dc_inv_Date: item.Dc_inv_Date,
          DC_InvType: item.DC_InvType,
          InvoiceFor: item.InvoiceFor,
          OrderNo: item.OrderNo,
          OrderDate: item.OrderDate,
          OrderScheduleNo: item.OrderScheduleNo,
          DC_No: item.DC_No,
          DC_Date: item.DC_Date,
          DC_Fin_Year: item.DC_Fin_Year,
          Inv_No: item.Inv_No,
          Inv_Date: item.Inv_Date,
          Inv_Fin_Year: item.Inv_Fin_Year,
          PaymentDate: item.PaymentDate,
          PmnyRecd: item.PmnyRecd,
          PaymentMode: item.PaymentMode,
          PymtAmtRecd: item.PymtAmtRecd,
          Cust_Code: item.Cust_Code,
          Cust_Name: item.Cust_Name,
          Cust_Address: item.Cust_Address,
          Cust_Place: item.Cust_Place,
          Cust_State: item.Cust_State,
          Cust_StateId: item.Cust_StateId,
          PIN_Code: item.PIN_Code,
          ECC_No: item.ECC_No,
          TIN_No: item.TIN_No,
          TaxAmount: item.TaxAmount,
          PO_No: item.PO_No,
          Net_Total: item.Net_Total,
          Pkng_chg: item.Pkng_chg,
          TptCharges: item.TptCharges,
          Discount: item.Discount,
          Pgm_Dft_Chg: item.Pgm_Dft_Chg,
          MtrlChg: item.MtrlChg,
          AssessableValueTemp: item.AssessableValue,
          AssessableValue: item.AssessableValue,
          Del_Chg: item.Del_Chg,
          InvTotal: item.InvTotal,
          Round_Off: item.Round_Off,
          GrandTotal: item.GrandTotal,
          Total_Wt: item.Total_Wt,
          ScarpWt: item.ScarpWt,
          DCStatus: item.DCStatus,
          DespatchDate: item.DespatchDate,
          DespatchTime: item.DespatchTime,
          TptMode: item.TptMode,
          VehNo: item.VehNo,
          ExNotNo: item.ExNotNo,
          InspBy: item.InspBy,
          PackedBy: item.PackedBy,
          Com_inv_id: item.Com_inv_id,
          Del_responsibility: item.Del_responsibility,
          PaymentTerms: item.PaymentTerms,
          PN_PkngLevel: item.PN_PkngLevel,
          DueDays: 0,
          Due: item.AssessableValue,
          Srl: 0,
          SummaryInvoice: item.SummaryInvoice,
          JwValue: 0,
          BillType: item.BillType,
          MaterialValue: 0,
          Tally_Uid: 0,
          TallyRef: "nill",
          IsDC: item.IsDC,
          Del_Address: item.Del_Address,
          Del_StateId: item.Del_StateId,
          DelDC_Inv: item.DelDC_Inv,
          PO_Value: item.PO_Value,
          FB_Qty: item.FB_Qty,
          FB_Quality: item.FB_Quality,
          FB_Delivery: item.FB_Delivery,
          pkngLevel: item.PN_PkngLevel,
        })),
        Inv_Payment_Dedtails: openVoucherData.map((item, index) => ({
          Id: -1 - index,
          UnitName: item.unitName,
          DC_Inv_No: item.dc_inv_no,
          Amt_received: 0,
          Receive_Now: item.Receive_Now,
          VoucherNo: item.VoucherNo,
          VoucherStatus: item.VoucherStatus,
          TxnType: item.TxnType,
        })),
      },
    };
    return js2xml(xmlData, options);
  };

  const handleDownload = async () => {
    try {
      const xmlString = arrayToXML({
        unitOpenInvoices,
        openVoucher,
      });
      const finalXmlString = `<?xml version="1.0" standalone="yes"?>\n${xmlString}`;
      const blob = new Blob([finalXmlString], { type: "text/xml" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const today = new Date();
      const formattedDate = today
        .toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        .replace(/\s+/g, "_"); // Replace spaces with underscores
      const strUnitName = "Jigani";
      // const strUnitName = data[0]?.UnitName || "DefaultUnit"; // Replace "DefaultUnit" with a default value if UnitName is not available
      // a.download = "unit_hosync.xml";
      // const fileXml = `${strUnitName}_Open_Invoices_List_Unit_DB_${formattedDate}.xml`;
      a.download = `${strUnitName}_Open_Invoices_List_Unit_DB_${formattedDate}.xml`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // const handle = await window.showSaveFilePicker({
      //   suggestedName: fileXml,
      //   types: [
      //     {
      //       description: "XML Files",
      //       accept: {
      //         "text/xml": [".xml"],
      //       },
      //     },
      //   ],
      // });

      // const writable = await handle.createWritable();
      // await writable.write(blob);
      // await writable.close();

      // if (
      //   getCustInvoice === 0 &&
      //   getInvoiceList === 0 &&
      //   getPaymentReceipts === 0 &&
      //   getCancelledUnit === 0
      // ) {
      //   toast.success("Unit Vouchers In Sync");
      // } else {
      //   // <SendMail/>
      // }
    } catch (error) {
      console.error("Error saving file:", error);
    }
    await setTimeout(callMailModal, 10000);
  };

  const selectedRowFun = (item, index, color) => {
    let list = { ...item, index };
    setSelectRow(list);
    setSelectedRowColor(color);

    if (color == "#f48483") {
      toast.error("This Inv does not exist in HO DB");
      const dcInvNo = list.DC_Inv_No;

      console.log("dcNo", dcInvNo);
      console.log("unit", getName);

      axios
        .put(baseURL + `/showSyncStatus/updateUnmatchedRowsOfUnit/`, {
          getName: getName,
          dcInvNo: dcInvNo,
        })
        .then((res) => {
          console.log("Data updated sucessfully", res.data);
          // toast.success('The data updated successfuly')
        })
        .catch((err) => {
          console.log("err in table", err);
        });
    }
  };

  const selectedRowFunHO = (item, index, color) => {
    let list = { ...item, index: index };
    setSelectRowHO(list);

    if (color == "#f48483") {
      toast.error("This Inv does not exist in Unit DB");
      const dcInvNo = list.DC_Inv_No;

      console.log("dcNo", dcInvNo);

      axios
        .put(baseURL + `/showSyncStatus/updateUnmatchedRowsOfHO/`, {
          dcInvNo: dcInvNo,
        })
        .then((res) => {
          console.log("Data updated sucessfully", res.data);
          // toast.success('The data updated successfuly')
        })
        .catch((err) => {
          console.log("err in table", err);
        });
    }
  };

  console.log("nim", selectRow.DC_Inv_No);

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  //Unit paymentVr
  const selectedPaymentVr = [];
  for (const paymentVr of invPaymentVrList) {
    if (paymentVr.dc_inv_no == selectRow.DC_Inv_No) {
      selectedPaymentVr.push(paymentVr);
    }
  }

  //HO paymentVr
  const selectedPaymentVrHO = [];
  for (const paymentVrHO of invPaymentVrListHO) {
    if (paymentVrHO.dc_inv_no == selectRowHO.DC_Inv_No) {
      selectedPaymentVrHO.push(paymentVrHO);
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current.click();
    console.log("Xml File", fileInputRef);
    handleApi();
  };

  const [receipt_data, setReceiptData] = useState([]);
  const [report, setReport] = useState([]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const xmlString = e.target.result;

      const parsedData = parseXmlData(xmlString);
      setReceiptData(xmlString);
      // sync_data(parsedData);
      console.log("heloo", parsedData);
      // setUnitName(parsedData.open_unit[0].UnitName);
    };
    reader.readAsText(file);
  };

  const parseXmlData = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const multiMediaNodesunit = xmlDoc.querySelectorAll("MagodUnits");
    const multiMediaNodes = xmlDoc.querySelectorAll("unit_invoices_list");
    const parsedData = {
      open_inv: [],
      open_unit: [],
    };
    // Function to extract data dynamically from nodes
    const extractData = (nodes, targetArray) => {
      nodes.forEach((node) => {
        const mediaObject = {};

        node.childNodes.forEach((childNode) => {
          if (childNode.nodeType === Node.ELEMENT_NODE) {
            mediaObject[childNode.tagName] = childNode.textContent;
          }
        });
        targetArray.push(mediaObject);
      });
    };

    // Call the function for both arrays
    extractData(multiMediaNodesunit, parsedData.open_unit);
    extractData(multiMediaNodes, parsedData.open_inv);
    setReport(parsedData);
    setUnitName(parsedData.open_unit[0].UnitName);
    return parsedData;
  };

  const handleUnitSelect = (selected) => {
    const selectedCustomer = selected[0];
    setSelectedOption(selected); // Update selected option state
    setGetName(selectedCustomer ? selectedCustomer.UnitName : "");
  };

  const handleUnitName = () => {
    axios
      .get(baseURL + `/showSyncStatus/getunitName`)
      .then((res) => {
        // console.log("firstTable", res.data)
        setunitData(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  useEffect(() => {
    handleUnitName();
  }, []);

  //API
  const handleApi = async () => {
    await axios
      .put(baseURL + `/showSyncStatus/updateUnitInvoicePaymentStatus`)
      .then((res) => {
        console.log("Data updated sucessfully", res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    await axios
      .get(baseURL + `/showSyncStatus/getUnitOpenInvAndReceipts/` + getName)
      .then((res) => {
        setGetUnitInvoice(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    await axios
      .get(baseURL + `/showSyncStatus/getHoOpenInvAndReceipts/` + getName)
      .then((res) => {
        setGetHOInvoice(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    await axios
      .get(
        baseURL +
          `/showSyncStatus/getUnitOpenInvAndReceiptsForExport/` +
          getName
      )
      .then((res) => {
        setGetUnitInvoiceForExport(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  useEffect(() => {
    if (getUnitInvoice.length === 1) {
      compare(report);
      toast.success("Please wait data being Populating");
    }
  }, [report]);

  useEffect(() => {
    if (getUnitInvoiceForExport.length === 1) {
      setUnitOpenInvoices(getUnitInvoiceForExport[0].cmdInvList);
      setOpenVoucher(getUnitInvoiceForExport[0].cmdInvPaymentVrList);
    }
  }, [getUnitInvoiceForExport]);

  useEffect(() => {
    if (getHOInvoice.length === 1) {
      HOCompare(report);
    }
  }, [getHOInvoice]);

  // Initialize arrays to store matched and unmatched invoices
  const [matchedInvoices, setmatchedInvoices] = useState([]);
  const [unmatchedInvoices, setunmatchedInvoices] = useState([]);

  const compare = (report) => {
    if (getUnitInvoice.length === 1) {
      const unitInvoices = getUnitInvoice[0].cmdInvList;
      setInvPaymentVrList(getUnitInvoice[0].cmdInvPaymentVrList);
      // Identify invoices in unitInvoices that are not in report.open_inv
      unitInvoices.forEach((unitInv) => {
        const matchedInv = report.open_inv.find(
          (importInv) =>
            parseInt(importInv.DC_Inv_No) === parseInt(unitInv.DC_Inv_No) &&
            importInv.PymtAmtRecd === unitInv.PymtAmtRecd
        );

        if (matchedInv) {
          // Invoice is matched, add to matchedInvoices array
          matchedInvoices.push({ ...unitInv, matchedInv });
        } else {
          // Invoice is unmatched, add to unmatchedInvoices array
          unmatchedInvoices.push(unitInv);
        }
      });

      // Now matchedInvoices contains the matched invoices along with their corresponding importInv
      console.log("matchedInvoices", matchedInvoices);

      // Now unmatchedInvoices contains the invoices present in unitInvoices but not in report.open_inv
      console.log("unmatchedInvoices", unmatchedInvoices);
    } else {
      console.log("there is no length");
    }
  };

  // Initialize arrays to store matched and unmatched invoices
  const [matchedInvoicesHo, setmatchedInvoicesHo] = useState([]);
  const [unmatchedInvoicesHO, setunmatchedInvoicesHo] = useState([]);

  const HOCompare = (report) => {
    if (getHOInvoice.length === 1) {
      const hoInvoices = getHOInvoice[0].cmdHoInvList;
      setInvPaymentVrListHO(getHOInvoice[0].cmdHoInvPaymentVrList);
      // Identify invoices in unitInvoices that are not in report.open_inv
      hoInvoices.forEach((unitInv) => {
        const matchedInv = getUnitInvoice[0].cmdInvList.find(
          (importInv) =>
            parseInt(importInv.DC_Inv_No) === parseInt(unitInv.DC_Inv_No) &&
            importInv.PymtAmtRecd === unitInv.PymtAmtRecd
        );

        if (matchedInv) {
          // Invoice is matched, add to matchedInvoices array
          matchedInvoicesHo.push({ ...unitInv, matchedInv });
        } else {
          // Invoice is unmatched, add to unmatchedInvoices array
          unmatchedInvoicesHO.push(unitInv);
        }
      });

      // Now matchedInvoices contains the matched invoices along with their corresponding importInv
      console.log("matchedInvoicesHo", matchedInvoicesHo);

      // Now unmatchedInvoices contains the invoices present in unitInvoices but not in report.open_inv
      console.log("unmatchedInvoicesHO", unmatchedInvoicesHO);
    } else {
      console.log("there is no length");
    }
  };

  const handleResetInvoice = () => {
    const dcInvNo = selectRowHO.DC_Inv_No;

    console.log("dcNo", dcInvNo);

    if (dcInvNo) {
      axios
        .put(baseURL + `/showSyncStatus/updateUnmatchedRowsOfHO/`, {
          dcInvNo: dcInvNo,
        })
        .then((res) => {
          console.log("Data updated successfully", res.data);
          toast.success("Status updated");
        })
        .catch((err) => {
          console.log("err in table", err);
        });
    } else {
      toast.error("Please select the row from HO information");
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

  let countUnmatched = unmatchedInvoices.length;

  // console.log('outside if, unit',state);
  console.log("unit invoices", getUnitInvoice);
  // console.log("invPaymentVrList", invPaymentVrList);
  console.log("HO invoices", getHOInvoice);
  console.log("HO PaymentVrList", invPaymentVrListHO);
  console.log("Unit open Invoices for export", getUnitInvoiceForExport);
  console.log("Unit open", openVoucher, "And", unitOpenInvoices);
  // console.log('color', selectedRowColor);
  const [mailAlert, setMailAlert] = useState(false);
  const [mailModal, setMailModal] = useState(false);
  const handleClose = () => {
    setMailModal(false);
    setMailAlert(false);
  };
  const yesmailSubmit = () => {
    setMailAlert(false);
    setMailModal(true);
  };

  const callMailModal = () => {
    setMailAlert(true);
  };

  return (
    <>
      <Modal show={mailAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "12px" }}>magod_machine</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ fontSize: "12px" }}>
          {" "}
          Accounts Sync Report Saved as (path filename.xml) Do you wish to mail
          it?
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={yesmailSubmit}
            style={{ fontSize: "12px" }}
          >
            Yes
          </Button>
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{ fontSize: "12px" }}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="row">
        <h4 className="title">HO Unit Sync Review</h4>
      </div>

      <div className="row">
        <label className="form-label">Magod Laser Machining Pvt Ltd</label>
      </div>

      <div className="row mb-1">
        <div className="col-md-2">
          <label className="form-label">Syncronise Account Details </label>
        </div>
        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <Typeahead
            id="basic-example"
            labelKey={(option) =>
              option && option.UnitName ? option.UnitName.toString() : ""
            }
            options={unitdata}
            placeholder="Select Unit"
            onChange={handleUnitSelect}
            selected={selectedOption}
          />

          <button
            className="button-style  group-button"
            onClick={handleButtonClick}
          >
            Load Data
          </button>
          <input
            type="file"
            accept=".xml"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>
        <div className="col-md-4">
          <button
            className="button-style  group-button"
            onClick={handleDownload}
          >
            Export Report
          </button>
          <button
            className="button-style  group-button"
            onClick={handleResetInvoice}
          >
            Reset Invoice
          </button>
        </div>
        <div className="col-md-3">
          <button
            className="button-style  group-button"
            style={{ float: "right" }}
            onClick={(e) => navigate("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div>

      {/* <div className="row mb-3">
        <div className="">
          <div className="mt-2">
            <div className="row">
              <div className=" row">
                <label
                  className="form-label col-md-3"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Syncronise Account Details{" "}
                </label>
                <div className="col-md-2">
                  <Typeahead
                    id="basic-example"
                    labelKey={(option) =>
                      option && option.UnitName
                        ? option.UnitName.toString()
                        : ""
                    }
                    options={unitdata}
                    placeholder="Select Unit"
                    onChange={handleUnitSelect}
                    selected={selectedOption}
                  />
                </div>
                <button
                  className="button-style  group-button  "
                  style={{ width: "120px" }}
                  onClick={handleButtonClick}
                >
                  Load Data
                </button>
                <input
                  type="file"
                  accept=".xml"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
                <button
                  className="button-style  group-button "
                  style={{ width: "150px" }}
                  onClick={handleDownload}
                >
                  Export Report
                </button>
                <button
                  className="button-style  group-button "
                  style={{ width: "150px" }}
                  onClick={handleResetInvoice}
                >
                  Reset Invoice
                </button>

                <button
                  className="button-style  group-button "
                  style={{ width: "80px" }}
                  onClick={(e) => navigate("/UnitAccounts")}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div>
        <div className="row">
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3 mt-1 tab_font "
          >
            <Tab eventKey="Inv" title="Invoices">
              <div className="">
                <label className="form-label">
                  Missing /Mismatch Invoice Count {countUnmatched}
                </label>
              </div>
              <div className="row">
                <div
                  className="col-md-6"
                  style={{
                    height: "300px",
                    overflowX: "scroll",
                    overflowY: "scroll",
                  }}
                >
                  <div className="row">
                    <div className=" col-md-5">
                      <div>
                        <label className="form-label">Unit Information</label>{" "}
                      </div>
                    </div>
                    <button
                      className="button-style mt-2 group-button"
                      style={{ width: "80px" }}
                    >
                      Filter
                    </button>
                  </div>
                  <Table striped className="table-data border mt-1">
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th>Inv Type</th>
                        <th>Inv No</th>
                        <th>Date</th>
                        <th>Inv Total</th>
                        <th>Amt Received</th>
                        <th>Customer</th>
                        <th>Inv Status</th>
                      </tr>
                    </thead>

                    <tbody className="tablebody">
                      {/* Render rows for matchedInvoices */}
                      {matchedInvoices?.map((item, key) => {
                        return (
                          <tr
                            style={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#92ec93",
                            }}
                            onClick={() => selectedRowFun(item, key)}
                            className={
                              key === selectRow?.index ? "selcted-row-clr" : ""
                            }
                          >
                            <td>{item.DC_InvType}</td>
                            <td>{item.Inv_No}</td>
                            <td>{formatDate(item.Dc_inv_Date)}</td>
                            <td style={{ textAlign: "right" }}>
                              {formatAmount(item.InvTotal)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {formatAmount(item.PymtAmtRecd)}
                            </td>
                            <td>{item.Cust_Name}</td>
                            <td>{item.DCStatus}</td>
                          </tr>
                        );
                      })}
                      {/* {matchedInvoices.map((item, index) => {
                        return (
                          <tr
                            onClick={() => selectedRowFun(item, index)}
                            className={
                              index === selectRow?.index
                                ? "selcted-row-clr"
                                : ""
                            }
                            key={`matched-${item.DC_Inv_No}`}
                            style={{
                              backgroundColor: "#92ec93",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <td>{item.DC_InvType}</td>
                            <td>{item.Inv_No}</td>
                            <td>{formatDate(item.Dc_inv_Date)}</td>
                            <td>{item.InvTotal}</td>
                            <td>{item.PymtAmtRecd}</td>
                            <td>{item.Cust_Name}</td>
                            <td>{item.DCStatus}</td>
                          </tr>
                        );
                      })} */}

                      {/* Render rows for unmatchedInvoices */}
                      {unmatchedInvoices?.map((item, key) => {
                        return (
                          <tr
                            style={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#f48483",
                            }}
                            onClick={() => selectedRowFun(item, key, "#f48483")}
                            className={
                              key === selectRow?.index ? "selcted-row-clr" : ""
                            }
                          >
                            <td>{item.DC_InvType}</td>
                            <td>{item.Inv_No}</td>
                            <td>{formatDate(item.Dc_inv_Date)}</td>
                            <td style={{ textAlign: "right" }}>
                              {formatAmount(item.InvTotal)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {formatAmount(item.PymtAmtRecd)}
                            </td>
                            <td>{item.Cust_Name}</td>
                            <td>{item.DCStatus}</td>
                          </tr>
                        );
                      })}
                      {/* {unmatchedInvoices.map((item) => {
                        return (
                          <tr
                            key={`unmatched-${item.DC_Inv_No}`}
                            style={{
                              backgroundColor: "#f48483",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <td>{item.DC_InvType}</td>
                            <td>{item.Inv_No}</td>
                            <td>{formatDate(item.Dc_inv_Date)}</td>
                            <td>{item.InvTotal}</td>
                            <td>{item.PymtAmtRecd}</td>
                            <td>{item.Cust_Name}</td>
                            <td>{item.DCStatus}</td>
                          </tr>
                        );
                      })} */}
                    </tbody>
                  </Table>
                </div>

                <div
                  className="col-md-6"
                  style={{
                    height: "300px",
                    overflowX: "scroll",
                    overflowY: "scroll",
                  }}
                >
                  <div className="row">
                    <div className="  col-md-5">
                      <div>
                        <label className="form-label"> HO Information</label>{" "}
                      </div>
                    </div>
                    <button
                      className="button-style mt-2 group-button"
                      style={{ width: "80px" }}
                    >
                      Filter
                    </button>
                  </div>

                  <Table striped className="table-data border mt-1">
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th>Inv Type</th>
                        <th>Inv No</th>
                        <th>Date</th>
                        <th>Inv Total</th>
                        <th>Amt Received</th>
                        <th>Customer</th>
                        <th>Inv Status</th>
                      </tr>
                    </thead>

                    <tbody className="tablebody">
                      {unmatchedInvoicesHO?.map((item, key) => {
                        return (
                          <tr
                            style={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#f48483",
                            }}
                            onClick={() =>
                              selectedRowFunHO(item, key, "#f48483")
                            }
                            className={
                              key === selectRowHO?.index
                                ? "selcted-row-clr"
                                : ""
                            }
                          >
                            <td>{item.DC_InvType}</td>
                            <td>{item.Inv_No}</td>
                            <td>{formatDate(item.DC_Date)}</td>
                            <td style={{ textAlign: "right" }}>
                              {formatAmount(item.InvTotal)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {formatAmount(item.PymtAmtRecd)}
                            </td>
                            <td>{item.Cust_Name}</td>
                            <td>{item.DCStatus}</td>
                          </tr>
                        );
                      })}

                      {matchedInvoicesHo?.map((item, key) => {
                        return (
                          <tr
                            style={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#92ec93",
                            }}
                            onClick={() => selectedRowFunHO(item, key)}
                            className={
                              key === selectRowHO?.index
                                ? "selcted-row-clr"
                                : ""
                            }
                          >
                            <td>{item.DC_InvType}</td>
                            <td>{item.Inv_No}</td>
                            <td>{formatDate(item.DC_Date)}</td>
                            <td style={{ textAlign: "right" }}>
                              {formatAmount(item.InvTotal)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {formatAmount(item.PymtAmtRecd)}
                            </td>
                            <td>{item.Cust_Name}</td>
                            <td>{item.DCStatus}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Table3 and table4 */}

              <div className="row">
                <div
                  className="col-md-6"
                  style={{
                    height: "300px",
                    overflowX: "scroll",
                    overflowY: "scroll",
                  }}
                >
                  <Table striped className="table-data border">
                    <thead className="tableHeaderBGColor">
                      <tr style={{ whiteSpace: "nowrap" }}>
                        <th>VoucherNo</th>
                        <th>TxnType</th>
                        <th>Receive_Now</th>
                        <th>VoucherStatus</th>
                      </tr>
                    </thead>

                    <tbody className="tablebody">
                      {selectedPaymentVr &&
                        selectedPaymentVr.map((item, key) => {
                          return (
                            <tr style={{ whiteSpace: "nowrap" }} key={key}>
                              <td>{item.VoucherNo}</td>
                              <td>{item.TxnType}</td>
                              <td>{item.Receive_Now}</td>
                              <td>{item.VoucherStatus}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>

                <div
                  className="col-md-6"
                  style={{
                    height: "300px",
                    overflowX: "scroll",
                    overflowY: "scroll",
                  }}
                >
                  <Table striped className="table-data border">
                    <thead className="tableHeaderBGColor">
                      <tr>
                        <th>VoucherNo</th>
                        <th>TxnType</th>
                        <th>Receive_Now</th>
                        <th>VoucherStatus</th>
                      </tr>
                    </thead>

                    <tbody className="tablebody">
                      {/* {selectedPaymentVrHO &&
                        selectedPaymentVrHO.map((item, key) => {
                          return (
                            <tr style={{ whiteSpace: "nowrap" }} key={key}>
                              <td>{item.VoucherNo}</td>
                              <td>{item.TxnType}</td>
                              <td>{item.Receive_Now}</td>
                              <td>{item.VoucherStatus}</td>
                            </tr>
                          );
                        })} */}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab>

            <Tab eventKey="PR" title="Payment Recepients"></Tab>

            <Tab eventKey="HOR" title=" HO Payment Receipnts"></Tab>
          </Tabs>
        </div>
        {<MailModal mailModal={mailModal} setMailModal={setMailModal} />}
      </div>
    </>
  );
}
