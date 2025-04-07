import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { xml2js, js2xml } from "xml-js";
import { baseURL } from "../../../../api/baseUrl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import SendMail from "../sendMail/SendMail";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import MailModal from "../../MailModal";

export default function AccountSyncXMLFile() {
  const [getCustInvoice, setGetCustInvoice] = useState([]);
  const [getInvoiceList, setGetInvoiceList] = useState([]);
  const [getInvoiceTaxList, setGetInvoiceTaxList] = useState([]);
  const [getInvoiceSummary, setGetInvoiceSummary] = useState([]);
  const [getPaymentReceipts, setGetPaymentReceipts] = useState([]);
  const [getPaymentAdjusted, setGetPaymentAdjusted] = useState([]);
  const [getCancelledUnit, setGetCancelledUnit] = useState([]);

  const navigate = useNavigate();

  const arrayToXML = (data) => {
    const custInvoiceData = data.getCustInvoice || [];
    const invoiceListData = data.getInvoiceList || [];
    const invoiceTaxData = data.getInvoiceTaxList || [];
    const invoiceSummaryData = data.getInvoiceSummary || [];
    const paymentRaceiptsData = data.getPaymentReceipts || [];
    const paymentAdjustedData = data.getPaymentAdjusted || [];
    const cancelledUnitData = data.getCancelledUnit || [];

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
        Unit_Cust_Data: custInvoiceData.map((item, index) => ({
          Id: -1 - index,
          UnitName: item.UnitName,
          Cust_Code: item.Cust_Code,
          Sync_HOId: item.Sync_HOId,
          Cust_name: item.Cust_name,
          Branch: item.Branch,
          Address: item.Address,
          City: item.City,
          State: item.State,
          StateId: item.StateID,
          Country: item.Country,
          IsGovtOrg: item.IsGovtOrg,
          IsForiegn: item.IsForiegn,
          Pin_Code: item.Pin_Code,
          GSTNo: item.GSTNo,
          PAN_No: item.PAN_No,
          CreditTerms: item.CreditTerms,
          CreditLimit: item.CreditLimit,
          CreditTime: 0,
          CURRENT: item.CURRENT,
          OutStandingAmount: 0,
          OutStandingInvoiceCount: 0,
          CustStatus: item.CustStatus,
          IsBranch: item.IsBranch,
        })),
        unit_recipts_register: paymentRaceiptsData.map((item, index) => ({
          Id: -1 - index,
          Unitname: item.UnitName,
          RecdPVID: item.RecdPVID,
          Selected: false,
          Sync_HOId: item.Sync_HOId,
          Unit_UId: item.Unit_UId,
          Recd_PVNo: item.Recd_PVNo,
          Recd_PV_Date: item.Recd_PV_Date,
          ReceiptStatus: item.ReceiptStatus,
          Cust_code: item.Cust_code,
          CustName: item.CustName,
          Amount: item.Amount,
          Adjusted: 0,
          DocuNo: item.DocuNo,
          Description: item.Description,
          HOPrvId: item.HOPrvId,
          Tally_Uid: 0,
          Updated: false,
          On_account: item.On_account,
          TxnType: item.TxnType,
          TallyUpdate: item.TallyUpdate,
        })),
        unit_receipts_adjusted_inv_list: paymentAdjustedData.map(
          (item, index) => ({
            Id: -1 - index,
            PvrId: 0,
            Unitname: item.UnitName,
            RecdPVID: item.RecdPVID,
            PVSrlID: item.PVSrlID,
            Unit_UId: item.Unit_uid,
            HoPvrId: 0,
            RecdPvSrl: item.RecdPvSrl,
            Sync_HOId: item.Sync_HOId,
            Dc_inv_no: item.Dc_inv_no,
            Inv_No: item.Inv_No,
            Inv_Type: item.Inv_Type,
            Inv_Amount: item.Inv_Amount,
            Amt_received: item.Amt_received,
            Receive_Now: item.Receive_Now,
            InvUpdated: item.InvUpdated,
            Inv_date: item.Inv_date,
            Updated: false,
            RefNo: item.RefNo,
          })
        ),
        unit_invoices_list: invoiceListData.map((item, index) => ({
          Id: -1 - index,
          Sync_HOId: item.Sync_HOId,
          Unit_UId: item.Unit_Uid,
          Selected: false,
          Unitname: item.unitName,
          DC_Inv_No: item.DC_Inv_No,
          ScheduleId: item.ScheduleId,
          Dc_inv_Date: item.Dc_inv_Date,
          DC_InvType: item.DC_InvType,
          InvoiceFor: item.InvoiceFor,
          OrderNo: item.OrderNo,
          OrderDate: item.OrderDate,
          OrderScheduleNo: item.OrderScheduleNo,
          DC_No: item.DC_No,
          DC_Date: item.DC_Date,
          DC_Fin_Year: item.DC_Fin_Year,
          Inv_No: item.Inv_No,
          Inv_Date: item.Inv_Date,
          Inv_Fin_Year: item.Inv_Fin_Year,
          PaymentDate: item.PaymentDate,
          PmnyRecd: item.PmnyRecd,
          PaymentMode: item.PaymentMode,
          PymtAmtRecd: item.PymtAmtRecd,
          Cust_Code: item.Cust_Code,
          Cust_Name: item.Cust_Name,
          Cust_Address: item.Cust_Address,
          Cust_Place: item.Cust_Place,
          Cust_State: item.Cust_State,
          Cust_StateId: item.Cust_StateId,
          PIN_Code: item.PIN_Code,
          GSTNo: item.GSTNo,
          TaxAmount: item.TaxAmount,
          PO_No: item.PO_No,
          Net_Total: item.Net_Total,
          Pkng_chg: item.Pkng_chg,
          TptCharges: item.TptCharges,
          Discount: item.Discount,
          Pgm_Dft_Chg: item.Pgm_Dft_Chg,
          MtrlChg: item.MtrlChg,
          AssessableValueTemp: item.AssessableValue,
          AssessableValue: item.AssessableValue,
          Del_Chg: item.Del_Chg,
          InvTotal: item.InvTotal,
          Round_Off: item.Round_Off,
          GrandTotal: item.GrandTotal,
          Total_Wt: item.Total_Wt,
          ScarpWt: item.ScarpWt,
          DCStatus: item.DCStatus,
          DespatchDate: item.DespatchDate,
          DespatchTime: item.DespatchTime,
          TptMode: item.TptMode,
          VehNo: item.VehNo,
          ExNotNo: item.ExNotNo,
          InspBy: item.InspBy,
          PackedBy: item.PackedBy,
          Com_inv_id: item.Com_inv_id,
          Del_responsibility: item.Del_responsibility,
          PaymentTerms: item.PaymentTerms,
          PN_PkngLevel: item.PN_PkngLevel,
          DueDays: 0,
          Due: item.GrandTotal, //need to update
          Srl: 0,
          SummaryInvoice: item.SummaryInvoice,
          JwValue: 0,
          BillType: item.BillType,
          MaterialValue: 0,
          Tally_Uid: 0,
          TallyRef: null,
          IsDC: item.IsDC,
          Del_Address: item.Del_Address,
          Del_StateId: item.Del_StateId,
          DelDC_Inv: item.DelDC_Inv,
          PO_Value: item.PO_Value,
          FB_Qty: item.FB_Qty,
          FB_Quality: item.FB_Quality,
          FB_Delivery: item.FB_Delivery,
          pkngLevel: item.pkngLevel,
        })),
        unit_taxes_list: invoiceTaxData.map((item, index) => ({
          InvTaxId: -1 - index,
          Sync_HOId: item.Sync_HOId,
          Unit_UId: item.Unit_Uid,
          Updated: false,
          Unitname: item.unitName,
          dc_invTaxId: item.dc_invTaxId,
          Dc_inv_no: item.Dc_inv_No,
          DcTaxID: item.DcTaxID,
          TaxID: item.TaxID,
          Tax_Name: item.Tax_Name,
          TaxOn: item.TaxOn,
          TaxableAmount: item.TaxableAmount,
          TaxPercent: item.TaxPercent,
          TaxAmt: item.TaxAmt,
          AcctHead: item.accthead,
          InvId: 0,
        })),
        dc_inv_summary: invoiceSummaryData.map((item, index) => ({
          Id: -1 - index,
          Unit_UId: item.Unit_UId,
          Sync_HOId: item.Sync_HOId,
          Updated: false,
          DC_Inv_No: item.DC_Inv_No,
          SummarySrl: item.SummarySrl,
          OrderScheduleNo: item.OrderScheduleNo,
          dc_invType: item.dc_invType,
          Mtrl: item.Mtrl,
          Material: item.Material,
          Excise_CL_no: item.Excise_CL_no,
          TotQty: item.TotQty,
          TotAmount: item.TotAmount,
          SrlWt: item.SrlWt,
          JW_Amount: item.JW_Amount,
          Mtrl_Amount: item.Mtrl_Amount,
          InvType: item.dc_invType,
          UnitName: item.unitName,
          InvId: 0,
        })),
      },
    };
    return js2xml(xmlData, options);
  };

  // (getCustInvoice === 0 && getInvoiceList === 0 && getPaymentReceipts === 0 && getCancelledUnit === 0)
  // ? toast.success("Unit Vouchers In Sync")
  // : handleDownload();

  // const handleDownload = async () => {
  //   try {
  //     const xmlString = arrayToXML({
  //       getCustInvoice,
  //       getInvoiceList,
  //       getInvoiceTaxList,
  //       getInvoiceSummary,
  //       getPaymentReceipts,
  //       getPaymentAdjusted,
  //       getCancelledUnit,
  //     });
  //     const finalXmlString = `<?xml version="1.0" standalone="yes"?>\n${xmlString}`;
  //     const blob = new Blob([finalXmlString], { type: "text/xml" });

  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     const today = new Date();
  //     const formattedDate = today
  //       .toLocaleDateString("en-US", {
  //         day: "numeric",
  //         month: "short",
  //         year: "numeric",
  //       })
  //       .replace(/\s+/g, "_"); // Replace spaces with underscores
  //     const strUnitName = "Jigani";
  //     // const strUnitName = data[0]?.UnitName || "DefaultUnit"; // Replace "DefaultUnit" with a default value if UnitName is not available
  //     // a.download = "unit_hosync.xml";
  //     // const fileXml = `${strUnitName}_to_HO_AcctsSync_${formattedDate}.xml`;
  //     a.download = `${strUnitName}_to_HO_AcctsSync_${formattedDate}.xml`;
  //     document.body.appendChild(a);
  //     a.click();
  //     URL.revokeObjectURL(url);
  //     document.body.removeChild(a);

  //     // const handle = await window.showSaveFilePicker({
  //     //   suggestedName: fileXml,
  //     //   types: [
  //     //     {
  //     //       description: "XML Files",
  //     //       accept: {
  //     //         "text/xml": [".xml"],
  //     //       },
  //     //     },
  //     //   ],
  //     // });

  //     // const writable = await handle.createWritable();
  //     // await writable.write(blob);
  //     // await writable.close();

  //     if (
  //       getCustInvoice === 0 &&
  //       getInvoiceList === 0 &&
  //       getPaymentReceipts === 0 &&
  //       getCancelledUnit === 0
  //     ) {
  //       toast.success("Unit Vouchers In Sync");
  //     } else {
  //       // <SendMail/>
  //     }
  //   } catch (error) {
  //     console.error("Error saving file:", error);
  //   }
  // };

  const handleDownload = async () => {
    try {
      const xmlString = arrayToXML({
        getCustInvoice,
        getInvoiceList,
        getInvoiceTaxList,
        getInvoiceSummary,
        getPaymentReceipts,
        getPaymentAdjusted,
        getCancelledUnit,
      });
      const finalXmlString = `<?xml version="1.0" standalone="yes"?>\n${xmlString}`;
      const dataUri =
        "data:text/xml;charset=utf-8," + encodeURIComponent(finalXmlString);

      const a = document.createElement("a");
      a.href = dataUri;

      const today = new Date();
      const formattedDate = today
        .toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        .replace(/\s+/g, "_"); // Replace spaces with underscores
      const strUnitName = "Jigani";
      const fileName = `${strUnitName}_to_HO_AcctsSync_${formattedDate}.xml`;

      // Set the download attribute with the suggested filename
      a.download = fileName;

      // Append the anchor to the document, click it, and remove it
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Handle the rest of your logic here
    } catch (error) {
      console.error("Error saving file:", error);
    }

    await setTimeout(callMailModal, 10000);
  };

  //api for the Accounts Sync
  const handleCustList = () => {
    //Invoiced Cust List
    axios
      .get(baseURL + `/accountSync/invoicedCustList`)
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetCustInvoice(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    //InvoiceList That has not yet been Synced with HO Details
    axios
      .get(baseURL + `/accountSync/invoiceNotYetSynced`)
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetInvoiceList(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    //Inovoice Taxes  Not Yet Sync with HO
    axios
      .get(baseURL + `/accountSync/invoiceTaxesSync`)
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetInvoiceTaxList(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    //Invoice Symmary Not Yet Synced with HO
    axios
      .get(baseURL + `/accountSync/invoiceSummarySync`)
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetInvoiceSummary(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    //Payment Receipts Vouchers in Unit Not Sycnhed with HO
    axios
      .get(baseURL + `/accountSync/paymentReceiptsSync`)
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetPaymentReceipts(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    //Payment Receipts Adjusted in Unit Not Sycnhed with HO
    axios
      .get(baseURL + `/accountSync/paymentAdjustedSync`)
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetPaymentAdjusted(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    //Unit Cancelled Vouchers Not yet Synced with HO
    axios
      .get(baseURL + `/accountSync/unitCancelledSync`)
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetCancelledUnit(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  useEffect(() => {
    handleCustList();
  }, []);

  // console.log('custList', getCustInvoice);
  // console.log('InvoiceList', getInvoiceList);
  // console.log('InvoiceTaxList', getInvoiceTaxList);
  // console.log('InvoiceSummary', getInvoiceSummary);
  // console.log('paymentReceipts', getPaymentReceipts);
  // console.log('paymentAdjusted', getPaymentAdjusted); //next
  // console.log('cancelledUnit', getCancelledUnit);
  const [mailAlert, setMailAlert] = useState(false);
  const [mailModal, setMailModal] = useState(false);
  const callMailModal = () => {
    setMailAlert(true);
  };

  const handleClose = () => {
    // setMailModal(false);
    setMailAlert(false);
  };

  const yesmailSubmit = () => {
    setMailAlert(false);
    setMailModal(true);
  };
  return (
    <>
      <Modal show={mailAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Magod_Unit_Accounts
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ fontSize: "12px" }}>
          {" "}
          Accounts Sync Report Saved as (path filename.xml) Do you wish to mail
          it?
        </Modal.Body>

        <Modal.Footer>
          <button className="button-style  group-button" onClick={yesmailSubmit}>
            Yes
          </button>
          <button className="button-style  group-button" onClick={handleClose}>
            No
          </button>
        </Modal.Footer>
      </Modal>
      <div className="row">
        <h4 className="title">From Accounts Sync File</h4>
      </div>

      <div className="d-flex">
        <div className="">
          <button
            className="button-style mt-2 group-button"
            onClick={handleDownload}
          >
            Account Sync File
          </button>
        </div>
        <div className="" style={{ marginLeft: "82%" }}>
          <button
            className="button-style mt-2 group-button"
            type="button"
            onClick={(e) => navigate("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div>
      {mailModal && (
        <MailModal mailModal={mailModal} setMailModal={setMailModal} />
      )}
    </>
  );
}
