import React, { useEffect, useState } from "react";
import Export from "./export/Export";
import Import from "./import/Import";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../../api/baseUrl";

export default function Sync() {
  const nav = useNavigate();
  const initialvalues = {
    open_inv: [],
    open_rec: [],
    ho_rec: [],
    tally_inv: [],
  };
  const [data, setData] = useState(initialvalues);
  const [openReceipts, setOpenReceipts] = useState([]);
  const [openInvoices, setOpenInvoices] = useState([]);

  async function fetchData() {
    try {
      // Use Promise.all to call both APIs simultaneously
      const [open_inv, open_rec] = await Promise.all([
        fetch(baseURL + "/setupSync/getdata").then((response) =>
          response.json()
        ),
        fetch(baseURL + "/setupSync/getreceiptdata").then((response) =>
          response.json()
        ),
      ]);

      // Set the responses in the state
      setData({
        ...data,
        open_inv: open_inv.Result,
        open_rec: open_rec.Result,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    // Call the API function when the component mounts
    fetchData();
  }, []); // Empty dependency array ensures it runs only once, equivalent to componentDidMount
  console.log(data, "syncpage");

  return (
    <div>
      <div className="row">
        <h4 className="title">Sync Accounts</h4>
      </div>

      <div className="row">
        <div className="col-md-10">
          <label className="form-label">Syncronise Account Details</label>
        </div>
        <div className="col-md-2">
          <button
            className="button-style  group-button"
            style={{ float: "right" }}
            onClick={(e) => nav("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-5">
          <Export data={data} />
        </div>
        <div className="col-md-7">
          <Import data={data} onDataReturn={fetchData} />
        </div>
      </div>
    </div>
  );
}
