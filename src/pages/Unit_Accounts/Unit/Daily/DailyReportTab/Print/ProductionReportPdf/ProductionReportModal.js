import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import ProductionReportPdfModal from "./ProductionReportPdfModal";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "../../../../../../../api/baseUrl";

export default function ProductionReportModal({
  productionPdfOpen,
  setProductionPdfOpen,
  getValuesPrdSum,
  date,
  unitDetails
}) {
  const handleClose = () => {
    setProductionPdfOpen(false);
  };

  const savePdfToServer = async () => {
    console.log("Helloo PDF");

    try {
      const adjustment = "Production Report"; // Replace with the actual name you want to send

      // Step 1: Call the API to set the adjustment name
      await axios.post(baseURL + `/PDF/set-adjustment-name`, { adjustment });
      const blob = await pdf(
        <ProductionReportPdfModal
          date={date}
          getValuesPrdSum={getValuesPrdSum}
          unitData={unitDetails}
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
      <Modal show={productionPdfOpen} fullscreen>
        <Modal.Header closeButton onClick={handleClose}>
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
            <PDFViewer width="1200" height="600">
              <ProductionReportPdfModal
                date={date}
                getValuesPrdSum={getValuesPrdSum}
                unitData={unitDetails}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </div>
  );
}
