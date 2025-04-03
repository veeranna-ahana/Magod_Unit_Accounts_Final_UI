import React, { useState } from "react";

import TabsTwo from "./TabsTwo";

import { useNavigate } from "react-router-dom";

export default function Billing_Address() {
  const [selectedDate, setSelectedDate] = useState("2017-08-09");
  const customDateFormat = "MM-dd-yy";

  const handleChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="row">
        <h4 className="title">Invoices Information</h4>
      </div>

      <div className="row mb-2">
        <div className="d-flex col-md-3 col-sm-6 mt-3" style={{ gap: "10px" }}>
          <label className="form-label  mt-1" style={{ whiteSpace: "nowrap" }}>
            Select Date
          </label>
          <input
            className="in-field mt-1"
            type="date"
            name="date"
            onChange={handleChange}
            value={selectedDate}
          />
        </div>
        <div className="col-md-5"></div>
        <div className="col-md-4">
          <button
            className="button-style mt-4 group-button"
            type="button"
            style={{ marginLeft: "290px" }}
            onClick={(e) => navigate("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div>

     

      <TabsTwo selectedDate={selectedDate} />
    </>
  );
}
