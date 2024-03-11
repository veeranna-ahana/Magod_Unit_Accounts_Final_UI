import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { js2xml } from 'xml-js';
import FileSaver from 'file-saver';
import OpenInvoice from './OpenInvoice';
import OpenReceipt from './OpenReceipt';
import HoReceiptVoucher from './HoReceiptVoucher';
import { Typography,Alert  } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


export default function Export({data}) {
  const [activeTab, setActiveTab] = useState('openInvoice');
  const [tabData, setTabData] = useState([]);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState('');



  // const handleExportButtonClick = (dataa) => {
  //   console.log(dataa,'lll')
  // //   if (downloaded) {
  // //     setError('File already exists. Please try again.');
  // //     return;
  // //   }
  // // else {
  //   let val  = dataa;
  //   // switch (activeTab) {
  //   //   case 'openInvoice':
  //   //     setTabData({ ...tabData, openInvoice: data });
  //   //     exportedData = tabData.openInvoice || [];
  //   //     break;
  //   //   case 'openReceipts':
  //   //     setTabData({ ...tabData, openReceipts: data });
  //   //     exportedData = tabData.openReceipts || [];
  //   //     break;
  //   //   case 'hoReceiptVoucher':
  //   //     setTabData({ ...tabData, hoReceiptVoucher: data });
  //   //     exportedData = tabData.hoReceiptVoucher || [];
  //   //     break;
  //   //   default:
  //   //     break;
  //   // }
  //   //console.log('Exported datammmmmmmmmmmm:', exportedData);
  //   const xmlData = js2xml({ data: val }, { compact: true, spaces: 4 });
  //   console.log('Exported data (XML):', xmlData);

  //   const blob = new Blob([xmlData], { type: 'application/xml' });
  //   FileSaver.saveAs(blob, 'exportedData.xml');
  //   setDownloaded(true);

  //   }

  // const handleExportButtonClick = (dataa) => {
  //   // Check if dataa is a valid JavaScript object
  //   if (!Array.isArray(dataa) || dataa === null) {
  //       console.error('Invalid data. Cannot export to XML.');
  //       return;
//     }

//     // Convert the data to XML
//     try {
//         let val = dataa;
//         console.log(val, data)
//         const xmlData = js2xml({ data: val }, { compact: true, spaces: 4 });

//         // Check if the generated XML is valid
//         if (!isValidXml(xmlData)) {
//             console.error('Invalid XML data. Cannot export to file.');
//             return;
//         }

//         console.log('Exported data (XML):', xmlData);

//         // Save the XML data to a file
//         const blob = new Blob([xmlData], { type: 'application/xml' });
//         FileSaver.saveAs(blob, 'exportedData.xml');
//         setDownloaded(true);
//     } catch (error) {
//         console.error('Error while generating XML:', error);
//     }
// }

// // Function to check if the XML data is valid
// function isValidXml(xmlData) {
//     try {
//         const parser = new DOMParser();
//         const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
//         const parseError = xmlDoc.getElementsByTagName('parsererror');
//         return parseError.length === 0;
//     } catch (error) {
//         return false;
//     }
// }

const arrayToXML = (data) => {
  const options = {
    compact: true,
    ignoreComment: true,
    spaces: 4,
  };
  const xmlData = {
    MagodUnits: {
      UnitName: data[0]?.UnitName || "",
      CashInHand: 0,
    },
    unit_recipts_register: data.open_rec.map((item, index) => ({
      Id: -1 - index,
      Unitname: item.UnitName,
      RecdPVID: item.DC_Inv_No,
      Selected: false,
      Sync_HOId: item.ScheduleId,
      Unit_UId: 0,
      Recd_PVNo: "13/14 / 1692", // Placeholder data, update as needed
      Recd_PV_Date: "2014-01-01T00:00:00+05:30", // Placeholder data, update as needed
      ReceiptStatus: "Open", // Placeholder data, update as needed
      Cust_code: item.Cust_Code,
      CustName: item.Cust_Name,
      Amount: parseFloat(item.InvTotal).toFixed(2),
      Adjusted: 0,
      DocuNo: "", // Placeholder data, update as needed
      Description: "", // Placeholder data, update as needed
      HOPrvId: 0,
      Tally_Uid: 0,
      Updated: false,
      On_account: "0.00", // Placeholder data, update as needed
      TxnType: "Bank", // Placeholder data, update as needed
      TallyUpdate: 0,
    })),
    unit_invoices_list: data.open_inv.map((item, index) => ({
      Id: -1 - index,
      Unitname: item.UnitName,
      RecdPVID: item.DC_Inv_No,
      Selected: false,
      Sync_HOId: item.ScheduleId,
      Unit_UId: 0,
      Recd_PVNo: "13/14 / 1692", // Placeholder data, update as needed
      Recd_PV_Date: "2014-01-01T00:00:00+05:30", // Placeholder data, update as needed
      ReceiptStatus: "Open", // Placeholder data, update as needed
      Cust_code: item.Cust_Code,
      CustName: item.Cust_Name,
      Amount: parseFloat(item.InvTotal).toFixed(2),
      Adjusted: 0,
      DocuNo: "", // Placeholder data, update as needed
      Description: "", // Placeholder data, update as needed
      HOPrvId: 0,
      Tally_Uid: 0,
      Updated: false,
      On_account: "0.00", // Placeholder data, update as needed
      TxnType: "Bank", // Placeholder data, update as needed
      TallyUpdate: 0,
    })),
  };
  return js2xml(xmlData, options);
};

const DownloadXMLButton = ({ data }) => {
  
      // const date = new Date(dateString);
      // const year = date.getFullYear();
      // const month = String(date.getMonth() + 1).padStart(2, '0');
      // const day = String(date.getDate()).padStart(2, '0');
      // const finaldate= `${year}-${month}-${day}`;
  
    const handleDownload = () => {
      const xmlString = arrayToXML(data);
      const blob = new Blob([xmlString], { type: "text/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "unit_hosync.xml";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };
    return (
      <button onClick={handleDownload} className="button-style group-button"
      style={{ width: '180px' }}>
        Export Open Sync File
      </button>
    );
  };
  const handleCloseError = () => {
    setError('');
  };
  
  useEffect(() => {
    let exportedData = [];
    switch (activeTab) {
      case 'openInvoice':
        exportedData = tabData.openInvoice || [];
        break;
      case 'openReceipts':
        exportedData = tabData.openReceipts || [];
        break;
      case 'hoReceiptVoucher':
        exportedData = tabData.hoReceiptVoucher || [];
        break;
      default:
        break;
    }
    // console.log('Exported data:', exportedData);
    
    // Perform further actions with the exported data
  }, [activeTab, tabData]);
  //console.log(data, 'exportpage')
  return (
    <div>
      <div>
        <div className="mb-3">
        <div>
        <DownloadXMLButton data={data} />
    </div>
          {/* <button
            className="button-style group-button"
            style={{ width: '180px' }}
            onClick={handleDownload}
          >
            Export Open Sync File
          </button> */}
          {error && (
          <Alert severity="error" variant="body1" color="error" sx={{ mt: 2 }}>
            {error}
          </Alert >
        )}
        </div>

        <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key)} >
          <Tab eventKey="openInvoice" title="Open Invoice" >
            <OpenInvoice data={data.open_inv} />
          </Tab>
          <Tab eventKey="openReceipts" title="Open Receipts">
            <OpenReceipt data={data.open_rec}/>
          </Tab>
          <Tab eventKey="hoReceiptVoucher" title="Ho Receipt Voucher">
            <HoReceiptVoucher />
          </Tab>
        </Tabs>
      </div>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleCloseError}>
          {error}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
