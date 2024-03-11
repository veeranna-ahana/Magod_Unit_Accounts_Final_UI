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

const arrayToXML = (data) => {
  const options = {
    compact: true,
    ignoreComment: true,
    spaces: 4,
  };
  const xmlData = {
    AccountsDS: {
    MagodUnits: {
      UnitName: "Jigani",
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
  }
  };
  return js2xml(xmlData, options);
};

const DownloadXMLButton = ({ data }) => {
  
    const handleDownload = () => {
      const xmlString = arrayToXML(data);
      const finalXmlString = `<?xml version="1.0" standalone="yes"?>\n${xmlString}`;
      const blob = new Blob([finalXmlString], { type: "text/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).replace(/\s+/g, '_'); // Replace spaces with underscores
      const strUnitName = 'Jigani';
     // const strUnitName = data[0]?.UnitName || "DefaultUnit"; // Replace "DefaultUnit" with a default value if UnitName is not available
      // a.download = "unit_hosync.xml";
      a.download = `Unit ${strUnitName} Sync ${formattedDate}.xml`;
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
    
  }, [activeTab, tabData]);
  //console.log(data, 'exportpage')
  return (
    <div>
      <div>
        <div className="mb-3">
        <div>
        <DownloadXMLButton data={data} />
    </div>
          {error && (
          <Alert severity="error" variant="body1" color="error" sx={{ mt: 2 }}>
            {error}
          </Alert >
        )}
        </div>

        <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key)} style={{fontSize: "13px"}}>
          <Tab eventKey="openInvoice" title="Open Invoices" >
            <OpenInvoice data={data.open_inv} />
          </Tab>
          <Tab eventKey="openReceipts" title="Open Receipts">
            <OpenReceipt data={data.open_rec}/>
          </Tab>
          <Tab eventKey="hoReceiptVoucher" title="HO Receipt Vouchers">
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
