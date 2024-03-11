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
          <Modal.Title>magod units_account </Modal.Title>
        </Modal.Header>

        <Modal.Body>Inv Not {selectValues.Inv_No} Cancelled, quantity reverted to 
            schedule, create paking note again to invoice
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleClose}>
            yes
          </Button>
        </Modal.Footer> 
      </Modal>
    </div>
  );
}
