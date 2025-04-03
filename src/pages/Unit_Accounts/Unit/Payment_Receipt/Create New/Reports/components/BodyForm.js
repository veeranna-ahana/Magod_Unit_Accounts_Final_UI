import React, { useState, useEffect, useCallback } from "react";
// import RemoveVoucher from '../tables/RemoveVoucher';
import AddVoucher from "../tables/AddVoucher";
import SaveAlert from "../tables/SaveAlert";
import { useNavigate } from "react-router-dom";
import HeadBar from "./HeadBar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { baseURL } from "../../../../../../../api/baseUrl";
import ReactToPrint from "react-to-print";
import PaymentReceiptVoucherPdf from "../../../../../../../PDF/PaymentReceiptVoucher";

export default function BodyForm() {
  const location = useLocation();
  const rowData = location.state ? location.state : "";

  const contentRef = React.useRef();

  // Create a reference for the ReactToPrint component
  const printRef = React.useRef();
  const [apiData, setApiData] = useState(null);
  // const {state} = useLocation();
  // const Voucherdata = state?state.selectedItems:[];
  // const selectedItems = location.state?.selectedItems ?? [];
  // const [ Voucherdata, setVoucherData] = useState(selectedItems)
  // let Voucherdata = selectedItems?selectedItems:[]
  const [flag, setFlag] = useState(false);
  const [date, setDate] = useState(new Date());
  const [insertId, setInsertId] = useState("");
  const [data, setData] = useState({
    inv_data: [],
    receipt_details: [],
    receipt_id: "",
    receipt_data: {},
  });
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const initial = {
    RecdPVID: "",
    Recd_PVNo: "Draft",
    Recd_PV_Date: formatDate(date),
    ReceiptStatus: "Draft",
    CustName: "",
    Cust_code: "",
    TxnType: "",
    Amount: "",
    On_account: "",
    Description: "",
    selectedCustomer: "",
  };
  const [postData, setPostData] = useState(initial);
  const [open, setOpen] = useState(false);
  //   const PaymentReceipts = (e) => {
  //     const { name, value } = e.target;
  //     setPostData({ ...postData, [name]: value });
  //     console.log(postData)
  //   };

  const PaymentReceipts = useCallback((e) => {
    const { name, value } = e.target;
    setPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSave = (e) => {
    var cust_name = postData.CustName;
    setPostData({ ...postData, Recd_PV_Date: date });
    axios
      .post(baseURL + "/Payment_Receipts/saveReceipt", postData)
      .then((res) => {
        if (res.data.ReceiptStatus === "fail") {
          alert(
            "Threading Error:Column Unit_Name is constrained  to be Unique value unit_Name is already present"
          );
        } else if (res.data.ReceiptStatus === "query") {
          alert("sql err");
        } else {
          let receipt_id = "";
          if (res.data.result.id) {
            setInsertId(res.data.result.id);
            receipt_id = res.data.result.id;
            setData({ ...data, receipt_id: res.data.result.id });
            setPostData({ ...postData, RecdPVID: res.data.result.id });
          } else {
            receipt_id = res.data.result.insertId;
            setInsertId(res.data.result.insertId);
            setData({ ...data, receipt_id: res.data.result.id });
            setPostData({ ...postData, RecdPVID: res.data.result.insertId });
          }
          openReceipt(postData.Cust_code, receipt_id);
          //openVoucherReceipts(res.data.result.insertId)
        }
      })
      .catch((err) => {
        console.log("eroor in fromntend", err);
      });

    if (data.receipt_details.length > 0) {
      axios
        .put(
          baseURL + "/Payment_Receipts/saveVoucherReceipt/" + data.receipt_id,
          data.receipt_details
        )
        .then((res) => {
          if (res.data.status === "fail") {
            alert(
              "Threading Error:Column Unit_Name is constrained  to be Unique value unit_Name is already present"
            );
          } else if (res.data.status === "query") {
            alert("sql err");
          } else {
            handleDataReturn(res.data.result, "fetch");
          }
        })
        .catch((err) => {
          console.log("eroor in fromntend", err);
        });
    }
    if (flag == true) {
      postDetails();
    }
    e.preventDefault();
  };
  const openReceipt = async (cust_code, receipt_id) => {
    try {
      const response = await axios.get(
        baseURL + `/Payment_Receipts/getinvlist?customercode=${cust_code}`
      ); // Replace this URL with your API endpoint
      setData({
        ...data,
        inv_data: response.data.Result,
        receipt_id: receipt_id,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleDelete = (e) => {
    axios
      .delete(baseURL + "/Payment_Receipts/deleteRecepit/" + postData.RecdPVID)
      .then((res) => {
        if (res.data.Status === "Success") {
        } else {
          alert("error");
        }
      })
      .catch((err) => console.log("select unit"));
  };

  const handlePost = async (e) => {
    setOpen(true);
    setFlag(true);
    //setPostData({...data, receipt_data:postData})
    e.preventDefault();
  };

  const postDetails = async (e) => {
    axios
      .put(baseURL + "/Payment_Receipts/postReceipt/" + insertId, data)
      .then((res) => {
        if (res.data.ReceiptStatus === "fail") {
          alert(
            "Threading Error: Column Unit_Name is constrained to be a unique value; Unit_Name is already present"
          );
        } else if (res.data.ReceiptStatus === "query") {
          alert("SQL error");
          alert(res.data.ReceiptStatus);
        } else {
          alert("Data posted successfully");
          openReceipt(postData.Cust_code, data.receipt_id);
        }
      })
      .catch((err) => {
        console.log("Error in frontend", err);
      });
    handleDataReturn(data.receipt_details, "fetch");
    e.preventDefault();
  };

  const handleYesClick = (e) => {
    setOpen(false); // Close the modal
    handleSave();
    //postDetails()
    e.preventDefault();
  };
  const handlePrint = (e) => {
    printRef.current.handlePrint();
    e.preventDefault();
  };

  const handleDataReturn = async (receipt_details, type) => {
    if (type === "fetch") {
      try {
        const response = await axios.get(
          baseURL + `/Payment_Receipts/getreceipt?receipt_id=${data.receipt_id}`
        ); // Replace this URL with your API endpoint
        setPostData(...response.data.Result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setData({ ...data, receipt_details: receipt_details });
      console.log(receipt_details);
    }
  };
  // useEffect(() => {
  //   // Call the API function when the component mounts
  //   if(Voucherdata){
  //     postData.On_account = postData.amount
  //     Voucherdata.forEach(element => {
  //       if(postData.amount){
  //         postData.On_account -= parseFloat(element.Balance);;
  //       }
  //     });
  //   }
  // }, [Voucherdata]); // Empty dependency array ensures it runs only once, equivalent to componentDidMount
  // if(Voucherdata){
  //   postData.On_account = postData.Amount
  //   Voucherdata.forEach(element => {
  //     if(postData.Amount){
  //       postData.On_account -= parseFloat(element.Balance);;
  //     }
  //   });
  // }
  console.log(data);
  const getReceipts = async (cust_code, postdata) => {
    setPostData(postdata);
    try {
      const resp = await axios.get(
        baseURL + `/Payment_Receipts/getrvdata?receipt_id=${rowData}`
      ); // Replace this URL with your API endpoint
      try {
        const response = await axios.get(
          baseURL + `/Payment_Receipts/getinvlist?customercode=${cust_code}`
        ); // Replace this URL with your API endpoint
        setData({
          ...data,
          inv_data: response.data.Result,
          receipt_details: resp.data.Result,
          receipt_data: postData,
          receipt_id: rowData,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    setData({ ...data, receipt_data: postData });
  }, [postData]);
  useEffect(() => {
    let final_value = postData.Amount;
    data.receipt_details.forEach((element) => {
      final_value -= element.Receive_Now;
      console.log(final_value);
      console.log(element.Receive_Now);
    });
    setPostData({ ...postData, On_account: final_value });
  }, [data.receipt_details]);
  useEffect(() => {
    const fetchData = async () => {
      if (rowData != "") {
        try {
          // Make the API call using the parameter from the row data
          const response = await axios.get(
            baseURL + `/Payment_Receipts/getreceipt?receipt_id=${rowData}`
          );
          // setPostData(response.data.Result[0]);
          getReceipts(
            response.data.Result[0].Cust_code,
            response.data.Result[0]
          );
        } catch (error) {
          console.error("Error making API call:", error);
        }
      }
    };

    fetchData();
  }, [rowData]);

  return (
    <>
      <div className="mt-2">
        <HeadBar
          onCustomerSelect={(
            cust_code,
            customer,
            receipt,
            invoice,
            receipt_details
          ) => {
            if (receipt.length > 0) {
              setPostData({
                ...postData,
                RecdPVID: receipt[0].RecdPVID,
                Recd_PVNo: receipt[0].Recd_PVNo,
                Recd_PV_Date: receipt[0].Recd_PV_Date,
                ReceiptStatus: receipt[0].ReceiptStatus,
                CustName: receipt[0].CustName,
                Cust_code: receipt[0].Cust_code,
                TxnType: receipt[0].TxnType,
                Amount: receipt[0].Amount,
                On_account: receipt[0].On_account,
                Description: receipt[0].Description,
              });
              setData({
                ...data,
                inv_data: invoice,
                receipt_details: receipt_details,
                receipt_id: receipt[0].RecdPVID,
              });
            } else {
              setPostData({
                ...postData,
                RecdPVID: "",
                Recd_PVNo: "Draft",
                Recd_PV_Date: formatDate(new Date()),
                ReceiptStatus: "Draft",
                CustName: customer,
                Cust_code: cust_code,
                TxnType: "",
                Amount: "",
                On_account: "",
                Description: "",
                selectedCustomer: customer,
              });
              setData({
                ...data,
                inv_data: [],
                receipt_details: [],
                receipt_id: "",
              });
            }
            // if (invoice.length > 0) {
            //   console.log(invoice, invoice.length)
            //   setData({...data, inv_data:invoice, receipt_id:receipt[0].RecdPVID})
            // }
            // else{
            //   console.log(invoice, invoice.length)
            //   setData({...data, inv_data:[], receipt_id:""})

            // }
            // if (receipt_details.length > 0) {
            //   console.log(receipt_details, receipt_details.length)
            //   setData({...data, inv_data:invoice,receipt_details:receipt_details, receipt_id:receipt[0].RecdPVID})
            // }
            // else{
            //   console.log(receipt_details, receipt_details.length)
            //   setData({...data, inv_data:[],receipt_details:[], receipt_id:""})

            // }
          }}
        />
        {/* <HeadBar onCustomerSelect={(cust_code, customer, receipt, invoice) => receipt.length>0? setPostData({...postData,RecdPVID:receipt[0].RecdPVID,
            Recd_PVNo:receipt[0].Recd_PVNo,
            Recd_PV_Date: receipt[0].Recd_PV_Date,
            ReceiptStatus: receipt[0].ReceiptStatus,
            CustName:receipt[0].CustName,
            Cust_code:receipt[0].Cust_code,
            TxnType: receipt[0].TxnType,
            Amount: receipt[0].Amount,
            On_account: receipt[0].On_account,
            Description: receipt[0].Description
            }): invoice.length>0? setData({...data, inv_data:invoice, receipt_id:receipt[0].RecdPVID}):setPostData({ ...postData, selectedCustomer: customer, CustName: customer, Cust_code:cust_code})} /> */}

        <form className="row mt-2">
          <div className="col-md-9">
            <div className="d-flex" style={{ gap: "10px" }}>
              <div className="col-md-4">
                <label className="form-label">Vr No</label>
                <input
                  className="in-field"
                  style={{ marginTop: "-10px" }}
                  name="Recd_PVNo"
                  id="Recd_PVNo"
                  disabled
                  value={postData.Recd_PVNo}
                  onChange={PaymentReceipts}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input
                  className="in-field"
                  type="text"
                  style={{ marginTop: "-10px" }}
                  name="Recd_PV_Date"
                  id="date"
                  disabled
                  value={postData.Recd_PV_Date}
                  onChange={PaymentReceipts}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">ReceiptStatus</label>
                <input
                  className="in-field"
                  type="text"
                  style={{ marginTop: "-10px" }}
                  name="ReceiptStatus"
                  id="ReceiptStatus"
                  disabled
                  value={postData.ReceiptStatus}
                  onChange={PaymentReceipts}
                />
              </div>
            </div>
            <div className="row col-md-12 col-sm-12">
              <div className="col-md-7">
                <label className="form-label">Customer Name</label>
                <input
                  className="in-field"
                  type="text"
                  style={{ marginTop: "-10px" }}
                  name="CustName"
                  id="CustName"
                  disabled
                  value={postData.CustName}
                  onChange={PaymentReceipts}
                  placeholder="Select Customer"
                />
              </div>
              <div className="box col-md-6">
                <div className="">
                  <label className="form-label">Transaction Type</label>
                  <select
                    className="ip-select"
                    onChange={PaymentReceipts}
                    name="TxnType"
                    id="TxnType"
                    value={postData.TxnType}
                    disabled={
                      postData.ReceiptStatus != "Draft"
                        ? postData.ReceiptStatus
                        : ""
                    }
                  >
                    <option value="">Select</option>
                    <option value="Bank">Bank</option>
                    <option value="Cash">Cash</option>
                    <option value="Adjustment">Adjustment</option>
                    <option value="Rejection">Rejection</option>
                    <option value="TDS Receivable">TDS Receivable</option>
                    <option value="Rate Difference">Rate Difference</option>
                    <option value="Short Supply">Short Supply</option>
                    <option value="Balance Recoverable">
                      Balance Recoverable
                    </option>
                    <option value="Other Income">Other Income</option>
                    <option value="Balance Not Recoverable">
                      Balance Not Recoverable
                    </option>
                    <option value="QR Code and RTGS">QR Code and RTGS</option>
                  </select>
                </div>

                <div className="">
                  <label className="form-label">Amount</label>
                  <input
                    className="in-field"
                    style={{ marginTop: "-7px" }}
                    onChange={PaymentReceipts}
                    name="Amount"
                    id="amount"
                    value={postData.Amount}
                      autoComplete="off"
                  />
                </div>

                <div className="">
                  <label className="form-label">On Account</label>
                  <input
                    className="in-field"
                    style={{ marginTop: "-7px" }}
                    onChange={PaymentReceipts}
                    name="On_account"
                    id="On_account"
                    disabled
                    value={postData.On_account}
                  />
                </div>
              </div>

              <div className="box col-md-6">
                <div className="mt-1">
                  <label
                    htmlFor="myBox"
                    className="bg-light form-title tab_font mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="Description"
                    id="Description"
                    style={{ height: "140px", resize: "none" }}
                    value={postData.Description}
                    onChange={PaymentReceipts}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="box02 col-md-6" style={{ float: "right" }}>
              <div className="row mt-5">
                <button
                  className="button-style mt-2 group-button"
                  onClick={handleSave}
                  disabled={
                    postData.ReceiptStatus != "Draft"
                      ? postData.ReceiptStatus
                      : ""
                  }
                >
                  Save
                </button>
              </div>

              <div className="row mt-4">
                <button
                  className="button-style mt-2 group-button"
                  style={{ float: "right" }}
                  onClick={handleDelete}
                  disabled={
                    postData.ReceiptStatus != "Draft"
                      ? postData.ReceiptStatus
                      : ""
                  }
                >
                  Delete
                </button>
              </div>

              <div className="row mt-4">
                <button
                  className="button-style mt-2 group-button"
                  style={{ float: "right" }}
                  onClick={handlePost}
                  disabled={
                    postData.ReceiptStatus != "Draft"
                      ? postData.ReceiptStatus
                      : ""
                  }
                >
                  Post
                </button>
              </div>

              <div className="row mt-4">
                <button
                  className="button-style mt-2 group-button"
                  style={{ float: "right" }}
                  onClick={handlePrint}
                >
                  Print
                </button>
                <ReactToPrint
                  trigger={() => (
                    <div style={{ display: "none" }}>
                      <PaymentReceiptVoucherPdf ref={contentRef} data={data} />
                    </div>
                  )}
                  content={() => contentRef.current}
                  ref={printRef} // Attach the reference to the ReactToPrint component
                  documentTitle="Payment Receipt Voucher"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="row col-md-12">
        {/* <div className="table01 col-md-6">
          <RemoveVoucher data={rvdata} />
        </div> */}

        <div className="table02 col-md-12">
          <AddVoucher
            data={data}
            onDataReturn={handleDataReturn}
            getReceipt={rowData}
          />
        </div>
      </div>

      {open && (
        <SaveAlert open={open} setOpen={setOpen} onYesClick={handleYesClick} />
      )}
    </>
  );
}
