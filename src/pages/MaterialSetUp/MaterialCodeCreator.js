import React from "react";
import { Form, Table } from "react-bootstrap";

export default function MaterialCodeCreator() {
  return (
    <div>
      <div className="row">
        <div className="col-md-8 col-sm-12">
          <label className="form-label">Select Shape</label>
          <select id="" className="ip-select" style={{width:"250px"}}>
          <option value="option1"></option>
            <option value="option1">option 1</option>
            <option value="option2">option 2</option>
            <option value="option3">option 3</option>
          </select>
          <h6 className="mt-2">
            <b>Select Material Grade</b>
          </h6>
          <div
            className="mt-2"
            style={{ overflowX: "scroll", overflowY: "scroll" }}
          >
            <Table
              striped
              className="table-data border"
              style={{ border: "1px", height: "320px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>Mtrl Grade Id</th>
                  <th style={{ whiteSpace: "nowrap" }}>Grade</th>
                  <th style={{ whiteSpace: "nowrap" }}>Specific_Wt</th>
                  <th style={{ whiteSpace: "nowrap" }}>Excise_Cl_No</th>
                </tr>
              </thead>
              <tbody className="tablebody"></tbody>
            </Table>
          </div>
          <Form className="mt-3 mb-5">
            <div className="form-bg ip-box">
            <h5><b>Sheet Parameters</b></h5>
            <div className="row">
              <div className="col-md-4 col-sm-12 mt-1">
              <label className="form-label">Thickness</label>
              </div>
              <div  className="col-md-8 col-sm-12">
              <div className="row">
               <div className="col-md-8 col-sm-12">
               <input className="in-fields" type="text"/>
               </div>
               <div className="col-md-2 col-sm-12 mt-3">
                <span>mm</span>
               </div>
                </div>
              </div>
            </div>
            <label className="form-label">New Material Code</label>
            <input className="in-fields" type="text" style={{width:"320px"}}/>
            <button className="button-style ">Create New Code</button>
            <span style={{whiteSpace:"nowrap"}}>Select SHAPE,Material Grade.Enter Parameters and Save</span>
            </div>
          </Form>
        </div>
        <div className="col-md-4 col-sm-12">
          <div
            className="mt-2"
            style={{ overflowX: "scroll", overflowY: "scroll" }}
          >
            <Table
              striped
              className="table-data border"
              style={{ border: "1px", height: "400px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>Mtrl Code</th>              
                </tr>
              </thead>
              <tbody className="tablebody"></tbody>
            </Table>
          </div>
         
        </div>
      </div>
    </div>
  );
}
