import React from "react";
import { Table } from "react-bootstrap";

export default function ImportOpenReceipt({data}) {
  
  return (
    <div className="mt-4" style={{height:"400px",overflowY: "scroll",overflowX:"scroll"}}>
      <Table striped className="table-data border">
        <thead className="tableHeaderBGColor">
          <tr>
            <th style={{whiteSpace:"nowrap"}}>RV No</th>
            <th>Recd_PV</th>
            <th>Customer</th>
            <th>Type</th>
            <th>HO_Amount</th>
            <th>Unit_Amount</th>
            <th>HO_On_account</th>
            <th>Unit_On_account</th>
            <th>HO_Receipt_Status</th>
            <th>Unit_Receipt_Status</th>
            <th>Unit_UId</th>
          </tr>
        </thead>
        <tbody className="tablebody">
        {data ? data.map((rv) => (
             <tr key={rv.RecdPVID}>
             <td>{rv.Recd_PVNo}</td>
             <td>{rv.Recd_PV_Date}</td>
             <td>{rv.CustName}</td>
             <td>{rv.TxnType}</td>
             <td>{rv.HO_Amount}</td>
             <td>{rv.Unit_Amount}</td>
             <td>{rv.HO_On_account}</td>
             <td>{rv.Unit_On_account}</td>
             <td>{rv.HO_ReceiptStatus}</td>
             <td>{rv.Unit_ReceiptStatus}</td>
             <td>{rv.Unit_UId}</td>
           </tr>
          )): ''}
        </tbody>
      </Table>
    </div>
  );
}
