import React from "react";
import { Table } from "react-bootstrap";

export default function CancelFormTable({ getValuesClearance }) {

  console.log('Hello getValuesClearance', getValuesClearance);

  return (
    <>
      <div
        className=""
        style={{ overflowY: "scroll", overflowX: "scroll", height: "200px" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: "nowrap" }}>
              <th>Srl</th>
              <th>Material</th>
              <th>Mtrl</th>
              <th>Excise class</th>
              <th>Quantiy</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody className="tablebody">
            {Array.isArray(getValuesClearance) &&
            getValuesClearance.length > 0 ? (
              getValuesClearance.map((item, key) => {
                return (
                  <tr key={key} style={{ whiteSpace: "nowrap" }}>
                    <td>{item.SummarySrl}</td>
                    <td>{item.Material}</td>
                    <td>{item.Mtrl}</td>
                    <td>{item.Excise_CL_no}</td>
                    <td>{item.TotQty}</td>
                    <td>{item.TotAmount}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td  colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Data not found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}
