import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import ReceiptReportPdfModal from "./ReceiptReportPdfModal";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "../../../../../../../api/baseUrl";

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

  const savePdfToServer = async () => {
    console.log("Helloo PDF");

    try {
      const adjustment = "Receipt Report"; // Replace with the actual name you want to send

      // Step 1: Call the API to set the adjustment name
      await axios.post(baseURL + `/PDF/set-adjustment-name`, { adjustment });
      const blob = await pdf(
        <ReceiptReportPdfModal
          overallTotal={overallTotal}
          overallOnAccountTotal={overallOnAccountTotal}
          getCustTax={getCustTax}
          groupedCustTaxArray={groupedCustTaxArray}
          date={date}
          getPdfTaxValuess={getPdfTaxValuess}
        />
      ).toBlob();

      const file = new File([blob], "GeneratedPDF.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(baseURL + `/PDF/save-pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("PDF saved successfully!");
      }
    } catch (error) {
      console.error("Error saving PDF to server:", error);
    }
  };

  return (
    <div>
      <Modal show={receiptPdfOpen} fullscreen onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Magod Unit Accounts</Modal.Title>
          <button
            style={{ marginLeft: "70%" }}
            className="button-style group-button"
            onClick={savePdfToServer}
          >
            Save to server
          </button>
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
