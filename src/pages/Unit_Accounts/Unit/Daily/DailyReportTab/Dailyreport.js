import React, { useRef } from "react";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import SalesReportPdf from "./Print/SalesReportPdf/SalesReportPdf";
// import ProductionReportPdf from "../../../../../PDF/DailyReportPdf/ProductionReportPdf";
import ProductionReportPdf from "./Print/ProductionReportPdf/ProductionReportPdf";
import ReceiptReportPdf from "./Print/ReceiptReportPdf/ReceiptReportPdf";

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

  return (
    <>
      <div className="row col-md-12">
        <div className="col-md-2">
          <div>
            {/* Button outside ReactToPrint */}
            <button
              className="button-style mt-2 group-button"
              onClick={handlePrintButtonClick}
              style={{ width: "120px" }}
            >
              Sales Report
            </button>
            {/* ReactToPrint component */}
            <ReactToPrint
              trigger={() => (
                <div style={{ display: "none" }}>
                  <SalesReportPdf
                    ref={contentRef}
                    date={date}
                    groupedArray={groupedArray}
                    getValuesTax={getValuesTax}
                  />
                </div>
              )}
              content={() => contentRef.current}
              ref={printRef} // Attach the reference to the ReactToPrint component
              documentTitle="Sales Report"
            />
          </div>
          <div className="" style={{ marginTop: "20px" }}>
            <button
              className="button-style mt-2 group-button"
              style={{ width: "120px" }}
              onClick={handleProductionPrintClick}
            >
              Production Report
            </button>
            {/* ReactToPrint component */}
            <ReactToPrint
              trigger={() => (
                <div style={{ display: "none" }}>
                  <ProductionReportPdf
                    ref={contentReff}
                    getValuesPrdSum={getValuesPrdSum}
                    date={date}
                  />
                </div>
              )}
              content={() => contentReff.current}
              ref={printReff} // Attach the reference to the ReactToPrint component
              documentTitle="Production Report"
            />
          </div>

          <div className="" style={{ marginTop: "20px" }}>
            <button
              className="button-style mt-15 group-button"
              style={{ width: "120px" }}
              onClick={handleReceiptPrintButtonClick}
            >
              Receipts Report
            </button>

            <ReactToPrint
              trigger={() => (
                <div style={{ display: "none" }}>
                  <ReceiptReportPdf
                    ref={contentRefff}
                    getPdfTaxValuess={getPdfTaxValuess}
                    date={date}
                    groupedCustTaxArray={groupedCustTaxArray}
                    getCustTax={getCustTax}
                    overallOnAccountTotal={overallOnAccountTotal}
                    overallTotal={overallTotal}
                  />
                </div>
              )}
              content={() => contentRefff.current}
              ref={printRefff} // Attach the reference to the ReactToPrint component
              documentTitle="Receipt Report"
            />
          </div>
        </div>

        <div className="col-md-10"></div>
      </div>
    </>
  );
}
