import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import PopAlertBox from './PopAlertBox';
import { baseURL } from "../../../../../../api/baseUrl";


export default function CancelPop({popupBox, setpopBox, selectValues, cancelData}) {

  const[pop, setPop]=React.useState(false);

  // Assuming data.RefVrDate is a string in the format '2015-02-03T18:30:00.000Z'
  const refVrDate = new Date(selectValues.Inv_Date);

  // Extracting the date components
  const year = refVrDate.getUTCFullYear();
  const month = refVrDate.getUTCMonth() + 1; // Months are 0-based
  const day = refVrDate.getUTCDate();

  // Formatting the date as 'YYYY-MM-DD'
  const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

  const data = {
    UnitName: selectValues.UnitName,
    VrAmount: selectValues.GrandTotal,
    CancelReason: cancelData,
    RefVr_Uid: selectValues.DC_Inv_No,
    RefVrNo: selectValues.Inv_No,
    RefVrDate: formattedDate,
    RefVrType: selectValues.DC_InvType,
    Cust_Code: selectValues.Cust_Code,
    Cust_Name: selectValues.Cust_Name
  }


  // console.log("hxavshxsah", data.RefVrDate);
  // console.log("hxavshxsah", formattedDate);

  const handleClose=()=>{
setpopBox(false);
  }

  const handleSubmit=()=>{
    setpopBox(false);
    setPop(true);
   
  }

  const handlePostData = async () =>{
    console.log("Possssssssssssssssssst")

    try {
      const response = await axios
      .post(baseURL + `/dailyReport/cancelInvoiceVoucher`, {data: data});
      console.log('Data successfully sent:', response.data);
      // You can perform further actions after successful submission
    } catch (error) {
      console.error('Error sending data:', error);
      // Handle error cases
    }
  };

  // console.log("bbbbbbbbbb", data);
  // console.log("bbbbbbbbbb", postData);

  return (
    <div>
      <div>
       <Modal show={popupBox} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>magod units_account </Modal.Title>
        </Modal.Header>

        <Modal.Body>Do you wish to Cancel Invoice No {selectValues.Inv_No} Dt {selectValues.date} and revert stock ?</Modal.Body> 

        <Modal.Footer>
          <Button variant="primary"   onClick={()=>{handleSubmit(); handlePostData();}}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>

      {
       pop &&
      (
         
          <PopAlertBox pop={pop} setPop={setPop} selectValues={selectValues}/>
        
        )
        }
    </div>
    </div>
  );
}
