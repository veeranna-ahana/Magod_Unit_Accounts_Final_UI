import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../../../../api/baseUrl";

export default function TabPage1Table({ selectedDate }) {
  //const formattedDay = selectedDate ? selectedDate.toLocaleDateString('en-GB').split(' ')[0]:'';
  //console.log("dateeeee tab", formattedDay);
  const [tabPage1Data, setTabPage1Data] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get(
  //       baseURL + "/billingDetails/getTabPageData",
  //       {
  //         params: {
  //           date: selectedDate,
  //         },
  //       } // Pass selectedDate as a query parameter
  //     )
  //     .then((res) => {
  //       setTabPage1Data(res.data.Result);
  //       console.log("2 tab table", res.data.Result);
  //     });
  // }, [selectedDate]);


useEffect(() => {
  if (!selectedDate) return; // Ensure selectedDate is not empty before making the request

  const fetchTabPageData = async () => {
    try {
      const response = await axios.get(`${baseURL}/billingDetails/getTabPageData`, {
        params: { date: selectedDate },
      });

      
      setTabPage1Data(response.data.Result);
     
    } catch (error) {
      console.error("Error fetching tab page data:", error);
    }
  };

  fetchTabPageData();
}, [selectedDate]);


  const [selectRow, setSelectRow] = useState("");
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    //  setSelectRow(initial)

    setSelectRow(list);
    // setState(true);
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...tabPage1Data];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        if (sortConfig.key === "Amount") {
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
    <div>
      <div
        className=""
        style={{ height: "320px", overflowY: "scroll", overflowX: "scroll" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: "nowrap" }}>
              <th>Id</th>
              <th onClick={() => requestSort("Sync_HOId")}>Sync_HOId</th>
              {/* <th>Unit_Uid</th>
              <th>Selected</th> */}
              <th onClick={() => requestSort("UnitName")}>UnitName</th>
              <th onClick={() => requestSort("DC_Inv_No")}>DC_Inv_No</th>
              <th onClick={() => requestSort("ScheduleId")}>ScheduleId</th>
              <th onClick={() => requestSort("Formatted_DC_inv_Date")}>
                Dc_inv_Date
              </th>
              <th onClick={() => requestSort("DC_InvType")}>DC_Inv Type</th>
              <th onClick={() => requestSort("InvoiceFor")}>InvoiceFor</th>
            </tr>
          </thead>

          <tbody className="tablebody">
            
            {/* {sortedData().map((item, key) => {
              return (
                <>
                  <tr
                    onClick={() => selectedRowFun(item, key)}
                    className={
                      key === selectRow?.index ? "selcted-row-clr" : ""
                    }
                  >
                    <td>{key + 1}</td>
                    <td>{item.Sync_HOId}</td>
                    
                    <td>{item.UnitName}</td>
                    <td>{item.DC_Inv_No}</td>
                    <td>{item.ScheduleId}</td>
                    
                    <td>{new Date(item.Dc_inv_Date).toLocaleDateString("en-GB")}</td>
                    <td>{item.DC_InvType}</td>
                    <td>{item.InvoiceFor}</td>
                  </tr>
                </>
              );
            })} */}

{
  tabPage1Data.length > 0 ? (
    sortedData().map((item, key) => (
      <tr
        key={key} // 
        onClick={() => selectedRowFun(item, key)}
        className={key === selectRow?.index ? "selcted-row-clr" : ""}
      >
        <td>{key + 1}</td>
        <td>{item.Sync_HOId}</td>
        <td>{item.UnitName}</td>
        <td>{item.DC_Inv_No}</td>
        <td>{item.ScheduleId}</td>
        <td>{new Date(item.Dc_inv_Date).toLocaleDateString("en-GB")}</td>
        <td>{item.DC_InvType}</td>
        <td>{item.InvoiceFor}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" style={{ textAlign: "center" }}>NO data at this specific Date</td>
    </tr>
  )
}

          </tbody>
        </Table>
      </div>
    </div>
  );
}
