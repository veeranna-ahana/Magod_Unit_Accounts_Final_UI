import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { PDFViewer, StyleSheet } from "@react-pdf/renderer";
import SalesReportPdfModal from "./SalesReportPdfModal";

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
  return (
    <div>
      <Modal show={pdfOpen} fullscreen>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title>Magod Unit Accounts</Modal.Title>
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
