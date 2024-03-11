import React, { useRef, useState , useEffect} from "react";
import ImportOpenInvoice from "./ImportOpenInvoice";
import ImportOpenReceipt from "./ImportOpenReceipt";
import ImportHoReceiptVoucher from "./ImportHoReceiptVoucher";
import TallyInvoicesSync from "./TallyInvoicesSync";
import { Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { xml2js } from "xml-js";
import { baseURL } from '../../../../../../api/baseUrl';



export default function Import({data}) {
  const fileInputRef = useRef(null);
  const [xmlData, setXmlData] = useState(data);
  const [dataa, setData] =useState({
    open_inv:[],
    open_rec:[]
  })
  const [receipt_data,setReceiptData] = useState([])
  const [report,setReport] = useState([])

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();



    reader.onload = (e) => {
      const xmlString = e.target.result;
    
      const parsedData = parseXmlData(xmlString);
      const syncedData = []
        data.open_inv.map((unitInv) => {
          console.log(unitInv)
        const matchedInv = parsedData.open_inv.find((importInv) => importInv.DC_Inv_No === unitInv.DC_Inv_No);
        console.log(matchedInv)
        if (matchedInv) {
          console.log('test')
          if (
            matchedInv.PymtAmtRecd !== unitInv.PymtAmtRecd ||
            matchedInv.GrandTotal !== unitInv.GrandTotal ||
            matchedInv.DCStatus !== unitInv.DCStatus
          ) {
            console.log('matched', 'hjjkllklkkl')
            // return {
            syncedData.push({
              ...unitInv,
              UnitName: matchedInv.UnitName,
            Cust_name: matchedInv.Cust_name,
            DC_Inv_No: matchedInv.DC_Inv_No,
            PymtAmtRecd: matchedInv.PymtAmtRecd,
            GrandTotal: matchedInv.GrandTotal,
            DCStatus: matchedInv.DCStatus,
            Inv_Date: matchedInv.Inv_Date,
            Inv_No: matchedInv.Inv_No,
            HO_ReceiptStatus: matchedInv.HO_ReceiptStatus,
            Unit_UId: matchedInv.Unit_UId,
            Sync_HOId: matchedInv.Sync_HOId,
              HO_GrandTotal: matchedInv.GrandTotal,
              HO_PymtAmtRecd: matchedInv.PymtAmtRecd,
              HO_DCStatus: matchedInv.DCStatus,
              Remarks: 'Value Different',
            });
          }
        }
        //return unitInv;
      });
      parsedData.open_inv.forEach((unitInv, index) => {
        const matchedInv = data.open_inv.find((importInv) => unitInv.DC_Inv_No === importInv.DC_Inv_No);
        //console.log(matchedInv)
        if (!matchedInv) {
          syncedData.push({
            ...unitInv,
            DC_InvType:unitInv.DC_InvType,
            UnitName: unitInv.UnitName,
          Cust_name: unitInv.Cust_name,
          DC_Inv_No: unitInv.DC_Inv_No,
          Unit_PymtAmtRecd: unitInv.PymtAmtRecd,
          Unit_GrandTotal: unitInv.GrandTotal,
          Unit_DCStatus: 'Unknown',
          Inv_Date: unitInv.Inv_Date,
          Inv_No: unitInv.Inv_No,
          HO_ReceiptStatus: unitInv.HO_ReceiptStatus,
          Unit_UId: unitInv.Unit_UId,
          Sync_HOId: unitInv.Sync_HOId,
            HO_GrandTotal: unitInv.GrandTotal,
            HO_PymtAmtRecd: unitInv.PymtAmtRecd,
            HO_DCStatus: unitInv.DCStatus,
            Remarks: 'Closed or Missing in Unit',
          })
        }
      })
      data.open_inv.forEach((importInv, index) => {
        const matchedInv = parsedData.open_inv.find((unitInv) => unitInv.DC_Inv_No === importInv.DC_Inv_No);
        // console.log(matchedInv)
        if (!matchedInv) {
          syncedData.push({
            ...importInv,
            UnitName: importInv.UnitName,
            Cust_name: importInv.Cust_Name,
            DC_Inv_No: importInv.DC_Inv_No,
            Unit_PymtAmtRecd: importInv.PymtAmtRecd,
            Unit_GrandTotal: importInv.GrandTotal,
            Unit_DCStatus: importInv.DCStatus,
            Inv_Date: importInv.Inv_Date,
            Inv_No: importInv.Inv_No,
            Unit_UId: importInv.Unit_UId,
            Sync_HOId: importInv.Sync_HOId,
            HO_GrandTotal: 0,
            HO_PymtAmtRecd: 0,
            HO_DCStatus: 'Unknown',
            Remarks: 'Closed or Missing in HO',
          });
        }
      });
      const syncedData1 = data.open_rec.map((unitRv) => {
              const matchedRv = parsedData.open_rec.find((importRv) => importRv.RecdPVID === unitRv.RecdPVID);
              if (matchedRv) {
                if (matchedRv.ReceiptStatus !== unitRv.ReceiptStatus || matchedRv.On_account !== unitRv.On_account) {
                  return {
                    ...unitRv,
                    HO_Amount: matchedRv.Amount,
                    HO_On_account: matchedRv.On_account,
                    HO_ReceiptStatus: matchedRv.ReceiptStatus,
                    Remarks: 'Value Different',
                  };
                }
              }
              return unitRv;
            });
      
            // Step 4: Add Missing Receipts
            parsedData.open_rec.forEach((rv) => {
              const matchedRv = data.open_rec.find((unitRv) => unitRv.RecdPVID === rv.RecdPVID);
              if (!matchedRv) {
                syncedData1.push({
                  ...rv,
                    Unitname : rv.UnitName,
                    Cust_code: rv.Cust_code,
                    CustName : rv.CustName,
                    HO_Amount : rv.Amount,
                    HO_On_account : rv.On_account,
                    HO_ReceiptStatus: rv.ReceiptStatus,
                    Recd_PV_Date : rv.Recd_PV_Date,
                    Recd_PVNo : rv.Recd_PVNo,
                    RecdPVID : rv.RecdPVID,
                    Sync_HOId : rv.Sync_HOId,
                    Unit_UId : rv.Unit_UId,
                    Unit_Amount : 0,
                    Unit_On_account : 0,
                    Unit_ReceiptStatus : "Unknown"
                });
              }
            });
            // Step 4: Add Missing Receipts
            data.open_rec.forEach((rv) => {
              const matchedRv = parsedData.open_rec.find((unitRv) => unitRv.RecdPVID === rv.RecdPVID);
              if (!matchedRv) {
                syncedData1.push({
                  ...rv,
                    Unitname : rv.UnitName,
                    Cust_code: rv.Cust_code,
                    CustName : rv.CustName,
                    HO_Amount : rv.Amount,
                    HO_On_account : rv.On_account,
                    HO_ReceiptStatus: rv.ReceiptStatus,
                    Recd_PV_Date : rv.Recd_PV_Date,
                    Recd_PVNo : rv.Recd_PVNo,
                    RecdPVID : rv.RecdPVID,
                    Sync_HOId : rv.Sync_HOId,
                    Unit_UId : rv.Unit_UId,
                    Unit_Amount : 0,
                    Unit_On_account : 0,
                    Unit_ReceiptStatus : "Unknown"
                });
              }
            });
      setData({ ...dataa, open_inv: syncedData, open_rec: syncedData1 });

      };

      reader.readAsText(file);
    };

  const parseXmlData = (xmlString) => {
   alert('heyy im here')
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const multiMediaNodes = xmlDoc.querySelectorAll('unit_invoices_list');
    const multiMediaNodes1 = xmlDoc.querySelectorAll('unit_recipts_register');
    const parsedData = {
      open_inv:[],
      open_rec:[]
    };
    // Function to extract data dynamically from nodes
    const extractData = (nodes, targetArray) => {
      nodes.forEach((node) => {
          const mediaObject = {};

          node.childNodes.forEach((childNode) => {
              if (childNode.nodeType === Node.ELEMENT_NODE) {
                  mediaObject[childNode.tagName] = childNode.textContent;
              }
          });

          targetArray.push(mediaObject);
      });
  };

  // Call the function for both arrays
  extractData(multiMediaNodes1, parsedData.open_rec);
  extractData(multiMediaNodes, parsedData.open_inv);
    setReport(parsedData)
    return parsedData;
  }; 

  const postData = async()=>{
    axios.post(baseURL+'/setupSync/postData',data)
      .then((res)=>{
        console.log(res,'newiddd')
      }).catch((err)=>{
        console.log('eroor in fromntend',err);
      })
  }
  return (
    <div>
      <div className="row">
        <input
          type="file"
        accept=".xml"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileSelect}/>
        <div className="col-md-4 mb-3 col-sm-6">
          <button className="button-style  group-button"style={{ width: "200px" }} onClick={handleButtonClick}>
            Import Open Sync File
          </button>
        </div>
        <div className="col-md-4 mb-3 col-sm-6" >
          <button className="button-style  group-button" style={{ width: "130px" }} onClick={postData} >
            Update Unit
          </button>
        </div>
      </div>

      <Tabs style={{width:'700px'}}>
        <Tab eventKey="openInvoice" title="Open Invoice">
          <ImportOpenInvoice data={dataa.open_inv}/>
        </Tab>
        <Tab eventKey="openReceipts" title="Open Receipts">
          <ImportOpenReceipt data = {dataa.open_rec} />
        </Tab>
        <Tab eventKey="hoReceiptVoucher" title="Ho Receipt Voucher">
          <ImportHoReceiptVoucher data={xmlData.ho_rec} />
        </Tab>
        <Tab eventKey="tallyInvoicesSync" title="Tally Invoices Sync">
          <TallyInvoicesSync data={xmlData.tally_inv} />
        </Tab>
      </Tabs>
    </div>
   
  );
}
