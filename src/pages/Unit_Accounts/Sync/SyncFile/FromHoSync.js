import React, { useEffect, useRef, useState } from "react";
import { xml2js, js2xml } from "xml-js";
import { baseURL } from "../../../../api/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

export default function FromHoSync() {
  const [vendorSyncData, setVendorSyncData] = useState([]);
  const [purchaseInvSyncData, setPurchaseInvSyncData] = useState([]);
  const [paymentRVSyncData, setPaymentRvSyncData] = useState([]);
  const [cancelledVrSyncData, setCancelledRvSyncData] = useState([]);
  const [fileName, setFileName] = useState("");

  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleButtonClick = () => {
    fileInputRef.current.click();
    console.log("Xml File", fileInputRef);
  };

  const [receipt_data, setReceiptData] = useState([]);
  const [report, setReport] = useState([]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const xmlString = e.target.result;

        const parsedData = parseXmlData(xmlString);
        setReceiptData(xmlString);
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
    const multiMediaNodes3 = xmlDoc.querySelectorAll("ho_paymentrv_register");
    const multiMediaNodes4 = xmlDoc.querySelectorAll("canceled_vouchers_list");
    const multiMediaNodes5 = xmlDoc.querySelectorAll("ho_paymentrv_details");
    const parsedData = {
      open_vendor_data: [],
      open_pur_inv: [],
      open_inv_tax: [],
      paymentrv_register: [],
      cancelled_vouchers_list: [],
      paymentrv_details: [],
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
    extractData(multiMediaNodes, parsedData.open_vendor_data); //vendor data
    extractData(multiMediaNodes1, parsedData.open_pur_inv); //purchase inv list
    extractData(multiMediaNodes2, parsedData.open_inv_tax); //purchase inv taxes
    extractData(multiMediaNodes3, parsedData.paymentrv_register); //paymentrv_register
    extractData(multiMediaNodes4, parsedData.cancelled_vouchers_list); //cancelled_vouchers_list
    extractData(multiMediaNodes5, parsedData.paymentrv_details); //paymentrv_details
    setReport(parsedData);
    return parsedData;
  };

  //API calls for inserting the DATA from XML file
  const handleInsertData = async () => {
    setIsLoading(true);

    await axios
      .post(baseURL + "/fromHoSync/purchaseInv", report)
      .then((res) => {
        console.log("The Invoice data inserted sucessfully", res.data);
        toast.success("The Invoice data inserted sucessfully");
        setPurchaseInvSyncData(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    //await  axios
    //   .post(baseURL + "/fromHoSync/purchaseInvTax", report)
    //   .then((res) => {
    //     console.log("The invTax data inserted sucessfully", res.data);
    //     toast.success("The invTax data inserted sucessfully");
    //   })
    //   .catch((err) => {
    //     console.log("err in table", err);
    //   });

    await axios
      .post(baseURL + "/fromHoSync/vendorDataa", report)
      .then((res) => {
        console.log("The vendor data inserted sucessfully", res.data);
        toast.success("The vendor data inserted sucessfully");
        setVendorSyncData(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    await axios
      .post(baseURL + "/fromHoSync/paymentRvRegisterDataa", report)
      .then((res) => {
        console.log("The PaymentRv data inserted sucessfully", res.data);
        toast.success("The PaymentRv data inserted sucessfully");
        setPaymentRvSyncData(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    await axios
      .post(baseURL + "/fromHoSync/cancelledVouchersDataa", report)
      .then((res) => {
        console.log("The Cancelled data inserted sucessfully", res.data);
        toast.success("The Cancelled data inserted sucessfully");
        setCancelledRvSyncData(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  const arrayToXML = (data) => {
    const unitVendorDataSyncInfo = (data.vendorSyncData && data.vendorSyncData[0].responseVendorData) || [];
    const unitpurchaseinvoicelistSyncInfo = (data.purchaseInvSyncData && data.purchaseInvSyncData[0].purchaseInvData) || [];
    const unitpurchaseinvtaxesSyncInfo = (data.purchaseInvSyncData && data.purchaseInvSyncData[1].purchaseInvTax) || [];
    const canceledvoucherslistsyncInfo = data.cancelledVrSyncData || [];
    const hopaymentrvregisterSyncInfo = (data.paymentRVSyncData && data.paymentRVSyncData[0].paymentRvRegister) || [];
    const hopaymentrvdetailsSyncInfo = (data.paymentRVSyncData && data.paymentRVSyncData[1].paymentRvDetails) || [];
    const options = {
      compact: true,
      ignoreComment: true,
      spaces: 4,
    };
    const xmlData = {
      AccountsDS: {
        ho_paymentrv_register_SyncInfo: hopaymentrvregisterSyncInfo.map(
          (inv, index) => ({
            HOPrvId: inv.HOPrvId,
            UnitName: inv.Unitname,
            Unit_UId: inv.Unit_Uid,
            HO_Uid: inv.HOPrvId,
            ho_paymentrv_detailsSyncInfo: hopaymentrvdetailsSyncInfo
              .filter((item) => item.HOPrvId === inv.HOPrvId)
              .map((item) => ({
                Id: item.Id,
                UnitName: item.Unitname,
                Unit_UId: item.Unit_Uid,
                HO_Uid: item.HO_Uid,
                HOPrvId: item.HOPrvId,
              })),
          })
        ),
        Unit_Vendor_Data_SyncInfo: unitVendorDataSyncInfo.map((vr, index) => ({
          Id: 1 + index,
          UnitName: vr.UnitName,
          HO_Uid: vr.Sync_HOId,
          Unit_Uid: vr.Unit_Uid,
        })),
        unit_purchase_invoice_list_SyncInfo:
          unitpurchaseinvoicelistSyncInfo.map((detail, index) => ({
            PI_Id: detail.HO_SyncId,
            UnitName: detail.UnitName,
            HO_Uid: detail.HO_SyncId,
            Unit_Uid: detail.Unit_Uid,
            unit_purchase_inv_taxes_SyncInfo: unitpurchaseinvtaxesSyncInfo
              .filter((item) => item.PI_Id === detail.HO_SyncId)
              .map((item) => ({
                PurInTaxID: detail.HO_SyncId,
                Unit_UId: item.Unit_Uid,
                UnitName: item.UnitName,
                PI_Id: detail.HO_SyncId,
                HO_UId: item.UnitName,
              })),
          })),
        canceled_vouchers_list_syncInfo: canceledvoucherslistsyncInfo.map(
          (vr, index) => ({
            UnitName: vr.UnitName,
            Unit_Uid: vr.Unit_Uid,
            HO_Sync_Id: vr.HO_Sync_Id,
            UUID: vr.UUID,
          })
        ),
      },
    };
    return js2xml(xmlData, options);
  };

  const handleDownload = async () => {
    try {
      // Generate XML string
      const xmlString = arrayToXML({
        vendorSyncData,
        purchaseInvSyncData,
        paymentRVSyncData,
        cancelledVrSyncData,
      });

      // Add XML declaration to the string
      const finalXmlString = `<?xml version="1.0" standalone="yes"?>\n${xmlString}`;

      // Create a Blob object from the XML string
      const blob = new Blob([finalXmlString], { type: "text/xml" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create an <a> element for downloading the file
      const a = document.createElement("a");
      a.href = url;

      // Create a suggested file name with the current date and unit name
      const today = new Date();
      const formattedDate = today
        .toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        .replace(/\s+/g, "_"); // Replace spaces with underscores
      const strUnitName = fileName; // Modify this to get the unit name from appropriate source
      a.download = `${strUnitName}-updated.xml`;

      // Append <a> element to the document body, trigger click to start download, then remove the element
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revoke the URL object to release resources
      URL.revokeObjectURL(url);

      // Additional code for saving file using file picker (commented out)
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

      // Handle success message or additional actions (commented out)
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
  };

  // console.log("pur_inv", purchaseInv.length);
  // console.log("inv_tax", invoiceTax.length);
  // console.log("vendor_list", vendorList.length);
  // console.log("report", report.length);

  console.log("vendorSync", vendorSyncData);
  console.log("purchaseInvData", purchaseInvSyncData);
  console.log("paymentRvSync", paymentRVSyncData);
  console.log("cancelledSync", cancelledVrSyncData);
  return (
    <>
      <div className={`${isLoading ? "loading" : ""}`}>
        <div className="row">
          <h4 className="title">From HO Sync</h4>
        </div>
      </div>
      <div className="">
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

          <button
            className="button-style mt-2 group-button"
            type="button"
            onClick={handleDownload}
          >
            Download
          </button>

          <button
            className="button-style mt-2 group-button"
            type="button"
            onClick={(e) => navigate("/UnitAccounts")}
            style={{ float: "right" }}
          >
            Close
          </button>
        </div>
      </div>
      {isLoading && <Spinner />}
    </>
  );
}
