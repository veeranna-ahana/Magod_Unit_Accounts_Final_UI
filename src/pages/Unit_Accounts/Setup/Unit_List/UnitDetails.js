import React, { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
// import UnitDetailsForm from "./UnitDetailsForm";
import { useNavigate } from "react-router-dom";

import axios from "axios";

// Import toastify css file
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../../api/baseUrl";

// import { Axios } from "axios";

const initial = {
  UnitID: "",
  UnitName: "",
  Unit_Address: "",
  Place: "",
  PIN: "",
  Country: "",
  State: "",
  Unit_contactDetails: "",
  Unit_GSTNo: "",
  Tally_account_Name: "",
  Cash_in_Hand: "",
  Mail_Id: "",
  UnitIntial: "",
  Current: 0,
};

const initial_state = { State: "" };
export default function UnitDetails() {
  const coolDownDuration = 6000; // 2 seconds (adjust as needed)
  const [lastToastTimestamp, setLastToastTimestamp] = useState(0);
  let test = 0;

  const [threadModal, setThreadModal] = useState(false);
  const [saveChangeModal, setSaveChangesModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [getUnit, setGetUnit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const navigate = useNavigate();

  //  const [postState, setPostState] = useState(initial_state);

  useEffect(() => {
    // async function fetchData() {

    //   await UnitGetDta();
    // }
    // fetchData()
    // getStateList();
    UnitGetDta();
  }, []);

  const [stateList, setStateList] = useState([]);
  const getStateList = () => {
    axios.get(baseURL + "/unitlist/getStates").then((res) => {
      // console.log(res.data.Result);
      setStateList(res.data.Result);
    });
  };

  const [postData, setPostData] = useState(initial);

  const UnitGetDta = async () => {
    try {
      const response = await axios.get(baseURL + "/unitlist/getUnitData");
      if (response.data.Status === "Success") {
        // console.log("dataaaa", response.data.Result);
        setGetUnit(response.data.Result);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   UnitGetDta();
  //   getStateList();

  // }, [])

  const formRef = useRef(null);

  useEffect(() => {
    if (getUnit.length > 0) {
      //setSelectRow(getUnit[0]);
      selectedRowFun(getUnit[0], 0);
    } else {
      setSelectRow(initial);
    }
  }, [getUnit]);

  const [selectRow, setSelectRow] = useState(initial);

  const [state, setState] = useState(true);
  const selectedRowFun = (item, index) => {
    setSelectRow({});

    let list = { ...item, index: index };

    // setSelectRow(initial)
    setSelectRow(list);
    // setSelectRow({ ...initial, ...list, State: postState.State });    //setPostData(initial)
    setState(true);
  };
  console.log("selct row", selectRow.Unit_Address);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...getUnit];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // if (sortConfig.key === "Amount") {
        //   valueA = parseFloat(valueA);
        //   valueB = parseFloat(valueB);
        // }

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
    <>
      <div className="row">
        <h4 className="title">Unit Details</h4>
      </div>

      <div className="row mt-1">
        <div
          className="col-md-4"
          style={{
            height: "430px",
            maxWidth: "32%",

            overflowY: "scroll",
          }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th onClick={() => requestSort("UnitID")}>Unit Id</th>
                <th onClick={() => requestSort("UnitName")}>Unit Name</th>
                {/* <th>Unit_Address</th>
                  <th>Place</th>
                  <th>State</th>
                  <th>Country</th> */}
              </tr>
            </thead>
            <tbody className="tablebody">
              {sortedData().map((item, key) => {
                return (
                  <>
                    <tr
                      onClick={() => selectedRowFun(item, key)}
                      style={{ whiteSpace: "nowrap" }}
                      className={
                        key === selectRow?.index ? "selcted-row-clr" : ""
                      }
                    >
                      <td>{item.UnitID} </td>
                      <td>{item.UnitName} </td>
                      {/* <td>{item.Unit_Address}</td>
                          <td>{item.Place}</td>
                          <td>{item.State}</td>
                          <td>{item.Country}</td> */}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </Table>
        </div>

        <div className="row col-md-8">
          <div className="col-md-6">
            <div className="d-flex " style={{ gap: "30px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Unit Id<span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div className="col-md-8">
                <input
                  class="in-field mt-2"
                  type="text"
                  name="UnitID"
                  id="UnitID"
                  required
                  value={selectRow?.UnitID}
                  disabled
                />
              </div>
            </div>

            <div className="d-flex mt-1" style={{ gap: "10px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Unit Name<span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div className="col-md-8">
                <input
                  class="in-field mt-2"
                  type="text"
                  placeholder=" "
                  name="UnitName"
                  id="UnitName"
                  disabled
                  value={selectRow?.UnitName}
                />
              </div>
            </div>

            <div className="d-flex mt-1" style={{ gap: "35px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Mail Id
                </label>
              </div>
              <div className="col-md-8">
                <input
                  class="in-field mt-2"
                  type="email"
                  placeholder=" "
                  name="Mail_Id"
                  disabled
                  value={selectRow.Mail_Id}
                />
              </div>
            </div>

            <div className="d-flex mt-1" style={{ gap: "45px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Place
                </label>
              </div>
              <div className="col-md-8">
                <input
                  class="in-field mt-2"
                  type="text"
                  placeholder=" "
                  name="Place"
                  disabled
                  value={selectRow.Place || postData.Place}
                />
              </div>
            </div>

            <div className="d-flex mt-1" style={{ gap: "54px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  PIN
                </label>
              </div>
              <div className="col-md-8">
                <input
                  class="in-field mt-2"
                  type="text"
                  placeholder=" "
                  name="PIN"
                  disabled
                  maxLength={6}
                  value={selectRow.PIN || postData.PIN}
                />
              </div>
            </div>

            <div className="d-flex mt-1" style={{ gap: "5px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Unit Address
                </label>
              </div>
              <div className="col-md-8">
                <textarea
                  className="in-field"
                  name="Unit_Address"
                  rows="2"
                  style={{ height: "80px", resize: "none", width: "209px" }}
                  disabled
                  value={
                    selectRow.Unit_Address === null
                      ? ""
                      : selectRow.Unit_Address
                  }
                ></textarea>
              </div>
            </div>

            <div className="d-flex mt-1" style={{ gap: "30px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Country
                </label>
              </div>
              <div className="col-md-8">
                <input
                  class="in-field mt-2"
                  type="text"
                  placeholder=" "
                  name="Country"
                  disabled
                  value={selectRow.Country}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <button
              className="button-style  group-button"
              onClick={(e) => navigate("/UnitAccounts")}
              style={{ float: "right" }}
            >
              Close
            </button>

            <div className="d-flex mt-5" style={{ gap: "75px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  GST No
                </label>
              </div>
              <div className="col-md-8">
                <input
                  class="in-field mt-2"
                  type="text"
                  placeholder=" "
                  name="Unit_GSTNo"
                  maxLength={15}
                  disabled
                  value={selectRow.Unit_GSTNo}
                />
              </div>
            </div>

            <div className="d-flex mt-1" style={{ gap: "5px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Tally Account Name
                </label>
              </div>
              <div className="col-md-8">
                <input
                  class="in-field mt-2"
                  type="text"
                  placeholder=" "
                  name="Tally_account_Name"
                  disabled
                  value={selectRow.Tally_account_Name}
                />
              </div>
            </div>

            <div className="d-flex mt-1" style={{ gap: "55px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Unit Initials
                </label>
              </div>
              <div className="col-md-8">
                <input
                  class="in-field mt-2"
                  type="text"
                  placeholder=" "
                  name="UnitIntial"
                  disabled
                  value={selectRow.UnitIntial}
                />
              </div>
            </div>

            <div className="d-flex mt-1" style={{ gap: "90px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  State
                </label>
              </div>
              <div className="col-md-8">
                <input
                  class="in-field mt-2"
                  type="text"
                  placeholder=" "
                  name="State"
                  disabled
                  value={selectRow.State}
                />
              </div>
            </div>

            <div className="d-flex mt-1" style={{ gap: "100px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Current
                </label>
              </div>
              <div>
                <input
                  className="mt-3 custom-checkbox"
                  type="checkbox"
                  name="Current"
                  id="flexCheckDefault"
                  checked={
                    selectRow.Current === 1
                      ? true
                      : false || postData.Current === 1
                      ? true
                      : false
                  }
                />
              </div>
            </div>

            <div className="d-flex mt-1" style={{ gap: "15px" }}>
              <div>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Contact details
                </label>
              </div>
              <div className="col-md-8">
                <textarea
                  className="in-field"
                  rows="2"
                  id=""
                  name="Unit_contactDetails"
                  value={selectRow.Unit_contactDetails}
                  disabled
                  style={{
                    height: "80px",
                    resize: "none",
                    marginLeft: "20px",
                    width: "209px",
                  }}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
