import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { baseURL } from "../../../../../api/baseUrl";

export default function Tabpage2Table({ selectedDate }) {
  const [tabPage2Data, setTabPage2Data] = useState([]);

  const [expandedGroup, setExpandedGroup] = useState(null);

  const handleRowClick = (index) => {
    // setExpandedGroup(index === expandedGroup ? null : index);
    if (expandedGroup === index) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(index);
    }
  };
  const tabData2 = async () => {
    const response = await axios.get(baseURL + "/billingDetails/getTab2Data", {
      params: {
        date: selectedDate,
      },
    });
    setTabPage2Data(response.data.Result);
    console.log("ressssss", response.data.Result);
  };

  //console.log(data, 'syncpage')

  const groupedData = tabPage2Data.reduce((groups, item) => {
    console.log("grops", item);
    const key = `${item.DC_InvType}`;

    if (!groups[key]) {
      groups[key] = {
        DC_InvType: item.DC_InvType,
        InvTypeCount: item.InvTypeCount,
        totalOnAccount: 0,
        items: [],
      };
    }

    groups[key].items.push(item);
    groups[key].totalOnAccount += parseFloat(item.Net_Total);

    return groups;
  }, {});

  // Convert the groupedData map into an array
  const groupedArray = Object.values(groupedData);

  useEffect(() => {
    tabData2();
    // tabData1();
  }, [selectedDate]);

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  const [selectRow, setSelectRow] = useState("");
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    //  setSelectRow(initial)

    setSelectRow(list);
    // setState(true);
  };

  //ascending and descinding
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedArray = React.useMemo(() => {
    const sortedData = [...groupedArray];
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedData;
  }, [groupedArray, sortConfig]);

  //ascending and descinding for expanded group
  const [expandedSortConfig, setExpandedSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const sortExpandedGroupItems = (items) => {
    if (!expandedSortConfig.key) return items;
    return [...items].sort((a, b) => {
      const aValue = a[expandedSortConfig.key];
      const bValue = b[expandedSortConfig.key];
      if (aValue < bValue) {
        return expandedSortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return expandedSortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };
  const handleExpandedSort = (key) => {
    let direction = "asc";
    if (
      expandedSortConfig.key === key &&
      expandedSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setExpandedSortConfig({ key, direction });
  };

  return (
    <div
      className=""
      style={{
        height: "320px",
        overflowY: "scroll",
        overflowX: "scroll",
        width: "500px",
      }}
    >
      <Table striped className="table-data border">
        <thead className="tableHeaderBGColor">
          <tr>
            <th></th>
            <th onClick={() => handleSort("DC_InvType")}>Invoice Type</th>
            <th
              onClick={() => handleSort("InvTypeCount")}
              style={{ textAlign: "center" }}
            >
              Count
            </th>
            <th
              onClick={() => handleSort("totalOnAccount")}
              style={{ textAlign: "right" }}
            >
              Total
            </th>
          </tr>
        </thead>

        <tbody className="tablebody">
          {sortedArray.map((group, index) => (
            <React.Fragment key={index}>
              <tr>
                <td
                  onClick={() => handleRowClick(index)}
                  style={{ cursor: "pointer" }}
                >
                  {expandedGroup === index ? "-" : "+"}
                </td>
                <td>{group.DC_InvType}</td>
                <td style={{ textAlign: "center" }}>{group.InvTypeCount}</td>
                <td style={{ textAlign: "right" }}>
                  {formatAmount(group.totalOnAccount)}
                </td>
              </tr>
              {expandedGroup === index && (
                <React.Fragment>
                  <tr style={{ backgroundColor: "AliceBlue" }}>
                    <th></th>
                    <th></th>
                    <th onClick={() => handleExpandedSort("Inv_No")}>
                      Invoice No
                      {expandedSortConfig.key === "Inv_No"
                        ? expandedSortConfig.direction === "asc"
                          ? ""
                          : ""
                        : ""}
                    </th>
                    <th
                      style={{ textAlign: "right" }}
                      onClick={() => handleExpandedSort("Net_Total")}
                    >
                      Invoice Total
                      {expandedSortConfig.key === "Net_Total"
                        ? expandedSortConfig.direction === "asc"
                          ? ""
                          : ""
                        : ""}
                    </th>
                  </tr>
                  {sortExpandedGroupItems(group.items).map((item, key) => (
                    <tr
                      onClick={() => selectedRowFun(item, key)}
                      className={
                        key === selectRow?.index ? "selcted-row-clr" : ""
                      }
                    >
                      <td></td>
                      <td></td>
                      <td>{item.Inv_No}</td>
                      <td style={{ textAlign: "right" }}>
                        {formatAmount(item.Net_Total)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
