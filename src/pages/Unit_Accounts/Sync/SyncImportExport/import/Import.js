import React, { useRef, useState, useEffect } from "react";
import ImportOpenInvoice from "./ImportOpenInvoice";
import ImportOpenReceipt from "./ImportOpenReceipt";
import ImportHoReceiptVoucher from "./ImportHoReceiptVoucher";
import TallyInvoicesSync from "./TallyInvoicesSync";
import { Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { xml2js } from "xml-js";
import { baseURL } from "../../../../../api/baseUrl";

export default function Import(props) {
  // console.log(props, 'vaaaaaaaaaaaaaaaaaaaaaa')
  const fileInputRef = useRef(null);
  const [xmlData, setXmlData] = useState(props.data);
  const [flag, setFlag] = useState(false);
  const [dataa, setData] = useState({
    open_inv: [],
    open_rec: [],
  });
  const [updatedataa, setupdateData] = useState({
    open_inv: [],
    open_rec: [],
  });
  const [receipt_data, setReceiptData] = useState([]);
  const [report, setReport] = useState([]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  let unitname = "";
  let unitName = "Jigani";
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const xmlString = e.target.result;

      const parsedData = parseXmlData(xmlString);
      setReceiptData(xmlString);
      sync_data(parsedData);
      // console.log(parsedData);
    };
    reader.readAsText(file);
  };

  const sync_data = (parsedData) => {
    // Check and sync for open_inv
    // console.log("parseddata.......", parsedData);
    const syncedData = [];
    const syncedData1 = [];
    const missingInParsed = [];
    const missingInData = [];
    const syncedData2 = [];

    props.data.open_inv.forEach((unitInv) => {
      const matchedInv = parsedData.open_inv.find(
        (importInv) =>
          parseInt(importInv.DC_Inv_No) === parseInt(unitInv.DC_Inv_No)
      );
      console.log("matchdataaaaaaa", matchedInv);
      if (matchedInv) {
        if (
          parseInt(matchedInv.PymtAmtRecd) !== parseInt(unitInv.PymtAmtRecd) ||
          parseInt(matchedInv.GrandTotal) !== parseInt(unitInv.GrandTotal) ||
          matchedInv.DCStatus !== unitInv.DCStatus
        ) {
          syncedData.push({
            ...unitInv,
            UnitName: matchedInv.UnitName,
            Cust_Name: matchedInv.Cust_Name,
            Remarks: "Value Different",
            DC_Inv_No: matchedInv.DC_Inv_No,
            Unit_PymtAmtRecd: unitInv.PymtAmtRecd,
            Unit_GrandTotal: unitInv.GrandTotal,
            Unit_DCStatus: unitInv.DCStatus,
            Inv_Date: matchedInv.Inv_Date,
            Inv_No: matchedInv.Inv_No,
            HO_ReceiptStatus: matchedInv.ReceiptStatus,
            Unit_UId: matchedInv.Unit_UId,
            Sync_HOId: matchedInv.Sync_HOId,
            HO_GrandTotal: matchedInv.GrandTotal,
            HO_PymtAmtRecd: matchedInv.PymtAmtRecd,
            HO_DCStatus: matchedInv.DCStatus,
          });
          syncedData1.push({
            ...unitInv,
            UnitName: matchedInv.UnitName,
            Cust_Name: matchedInv.Cust_Name,
            Remarks: "Value Different",
            DC_Inv_No: matchedInv.DC_Inv_No,
            Unit_PymtAmtRecd: unitInv.PymtAmtRecd,
            Unit_GrandTotal: unitInv.GrandTotal,
            Unit_DCStatus: unitInv.DCStatus,
            Inv_Date: matchedInv.Inv_Date,
            Inv_No: matchedInv.Inv_No,
            HO_ReceiptStatus: matchedInv.ReceiptStatus,
            Unit_UId: matchedInv.Unit_UId,
            Sync_HOId: matchedInv.Sync_HOId,
            HO_GrandTotal: matchedInv.GrandTotal,
            HO_PymtAmtRecd: matchedInv.PymtAmtRecd,
            HO_DCStatus: matchedInv.DCStatus,
          });
        } else {
          syncedData1.push({
            ...matchedInv,
            UnitName: matchedInv.UnitName,
            Cust_Name: matchedInv.Cust_Name,
            DC_Inv_No: matchedInv.DC_Inv_No,
            Unit_PymtAmtRecd: unitInv.PymtAmtRecd,
            Unit_GrandTotal: unitInv.GrandTotal,
            Unit_DCStatus: unitInv.DCStatus,
            Inv_Date: matchedInv.Inv_Date,
            Inv_No: matchedInv.Inv_No,
            HO_ReceiptStatus: matchedInv.ReceiptStatus,
            Unit_UId: matchedInv.Unit_UId,
            Sync_HOId: matchedInv.Sync_HOId,
            HO_GrandTotal: matchedInv.GrandTotal,
            HO_PymtAmtRecd: matchedInv.PymtAmtRecd,
            HO_DCStatus: matchedInv.DCStatus,
          });
        }
      } else {
        // Record in parsedData is missing in data
        syncedData1.push({
          ...unitInv,
          Remarks: "Closed or Missing in HO",
          UnitName: unitInv.UnitName,
          Cust_name: unitInv.Cust_Name,
          DC_Inv_No: unitInv.DC_Inv_No,
          Unit_PymtAmtRecd: unitInv.PymtAmtRecd,
          Unit_GrandTotal: unitInv.GrandTotal,
          Unit_DCStatus: unitInv.DCStatus,
          Inv_Date: unitInv.Inv_Date,
          Inv_No: unitInv.Inv_No,
          Unit_UId: unitInv.Unit_UId,
          Sync_HOId: unitInv.Sync_HOId,
          HO_GrandTotal: 0,
          HO_PymtAmtRecd: 0,
          HO_DCStatus: "Unknown",
          //Remarks: 'Closed or Missing in HO',
        });
      }
    });

    // Check for records missing in parsedData
    parsedData.open_inv.forEach((unitInv) => {
      const matchedInv = props.data.open_inv.find(
        (importInv) =>
          parseInt(unitInv.DC_Inv_No) === parseInt(importInv.DC_Inv_No)
      );
      if (!matchedInv) {
        // Record in data is missing in parsedData
        syncedData1.push({
          ...unitInv,
          Remarks: "Closed or Missing in Unit",
          DC_InvType: unitInv.DC_InvType,
          UnitName: unitInv.UnitName,
          Cust_name: unitInv.Cust_name,
          DC_Inv_No: unitInv.DC_Inv_No,
          Unit_PymtAmtRecd: unitInv.PymtAmtRecd,
          Unit_GrandTotal: unitInv.GrandTotal,
          Unit_DCStatus: "Unknown",
          Inv_Date: unitInv.Inv_Date,
          Inv_No: unitInv.Inv_No,
          HO_ReceiptStatus: unitInv.HO_ReceiptStatus,
          Unit_UId: unitInv.Unit_UId,
          Sync_HOId: unitInv.Sync_HOId,
          HO_GrandTotal: unitInv.GrandTotal,
          HO_PymtAmtRecd: unitInv.PymtAmtRecd,
          HO_DCStatus: unitInv.DCStatus,
          //Remarks: 'Closed or Missing in Unit',
        });
      }
    });
    // Now you have three arrays: syncedData, missingInData, and missingInParsed

    // Repeat similar logic for open_rec to get syncedDataRec, missingInDataRec, and missingInParsedRec
    const syncedDataRec = [];
    const missingInParsedRec = [];
    const missingInDataRec = [];

    props.data.open_rec.forEach((unitInv) => {
      const matchedRv = parsedData.open_rec.find(
        (importInv) =>
          parseInt(importInv.RecdPVID) === parseInt(unitInv.RecdPVID)
      );
      if (matchedRv) {
        if (
          matchedRv.ReceiptStatus !== unitInv.ReceiptStatus ||
          parseInt(matchedRv.On_account) !== parseInt(unitInv.On_account)
        ) {
          // syncedData.push({
          //   ...unitInv,
          //   UnitName: matchedInv.UnitName,
          //   Cust_Name: matchedInv.Cust_Name,
          //   // ... other properties
          //   Remarks: 'Value Different',
          // });
          syncedDataRec.push({
            ...unitInv,
            HO_Amount: matchedRv.Amount,
            HO_On_account: matchedRv.On_account,
            HO_ReceiptStatus: matchedRv.ReceiptStatus,
            Remarks: "Value Different",
          });
          syncedData2.push({
            ...unitInv,
            HO_Amount: matchedRv.Amount,
            HO_On_account: matchedRv.On_account,
            HO_ReceiptStatus: matchedRv.ReceiptStatus,
            Remarks: "Value Different",
          });
        } else {
          syncedData2.push({
            ...matchedRv,
            Unitname: matchedRv.UnitName,
            Cust_code: matchedRv.Cust_code,
            CustName: matchedRv.CustName,
            HO_Amount: matchedRv.Amount,
            HO_On_account: matchedRv.On_account,
            HO_ReceiptStatus: matchedRv.ReceiptStatus,
            Recd_PV_Date: matchedRv.Recd_PV_Date,
            Recd_PVNo: matchedRv.Recd_PVNo,
            RecdPVID: matchedRv.RecdPVID,
            Sync_HOId: matchedRv.Sync_HOId,
            Unit_UId: matchedRv.Unit_UId,
            Unit_Amount: 0,
            Unit_On_account: 0,
            Unit_ReceiptStatus: "Unknown",
          });
        }
      } else {
        // Record in parsedData is missing in data
        syncedData2.push({
          ...unitInv,
          Remarks: "Closed or Missing in HO",
          Unitname: unitInv.UnitName,
          Cust_code: unitInv.Cust_code,
          CustName: unitInv.CustName,
          HO_Amount: unitInv.Amount,
          HO_On_account: unitInv.On_account,
          HO_ReceiptStatus: unitInv.ReceiptStatus,
          Recd_PV_Date: unitInv.Recd_PV_Date,
          Recd_PVNo: unitInv.Recd_PVNo,
          RecdPVID: unitInv.RecdPVID,
          Sync_HOId: unitInv.Sync_HOId,
          Unit_UId: unitInv.Unit_UId,
          Unit_Amount: 0,
          Unit_On_account: 0,
          Unit_ReceiptStatus: "Unknown",
        });
      }
    });

    // Check for records missing in parsedData
    parsedData.open_rec.forEach((unitInv) => {
      const matchedRv = props.data.open_rec.find(
        (importInv) =>
          parseInt(unitInv.DC_Inv_No) === parseInt(importInv.DC_Inv_No)
      );
      if (!matchedRv) {
        // Record in data is missing in parsedData
        syncedData2.push({
          ...unitInv,
          Remarks: "Closed or Missing in Unit",
          Unitname: unitInv.UnitName,
          Cust_code: unitInv.Cust_code,
          CustName: unitInv.CustName,
          HO_Amount: unitInv.Amount,
          HO_On_account: unitInv.On_account,
          HO_ReceiptStatus: unitInv.ReceiptStatus,
          Recd_PV_Date: unitInv.Recd_PV_Date,
          Recd_PVNo: unitInv.Recd_PVNo,
          RecdPVID: unitInv.RecdPVID,
          Sync_HOId: unitInv.Sync_HOId,
          Unit_UId: unitInv.Unit_UId,
          Unit_Amount: 0,
          Unit_On_account: 0,
          Unit_ReceiptStatus: "Unknown",
        });
      }
    });
    setData((prevData) => ({
      ...prevData,
      open_inv: syncedData1,
      open_rec: syncedData2,
    }));
    setupdateData((prevDatanew) => ({
      ...prevDatanew,
      open_inv: syncedData,
      open_rec: syncedDataRec,
    }));
  };

  const parseXmlData = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const multiMediaNodesunit = xmlDoc.querySelectorAll("MagodUnits");
    const multiMediaNodes = xmlDoc.querySelectorAll("unit_invoices_list");
    const multiMediaNodes1 = xmlDoc.querySelectorAll("unit_recipts_register");
    const parsedData = {
      open_inv: [],
      open_rec: [],
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
    //extractData(multiMediaNodesunit, unitname);
    extractData(multiMediaNodes1, parsedData.open_rec);
    extractData(multiMediaNodes, parsedData.open_inv);
    setReport(parsedData);
    return parsedData;
  };

  const postData = async () => {
    axios
      .post(baseURL + "/setupSync/postData", updatedataa)
      .then((res) => {
        console.log(res, "newiddd");
        if (res.data.Status === "Success") {
          alert("Data Updated Successfully");
          props.onDataReturn();
          const parsedData = parseXmlData(receipt_data);
          sync_data(parsedData);
          setFlag(true);
        } else {
          alert("Failed to update data");
        }
      })
      .catch((err) => {
        console.log("eroor in fromntend", err);
      });
  };

  useEffect(() => {
    console.log(receipt_data, "receipt_data");
    // const parsedData = parseXmlData(receipt_data)
    // sync_data(parsedData)
  }, [flag]);

  return (
    <div>
      <div className="row">
        <input
          type="file"
          accept=".xml"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        <div className="col-md-4 mb-2 col-sm-6">
          <button
            className="button-style  group-button"
            onClick={handleButtonClick}
          >
            Import Open Sync File
          </button>
        </div>
        <div className="col-md-4 mb-2 col-sm-6">
          <button className="button-style  group-button" onClick={postData}>
            Update Unit
          </button>
        </div>
      </div>

      <Tabs style={{ fontSize: "13px" }}>
        <Tab eventKey="openInvoice" title="Open Invoices">
          <ImportOpenInvoice data={dataa.open_inv} />
        </Tab>
        <Tab eventKey="openReceipts" title="Open Receipts">
          <ImportOpenReceipt data={dataa.open_rec} />
        </Tab>
        <Tab eventKey="hoReceiptVoucher" title="HO Receipt Vouchers">
          <ImportHoReceiptVoucher data={xmlData.ho_rec} />
        </Tab>
        <Tab eventKey="tallyInvoicesSync" title="Tally Invoices Sync">
          <TallyInvoicesSync data={xmlData.tally_inv} />
        </Tab>
      </Tabs>
    </div>
  );
}
