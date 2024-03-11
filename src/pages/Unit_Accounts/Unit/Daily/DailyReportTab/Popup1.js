import React from 'react';

export default function Popup1() {
  return (
    <div>
      <Modal  show={OpenForm} onHide={handleClose}>
        <Modal.Header closeButton >
          <Modal.Title>Program Parts Inspection Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          hiiii
       
        </Modal.Body>
        
      </Modal>
    </div>
  );
}
