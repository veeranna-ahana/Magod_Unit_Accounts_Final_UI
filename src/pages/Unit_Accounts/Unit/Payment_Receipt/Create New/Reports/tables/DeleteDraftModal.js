import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function DeleteDraftModal({
  setDeleteDraft,
  deleteDraft,
  deleteSubmit,
}) {
  const handleClose = () => {
    setDeleteDraft(false);
  };

  const handleYes = () => {
    handleClose(); // Close the modal
    deleteSubmit();
    // Call the function passed from the parent component
  };

  return (
    <>
      <Modal show={deleteDraft}>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title>Magod Unit Accounts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Confirm : Do you wish to Delete this Draft Payment Receipt Voucher
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={handleYes}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
