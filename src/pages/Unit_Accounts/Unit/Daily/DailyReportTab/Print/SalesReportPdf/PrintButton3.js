
import React from 'react';
import ReactToPrint from 'react-to-print';
import SalesReportPdf from './SalesReportPdf';

export default function PrintButton3() {
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
      <button onClick={handlePrintButtonClick}>Print Sales Report</button>

      {/* ReactToPrint component */}
      <ReactToPrint
        trigger={() => <div style={{ display: 'none' }}><SalesReportPdf ref={contentRef} /></div>}
        content={() => contentRef.current}
        ref={printRef} // Attach the reference to the ReactToPrint component
        documentTitle ="Sales Report"
      />
    </div>
  );
}
