import axios from "axios";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

//import { ToastContainer, toast } from 'react-toastify';

import { toast } from "react-toastify";

// Import toastify css file
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../../api/baseUrl";

const initial = {
  TaxID: "",
  TaxName: "",
  Tax_Percent: "",
  TaxOn: "",
  EffectiveFrom: "",
  EffectiveTO: "",
  AcctHead: "",
  TallyAcctCreated: 0,
  UnderGroup: "",
  Service: 0,
  Sales: 0,
  JobWork: 0,
  IGST: 0,
};

export default function TaxMasterForm() {
  const navigate = useNavigate();

  const coolDownDuration = 6000; // 5 seconds (adjust as needed)
  const [lastToastTimestamp, setLastToastTimestamp] = useState(0);
  let test = 0;

  const [taxData, setTaxData] = useState([]);
  const [deleteID, setDeleteID] = useState(false);
  const [taxPostData, setTaxPostData] = useState(initial);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    axios
      .get(baseURL + "/taxMaster/getTaxData")
      .then((res) => {
        // console.log("unitdata",res.data);
        if (res.data.Status === "Success") {
          // console.log("dataaaa", res.data.Result);
          // console.log("result", res.data.Result);
          setTaxData(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const [state, setState] = useState(false);
  const [selectRow, setSelectRow] = useState(initial);
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    //  setSelectRow(initial)

    setSelectRow(list);
    setState(true);
  };

  console.log("selected in tax", selectRow);

  useEffect(() => {
    if (taxData.length > 0) {
      // setSelectRow(taxData[0]);
      selectedRowFun(taxData[0], 0);
    } else {
      setSelectRow(initial);
    }
  }, [taxData]);

  // const getTaxDetails=()=>{
  //     axios.get(baseURL + '/taxMaster/getTaxData')
  //             .then((res) => {
  //                 // console.log("unitdata",res.data);
  //                 if (res.data.Status === 'Success') {
  //                     // console.log("dataaaa", res.data.Result);
  //                     // console.log("result", res.data.Result);
  //                     setTaxData(res.data.Result)
  //                 }
  //             })
  //             .catch(err => console.log(err))
  // }

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...taxData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        if (sortConfig.key === "Tax_Percent") {
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

  return (
    <div className="row">
      <div className="col-md-6 col-sm-12">
        <div
          style={{ height: "300px", overflowY: "scroll", overflowX: "scroll" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th onClick={() => requestSort("TaxID")}>Id</th>
                <th onClick={() => requestSort("TaxName")}>TaxName</th>
                <th onClick={() => requestSort("TaxPrintName")}>PrintName</th>
                <th onClick={() => requestSort("Tax_Percent")}>Tax %</th>
                <th onClick={() => requestSort("TaxOn")}>Tax on</th>
                <th onClick={() => requestSort("EffectiveFrom")}>
                  Effective From
                </th>
                <th onClick={() => requestSort("EffectiveTO")}>Effective To</th>
                <th onClick={() => requestSort("AcctHead")}>Acct Head</th>
                <th>Service</th>
                <th>Sales</th>
                <th>Job Work</th>
                <th>IGST</th>
                <th>Tally</th>
              </tr>
            </thead>

            <tbody>
              {sortedData().map((item, key) => {
                const formattedEffectiveFrom = new Date(
                  item.EffectiveFrom
                ).toLocaleDateString("en-CA");
                const formattedEffectiveTO = new Date(
                  item.EffectiveTO
                ).toLocaleDateString("en-CA");

                item.EffectiveFrom = formattedEffectiveFrom;
                item.EffectiveTO = formattedEffectiveTO;

                const taxPercent = parseFloat(item.Tax_Percent);
                const formattedTaxPercent =
                  taxPercent % 1 !== 0
                    ? taxPercent.toFixed(2)
                    : taxPercent.toFixed(0);
                return (
                  <>
                    <tr
                      onClick={() => selectedRowFun(item, key)}
                      className={
                        key === selectRow?.index ? "selcted-row-clr" : ""
                      }
                    >
                      <td>{item.TaxID} </td>
                      <td>{item.TaxName} </td>
                      <td>{item.TaxPrintName} </td>

                      {/* <td>{Number(item.Tax_Percent).toFixed(2)}</td> */}
                      <td style={{ textAlign: "right" }}>
                        {formattedTaxPercent}
                      </td>

                      <td>{item.TaxOn}</td>
                      {/* <td>{item.EffectiveFrom}</td>
                                                            <td>{item.EffectiveTO}</td> */}
                      <td>{item.FormattedEffectiveFrom}</td>
                      <td>{item.FormattedEffectiveTO}</td>

                      <td>{item.AcctHead}</td>

                      <td>
                        <input type="checkbox" checked={item.Service === 1} />
                      </td>
                      <td>
                        <input type="checkbox" checked={item.Sales === 1} />
                      </td>
                      <td>
                        <input type="checkbox" checked={item.JobWork === 1} />
                      </td>
                      <td>
                        <input type="checkbox" checked={item.IGST === 1} />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={item.TallyAcctCreated === 1}
                        />
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="col-md-6 col-sm-12">
        <button
          className="button-style mt-2 group-button"
          type="button"
          style={{ float: "right" }}
          onClick={(e) => navigate("/UnitAccounts")}
        >
          Close
        </button>

        <form
          className="form mt-5"
          style={{ height: "400px", marginLeft: "-30px" }}
        >
          <div className="row">
            <div className="d-flex col-md-6" style={{ gap: "35px" }}>
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Tax Name
              </label>
              <input
                className="in-field mt-1"
                value={selectRow.TaxName}
                disabled
                name="TaxName"
              />
            </div>

            <div className="d-flex col-md-6" style={{ gap: "15px" }}>
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Print Name
              </label>
              <input
                className="in-field mt-1"
                name="TaxPrintName"
                value={selectRow.TaxPrintName}
                disabled
              />
            </div>
          </div>

          <div className="row">
            <div className="d-flex col-md-6 mt-1" style={{ gap: "57px" }}>
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Tax %
              </label>
              <input
                className="in-field mt-1"
                value={
                  parseFloat(selectRow.Tax_Percent) % 1 !== 0
                    ? parseFloat(selectRow.Tax_Percent).toFixed(2)
                    : parseFloat(selectRow.Tax_Percent).toFixed(0)
                }
                disabled
                name="Tax_Percent"
              />
            </div>

            <div className="d-flex col-md-6 mt-1" style={{ gap: "44px" }}>
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Tax on
              </label>
              <input
                className="in-field"
                name="TaxOn"
                value={selectRow.TaxOn}
                disabled
              />
            </div>
          </div>

          <div className="row">
            <div className="d-flex col-md-6 mt-1" style={{ gap: "10px" }}>
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Effective From
              </label>
              <input
                className="in-field"
                name="EffectiveFrom"
                type="date"
                value={selectRow.EffectiveFrom}
                disabled
              />
            </div>

            <div className="d-flex col-md-6 mt-1" style={{ gap: "15px" }}>
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Effective To
              </label>
              <input
                className="in-field"
                value={selectRow.EffectiveTO}
                name="EffectiveTO"
                type="date"
                disabled
              />
            </div>
          </div>

          <div className="row">
            <div className="d-flex col-md-6" style={{ gap: "17px" }}>
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                LedgerName
              </label>
              <input
                className="in-field mt-1"
                name="AcctHead"
                value={selectRow.AcctHead}
                disabled
              />
            </div>

            <div className="d-flex col-md-6" style={{ gap: "10px" }}>
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                UnderGroup
              </label>
              <input
                className="in-field mt-1"
                name="UnderGroup"
                value={selectRow.UnderGroup}
                disabled
              />
            </div>
          </div>

          <div className="row">
            <div className="row col-md-6 ">
              <input
                className="mt-3 col-md-3  custom-checkbox "
                type="checkbox"
                checked={selectRow.Service === 1 ? true : false}
                name="Service"
                id="flexCheckDefault"
              />

              <div className="col-md-2">
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Service
                </label>
              </div>
            </div>

            <div className="row col-md-6">
              <input
                className="mt-3 col-md-3  custom-checkbox"
                type="checkbox"
                checked={selectRow.Sales === 1 ? true : false}
                name="Sales"
                id="flexCheckDefault"
              />

              <div className=" col-md-2">
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Sales
                </label>
              </div>
            </div>

            <div className="row col-md-6">
              <input
                className="mt-3 col-md-3  custom-checkbox"
                type="checkbox"
                checked={selectRow.JobWork === 1 ? true : false}
                name="JobWork"
                id="flexCheckDefault"
              />

              <div className=" col-md-5">
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Job Work
                </label>
              </div>
            </div>

            <div className="row col-md-6">
              <input
                className="mt-3 col-md-3  custom-checkbox"
                type="checkbox"
                checked={selectRow.IGST === 1 ? true : false}
                name="IGST"
                id="flexCheckDefault"
              />

              <div className=" col-md-5">
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Inter State
                </label>
              </div>
            </div>

            <div className="row col-md-6">
              <input
                className="mt-3 col-md-3  custom-checkbox"
                type="checkbox"
                checked={selectRow.TallyAcctCreated === 1 ? true : false}
                name="TallyAcctCreated"
                id="flexCheckDefault"
              />

              <div className=" col-md-5">
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Tally Updated
                </label>
              </div>
            </div>

            <div></div>
          </div>
        </form>
      </div>
    </div>
  );
}
