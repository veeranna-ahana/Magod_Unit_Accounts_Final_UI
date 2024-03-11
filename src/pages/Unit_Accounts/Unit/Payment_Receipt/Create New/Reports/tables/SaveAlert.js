import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function SaveAlert({open, setOpen,onYesClick}) {

    const handleClose = ()=>{
        setOpen(false);
    }

    const handleYes = () => {
    
      handleClose(); // Close the modal
      onYesClick(); 
      // Call the function passed from the parent component
    };

  return (
    <>
      <Modal show={open}>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title>Magod Unit Accounts</Modal.Title>
        </Modal.Header>
        <Modal.Body>   
            <p>Confirm : Do you wish to Post the voucher</p>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" type='submit'  onClick={handleYes}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
