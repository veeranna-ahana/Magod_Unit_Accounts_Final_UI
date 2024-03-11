import React from 'react'
import { Table } from 'react-bootstrap'

export default function OpenInvoice({data}) {
  //console.log(data)
  return (
    <div  className='mt-4' style={{height:"400px",overflowY: "scroll",overflowX:"scroll"}}>
    <Table striped className="table-data border">
      <thead className="tableHeaderBGColor">
        <tr>
          <th style={{whiteSpace:"nowrap"}}>Invoice No</th>
          <th>Date</th>
          <th>Type</th>
          <th style={{whiteSpace:"nowrap"}}>Grand Total</th>
          <th>Balance</th>
          <th>Customer</th>
        </tr>
      </thead>
    <tbody className='tablebody'>
    {data ? data.map((item) => (
            <tr key={item.DC_Inv_No}>
              <td>{item.Inv_No}</td>
              <td>{item.Inv_Date}</td>
              <td>{item.DC_InvType}</td>
              <td>{item.GrandTotal}</td>
              <td>{item.Cust_Name}</td>
              <td>{item.Cust_Name}</td>
            </tr>
          )): ''}
    </tbody>
    
</Table>
    </div>
  )
}
