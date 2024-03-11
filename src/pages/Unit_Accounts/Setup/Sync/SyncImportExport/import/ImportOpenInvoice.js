import React, {useState} from "react";
import { Table } from "react-bootstrap";

export default function ImportOpenInvoice({data}) {
  
  const [selectedItems, setSelectedItems] = useState([]);
  const handleCheckboxChange = (itemId) => {
    if (data && Array.isArray(data)) { // Check if data is not undefined and is an array
      if (selectedItems.includes(itemId)) {
        // Item is already selected, so remove it from selectedItems
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((DC_Inv_No) => DC_Inv_No !== itemId)
        );
      } else {
        // Item is not selected, so add it to selectedItems
        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemId]);
      }
    }
  };

  // Get the selected data based on selectedItems
  const selectedData = data? data.filter((item) => selectedItems.includes(item.DC_Inv_No)): '';
 // console.log(selectedData, 'selectedData')
  return (
    <div className="mt-4" style={{height:"400px",overflowY: "scroll",overflowX:"scroll"}}>
      <Table striped className="table-data border">
        <thead className="tableHeaderBGColor">
          <tr>
            <th>Select</th>
            <th>Type</th>
            <th>Customer</th>
            <th style={{whiteSpace:"nowrap"}}>Invoice No</th>
            <th>Date</th>
            <th style={{whiteSpace:"nowrap"}}>Invoice Value Unit</th>
            <th style={{whiteSpace:"nowrap"}}>Invoice Value HO</th>
            <th style={{whiteSpace:"nowrap"}}>Received Unit</th>
            <th style={{whiteSpace:"nowrap"}}>Received HO</th>
            <th>Unit_DC_Status</th>
            <th>HO_DC_Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody className="tablebody">
        {data ? data.map((rv) => (
            <tr key={rv.DC_Inv_No} style={rv.Remarks==='Closed or Missing in HO' ? { background : "green"} : {background : 'red'} } >
              <td>
                      <input
                        type='checkbox'
                        checked={selectedItems.includes(rv.DC_Inv_No)}
                        onChange={() => handleCheckboxChange(rv.DC_Inv_No)}
                      />
                    </td>
            <td>{rv.DC_InvType}</td>
            <td>{rv.Cust_Name}</td>
            <td>{rv.Inv_No}</td>
            <td>{rv.Inv_Date}</td>
            <td>{rv.Unit_GrandTotal}</td>
            <td>{rv.HO_GrandTotal}</td>
            <td>{rv.Unit_PymtAmtRecd }</td>
            <td>{rv.HO_PymtAmtRecd }</td>
            <td>{rv.Unit_DCStatus }</td>
            <td>{rv.HO_DCStatus }</td>
            <td>{rv.Remarks}</td>
          </tr>
          )): ''}
        </tbody>
      </Table>
    </div>
  );
}
