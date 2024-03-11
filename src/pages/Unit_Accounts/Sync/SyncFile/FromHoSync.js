import React, { useEffect, useRef, useState } from "react";
import { xml2js } from "xml-js";
import { baseURL } from "../../../../api/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

export default function FromHoSync() {
  const fileInputRef = useRef(null);
  const [purchaseInv, setPurchaseInv] = useState([]);
  const [invoiceTax, setInvoiceTax] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataa, setData] = useState({
    open_inv: [],
    open_rec: [],
  });
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
        setPurchaseInv(parsedData.open_pur_inv);
        setInvoiceTax(parsedData.open_inv_tax);
        setVendorList(parsedData.open_vendor_data);
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
    // useEffect will run when purchaseInv is updated
    try {
      if (report.open_pur_inv.length > 0) {
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
    const multiMediaNodes = xmlDoc.querySelectorAll("Unit_Vendor_Data");
    const multiMediaNodes1 = xmlDoc.querySelectorAll(
      "unit_purchase_invoice_list"
    );
    const multiMediaNodes2 = xmlDoc.querySelectorAll("unit_purchase_inv_taxes");
    const parsedData = {
      open_vendor_data: [],
      open_pur_inv: [],
      open_inv_tax: [],
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
    extractData(multiMediaNodes1, parsedData.open_pur_inv); //purchase inv list
    extractData(multiMediaNodes, parsedData.open_vendor_data); //vendor data
    extractData(multiMediaNodes2, parsedData.open_inv_tax); //purchase inv taxes
    setReport(parsedData);
    return parsedData;
  };

  //API calls for inserting the DATA from XML file
  const handleInsertData = () => {
    setIsLoading(true);
    // toast.success("The data is Inserting.");
    axios
      .post(baseURL + "/fromHoSync/purchaseInv", report)
      .then((res) => {
        console.log(
          "The pur and tax Invoice data inserted sucessfully",
          res.data
        );
        toast.success("The data inserted sucessfully");
      })
      .catch((err) => {
        console.log("err in table", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // axios
    // .post(baseURL + "/fromHoSync/vendorInsertData", report)
    // .then((res) => {
    //   console.log("The vendor data inserted sucessfully", res.data);
    //   toast.success("The data inserted sucessfully");
    // })
    // .catch((err) => {
    //   console.log("err in table", err);
    // });
  };

  console.log("pur_inv", purchaseInv.length);
  console.log("inv_tax", invoiceTax.length);
  console.log("vendor_list", vendorList.length);
  console.log("report", report.length);

  return (
    <>
      <div className={`col-md-12 ${isLoading ? "loading" : ""}`}>
        <div className="row">
          <h4 className="title">From HO Sync</h4>
        </div>
      </div>
      <div className="col-md-12">
        <div>
        <button
          className={`button-style mt-2 group-button ${
            isLoading ? "loading" : ""
          }`}
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "From Ho Sync"}
        </button>
        <input
          type="file"
          accept=".xml"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        </div>
        <div className="" style={{marginLeft:'70%'}}>
          <button
            className="button-style mt-2 group-button"
            type="button"
            onClick={(e) => Navigate("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div>
      {isLoading && <Spinner />}
    </>
  );
}
