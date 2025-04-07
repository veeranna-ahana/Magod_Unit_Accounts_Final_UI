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
          <button
           className="button-style  group-button"
            type="submit"
            onClick={handleYes}
            style={{ fontSize: "12px" }}
          >
            Yes
          </button>
          <button
            className="button-style  group-button"
            onClick={handleClose}
            style={{ fontSize: "12px" }}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
