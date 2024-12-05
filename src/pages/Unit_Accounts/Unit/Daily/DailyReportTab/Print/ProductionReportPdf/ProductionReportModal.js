import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { PDFViewer } from "@react-pdf/renderer";
import ProductionReportPdfModal from "./ProductionReportPdfModal";

export default function ProductionReportModal({
  productionPdfOpen,
  setProductionPdfOpen,
  getValuesPrdSum,
  date,
}) {
  const handleClose = () => {
    setProductionPdfOpen(false);
  };

  return (
    <div>
      <Modal show={productionPdfOpen} fullscreen>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title>Magod Unit Accounts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600">
              <ProductionReportPdfModal
                date={date}
                getValuesPrdSum={getValuesPrdSum}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </div>
  );
}
