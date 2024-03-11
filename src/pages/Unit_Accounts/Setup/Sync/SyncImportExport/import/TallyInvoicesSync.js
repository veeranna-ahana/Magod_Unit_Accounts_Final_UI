import React from "react";
import { Table } from "react-bootstrap";

export default function TallyInvoicesSync({data}) {
  return (
    <div>
      <div className="row">
        <div
          className="col-md-4"
       
        >
          <button
            className="button-style  group-button"
            style={{ width: "120px" }}
          >
            Close Invoices
          </button>
        </div>
        <div
          className="col-md-4"
         
        >
          <button
            className="button-style  group-button"
            style={{ width: "120px" }}
          >
            Open Invoices
          </button>
        </div>
      </div>

      <div className="mt-4" style={{height:"350px",overflowY: "scroll",overflowX:"scroll"}}>
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr>
              <th>Select</th>
              <th style={{whiteSpace:"nowrap"}}>Invoice No</th>
              <th>Date</th>
              <th>Customer</th>
              <th style={{whiteSpace:"nowrap"}}>HO Amount</th>
              <th style={{whiteSpace:"nowrap"}}>Tally Total</th>
              <th style={{whiteSpace:"nowrap"}}>Received HO</th>
              <th style={{whiteSpace:"nowrap"}}>Received Tally</th>
            </tr>
          </thead>
          <tbody className="tablebody">
          {data ? data.map((item) => (
            <tr key={item.id}>
              {/* Render table cells with corresponding data */}
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              {/* Add the remaining cells based on your data structure */}
            </tr>
          )): ''}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
