import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { PDFViewer } from "@react-pdf/renderer";
import ReceiptReportPdfModal from "./ReceiptReportPdfModal";

export default function ReceiptReportModal({
  receiptPdfOpen,
  setReceiptPdfOpen,
  overallTotal,
  overallOnAccountTotal,
  getCustTax,
  groupedCustTaxArray,
  date,
  getPdfTaxValuess,
}) {
  const handleClose = () => {
    setReceiptPdfOpen(false);
  };

  return (
    <div>
      <Modal show={receiptPdfOpen} fullscreen onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Magod Unit Accounts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="100%" height="600">
              <ReceiptReportPdfModal
                overallTotal={overallTotal}
                overallOnAccountTotal={overallOnAccountTotal}
                getCustTax={getCustTax}
                groupedCustTaxArray={groupedCustTaxArray}
                date={date}
                getPdfTaxValuess={getPdfTaxValuess}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </div>
  );
}
