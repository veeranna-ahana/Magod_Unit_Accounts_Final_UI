import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { PDFViewer, StyleSheet, pdf } from "@react-pdf/renderer";
import SalesReportPdfModal from "./SalesReportPdfModal";
import { baseURL } from "../../../../../../../api/baseUrl";
import { toast } from "react-toastify";
import axios from "axios"

export default function SalesReportModal({
  pdfOpen,
  setPdfOpen,
  groupedArray,
  date,
  getValuesTax,
}) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    logoImage: {
      width: "50px",
      // marginLeft: "10px",
    },
    companyInfo: {
      marginTop: "5px",
      marginLeft: "20%",
      width: "60%",
      fontSize: "9",
      alignSelf: "center",
    },
  });

  const handleClose = () => {
    setPdfOpen(false);
  };

  const savePdfToServer = async () => {
    console.log("Helloo PDF");
    
    try {
      const adjustment = "Sales Report"; // Replace with the actual name you want to send

      // Step 1: Call the API to set the adjustment name
      await axios.post(baseURL + `/PDF/set-adjustment-name`, { adjustment });
      const blob = await pdf(
        <SalesReportPdfModal
          date={date}
          groupedArray={groupedArray}
          getValuesTax={getValuesTax}
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
      <Modal show={pdfOpen} fullscreen>
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
              <SalesReportPdfModal
                date={date}
                groupedArray={groupedArray}
                getValuesTax={getValuesTax}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </div>
  );
}
