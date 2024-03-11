import React from 'react';
import ReactToPrint from 'react-to-print';
import PaymentReceiptVoucherPdf from './PaymentReceiptVoucher';

export default function PrintButton7() {
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
      <button onClick={handlePrintButtonClick}>Payment Receipt Voucher</button>

      {/* ReactToPrint component */}
      <ReactToPrint
        trigger={() => <div style={{ display: 'none' }}><PaymentReceiptVoucherPdf ref={contentRef} /></div>}
        content={() => contentRef.current}
        ref={printRef} // Attach the reference to the ReactToPrint component
        documentTitle ="Payment Receipt Voucher"
      />
    </div>
  );
}
