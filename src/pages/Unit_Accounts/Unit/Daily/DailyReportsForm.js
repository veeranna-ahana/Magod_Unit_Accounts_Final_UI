import React, { useEffect, useRef, useState } from "react";
import TabsSeven from "./TabsSeven";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { xml2js } from "xml-js";
import { baseURL } from "../../../../api/baseUrl";
import { toast } from "react-toastify";
import _debounce from "lodash/debounce";

export default function DailyReportsForm() {
  const navigate = useNavigate();

  const [getValues, setGetValues] = useState([]);
  const [getValuesTaxDetails, setGetValuesTaxDetails] = useState([]);
  const [getValuesSummaryDetails, setGetValuesSummaryDetails] = useState([]);
  const [getValuesReport, setGetValuesReport] = useState([]);
  const [getValuesReceiptReport, setGetValuesReceiptReport] = useState([]);
  const [getValuesHo, setGetValuesHo] = useState([]);
  const [getValuesHoDe, setGetValuesHoDe] = useState([]);
  const [getValuesTax, setGetValuesTax] = useState([]);
  const [getValuesPrdSum, setGetValuesPrdSum] = useState([]);
  const [getValuesSales, setGetValuesSales] = useState([]); // sales
  const [getPdfTaxValuess, setPdfTaxValuess] = useState([]);
  const [getCustTax, setCustTax] = useState([]);
  const [date, setDate] = useState("");
  const [report, setReport] = useState([]);
  const [dataa, setData] = useState({
    open_inv: [],
    open_rec: [],
  });

  const [lastToastTimestamp, setLastToastTimestamp] = useState(0);
  const cooldownDuration = 6000;

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
    console.log("Xml File", fileInputRef);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    alert(file);
    console.log(file);
    const reader = new FileReader();

    console.log("File selected", reader);

    reader.onload = (e) => {
      const xmlString = e.target.result;
      console.log(xmlString);
      const parsedData = parseXmlData(xmlString);
      const syncedData = [];

      console.log("Reading File", parsedData);

      getValuesSales.open_inv.map((unitInv) => {
        console.log("helooo", unitInv);
        const matchedInv = parsedData.open_inv.find(
          (importInv) => importInv.Inv_No === unitInv.Inv_No
        );
        console.log(matchedInv);
        if (matchedInv) {
          console.log("test");
          if (
            matchedInv.Net_Total !== unitInv.Net_Total ||
            matchedInv.GrandTotal !== unitInv.GrandTotal ||
            matchedInv.DCStatus !== unitInv.DCStatus
          ) {
            console.log("matched");
            syncedData.push({
              ...unitInv,
              UnitName: matchedInv.UnitName,
              Cust_name: matchedInv.Cust_name,
              DC_Inv_No: matchedInv.DC_Inv_No,
              PymtAmtRecd: matchedInv.PymtAmtRecd,
              GrandTotal: matchedInv.GrandTotal,
              DCStatus: matchedInv.DCStatus,
              Inv_Date: matchedInv.Inv_Date,
              Inv_No: matchedInv.Inv_No,
              HO_ReceiptStatus: matchedInv.HO_ReceiptStatus,
              Unit_UId: matchedInv.Unit_UId,
              Sync_HOId: matchedInv.Sync_HOId,
              HO_GrandTotal: matchedInv.GrandTotal,
              HO_PymtAmtRecd: matchedInv.PymtAmtRecd,
              HO_DCStatus: matchedInv.DCStatus,
              Remarks: "Value Different",
            });
          }
        }
      });
    };
  };

  const parseXmlData = (xmlString) => {
    alert("heyy im here");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
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
    extractData(multiMediaNodes1, parsedData.open_rec);
    extractData(multiMediaNodes, parsedData.open_inv);
    setReport(parsedData);
    return parsedData;
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatedDate = formatDate(date);

  const handleDate = (e) => {
    // const selectedDate = new Date(e.target.value);
    // const selectedYear = selectedDate.getFullYear();
    // const comparisonYear = 2013;

    // if (selectedYear < comparisonYear) {
    //   toast.error("Please select a year on or after 2013");
    // } else {
    //   setDate(e.target.value);
    // }
    setDate(e.target.value);
  };

  const handleGetData = () => {
    axios
      .post(baseURL + `/dailyReport/reportSummary`, { date: date })
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetValuesReport(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/dailyReport/receiptReportSummary`, {
        date: date,
      })
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetValuesReceiptReport(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/dailyReport/reportTaxDetails`, {
        date: date,
      })
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetValuesTaxDetails(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/dailyReport/reportSummaryDetails`, {
        date: date,
      })
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetValuesSummaryDetails(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/dailyReport/dailyReportdata`, { date: date })
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetValues(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/dailyReport/hoReceiptDetails`, {
        date: date,
      })
      .then((res) => {
        setGetValuesHoDe(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/dailyReport/taxSummary`, { date: date })
      .then((res) => {
        setGetValuesTax(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/dailyReport/productionSummary`, {
        date: date,
      })
      .then((res) => {
        setGetValuesPrdSum(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/dailyReport/salesInvoice`, { date: date })
      .then((res) => {
        setGetValuesSales(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/dailyReport/hoReceipt`, { date: date })
      .then((res) => {
        setGetValuesHo(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/dailyReport/receiptReportPdf`, { date: date })
      .then((res) => {
        setPdfTaxValuess(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/dailyReport/customerTaxReceiptsPdf`, { date: date })
      .then((res) => {
        setCustTax(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  const getDataOfDate = () => {
    const now = Date.now();
    if (now - lastToastTimestamp >= cooldownDuration) {
      if (date === "") {
        setLastToastTimestamp(now);
        toast.error("Please provide correct date");
      } else {
        handleGetData();
        setLastToastTimestamp(now);
        toast.success(
          `Accounts reports for ${formatedDate} prepared successfully`
        );
      }
    }
  };

  return (
    <>
      <div className="row">
        <h4 className="title">Unit Accounts Daily Reports Reviewer</h4>
      </div>

      <div className="row">
        <div className="col-md-2">
          <label className="form-label">Unit Accounts Daily Reports</label>
        </div>
        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <div className="">
            <label className="form-label mt-2" style={{ whiteSpace: "nowrap" }}>
              Select Report Date
            </label>
          </div>

          <div className="mt-2 col-md-7">
            <input
              className="in-field"
              type="date"
              onChange={(e) => handleDate(e)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <button className="button-style group-button" onClick={getDataOfDate}>
            Load Data
          </button>
        </div>
        <div className="col-md-3">
          <button
            className="button-style group-button"
            style={{ float: "right" }}
            onClick={(e) => navigate("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div>

      {/* <div className="row">
        <div className="col-md-3">
          <label className="form-label ms-2">Unit Accounts Daily Reports</label>
        </div>
        <div className="col-md-3">
          <div className="">
            <label className="form-label mt-2" style={{ whiteSpace: "nowrap" }}>
              Select Report Date
            </label>
          </div>
          <div className="">
            <input
              className="in-field "
              type="date"
              onChange={(e) => handleDate(e)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <button
            className="button-style mt-4 ms-2 group-button"
            onClick={getDataOfDate}
          >
            Load Data
          </button>
        </div>
        <div className="col-md-3">
          <button
            className="button-style mt-4 group-button"
            style={{ marginLeft: "200px" }}
            onClick={(e) => navigate("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div> */}

      <TabsSeven
        getValues={getValues}
        getValuesHo={getValuesHo}
        getValuesTax={getValuesTax}
        date={date}
        getValuesPrdSum={getValuesPrdSum}
        getValuesSales={getValuesSales}
        getValuesHoDe={getValuesHoDe}
        getValuesReport={getValuesReport}
        getValuesReceiptReport={getValuesReceiptReport}
        getValuesTaxDetails={getValuesTaxDetails}
        getValuesSummaryDetails={getValuesSummaryDetails}
        getPdfTaxValuess={getPdfTaxValuess}
        getCustTax={getCustTax}
      />
    </>
  );
}
