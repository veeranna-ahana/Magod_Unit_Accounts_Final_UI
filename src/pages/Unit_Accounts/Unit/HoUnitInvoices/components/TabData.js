import { Tab } from "bootstrap";
import React, { useEffect } from "react";
import { useState } from "react";
import { Tabs } from "react-bootstrap";
import UnitOutStanding from "../Tables/UnitOutStanding";
import CustomerOutStanding from "../Tables/CustomerOutStanding";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import PreviewReportPdf from "../../../../../PDF/PreviewReportPdf";
import { Typeahead } from "react-bootstrap-typeahead";
import { baseURL } from "../../../../../api/baseUrl";
import ModalPDF from "../Tables/ModalPDF";
import { toast } from "react-toastify";

export default function TabData() {
  let [selected, setSelected] = useState("");
  const contentRef = React.useRef();
  // const [selectedOption, setSelectedOption] = useState([{ Cust_name: 'MAGOD LASER MACHINING PVT LTD' }]);
  const [selectedOption, setSelectedOption] = useState([{}]);

  // Create a reference for the ReactToPrint component

  const printRef = React.useRef();

  const handlePrintButtonClick = () => {
    printRef.current.handlePrint();
  };

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [key, setKey] = useState("customer_O");
  const [customersData, setCustomersData] = useState([]);
  const [selectedCustCode, setSelectedCustCode] = useState("");
  const [selectedDCType, setSelectedDCType] = useState("");
  const [flag, setFlag] = useState("");

  const [selectedUnitName, setSelectedUnitName] = useState("");
  const [selectUnit, setSelectUnit] = useState([]);

  const [unitData, setunitData] = useState([]);
  const [unit, setUnit] = useState([]);

  useEffect(() => {
    getCustomerData();
    getDistinctDCtypes();
  }, [selectedCustCode, selectedDCType, flag]);

  console.log("11111111111111");

  const handleUnitSelect = (selected) => {
    console.log("selectexdddddddd", selected);
    const selectedCustomer = selected[0];

    setSelectUnit(selected);
    setUnit(selected[0].UnitName);

    setSelectedUnitName(selected);
  };

  console.log(
    "selected unit name in customer outstandibg",
    selectedUnitName[0]?.UnitName
  );

  const handleUnitName = () => {
    axios
      .get(baseURL + `/customerOutstanding/unitNames`)
      .then((res) => {
        console.log("firstTable", res.data);
        setunitData(res.data.Result);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  useEffect(() => {
    handleUnitName();
  }, []);

  const getCustomerData = () => {
    axios
      .get(baseURL + "/customerOutstanding/getCustomers")
      .then((res) => {
        console.log("get customers", res.data.Result);
        setCustomersData(res.data.Result);
      })
      .catch((err) => {});
  };

  const [distictDCType, setDistinctDCType] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const getDistinctDCtypes = () => {
    axios
      .get(baseURL + "/customerOutstanding/getDCTypes", {
        params: {
          selectedCustCode: selectedCustCode,
        },
      })
      .then((res) => {
        //  setDistinctDCType(res.data.Result)
        const currentDistinctDCType = res.data.Result;
        const extraDCType = "ALL";
        const updatedDistinctDCType = [
          ...currentDistinctDCType,
          { DC_InvType: extraDCType },
        ];

        // Set the state with the updated array
        setDistinctDCType(updatedDistinctDCType);
        console.log("dcccccc", distictDCType);
      });
  };

  const handleTypeaheadChange = (selectedOptions) => {
    if (selectedOptions && selectedOptions.length > 0) {
      const selectedCustomer = selectedOptions[0];
      const custName = selectedCustomer.Cust_name;

      // Set the selected customer in state
      setSelectedOption([selectedCustomer]); // Ensure it's an array

      // Set the selected Cust_Code in state
      setSelectedCustCode(selectedCustomer.Cust_Code);
    } else {
      // Handle the case where nothing is selected (optional)
      setSelectedOption([]); // Clear the selected customer in state
      setSelectedCustCode(""); // Clear the selected Cust_Code in state
    }
  };

  const handleRadioChange = (event) => {
    console.log("dc typee", selectedDCType);
    const value = event.target.value;
    if (selectedDCType === "ALL") {
      setFlag({});
    } else {
      setFlag(value);
    }
  };
  console.log("set flag", flag);
  const handleSelectChange = (e) => {
    const value = e.target.value;

    setSelectedDCType(value);
  };

  const [pdfOpen, setPdfOpen] = useState(false);

  console.log("nnnnnnnnnnnnnnn", selectedCustCode);

  const pdfSubmit = () => {
    setPdfOpen(true);
  };
  console.log("selected ", selectedDCType);

  const poSumMap = {};

  // Iterate through the original data
  Object.entries(filterData).forEach(([poNo, balance]) => {
    // Check if the PO_NO already exists in the map
    if (poSumMap[poNo]) {
      poSumMap[poNo] += balance; // Add the balance to the existing sum
    } else {
      poSumMap[poNo] = balance; // Initialize the sum for the PO_NO
    }
  });

  // Get distinct PO_NO values
  const distinctPO_NOs = Object.keys(poSumMap);

  const [unitAddress, setUnitAddress] = useState([]);
  const fetchUnitAddress = () => {
    axios
      .post(baseURL + "/customerOutstanding/getAddress", {
        unit,
      })
      .then((res) => {
        setUnitAddress(res.data.Result);
      })
      .catch((err) => {
        console.log("errin pdf address", err);
      });
  };

  return (
    <>
      {pdfOpen && (
        <ModalPDF
          pdfOpen={pdfOpen}
          setPdfOpen={setPdfOpen}
          selectedCustCode={selectedCustCode}
          setFlag={setFlag}
          flag={flag}
          setSelectedDCType={setSelectedDCType}
          selectedDCType={selectedDCType}
          setFilterData={setFilterData}
          filterData={filterData}
        />
      )}

      <div className="row">
        <h4 className="title">Unit Invoices List</h4>
      </div>

      <div className="row">
        <div className="d-flex col-md-4" style={{ gap: "10px" }}>
          <label className="form-label mt-2" style={{ whiteSpace: "nowrap" }}>
            Select Customer
          </label>
          <Typeahead
            id="basic-example "
            className="ip-select mt-1"
            labelKey={(option) =>
              option && option.Cust_name ? option.Cust_name.toString() : ""
            }
            valueKey="Cust_Code"
            options={customersData}
            placeholder="Select Customer"
            onChange={handleTypeaheadChange}
            selected={selectedOption}
          />
        </div>

        {/* <div className="col-md-4 ">
          <div className="d-flex ">
            <div className="col-md-3">
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Select Unit
              </label>
            </div>
            <div className="col-md-8 ">
              <Typeahead
                // className="ip-select col-md-5"
                className="input-disabled  "
                id="ip-select"
                labelKey={(option) =>
                  option && option.UnitName ? option.UnitName.toString() : ""
                }
                options={unitData}
                placeholder="Select Unit"
                onChange={handleUnitSelect}
                selected={selectedUnitName}
                //   selected={selectedUnitName ? [selectedUnitName] : []}
              />
            </div>
          </div>
        </div> */}
        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Search Inv No
          </label>
          <input
            className="in-field mt-2"
            type="search"
            placeholder="Search Invoice Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          ></input>
        </div>
        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label mt-2" style={{ whiteSpace: "nowrap" }}>
            DC Inv Type
          </label>
          <select
            className="ip-select mt-2"
            value={selectedDCType}
            onChange={handleSelectChange}
          >
            <option value="">Select inv Type</option>
            <option value="Sales & Jobwork">Sales & Jobwork</option>
            {distictDCType.map((i) => (
              <option key={i.DC_InvType} value={i.DC_InvType}>
                {i.DC_InvType}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <button
            className="button-style mt-2 group-button"
            type="button"
            style={{ float: "right" }}
            onClick={(e) => navigate("/UnitAccounts")}
          >
            Close
          </button>

          <button
            className="button-style mt-2 group-button"
            onClick={pdfSubmit}
            style={{ float: "right" }}
          >
            Print
          </button>
        </div>
      </div>

      <div className="row">
        {/* <div className="d-flex col-md-4" style={{ gap: "15px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Select Customer
          </label>
          <Typeahead
            id="basic-example"
            className="ip-select"
            labelKey={(option) =>
              option && option.Cust_name ? option.Cust_name.toString() : ""
            }
            valueKey="Cust_Code"
            options={customersData}
            placeholder="Select Customer"
            onChange={handleTypeaheadChange}
            selected={selectedOption}
          />
        </div> */}
        <div className="d-flex col-md-6" style={{ gap: "30px" }}>
          <div className="mt-1 p-1">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="Profile"
                name="flexRadioDefaultA1"
                value="Profile"
                onChange={handleRadioChange}
                disabled={selectedDCType == "ALL"}
                checked={selectedDCType === "ALL" ? false : flag === "Profile"}
              />
              <label
                className="form-check-label checkBoxStyle"
                htmlFor="flexCheckDefault"
              >
                <b>Profile</b>
              </label>
            </div>
          </div>

          <div className="mt-1  p-1">
            <div className="form-check ">
              <input
                className="form-check-input"
                type="radio"
                id="flexRadioDefaultA4"
                name="flexRadioDefaultA1"
                value="Fabrication"
                onChange={handleRadioChange}
                disabled={selectedDCType == "ALL"}
                checked={
                  selectedDCType === "ALL" ? false : flag === "Fabrication"
                }
              />
              <label
                className="form-check-label checkBoxStyle"
                htmlFor="flexCheckDefault"
              >
                <b> Fabrication</b>
              </label>
            </div>
          </div>

          <div className="mt-1 p-1">
            <div className="form-check ">
              <input
                className="form-check-input"
                type="radio"
                id="flexRadioDefaultA5"
                name="flexRadioDefaultA1"
                value="Service"
                onChange={handleRadioChange}
                disabled={selectedDCType == "ALL"}
                checked={selectedDCType === "ALL" ? false : flag === "Service"}
              />
              <label
                className="form-check-label checkBoxStyle"
                htmlFor="flexCheckDefault"
              >
                <b>Service</b>
              </label>
            </div>
          </div>

          <div className="mt-1 p-1">
            <div className="form-check ">
              <input
                className="form-check-input"
                type="radio"
                id="flexRadioDefaultA5"
                name="flexRadioDefaultA1"
                value="Misc"
                onChange={handleRadioChange}
                disabled={selectedDCType == "ALL"}
                checked={selectedDCType === "ALL" ? false : flag === "Misc"}
              />
              <label
                className="form-check-label checkBoxStyle"
                htmlFor="flexCheckDefault"
              >
                <b>Misc</b>
              </label>
            </div>
          </div>

          <div className="mt-1 p-1">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="flexRadioDefaultA5"
                name="flexRadioDefaultA1"
                value="Scrap"
                onChange={handleRadioChange}
                disabled={selectedDCType == "ALL"}
                checked={selectedDCType === "ALL" ? false : flag === "Scrap"}
              />
              <label
                className="form-check-label checkBoxStyle"
                htmlFor="flexCheckDefault"
              >
                <b>Scrap</b>
              </label>
            </div>
          </div>
        </div>
        <div className="col-md-6"></div>
      </div>

      <div className="mt-1">
        <Tabs
          id="controlled-tab-example "
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="tab_font"
        >
          <Tab eventKey="unit_O" title="Unit Outstanding">
            <UnitOutStanding selectedUnitName={selectedUnitName[0]?.UnitName} />
          </Tab>

          <Tab eventKey="customer_O" title="Customer Outstanding">
            <CustomerOutStanding
              selectedCustCode={selectedCustCode}
              searchQuery={searchQuery}
              setFlag={setFlag}
              flag={flag}
              setSelectedDCType={setSelectedDCType}
              selectedDCType={selectedDCType}
              setFilterData={setFilterData}
              filterData={filterData}
            />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
