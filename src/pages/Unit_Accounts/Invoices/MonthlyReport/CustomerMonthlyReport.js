import React, { useEffect, useState } from "react";
import InvoiceSummary from "./MonthlyReportTabs/InvoiceSummary";
import TaxSummary from "./MonthlyReportTabs/TaxSummary";
import ClearanceSummary from "./MonthlyReportTabs/ClearanceSummary";
import CollectionSummary from "./MonthlyReportTabs/CollectionSummary";
import CustomerValueAddition from "./MonthlyReportTabs/CustomerValueAddition";
import SalesOutstandingBills from "./MonthlyReportTabs/SalesOutstandingBills";
import AllOutstandingBills from "./MonthlyReportTabs/AllOutstandingBills";
import MachineUtilisation from "./MonthlyReportTabs/MachineUtilisation";
import MaterialSalesSummary from "./MonthlyReportTabs/MaterialSalesSummary";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "../../../../api/baseUrl";

export default function CustomerMonthlyReport() {
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [wordMonth, setWordMonth] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [getName, setGetName] = useState("");
  const [getMonthReport, setGetMonthReport] = useState([]);
  const [getMonthInvReport, setGetMonthInvReport] = useState([]);
  const [getMonthInvReportNames, setGetMonthInvReportNames] = useState([]);
  const [getMaterialSummary, setGetMaterialSummary] = useState([]);
  const [getMachineSummary, setGetMachineSummary] = useState([]);
  const [getSalesOutStanding, setGetSalesOutStanding] = useState([]);
  const [getAllOutStanding, setGetAllOutStanding] = useState([]);
  const [getCollectionSummary, setGetCollectionSummary] = useState([]);
  const [getClearanceSummary, setGetClearanceSummary] = useState([]);
  const [getCustomerAddtion, setGetCustomerAddtion] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthNumbers = [
    { value: "1" },
    { value: "2" },
    { value: "3" },
    { value: "4" },
    { value: "5" },
    { value: "6" },
    { value: "7" },
    { value: "8" },
    { value: "9" },
    { value: "10" },
    { value: "11" },
    { value: "12" },
  ];

  const convertToMonthName = (month) => {
    if (month >= 1 && month <= 12) {
      setWordMonth(monthNames[month - 1]); // Set the "month" state directly
    }
  };

  // Use useEffect for initialization logic
  useEffect(() => {
    // Create a fromDate object for the first day of the specified month and year
    const fromDatee = new Date(year, month, 1);

    // Calculate toDate by adding one month to fromDate and subtracting one day
    const toDatee = new Date(
      fromDatee.getFullYear(),
      fromDatee.getMonth() + 1,
      0
    );

    // Function to format date as "YYYY-MM-DD"
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Format and set the state variables with the calculated values
    setFromDate(formatDate(fromDatee));
    setToDate(formatDate(toDatee));
  }, [month, year]);

  const handleMonth = (e) => {
    setMonth(e.target.value);
    convertToMonthName(e.target.value);
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const handleYear = (e) => {
    const inputYear = e.target.value;
    setYear(inputYear); // Update the year value immediately
  };

  const validateYear = () => {
    const currentYear = new Date().getFullYear();
    if (year < 2014) {
      toast.error("Please select a year after 2014");
      setYear(""); // Clear the year value
    } else if (year > currentYear) {
      toast.error("Please select a year before or equal to the current year");
      setYear(""); // Clear the year value
    }
  };

  // const handleNames = (e) => {
  //   setGetName(e.target.value);
  // };

  const handleNames = (selected) => {
    const selectedCustomer = selected[0];
    setSelectedOption(selected); // Update selected option state
    setGetName(selectedCustomer ? selectedCustomer.Cust_Name : ""); // Update selected name
  };

  useEffect(() => {
    axios
      .post(baseURL + `/custMonthlyReportData/monthlyInvSummaryNames`)
      .then((res) => {
        setGetMonthInvReportNames(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  }, []);

  // Function to calculate dates
  // const calculateDates = () => {
  //   // console.log("uuuuu", year , month);

  //   // Create a fromDate object for the first day of the specified month and year
  //   const fromDatee = new Date(year, month, 1);

  //   // Calculate toDate by adding one month to fromDate and subtracting one day
  //   const toDatee = new Date(
  //     fromDatee.getFullYear(),
  //     fromDatee.getMonth() + 1,
  //     0
  //   );

  //   // Format and set the state variables with the calculated values
  //   setFromDate(formatDate(fromDatee));
  //   setToDate(formatDate(toDatee));
  // };

  console.log("hgsausa", fromDate, toDate);

  const handleGetData = () => {
    console.log("hgsausa", fromDate, toDate);

    toast.success('Please wait data being populating');

    axios
      .post(baseURL + `/custMonthlyReportData/monthlyTaxSummary`, {
        month: month,
        year: year, 
        getName: getName,
      })
      .then((res) => {
        setGetMonthReport(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/custMonthlyReportData/monthlyInvSummaryCustomerwise`, {
        month: month,
        year: year,
        getName: getName,
      })
      .then((res) => {
        setGetMonthInvReport(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/custMonthlyReportData/monthlySalesOutStanding`, {
        month: month,
        year: year,
        getName: getName,
      })
      .then((res) => {
        setGetSalesOutStanding(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/custMonthlyReportData/materialSalesSummary`, {
        month: month,
        year: year,
        getName: getName,
      })
      .then((res) => {
        setGetMaterialSummary(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/custMonthlyReportData/machineUtilaisation`, {
        fDate: fromDate,
        tDate: toDate,
        getName: getName,
      })
      .then((res) => {
        setGetMachineSummary(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/custMonthlyReportData/allOutStandingBills`, {
        month: month,
        year: year,
        getName: getName,
      })
      .then((res) => {
        setGetAllOutStanding(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/custMonthlyReportData/collectionSummary`, {
        month: month,
        year: year,
        getName: getName,
      })
      .then((res) => {
        setGetCollectionSummary(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/custMonthlyReportData/clearanceSummary`, {
        month: month,
        year: year,
        getName: getName,
      })
      .then((res) => {
        setGetClearanceSummary(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .post(baseURL + `/custMonthlyReportData/customerValueAddtion`, {
        month: month,
        year: year,
        getName: getName,
      })
      .then((res) => {
        setGetCustomerAddtion(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  // Wrapper function to call both functions
  const handleButtonClick = () => {
    handleGetData();
  };

  console.log("Joi", getMonthInvReport);

  const navigate = useNavigate();
  return (
    <>
      <div className="row">
        <h4 className="title">Customerwise Monthly Report</h4>
      </div>

      <div className="row">
        <div className="col-md-3">
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Unit Monthly Report for {wordMonth} {year}
          </label>
        </div>

        <div className="d-flex col-md-3 mt-1" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Select List
          </label>

          <Typeahead
            className="ip-select"
            id="basic-example"
            labelKey={(option) =>
              option && option.Cust_Name ? option.Cust_Name.toString() : ""
            }
            options={getMonthInvReportNames}
            placeholder="Select Customer"
            onChange={handleNames}
            selected={selectedOption}
            style={{ marginTop: "-7px" }}
          />
        </div>
        <div className="d-flex col-md-4 mt-1" style={{ gap: "20px" }}>
          <div className="d-flex" style={{ gap: "10px" }}>
            <label className="form-label">Month</label>
            <select
              className="ip-select mt-1"
              onChange={(e) => handleMonth(e)}
              placeholder="MM"
            >
              <option value="">Select Month</option>
              {monthNumbers.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex" style={{ gap: "10px" }}>
            <label className="form-label">Year</label>
            <input
              onChange={(e) => handleYear(e)}
              onBlur={validateYear} // Validate year when input loses focus
              className="in-field mt-1"
              type="number"
              value={year}
            />
          </div>
        </div>
        <div className="col-md-2">
          <button
            className="button-style  group-button"
            // style={{ marginLeft: "-30px" }}
            onClick={handleButtonClick}
          >
            Load Data
          </button>

          <button
            className="button-style mt-2 group-button"
            type="button"
            style={{ float: "right" }}
            onClick={(e) => navigate("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div>

      {/* <div className="row">
        <div className="col-md-4">
          <label
            className="form-label mt-2 col-md-4"
            style={{ whiteSpace: "nowrap" }}
          >
            Unit Monthly Report for {wordMonth} {year}
          </label>
        </div>

        <div className="row col-md-6">
          <div className="col-md-7">
            <label
              className="form-label"
              style={{ whiteSpace: "nowrap", zIndex: "2" }}
            >
              Select List
            </label>

            <Typeahead
              className="custom-typeahead"
              id="basic-example"
              labelKey={(option) =>
                option && option.Cust_Name ? option.Cust_Name.toString() : ""
              }
              options={getMonthInvReportNames}
              placeholder="Select Customer"
              onChange={handleNames}
              selected={selectedOption}
              style={{ marginTop: "-7px" }}
            />
          </div>

          <div className="d-flex col-md-4" style={{ gap: "30px" }}>
            <div className="col-md-6" style={{ marginLeft: "-20px" }}>
              <label className="form-label" style={{ marginBottom: "10px" }}>
                Month
              </label>
              <select
                className="defdrop"
                onChange={(e) => handleMonth(e)}
                placeholder="MM"
              >
                <option value="">Select Month</option>
                {monthNumbers.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-7 ms-4">
              <label className="form-label">Year</label>
              <input
                onChange={(e) => handleYear(e)}
                className=""
                type="number"
                value={year}
                max={getCurrentYear()}
              />
            </div>
          </div>
        </div>

        <div className="col-md-2 d-flex mt-3">
          <div className="">
            <button
              className="button-style  group-button"
              onClick={handleButtonClick}
            >
              Load Data
            </button>
          </div>
          <div className="">
            <button
              className="button-style mt-2 group-button"
              type="button"
              onClick={(e) => navigate("/UnitAccounts")}
            >
              Close
            </button>
          </div>
        </div>
      </div> */}

      <div className="mt-1">
        <Tabs className="tab_font mb-1">
          <Tab eventKey="invoiceSummary" title="Invoice Summary">
            <InvoiceSummary getMonthInvReport={getMonthInvReport} />
          </Tab>
          <Tab eventKey="taxSummary" title="Tax Summary">
            <TaxSummary getMonthReport={getMonthReport} />
          </Tab>
          <Tab eventKey="clearanceSummary" title="Clearance Summary">
            <ClearanceSummary getClearanceSummary={getClearanceSummary} />
          </Tab>
          <Tab eventKey="collectionSummary" title="Collection Summary">
            <CollectionSummary getCollectionSummary={getCollectionSummary} />
          </Tab>
          <Tab eventKey="customerValueAddition" title="Customer Value Addition">
            <CustomerValueAddition getCustomerAddtion={getCustomerAddtion} />
          </Tab>
          <Tab eventKey="salesOutstandingBills" title="Sales Outstanding Bills">
            <SalesOutstandingBills getSalesOutStanding={getSalesOutStanding} />
          </Tab>
          <Tab eventKey="allOutstandingBills" title="All Outstanding Bills">
            <AllOutstandingBills getAllOutStanding={getAllOutStanding} />
          </Tab>
          <Tab eventKey="machineUtilisation" title="Machine Utilisation">
            <MachineUtilisation getMachineSummary={getMachineSummary} />
          </Tab>
          <Tab eventKey="MaterialSalesSummary" title="Material Sales Summary">
            <MaterialSalesSummary getMaterialSummary={getMaterialSummary} />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
