import React, { useEffect, useRef, useState } from "react";
import { xml2js } from "xml-js";
import { baseURL } from "../../../../api/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

export default function FromHOUpdate() {
  const fileInputRef = useRef(null);
  const [purchaseInv, setPurchaseInv] = useState([]);
  const [invoiceTax, setInvoiceTax] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedataa, setupdateData] = useState({
    open_inv: [],
    open_rec: [],
  });

  const navigate = useNavigate();

  const handleButtonClick = () => {
    fileInputRef.current.click();
    console.log("Xml File", fileInputRef);
  };

  const [receipt_data, setReceiptData] = useState([]);
  const [report, setReport] = useState([]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const xmlString = e.target.result;

        const parsedData = parseXmlData(xmlString);
        setReceiptData(xmlString);
        // setPurchaseInv(parsedData.syncInfo_pur_inv);
        // setInvoiceTax(parsedData.syncInfo_inv_tax);
        // setVendorList(parsedData.syncInfo_vendor_data);
        // sync_data(parsedData);
        console.log("jjjj", parsedData);
        // console.log("jjjj", parsedData.open_pur_inv.length);
      };
      reader.readAsText(file);
    } else {
      console.error("No valid file selected.");
    }
  };

  useEffect(() => {
    console.log("hmkiu", report);
    // useEffect will run when Inv is updated
    try {
      if (
        report.syncInfo_unit_inv.length > 0 ||
        report.syncInfo_tax_list.length > 0 ||
        report.syncInfo_dc_summary.length > 0 ||
        report.syncInfo_receipts_register.length > 0 ||
        report.syncInfo_receipts_adjusted.length > 0 ||
        report.syncInfo_cust_data.length > 0 ||
        report.syncInfo_cancelled_vouchers.length > 0
      ) {
        handleInsertData();
      }
    } catch (err) {
      console.log("The length is zero Initially");
    }
  }, [report]);

  const parseXmlData = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const multiMediaNodesunit = xmlDoc.querySelectorAll("MagodUnits");
    const multiMediaNodes = xmlDoc.querySelectorAll("unit_invoices_SyncInfo");
    const multiMediaNodes1 = xmlDoc.querySelectorAll(
      "unit_taxes_list_SyncInfo"
    );
    const multiMediaNodes2 = xmlDoc.querySelectorAll("dc_inv_summary_SyncInfo");
    const multiMediaNodes3 = xmlDoc.querySelectorAll(
      "unit_recipts_register_SyncInfo"
    );
    const multiMediaNodes4 = xmlDoc.querySelectorAll(
      "unit_receipts_adjusted_inv_list_SyncInfo"
    );
    const multiMediaNodes5 = xmlDoc.querySelectorAll("Unit_Cust_Data_SyncInfo");
    const multiMediaNodes6 = xmlDoc.querySelectorAll(
      "canceled_vouchers_list_syncInfo"
    );
    // const multiMediaNodes7 = xmlDoc.querySelectorAll("unit_recipts_register_SyncInfo");
    const parsedData = {
      syncInfo_unit_inv: [],
      syncInfo_tax_list: [],
      syncInfo_dc_summary: [],
      syncInfo_receipts_register: [],
      syncInfo_receipts_adjusted: [],
      syncInfo_cust_data: [],
      syncInfo_cancelled_vouchers: [],
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
    extractData(multiMediaNodes, parsedData.syncInfo_unit_inv);
    extractData(multiMediaNodes1, parsedData.syncInfo_tax_list);
    extractData(multiMediaNodes2, parsedData.syncInfo_dc_summary);
    extractData(multiMediaNodes3, parsedData.syncInfo_receipts_register);
    extractData(multiMediaNodes4, parsedData.syncInfo_receipts_adjusted);
    extractData(multiMediaNodes5, parsedData.syncInfo_cust_data);
    extractData(multiMediaNodes6, parsedData.syncInfo_cancelled_vouchers);
    setReport(parsedData);
    return parsedData;
  };

  //API calls for inserting the DATA from XML file
  const handleInsertData = () => {
    setIsLoading(true);
    axios
      .post(baseURL + "/fromHoUpdate/updateSyncInfo", report)
      .then((res) => {
        console.log("The updated sucessfully", res.data);
        toast.success("HO Sync Data Updated");
      })
      .catch((err) => {
        console.log("err in table", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // console.log("unitInv", report.syncInfo_unit_inv.length);
  // console.log("unitTax", report.syncInfo_tax_list.length);
  // console.log("unitDcSummary", report.syncInfo_dc_summary.length);
  // console.log("unitRegister", report.syncInfo_receipts_register.length);
  // console.log("unitAdjusted", report.syncInfo_receipts_adjusted.length);
  // console.log("unitCustData", report.syncInfo_cust_data.length);
  // console.log("unitCancelledVoucher", report.syncInfo_cancelled_vouchers.length);
  console.log("report", report);

  return (
    <>
      <div className={`${isLoading ? "loading" : ""}`}>
        <div className="row">
          <h4 className="title">From HO Update</h4>
        </div>
      </div>
      <div className="d-flex">
        <div>
          <button
            className={`button-style mt-2 group-button ${
              isLoading ? "loading" : ""
            }`}
            onClick={handleButtonClick}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "From HO Update"}
          </button>
          <input
            type="file"
            accept=".xml"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>
        <div className="" style={{ marginLeft: "82%" }}>
          <button
            className="button-style mt-2 group-button"
            type="button"
            onClick={(e) => navigate("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div>
      {isLoading && <Spinner />}
    </>
  );
}
