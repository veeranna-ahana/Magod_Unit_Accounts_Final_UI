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
          <Modal.Title style={{ fontSize: "14px" }}>
            Magod Unit Accounts
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "12px" }}>
          <p>
            Confirm : Do you wish to Delete this Draft Payment Receipt Voucher
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            onClick={handleYes}
            style={{ fontSize: "12px" }}
          >
            Yes
          </Button>
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{ fontSize: "12px" }}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
