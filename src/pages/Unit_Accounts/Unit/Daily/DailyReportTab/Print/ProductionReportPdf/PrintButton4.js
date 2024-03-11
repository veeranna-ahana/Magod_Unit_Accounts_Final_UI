
import React from 'react';
import ReactToPrint from 'react-to-print';
import ProductionReportPdf from './ProductionReportPdf';

export default function PrintButton4() {
  const contentRef = React.useRef();

  // Create a reference for the ReactToPrint component
  const printRef = React.useRef();

  const handlePrintButtonClick = () => {
    // Call the trigger function of ReactToPrint
    printRef.current.handlePrint();  
  };

  return (
    <div>
      {/* Button outside ReactToPrint */}
      <button onClick={handlePrintButtonClick}>Print Production Report</button>

      {/* ReactToPrint component */}
      <ReactToPrint
        trigger={() => <div style={{ display: 'none' }}><ProductionReportPdf ref={contentRef} /></div>}
        content={() => contentRef.current}
        ref={printRef} // Attach the reference to the ReactToPrint component
        documentTitle ="Production Report"
      />
    </div>
  );
}
