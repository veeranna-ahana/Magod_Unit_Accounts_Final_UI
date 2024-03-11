import React from "react";
import { Table } from "react-bootstrap";

export default function ImportHoReceiptVoucher({data}) {
  return (
    <div className="mt-4" style={{height:"400px",overflowY: "scroll",overflowX:"scroll"}}>
      <Table striped className="table-data border">
        <thead className="tableHeaderBGColor">
          <tr>
            <th>Type</th>
            <th style={{whiteSpace:"nowrap"}}>HO RV No</th>
            <th>Date</th>
            <th>Amount</th>
            <th>On_Account</th>
            <th style={{whiteSpace:"nowrap"}}>Customer Name</th>
          </tr>
        </thead>
        <tbody className="tablebody">
        {data ? data.map((rv) => (
            <tr key={rv.RecdPVID}>
            <td>{rv.TxnType}</td>
            <td>{rv.HOPrvId}</td>
            <td>{rv.Recd_PV_Date}</td>
            <td>{rv.Amount}</td>
            <td>{rv.On_account}</td>
            <td>{rv.CustName}</td>
          </tr>
          )): ''}
        </tbody>
      </Table>
    </div>
  );
}
