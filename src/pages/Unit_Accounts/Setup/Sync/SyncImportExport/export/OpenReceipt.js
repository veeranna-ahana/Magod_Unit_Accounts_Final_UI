import React, {useEffect, useState} from 'react'
import { Table } from 'react-bootstrap'
import axios from "axios";

export default function OpenReceipt({data}) {

  const [selectedItems, setSelectedItems] = useState([]);
  const handleCheckboxChange = (itemId) => {
    if (data && Array.isArray(data)) { // Check if data is not undefined and is an array
      if (selectedItems.includes(itemId)) {
        // Item is already selected, so remove it from selectedItems
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((RecdPVID) => RecdPVID !== itemId)
        );
      } else {
        // Item is not selected, so add it to selectedItems
        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemId]);
      }
    }
  };

  // Get the selected data based on selectedItems
  const selectedData = data? data.filter((item) => selectedItems.includes(item.RecdPVID)): '';
  //console.log(selectedData, 'selectedData')
  return (
    <div  className='mt-4' style={{height:"400px",overflowY: "scroll",overflowX:"scroll"}}>
    <Table striped className="table-data border">
      <thead className="tableHeaderBGColor">
        <tr>
          <th>Type</th>
          <th style={{whiteSpace:"nowrap"}}>RV No</th>
          <th>Recd_PV</th>
          <th>Amount</th>
          <th style={{whiteSpace:"nowrap"}}>On Account</th>
          <th>Customer</th>
          <th>Id</th>
          <th style={{whiteSpace:"nowrap"}}>Unit Name</th>
          <th style={{whiteSpace:"nowrap"}}>Recd PVID</th>
          <th>Sync_HOId</th>
          <th>Unit_UId</th>
          <th>Recd_PVNo</th>
          <th>Recd_PV_Date</th>
          <th style={{whiteSpace:"nowrap"}}>Receipt Status</th>
          <th>Cust_code</th>
          <th style={{whiteSpace:"nowrap"}}>Cust Name</th>
          <th>Amount</th>
          <th>Adjusted</th>
          <th style={{whiteSpace:"nowrap"}}>Document No</th>
          <th>Description</th>
          <th style={{whiteSpace:"nowrap"}}>HO Ref</th>
          <th style={{whiteSpace:"nowrap"}}>HO PrvId</th>
          <th>Tally_UId</th>
          <th>Updated</th>
          <th>On_account</th>
          <th style={{whiteSpace:"nowrap"}}>Txn Type</th>
        </tr>
      </thead>
    <tbody className='tablebody'>
    {data ? data.map((item) => (
            <tr key={item.RecdPVID}>
              {/* Render table cells with corresponding data */}
              <td>{item.TxnType}</td>
              <td>{item.Recd_PV_Date}</td>
              <td>{item.Recd_PV_Date}</td>
              <td>{item.Amount}</td>
              <td>{item.On_account}</td>
              <td>{item.CustName}</td>
              <td>{item.Id}</td>
              <td>{item.UnitName}</td>
              <td>{item.RecdPVID}</td>
              <td>{item.Sync_HOId}</td>
              <td>{item.Unit_UId}</td>
              <td>{item.Recd_PVNo}</td>
              <td>{item.Recd_PV_Date}</td>
              <td>{item.ReceiptStatus}</td>
              <td>{item.Cust_code}</td>
              <td>{item.CustName}</td>
              <td>{item.Amount}</td>
              <td></td>
              <td>{item.DocuNo}</td>
              <td>{item.Description}</td>
              <td>{item.HORef}</td>
              <td>{item.HOPrvId}</td>
              <td>{item.TallyUpdate}</td>
              <td>
                      <input
                        type='checkbox'
                        checked={selectedItems.includes(item.RecdPVID)}
                        onChange={() => handleCheckboxChange(item.RecdPVID)}
                      />
                    </td>
              <td>{item.On_account}</td>
              <td>{item.TxnType}</td>
              {/* Add the remaining cells based on your data structure */}
            </tr>
          )): ''}
    </tbody>
    
</Table>
    </div>
  )
}
