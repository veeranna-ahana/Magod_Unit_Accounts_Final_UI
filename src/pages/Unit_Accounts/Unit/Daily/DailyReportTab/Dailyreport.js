import React, { useRef, useState } from "react";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import SalesReportPdf from "./Print/SalesReportPdf/SalesReportPdf";
// import ProductionReportPdf from "../../../../../PDF/DailyReportPdf/ProductionReportPdf";
import ProductionReportPdf from "./Print/ProductionReportPdf/ProductionReportPdf";
import ReceiptReportPdf from "./Print/ReceiptReportPdf/ReceiptReportPdf";
import { baseURL } from "../../../../../api/baseUrl";
import axios from "axios";
import SalesReportModal from "./Print/SalesReportPdf/SalesReportModal";
import jsPDF from "jspdf";
import ProductionReportModal from "./Print/ProductionReportPdf/ProductionReportModal";
import ReceiptReportModal from "./Print/ReceiptReportPdf/ReceiptReportModal";
import { useGlobalContext } from "../../../../../Context/Context";

export default function Dailyreport({
  date,
  groupedArray,
  getValuesPrdSum,
  getValuesTax,
  getPdfTaxValuess,
  groupedCustTaxArray,
  getCustTax,
  overallTotal,
  overallOnAccountTotal,
}) {
  const [pdfOpen, setPdfOpen] = useState(false);
  const [productionPdfOpen, setProductionPdfOpen] = useState(false);
  const [receiptPdfOpen, setReceiptPdfOpen] = useState(false);

   const { unitDetails } = useGlobalContext();
   console.log("unir details in Daily Report, date ", date);
   

  // Sales Report Pdf
  const pdfSalesReport = () => {
    setPdfOpen(true);
  };

  // Production Report Pdf
  const pdfProductionReport = () => {
    setProductionPdfOpen(true);
  };

  // Production Report Pdf
  const pdfRaceiptReport = () => {
    setReceiptPdfOpen(true);
  };

  const contentRef = React.useRef();

  // Create a reference for the ReactToPrint component
  const printRef = React.useRef();

  const handlePrintButtonClick = () => {
    // Call the trigger function of ReactToPrint
    printRef.current.handlePrint();
  };

  //Production Report
  const contentReff = React.useRef();

  // Create a reference for the ReactToPrint component
  const printReff = React.useRef();

  const handleProductionPrintClick = () => {
    // Call the trigger function of ReactToPrint
    printReff.current.handlePrint();
  };

  //Receipts Pdf
  const contentRefff = React.useRef();

  const printRefff = React.useRef();

  const handleReceiptPrintButtonClick = () => {
    // Call the trigger function of ReactToPrint
    printRefff.current.handlePrint();
  };

  const handleDownloadPdf = async () => {
    axios
      .post(`${baseURL}/dailyReportPdfServer/dailyReportSalesReportPdf`, {
        date,
        groupedArray,
        getValuesTax,
      })
      .then((response) => {
        console.log("Response data:", response.data);
      })
      .catch((error) => {
        console.error("Error in table:", error.message);
      });
  };

  // const handleDownloadPdf = async () => {
  //   const pdf = new jsPDF();
  //   const content = contentRef.current;

  //   pdf.html(content, {
  //     callback: async (doc) => {
  //       const pdfBlob = doc.output("blob");
  //       const pdfFile = new File([pdfBlob], "SalesReport.pdf", {
  //         type: "application/pdf",
  //       });

  //       const url = URL.createObjectURL(pdfBlob);
  //       window.open(url, "_blank");

  //       // Log file details
  //       console.log("FormData file details:", pdfFile);
  //       console.log("FormData file size:", pdfFile.size);
  //       console.log("FormData file type:", pdfFile.type);

  //       const formData = new FormData();
  //       formData.append("file", pdfFile);

  //       // Log FormData to check file content
  //       console.log("FormData object content:", formData);

  //       try {
  //         const response = await axios.post(
  //           `${baseURL}/dailyReportPdfServer/dailyReportSalesReportPdf`,
  //           formData,
  //           {
  //             headers: { "Content-Type": "multipart/form-data" },
  //           }
  //         );
  //         console.log("Server Response:", response.data);
  //       } catch (error) {
  //         console.error(
  //           "Upload Error:",
  //           error.response ? error.response.data : error.message
  //         );
  //       }
  //     },
  //   });
  // };

  return (
    <>
      <div className="row col-md-12">
        
        
        <div className="col-md-2">
          <div>
            <button
              className="button-style mt-2 group-button"
              style={{ width: "120px" }}
              onClick={pdfSalesReport}
            >
              Sales Report
            </button>
            {pdfOpen && (
              <SalesReportModal
                pdfOpen={pdfOpen}
                setPdfOpen={setPdfOpen}
                date={date}
                groupedArray={groupedArray}
                getValuesTax={getValuesTax}
                unitDetails={unitDetails}
              />
            )}
          </div>
          <div className="mt-3">
            <button
              className="button-style mt-2 group-button"
              style={{ width: "120px" }}
              onClick={pdfProductionReport}

            >
              Production Report
            </button>
            {productionPdfOpen && (
              <ProductionReportModal
                productionPdfOpen={productionPdfOpen}
                setProductionPdfOpen={setProductionPdfOpen}
                getValuesPrdSum={getValuesPrdSum}
                date={date}
                unitDetails={unitDetails}
              />
            )}
          </div>
          <div className="mt-4">
            <button
              className="button-style mt-2 group-button"
              style={{ width: "120px" }}
              onClick={pdfRaceiptReport}
            >
              Receipt Report
            </button>
            {receiptPdfOpen && (
              <ReceiptReportModal
                getPdfTaxValuess={getPdfTaxValuess}
                date={date}
                groupedCustTaxArray={groupedCustTaxArray}
                getCustTax={getCustTax}
                overallOnAccountTotal={overallOnAccountTotal}
                overallTotal={overallTotal}
                receiptPdfOpen={receiptPdfOpen}
                setReceiptPdfOpen={setReceiptPdfOpen}
                unitDetails={unitDetails}
              />
            )}
          </div>
        </div>

        <div className="col-md-10"></div>
      </div>
    </>
  );
}
