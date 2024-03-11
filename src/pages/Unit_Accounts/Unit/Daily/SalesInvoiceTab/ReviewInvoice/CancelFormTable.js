import React from 'react';
import { Table } from 'react-bootstrap';

export default function CancelFormTable({getValuesClearance}) {
  return (
    <div>
       <div className='col-md-12' style={{ overflowY: 'scroll', overflowX: 'scroll', height: '250px',  }}>
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr style={{whiteSpace:'nowrap'}}>
                <th>Srl</th>
                <th>Material</th>
                <th>Mtrl</th>
                <th>Excise class</th>
                <th>Quantiy</th>
                <th>Amount</th>
              </tr>
            </thead>

                  <tbody className='tablebody'>
                    {getValuesClearance.map((item, key)=>{
                      return(
                      <tr style={{whiteSpace:'nowrap'}}>
                      <td>{item.SummarySrl}</td>
                      <td>{item.Material}</td>
                      <td>{item.Mtrl}</td>
                      <td>{item.Excise_CL_no}</td>
                      <td>{item.TotQty}</td>
                      <td>{item.TotAmount}</td>
                      </tr>
                      )
                    })}
                  </tbody>
          </Table>

        </div >
    </div>
  );
}
