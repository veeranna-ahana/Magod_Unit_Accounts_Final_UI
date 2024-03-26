import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';


export default function PopAlertBox({pop, setPop, selectValues}) {

    const handleClose=()=>{
        setPop(false);
        window.location.reload();
          }
  return (
    <div>
       <Modal show={pop}  onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize:'12px'}}>magod units_account </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{fontSize:'12px'}}>Inv No {selectValues.Inv_No} Cancelled, quantity reverted to 
            schedule, create paking note again to invoice
        </Modal.Body>

        <Modal.Footer>
          <button className='button-style group-button' onClick={handleClose}>
            yes
          </button>
        </Modal.Footer> 
      </Modal>
    </div>
  );
}
