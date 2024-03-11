import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import AlertModal from "../component/alert";


export default function MaterialGradeCreator(props) {  
  
 console.log('porps', props);



  let [alertModal1, setAlertModal1] = useState(false);
  let openModal1 = (e) => {
    e.preventDefault();
    setAlertModal1(true);
  };
  let closeModal1 = () => {
    setAlertModal1(false);
  };

  let [alertModal2, setAlertModal2] = useState(false);
  let openModal2 = () => {
    setAlertModal1(false);
    setAlertModal2(true);
  };
  let closeModal2 = () => {
    setAlertModal2(false);
  };
  return (
    <div>
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
              <th style={{ whiteSpace: "nowrap" }}> MG_id</th>
              <th style={{ whiteSpace: "nowrap" }}>Grade</th>
              <th style={{ whiteSpace: "nowrap" }}>Specific_weight</th>
              <th style={{ whiteSpace: "nowrap" }}>Excise_cl_no</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {props.mtrlData.length>0?
            (props.mtrlData?.map((val,i)=>(
              <>
              
              <tr>
              <td>
                  {val.MG_id}
                </td><td>
                  {val.Grade}
                </td><td>
                  {val.Specific_weight}
                </td><td>
                  {val.Excise_cl_no}
                </td>
              </tr>
              </>
            )))
          :null  
          }
            {/* {props.mtrlData?.map((val,i)=>(
              <>
              
              <tr>
              <td>
                  {val.MG_id}
                </td><td>
                  {val.MG_id}
                </td><td>
                  {val.MG_id}
                </td><td>
                  {val.MG_id}
                </td>
              </tr>
              </>
            ))} */}
             {/* {mtrlData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.MG_id}</td>
                </tr>
              );
            })}  */}
          </tbody> 
        </Table>
      </div>
      <Form className="mt-2" onSubmit={openModal1}>
        <h5>
          <b>Add New Grade</b>
        </h5>
        <div className="row mb-5">
          <div className="col-md-4 col-sm-12">
            <label className="form-label">New Grade</label>
            <input type="text" />
            <label className="form-label">Specific Weight</label>
            <input type="text" />
            <label className="form-label">Excse Class</label>
            <input type="text" />
            <button className="button-style">Save</button>
          </div>
        </div>
      </Form>
      <AlertModal
        show={alertModal1}
        onHide={(e) => setAlertModal1(e)}
        firstbutton={openModal2}
        secondbutton={closeModal1}
        title="magod_setup"
        message="Do you wish to add new Material"
        firstbuttontext="Yes"
        secondbuttontext="No"
      />

      <AlertModal
        show={alertModal2}
        onHide={(e) => setAlertModal2(e)}
        firstbutton={closeModal2}
        title="magod_setup"
        message="Added to list."
        firstbuttontext="Yes"
      />
    </div>
  );
}
