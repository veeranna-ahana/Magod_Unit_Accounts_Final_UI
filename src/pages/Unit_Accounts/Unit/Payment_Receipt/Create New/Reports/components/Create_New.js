import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../../../../../api/baseUrl";
import { Typeahead } from "react-bootstrap-typeahead";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import ReactToPrint from "react-to-print";
// import PaymentReceiptVoucherPdf from "../../../../../../../PDF/PaymentReceiptVoucher";
import DeleteDraftModal from "../tables/DeleteDraftModal";
import SaveAlert from "../tables/SaveAlert";
import PdfVoucherModal from "../tables/PdfVoucherModal";

function Create_New() {
  const location = useLocation();
  const { rowData, date } = location.state ? location.state : "";

  const newDate = new Date(date).toLocaleDateString("en-GB");
  console.log("dateeeeeeeeeeeeeeeeeeee", rowData, newDate);

  const contentRef = React.useRef();
  const printRef = React.useRef();

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10); // Format as yyyy-mm-dd
    setCurrentDate(formattedDate);
  }, []);
  const formatDatee = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formattedInputDate = date
    ? formatDatee(new Date(date))
    : formatDatee(new Date(currentDate));

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };

  const [open, setOpen] = useState(false);
  const [deleteDraft, setDeleteDraft] = useState(false);

  const [rvData, setRvData] = useState({
    apiData: null,
    flag: false,
    date: new Date(),
    insertId: "",
    firstTableArray: [],
    secondTableArray: [],
    custData: [],
    postData: {
      RecdPVID: "",
      Recd_PVNo: "Draft",
      Recd_PV_Date: new Date().toLocaleDateString("en-GB").split("/").join("-"),
      // Recd_PV_Date: formattedInputDate,

      ReceiptStatus: "Draft",
      CustName: "",
      Cust_code: "",
      TxnType: "",
      Amount: "",
      On_account: "",
      Description: "",
      selectedCustomer: "",
      RecdPvSrl: 0,
      PVSrlID: "",
      InvUpdated: 0,
      Sync_Hold: 0,
    },
    data: {
      inv_data: [],
      receipt_details: [],
      receipt_id: "",
      receipt_data: null,
    },
    open: false,
  });

  const initial = {
    RecdPVID: "",
    Recd_PVNo: "Draft",
    // Recd_PV_Date: new Date().toLocaleDateString("en-GB").split("/").join("-"),
    Recd_PV_Date: formattedInputDate,
    ReceiptStatus: "Draft",
    CustName: "",
    Cust_code: "",
    TxnType: "",
    Amount: "",
    On_account: "",
    Description: "",
    selectedCustomer: "",
  };

  // const [selectedOption, setSelectedOption] = useState([
  //   { Cust_name: "MAGOD LASER MACHINING PVT LTD" },
  // ]);

  const [txnTypes, setTxnTypes] = useState([]);
  useEffect(() => {
    const fetchTxnTypes = async () => {
      try {
        const res = await axios.get(baseURL + "/Payment_Receipts/txntypes/");
        if (res.data && res.data.Result && res.data.Result.length > 0) {
          setTxnTypes(res.data.Result);
        } else {
          console.error("Response data structure is unexpected:", res.data);
        }
      } catch (error) {
        console.error("Error fetching transaction types:", error);
      }
    };

    fetchTxnTypes();
  }, []);

  console.log("txn types ", txnTypes);
  
  const [selectedOption, setSelectedOption] = useState("");

  const PaymentReceipts = useCallback((e) => {
    const { name, value } = e.target;

    setRvData((prevRvData) => ({
      ...prevRvData,
      postData: {
        ...prevRvData.postData,
        [name]: value,
        On_account: name === "Amount" ? value : prevRvData.postData.On_account,
      },
    }));
  }, []);

  const handleSave = async (e) => {


    // -------------------------------------------------------------------

    if (rvData.data.receipt_details.length > 0) {
      const isReceiveNowValid = rvData.data.receipt_details.every((row) => {
        const receiveNow = parseFloat(row.Receive_Now) || 0;
        const amtReceived = parseFloat(row.Amt_received) || 0;
        const invAmount = parseFloat(row.Inv_Amount) || 0;
    
        if (receiveNow < 0) {
          toast.error("Receive Now cannot be negative");
          return false;
        }
    
        if (amtReceived + receiveNow > invAmount) {
          toast.error("Cannot Receive More than Invoice Amount");
          return false;
        } 
    
        return true;
      });
    
      if (!isReceiveNowValid) {
        return; // Stop execution if any validation fails
      }
    }
    

    // ------------------------------------------------------------------
    console.log("postData  ,,,,,,,,,", rvData.postData);
    const isAnyEmptyReceiveNow = rvData.firstTableArray.some(
      (row) => row.Receive_Now === ""
    );

    if (isAnyEmptyReceiveNow) {
      toast.error("Receive Now cannot be empty");
      return;
    }

    if (rvData.postData.CustName === "" || rvData.postData.TxnType === "") {
      toast.error("Customer Name and Transaction type can not be empty");
    } 
    else if(rvData.postData.Amount===''){
      toast.error("Please Enter Amount");
      return;
    }
    
    else {
      try {
        const response = await axios.post(
          baseURL + "/Payment_Receipts/saveReceipt",
          rvData.postData
        );

        console.log("RESPONSE ID", response.data);

        if (response.data.ReceiptStatus === "fail") {
          toast.error(
            "Threading Error: Column Unit_Name is constrained to be Unique value unit_Name is already present"
          );
        } else if (response.data.ReceiptStatus === "query") {
          toast.error("SQL error");
        } else if (response.data.Status === "Success"){
           toast.success("Saved Successfully");
          let receipt_id = "";

          if (response.data.result.id) {
            receipt_id = response.data.result.id;
            setRvData((prevRvData) => ({
              ...prevRvData,
              insertId: response.data.result.id,
              data: { ...prevRvData.data, receipt_id: response.data.result.id },
              postData: {
                ...prevRvData.postData,
                RecdPVID: response.data.result.id,
              },
            }));
          } else {
            receipt_id = response.data.result.insertId;
            setRvData((prevRvData) => ({
              ...prevRvData,
              insertId: response.data.result.insertId,
              data: { ...prevRvData.data, receipt_id: response.data.result.id },
              postData: {
                ...prevRvData.postData,
                RecdPVID: response.data.result.insertId,
              },
            }));
          }

          openReceipt(rvData.postData.Cust_code, receipt_id);
        }
      } catch (err) {
        console.log("Error in frontend", err);
      }

      if (rvData.data.receipt_details.length > 0) {
        const isReceiveNowValid = rvData.data.receipt_details.every((row) => {
          const receiveNow = parseFloat(row.Receive_Now) || 0;
          const amtReceived = parseFloat(row.Amt_received) || 0;
          const invAmount = parseFloat(row.Inv_Amount) || 0;

          if (receiveNow < 0) {
            toast.error("Receive Now cannot be negative");
            return false;
          }

          if (amtReceived + receiveNow > invAmount) {
            toast.error("Cannot Receive More than Invoice Amount");
            return false;
          }

          return true;
        });

        if (!isReceiveNowValid) {
          return;
        }
        try {
          const res = await axios.put(
            baseURL +
              "/Payment_Receipts/saveVoucherReceipt/" +
              rvData.data.receipt_id,
            rvData.data.receipt_details
          );

          if (res.data.status === "fail") {
            toast.error(
              "Threading Error: Column Unit_Name is constrained to be Unique value unit_Name is already present"
            );
          } else if (res.data.status === "query") {
            toast.error("SQL error");
          } else {
            handleDataReturn(res.data.result, "fetch");
          }
        } catch (err) {
          console.log("Error in frontend", err);
        }
      }

      setRvData((prevRvData) => ({
        ...prevRvData,
        secondTableArray: [],
      }));
    }
  };

  const openReceipt = async (cust_code, receipt_id) => {
    try {
      const response = await axios.get(
        baseURL + `/Payment_Receipts/getinvlist?customercode=${cust_code}`
      );

      setRvData((prevRvData) => ({
        ...prevRvData,
        data: {
          ...prevRvData.data,
          inv_data: response.data.Result,
          receipt_id: receipt_id,
        },
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePost = async (e) => {
    const isAnyEmptyReceiveNow = rvData.firstTableArray.some(
      (row) => row.Receive_Now === ""
    );

    if (isAnyEmptyReceiveNow) {
      toast.error("Receive Now cannot be empty");
      return;
    }

    if (rvData.data.receipt_details.length > 0) {
      const isReceiveNowValid = rvData.data.receipt_details.every((row) => {
        const receiveNow = parseFloat(row.Receive_Now) || 0;
        const amtReceived = parseFloat(row.Amt_received) || 0;
        const invAmount = parseFloat(row.Inv_Amount) || 0;

        if (receiveNow < 0) {
          toast.error("Receive Now cannot be negative");
          return false;
        }

        if (amtReceived + receiveNow > invAmount) {
          toast.error("Cannot Receive More than Invoice Amount");
          return false;
        } else {
          setOpen(true);
          getDCNo();
          setRvData((prevRvData) => ({
            ...prevRvData,
            open: true,
            flag: true,
          }));
        }

        return true;
      });
    } else {
      toast.error("Receipt details can not be empty");
    }

    e.preventDefault();
  };

  const getDCNo = async () => {
    const srlType = "PaymentReceipt";
    const ResetPeriod = "FinanceYear";
    const ResetValue = 0;
    const VoucherNoLength = 4;
    const unit = "Jigani";
    try {
      const response = await axios.post(baseURL + `/Payment_Receipts/getDCNo`, {
        unit: unit,
        srlType: srlType,
        ResetPeriod: ResetPeriod,
        ResetValue: ResetValue,
        VoucherNoLength: VoucherNoLength,
      });

      console.log("getDCNo Responseeeeeeeeeeeeee", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const postDetails = async (e) => {
  //   try {
  //     console.log("insert id", rvData.insertId);
  //     const response = await axios.put(
  //       baseURL + "/Payment_Receipts/postReceipt/" + rvData.insertId,
  //       rvData.data
  //     );

  //     if (response.data.ReceiptStatus === "fail") {
  //       toast.error(
  //         "Threading Error: Column Unit_Name is constrained to be a unique value; Unit_Name is already present"
  //       );
  //     } else if (response.data.ReceiptStatus === "query") {
  //       toast.error("SQL error");
  //       toast.error(response.data.ReceiptStatus);
  //     } else {
  //       toast.success("Data posted successfully");
  //       openReceipt(rvData.postData.Cust_code, rvData.data.receipt_id);
  //     }
  //   } catch (err) {
  //     console.error("Error in frontend", err);
  //     toast.error("Error posting data");
  //   }

  //   handleDataReturn(rvData.data.receipt_details, "fetch");
  //   //  e.preventDefault();
  // };

  //post data for runnning no table
  const postDetails = async (e) => {
    const requestBody = {
      srlType: "PaymentReceipt", // Replace srlTypeValue with the actual value you want to send
      unit: "Jigani", // Replace unitValue with the actual value you want to send
      data: rvData.data, // Assuming rvData.data is the main data payload
    };

    try {
      console.log("insert id", rvData.insertId);
      const response = await axios.put(
        baseURL + "/Payment_Receipts/postReceipt/" + rvData.insertId,
        requestBody
      );

      if (response.data.ReceiptStatus === "fail") {
        toast.error(
          "Threading Error: Column Unit_Name is constrained to be a unique value; Unit_Name is already present"
        );
      } else if (response.data.ReceiptStatus === "query") {
        toast.error("SQL error");
        toast.error(response.data.ReceiptStatus);
      } else {
        toast.success("Data posted successfully");
        openReceipt(rvData.postData.Cust_code, rvData.data.receipt_id);
      }
    } catch (err) {
      console.error("Error in frontend", err);
      toast.error("Error posting data");
    }

    handleDataReturn(rvData.data.receipt_details, "fetch");
    //  e.preventDefault();
  };

  const handleYesClick = (e) => {
    setOpen(false);
    setRvData((prevRvData) => ({ ...prevRvData, open: false }));
    postDetails();
  };

  const handlePrint = (e) => {
    e.preventDefault();
    toast.info("Printing...");
    printRef.current.handlePrint();
  };

  const handleDataReturn = async (receipt_details, type) => {
    if (type === "fetch") {
      try {
        const response = await axios.get(
          baseURL +
            `/Payment_Receipts/getreceipt?receipt_id=${rvData.data.receipt_id}`
        );
        setRvData((prevRvData) => ({
          ...prevRvData,
          postData: { ...prevRvData.postData, ...response.data.Result[0] },
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setRvData((prevRvData) => ({
        ...prevRvData,
        data: { ...prevRvData.data, receipt_details: receipt_details },
      }));
    }
  };

  const getReceipts = async (cust_code, postdata) => {
    setRvData((prevRvData) => ({ ...prevRvData, postData: postdata }));

    try {
      //left table data
      const resp = await axios.get(
        baseURL + `/Payment_Receipts/getrvdata?receipt_id=${rowData}`
      );

      try {
        //right table data(open invoices)
        const response = await axios.get(
          baseURL + `/Payment_Receipts/getinvlist?customercode=${cust_code}`
        );

        setRvData((prevRvData) => ({
          ...prevRvData,
          data: {
            ...prevRvData.data,
            inv_data: response.data.Result,
            receipt_details: resp.data.Result,
            receipt_data: prevRvData.postData,
            receipt_id: rowData,
          },
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (rvData.postData) {
      setRvData((prevRvData) => ({
        ...prevRvData,
        data: { ...prevRvData.data, receipt_data: rvData.postData },
      }));
    }
  }, [rvData.postData]);

  console.log("row data from oaccount list ", rowData);

  useEffect(() => {
    const fetchData = async () => {
      if (rowData !== "") {
        try {
          //fetch Form data
          const response = await axios.get(
            baseURL + `/Payment_Receipts/getreceipt?receipt_id=${rowData}`
          );
          console.log("res", response.data.Result[0]);
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

  const handleTypeaheadChange = (selectedOptions) => {
    if (selectedOptions && selectedOptions.length > 0) {
      const selectedCustomer = selectedOptions[0];
      const custName = selectedCustomer.Cust_name;

      setSelectedOption([selectedCustomer]);

      setRvData((prevRvData) => ({
        ...prevRvData,
        postData: {
          ...prevRvData.postData,
          selectedCustomer: selectedCustomer,
          CustName: selectedCustomer.Cust_name,
          Cust_code: selectedCustomer.Cust_Code,
        },
      }));

      getReceipt(
        selectedCustomer.Cust_Code,
        selectedCustomer.Cust_Code,
        selectedCustomer.Cust_name
      );
    } else {
      setSelectedOption([]);
      setRvData((prevRvData) => ({
        ...prevRvData,
        postData: initial,
      }));
    }
  };

  // console.log("left data",rvData.data.receipt_details);
  const getReceipt = async (cust_code, selectedCustCode, selectedValue) => {
    try {
      const [receipt_data, invoice_data] = await Promise.all([
        axios.get(
          baseURL + `/Payment_Receipts/getreceiptdata?customercode=${cust_code}`
        ),
        axios.get(
          baseURL + `/Payment_Receipts/getinvlist?customercode=${cust_code}`
        ),
      ]);

      const updatedPostData = {
        ...rvData.postData, // Copy existing state
        RecdPVID: receipt_data.data.Result[0].RecdPVID,
        Recd_PVNo: receipt_data.data.Result[0].Recd_PVNo,
        Recd_PV_Date: receipt_data.data.Result[0].Recd_PV_Date,
        ReceiptStatus: receipt_data.data.Result[0].ReceiptStatus,
        CustName: receipt_data.data.Result[0].CustName,
        Cust_code: receipt_data.data.Result[0].Cust_code,
        TxnType: receipt_data.data.Result[0].TxnType,
        Amount: receipt_data.data.Result[0].Amount,
        On_account: receipt_data.data.Result[0].On_account,
        Description: receipt_data.data.Result[0].Description,
      };
      

      setRvData((prevRvData) => ({
        ...prevRvData, // Copy the existing state
        postData: updatedPostData, // Update postData with the new values
        data: {
          ...prevRvData.data, // Copy existing data property
          inv_data: invoice_data.data.Result, // Update inv_data with new values
        },
      }));

      if (receipt_data.data.Result.length > 0) {
        const response = await axios.get(
          baseURL +
            `/Payment_Receipts/getrvdata?receipt_id=${receipt_data.data.Result[0].RecdPVID}`
        );

        setRvData((prevRvData) => ({
          ...prevRvData,
          data: {
            ...prevRvData.data,
            receipt_details: response.data.Result,
          },
        }));
      } else {
        // Handle the case when there is no receipt data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const custDetails = async () => {
    try {
      const response = await axios.get(
        baseURL + "/Payment_Receipts/getcustomerdata"
      );
      setRvData((prevRvData) => ({
        ...prevRvData,
        custData: response.data.Result,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    custDetails();
  }, []);

  const [doubleClickSignal, setDoubleClickSignal] = useState(false);

  const handleCheckboxChange = (event, rowData) => {
    const isChecked = event.target.checked;

    setRvData((prevRvData) => {
      const updatedInvData = prevRvData.data.inv_data.map((row) => {
        if (row === rowData) {
          return { ...row, isSelected: isChecked };
        }
        return row;
      });

      const selectedRow = isChecked ? rowData : null;

      return {
        ...prevRvData,
        data: {
          ...prevRvData.data,
          inv_data: updatedInvData,
        },
        secondTableArray: selectedRow
          ? [...prevRvData.secondTableArray, selectedRow]
          : prevRvData.secondTableArray.filter(
              (item) => item.DC_Inv_No !== rowData.DC_Inv_No
            ),
      };
    });
  };

  useEffect(() => {
    // Check if the doubleClickSignal is true after state has been updated
    if (doubleClickSignal) {
      addToVoucher();

      // Reset the doubleClickSignal
      setDoubleClickSignal(false);
    }
  }, [doubleClickSignal]);

  const handleRowSelect = (data) => {
    console.log("hiiiiiiiiiiiiiiiiiiiiiii", data);
    const selectedRow = rvData.firstTableArray.find(
      (row) => row.PVSrlID === data.PVSrlID
    );
    console.log("sel row", selectedRow);

    setRvData({
      ...rvData,
      firstTableArray: selectedRow ? [] : [data],
    });
  };

  //  const handleRowSelect = (data) => {
  //   console.log("hiiiiiiiiiiiiiiiiiiiiiii", data);
  //   const selectedRow = rvData.firstTableArray.find(
  //     (row) => row.PVSrlID === data.PVSrlID
  //   );
  //   console.log("sel row", selectedRow);

  //   const updatedFirstTableArray = selectedRow ? [] : [data];
  // const updatedRvData = {
  //   ...rvData,
  //   firstTableArray: updatedFirstTableArray,
  // };

  // setRvData(updatedRvData); // Update the state asynchronously
  // console.log("update ",updatedRvData.firstTableArray);

  // return updatedRvData.firstTableArray;

  // };

  console.log("post data onaccount", rvData.postData.On_account);

  console.log("RECEIPT DETAILS", rvData.data.receipt_details);

  const handleInputChange = async (e, invNo, data) => {
    //handleRowSelect(data);
    try {
      const { name, value } = e.target;

      // Find the current receipt detail for the specified Inv_No
      const currentReceiptDetail = rvData.data.receipt_details.find(
        (row) => row.Inv_No === invNo
      );

      // Calculate the difference between the new and old Receive_Now values
      const receiveNowDifference =
        parseFloat(value) - parseFloat(currentReceiptDetail.Receive_Now || 0);

      const updatedReceiptDetails = rvData.data.receipt_details.map((row) =>
        row.Inv_No === invNo ? { ...row, [name]: value } : row
      );

      const updatedTotalReceiveNow = updatedReceiptDetails.reduce(
        (total, row) => total + parseFloat(row.Receive_Now || 0),
        0
      );

      const newOnAccount =
        parseFloat(rvData.postData.Amount) - updatedTotalReceiveNow;

      console.log("NEWONACCOUNT", newOnAccount);

      // Check if the difference between the new and old Receive_Now values exceeds newOnAccount
      if (newOnAccount >= 0) {
        // Update On_account using the updateOnAccount API
        const updateOnAccountResponse = await axios.post(
          baseURL + "/Payment_Receipts/updateOnAccount",
          {
            onAccountValue: newOnAccount,
            RecdPVID: rvData.postData.RecdPVID,
          }
        );

        // Check if the updated On_account would be negative
        if (updateOnAccountResponse.data.updatedOnAccount[0]?.On_account >= 0) {
          // Update On_account in rvData.postData with the result from the updateOnAccount API
          setRvData((prevRvData) => ({
            ...prevRvData,
            data: {
              ...prevRvData.data,
              receipt_details: updatedReceiptDetails,
            },
            postData: {
              ...prevRvData.postData,
              On_account:
                updateOnAccountResponse.data.updatedOnAccount[0]?.On_account,
            },
          }));
        }

        rvData.firstTableArray = [];
      } else {
        toast.error("Cannot Receive more than Invoice Amount");
      }
    } catch (error) {
      console.error("Error in handleInputChange:", error);
      // Handle error if needed
    }
  };

  const addToVoucher = async () => {
    const isAnyEmptyReceiveNow = rvData.firstTableArray.some(
      (row) => row.Receive_Now === ""
    );

    if (isAnyEmptyReceiveNow) {
      toast.error("Receive Now cannot be empty");
      return;
    }

    try {
      const selectedRows = rvData.secondTableArray;
      const RecdPVID = rvData.postData.RecdPVID;
      console.log(
        "first table arry",
        rvData.firstTableArray,
        rvData.data.receipt_details
      );

      if (selectedRows.length === 0) {
        toast.error("No rows selected for addition to voucher.");
        return;
      }

      // Extract On Account value from rvData.postData
      let onAccountValue = parseFloat(rvData.postData.On_account) || 0;

      if (onAccountValue <= 0) {
        toast.error("On Account is already exhausted. Cannot add more rows.");
        return;
      }

      console.log("selected rows", selectedRows);

      const rowsToAdd = [];

      for (const row of selectedRows) {
        const balance = parseFloat(row.Balance);

        // Check if the row is not already in receipt_details
        const isRowAlreadyAdded = rvData.data.receipt_details.some(
          (existingRow) => existingRow.Dc_inv_no === row.DC_Inv_No
        );

        // Only add rows if there's enough On_account balance and the row is not already added
        if (!isRowAlreadyAdded) {
          if (balance <= onAccountValue) {
            rowsToAdd.push(row);
            onAccountValue -= balance;
          } else {
            rowsToAdd.push({ ...row, Balance: onAccountValue });
            onAccountValue = 0;
            break; // Stop adding rows if the On_account becomes 0
          }
        }
      }

      if (rowsToAdd.length === 0) {
        toast.error("Row already exists");
        return;
      }

      // Continue with the existing API call
      const response = await axios.post(
        baseURL + "/Payment_Receipts/addToVoucher",
        {
          selectedRows: rowsToAdd,
          RecdPVID,
        }
      );

      console.log("After API call: onAccountValue =", onAccountValue);

      // Filter out rows that already exist in receipt_details
      const newRows = response.data.filter(
        (newRow) =>
          !rvData.data.receipt_details.some(
            (existingRow) => existingRow.PVSrlID === newRow.PVSrlID
          )
      );

      // Update receipt_details and other data after addToVoucher API call
      setRvData((prevRvData) => ({
        ...prevRvData,
        data: {
          ...prevRvData.data,
          receipt_details: [...prevRvData.data.receipt_details, ...newRows],
          inv_data: prevRvData.data.inv_data.map((row) => ({
            ...row,
            isSelected: false,
          })),
        },

        secondTableArray: [],
      }));

      console.log("ONACCOUNTVALUE", onAccountValue);

      // Make API call to update On_account on the backend
      const updateOnAccountResponse = await axios.post(
        baseURL + "/Payment_Receipts/updateOnAccount",
        {
          onAccountValue: onAccountValue,
          RecdPVID: RecdPVID,
        }
      );

      setRvData((prevRvData) => ({
        ...prevRvData,
        postData: {
          ...prevRvData.postData,
          On_account:
            updateOnAccountResponse.data.updatedOnAccount[0]?.On_account,
        },
      }));
      return response.data;
    } catch (error) {
      console.error("Error adding rows to voucher:", error);
      throw error;
    }
  };

  const removeVoucher = async () => {
    try {
      const isAnyEmptyReceiveNow = rvData.firstTableArray.some(
        (row) => row.Receive_Now === ""
      );

      if (isAnyEmptyReceiveNow) {
        toast.error("Receive Now cannot be empty");
        return;
      }

      if (rvData.firstTableArray.length === 0) {
        toast.error("No rows selected for removal of voucher.");
        return;
      }

      const selectedRow = rvData.firstTableArray[0];

      if (parseFloat(selectedRow.Receive_Now) < 0) {
        toast.error("Receive Now cannot be negative");
        return;
      }

      if (
        parseFloat(selectedRow.Receive_Now) +
          parseFloat(selectedRow.Amt_received) >
        parseFloat(selectedRow.Inv_Amount)
      ) {
        toast.error("Cannot Receive More than Invoice Amount");
        return;
      }

      const PVSrlID = selectedRow.PVSrlID;
      const receiveNowValue = parseFloat(selectedRow.Receive_Now || 0);

      console.log("PVSrlID", PVSrlID);

      const response = await axios.post(
        baseURL + "/Payment_Receipts/removeVoucher",
        {
          PVSrlID: PVSrlID,
          RecdPVID: rvData.postData.RecdPVID,
        }
      );

      // Convert On_account to a number, round it to 2 decimal places, then parse it back to a number
      const roundedOnAccount = parseFloat(
        parseFloat(rvData.postData.On_account).toFixed(2)
      );

      // Update receipt_details and On_account after removing voucher
      setRvData((prevRvData) => ({
        ...prevRvData,
        data: {
          ...prevRvData.data,
          receipt_details: response.data,
        },
        postData: {
          ...prevRvData.postData,
          On_account: roundedOnAccount + receiveNowValue,
        },
        firstTableArray: [], // Clear firstTableArray after removal
      }));

      // Make API call to update On_account on the backend
      const updateOnAccountResponse = await axios.post(
        baseURL + "/Payment_Receipts/updateOnAccount",
        {
          onAccountValue: roundedOnAccount + receiveNowValue,
          RecdPVID: rvData.postData.RecdPVID,
        }
      );
      toast.success("Deleted Successfully");

      // Update On_account in rvData.postData with the result from the updateOnAccount API
      setRvData((prevRvData) => ({
        ...prevRvData,
        postData: {
          ...prevRvData.postData,
          On_account:
            updateOnAccountResponse.data.updatedOnAccount[0]?.On_account,
        },
      }));
    } catch (error) {
      console.error("Error removing voucher:", error);
    }
  };

  const onBlurr = async () => {
    const res = axios.put(
      baseURL +
        "/Payment_Receipts/saveVoucherReceipt/" +
        rvData.data.receipt_id,
      rvData.data.receipt_details
    );

    console.log("rvData.data.receipt_details", rvData.data.receipt_details);
    if (rvData.data.receipt_details.length > 0) {
      const isReceiveNowValid = rvData.data.receipt_details.every((row) => {
        const receiveNow = parseFloat(row.Receive_Now) || 0;
        const amtReceived = parseFloat(row.Amt_received) || 0;
        const invAmount = parseFloat(row.Inv_Amount) || 0;

        if (receiveNow === "") {
          toast.error("Receive_Now can not be empty");
          return false;
        } else if (receiveNow <= 0) {
          toast.error("Enter Valid  Amount");
          return false;
        } else if (amtReceived + receiveNow > invAmount) {
          toast.error("Cannot Receive More than Invoice Amount");
          return false;
        } else {
          setRvData((prevRvData) => {
            // Calculate and update On_account here

            const newOnAccount = prevRvData.data.receipt_details.reduce(
              (total, row) => total + parseFloat(row.Receive_Now || 0),
              0
            );
            //console.log("total", total);
            console.log("save new onaccount", newOnAccount);

            console.log("ACCCOUNT", rvData.postData.Amount);

            const TA = parseFloat(rvData.postData.Amount);

            const finalOnAccount = TA - newOnAccount;

            return {
              ...prevRvData,
              postData: {
                ...prevRvData.postData,
                On_account: finalOnAccount,
              },
            };
          });
        }

        return true;
      });
    }
  };

  useEffect(() => {
    const saveData = async () => {
      if (rvData.postData.RecdPVID) {
        const isReceiveNowValid = rvData.data.receipt_details.every((row) => {
          const receiveNow = parseFloat(row.Receive_Now) || 0;
          const amtReceived = parseFloat(row.Amt_received) || 0;
          const invAmount = parseFloat(row.Inv_Amount) || 0;

          return true;
        });

        if (!isReceiveNowValid) {
          // Handle invalid data condition
          return;
        }

        try {
          const res = await axios.put(
            baseURL +
              "/Payment_Receipts/saveVoucherReceipt/" +
              rvData.postData.RecdPVID,
            rvData.data.receipt_details
          );

          console.log("PUT request successful:", res.data);
        } catch (error) {
          console.error("Error in handleSave:", error);
        }
      }
    };

    saveData();
  }, [rvData.data.receipt_details, rvData.data.receipt_id]);

  const deleteSubmit = (e) => {
    setDeleteDraft(false);
    deleteDrftSubmit();

    e.preventDefault();
  };

  const handleDelete = (e) => {
    const isAnyEmptyReceiveNow = rvData.firstTableArray.some(
      (row) => row.Receive_Now === ""
    );

    if (isAnyEmptyReceiveNow) {
      toast.error("Receive Now cannot be empty");
      return;
    }

    // setDeleteDraft(true);
    // e.preventDefault();
    if (rvData.data.receipt_details.length > 0) {
      const isReceiveNowValid = rvData.data.receipt_details.every((row) => {
        const receiveNow = parseFloat(row.Receive_Now) || 0;
        const amtReceived = parseFloat(row.Amt_received) || 0;
        const invAmount = parseFloat(row.Inv_Amount) || 0;

        if (receiveNow < 0) {
          toast.error("Receive Now cannot be negative");
          return false;
        }

        if (amtReceived + receiveNow > invAmount) {
          toast.error("Cannot Receive More than Invoice Amount");
          return false;
        } else {
          setDeleteDraft(true);
          e.preventDefault();
        }

        return true;
      });
    } else {
      if (rvData.postData.CustName === "" || rvData.postData.TxnType === "") {
        toast.error("Customer Name and Transaction type can not be empty");
      } else {
        setDeleteDraft(true);
        e.preventDefault();
      }
    }

    e.preventDefault();
  };

  const deleteDrftSubmit = () => {
    axios
      .delete(
        baseURL + "/Payment_Receipts/deleteRecepit/" + rvData.postData.RecdPVID
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          setRvData((prevData) => ({
            ...prevData,

            data: {
              receipt_details: [],
              receipt_id: "",
              receipt_data: null,
            },

            postData: {
              RecdPVID: "",
              Recd_PVNo: "Draft",
              Recd_PV_Date: formatDate(new Date()),
              ReceiptStatus: "Draft",
              CustName: "",
              Cust_code: "",
              TxnType: "",
              Amount: "",
              On_account: "",
              Description: "",
              selectedCustomer: "",
              RecdPvSrl: 0,
              PVSrlID: "",
              InvUpdated: 0,
              Sync_Hold: 0,
            },
          }));

          toast.success("Deleted Successfully");
          window.location.reload();
        } else {
          alert("error");
        }
      })
      .catch((err) => console.log("select unit"));
  };

  const [pdfVoucher, setPdfVoucher] = useState(false);

  const pdfSubmit = (e) => {
    if (rvData.data.receipt_details.length === 0) {
      setPdfVoucher(true);
    }
    const isAnyEmptyReceiveNow = rvData.firstTableArray.some(
      (row) => row.Receive_Now === ""
    );

    if (isAnyEmptyReceiveNow) {
      toast.error("Receive Now cannot be empty");
      return;
    }

    if (rvData.data.receipt_details.length > 0) {
      const isReceiveNowValid = rvData.data.receipt_details.every((row) => {
        const receiveNow = parseFloat(row.Receive_Now) || 0;
        const amtReceived = parseFloat(row.Amt_received) || 0;
        const invAmount = parseFloat(row.Inv_Amount) || 0;

        if (receiveNow < 0) {
          toast.error("Receive Now cannot be negative");
          return false;
        }

        if (amtReceived + receiveNow > invAmount) {
          toast.error("Cannot Receive More than Invoice Amount");
          return false;
        } else {
          setPdfVoucher(true);
          e.preventDefault();
        }

        return true;
      });
    }
  };

  const nav = useNavigate();

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  console.log("out nooo", selectedOption);

  return (
    <>
      {pdfVoucher && (
        <PdfVoucherModal
          setPdfVoucher={setPdfVoucher}
          pdfVoucher={pdfVoucher}
          data={rvData.data}
        />
      )}

      <div className="row">
        <h4 className="title">Unit Payment Receipt </h4>
      </div>

      <div className="row mt-1">
        <div className="d-flex col-md-4" style={{ gap: "15px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Select Customer
          </label>

          <Typeahead
            className="ip-select"
            style={{ marginTop: "-9px" }}
            id="basic-example"
            valueKey="Cust_Code"
            options={rvData.custData}
            placeholder="Select Customer"
            labelKey={(option) =>
              option && option.Cust_name ? option.Cust_name.toString() : ""
            }
            onChange={handleTypeaheadChange}
            disabled={rvData.postData.ReceiptStatus !== "Draft" || rowData}
          />
        </div>

        <div className="d-flex col-md-3 mt-1" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Vr No
          </label>
          <input
            className="in-field"
            name="Recd_PVNo"
            id="Recd_PVNo"
            disabled
            value={rvData.postData.Recd_PVNo}
            onChange={PaymentReceipts}
          />
        </div>

        <div className="d-flex col-md-3 mt-1" style={{ gap: "10px" }}>
          <label className="form-label">Date</label>
          <input
            className="in-field"
            type="text"
            name="Recd_PV_Date"
            value={formattedInputDate}
            id="date"
            disabled
            onChange={PaymentReceipts}
          />
        </div>
        <div className="col-md-2">
          <button
            className="button-style group-button "
            style={{ float: "right" }}
            onClick={(e) => nav("/UnitAccounts")}
          >
            Close
          </button>
        </div>
      </div>

      <div className="row mt-1">
        <div className="d-flex col-md-3" style={{ gap: "30px" }}>
          <label className="form-label">ReceiptStatus</label>
          <input
            className="in-field mt-1"
            type="text"
            name="ReceiptStatus"
            id="ReceiptStatus"
            value={rvData.postData.ReceiptStatus}
            disabled
            onChange={PaymentReceipts}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Customer Name
          </label>
          <input
            className="in-field mt-1"
            type="text"
            name="CustName"
            id="CustName"
            disabled
            value={rvData.postData.CustName}
            placeholder="Select Customer"
            onChange={PaymentReceipts}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label">Amount</label>
          <input
            className="in-field mt-1"
            name="Amount"
            id="amount"
            value={rvData.postData.Amount}
            onChange={PaymentReceipts}
            disabled={
              rvData && rvData.postData.ReceiptStatus !== "Draft"
                ? rvData.postData.ReceiptStatus
                : "" || rvData.data.receipt_details.length !== 0
            }
            onKeyPress={(e) => {
              // Allow only numbers (0-9) and backspace
              const isNumber = /^[0-9\b]+$/;
              if (!isNumber.test(e.key)) {
                e.preventDefault();
              }
            }}
            autoComplete="off"
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            On Account
          </label>
          <input
            className="in-field mt-1"
            name="On_account"
            id="On_account"
            disabled
            onChange={PaymentReceipts}
            value={rvData.postData.On_account}
          />
        </div>
      </div>

      <div className="row mt-2">
        {/* <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Transaction Type
          </label>
          <select
            className="ip-select"
            name="TxnType"
            id="TxnType"
            onChange={PaymentReceipts}
            value={rvData.postData.TxnType}
            disabled={
              rvData && rvData.postData.ReceiptStatus !== "Draft"
                ? rvData.postData.ReceiptStatus
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
            <option value="Balance Recoverable">Balance Recoverable</option>
            <option value="Other Income">Other Income</option>
            <option value="Balance Not Recoverable">
              Balance Not Recoverable
            </option>
            <option value="QR Code and RTGS">QR Code and RTGS</option>
          </select>
        </div> */}

<div className="d-flex col-md-3" style={{ gap: "10px" }}>
  <label className="form-label" style={{ whiteSpace: "nowrap" }}>
    Transaction Type
  </label>
  <select
    className="ip-select"
    name="TxnType"
    id="TxnType"
    onChange={PaymentReceipts}
    value={rvData.postData.TxnType}
    disabled={
      rvData && rvData.postData.ReceiptStatus !== "Draft"
        ? rvData.postData.ReceiptStatus
        : ""
    }
  >
    <option value="">Select</option>
    {txnTypes.length > 0 ? (
      txnTypes.map((txn, index) => (
        <option key={index} value={txn.TxnType}>
        {txn.TxnType}
      </option>
      ))
    ) : (
      <option value="">No transaction types available</option>
    )}
  </select>
</div>
        

        <div className="d-flex mt-1 col-md-3" style={{ gap: "35px" }}>
          <label className="form-label"> Description </label>
          <textarea
            className="in-field"
            rows="2"
            name="Description"
            id="Description"
            style={{ height: "70px", resize: "none", width: "200px" }}
            onChange={PaymentReceipts}
            value={rvData.postData.Description}
            disabled={
              rvData.postData.ReceiptStatus != "Draft"
                ? rvData.postData.ReceiptStatus
                : ""
            }
          ></textarea>
        </div>

        <div className="col-md-6">
          <button
            className={
              rvData.postData.ReceiptStatus != "Draft"
                ? "disabled-button"
                : "button-style  group-button"
            }
            onClick={handleSave}
            disabled={
              rvData.postData.ReceiptStatus != "Draft"
                ? rvData.postData.ReceiptStatus
                : ""
            }
            style={{ marginLeft: "55px" }}
          >
            Save
          </button>

          <button
            className={
              rvData.postData.ReceiptStatus != "Draft"
                ? "disabled-button"
                : "button-style  group-button"
            }
            onClick={handleDelete}
            disabled={
              rvData.postData.ReceiptStatus != "Draft"
                ? rvData.postData.ReceiptStatus
                : ""
            }
          >
            Delete
          </button>
          <button
            className={
              rvData.postData.ReceiptStatus != "Draft"
                ? "disabled-button"
                : "button-style  group-button"
            }
            onClick={handlePost}
            disabled={
              rvData.postData.ReceiptStatus != "Draft"
                ? rvData.postData.ReceiptStatus
                : ""
            }
          >
            Post
          </button>

          <button
            className="button-style mt-2 group-button"
            onClick={pdfSubmit}
          >
            Print
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="row mt-2">
            <button
              className={
                rvData.postData.ReceiptStatus != "Draft"
                  ? "disabled-button"
                  : "button-style  group-button"
              }
              style={{ width: "150px", marginLeft: "2px" }}
              onClick={removeVoucher}
              disabled={
                rvData.postData.ReceiptStatus != "Draft"
                  ? rvData.postData.ReceiptStatus
                  : ""
              }
            >
              Remove From Voucher
            </button>
          </div>
          <div
            style={{
              height: "220px",
              overflowY: "scroll",
              overflowX: "scroll",
            }}
            className="mt-3"
          >
            <Table
              className="table-data border"
              style={{ border: "1px solid grey" }}
            >
              <thead
                className="tableHeaderBGColor"
                style={{ textAlign: "center" }}
              >
                <tr>
                  <th>srl</th>
                  <th>InvNo</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Received</th>
                  <th>ReceiveNow</th>
                  <th>RefNo</th>
                  <th>InvUpdated</th>
                </tr>
              </thead>
              <tbody className="tablebody">
                {rvData.data.receipt_details
                  ? rvData.data.receipt_details.map((data, index) => (
                      <>
                        <tr
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() => handleRowSelect(data)}
                          key={data.PVSrlID}
                          className={
                            rvData.firstTableArray.some(
                              (row) => row.Dc_inv_no === data.Dc_inv_no
                            )
                              ? "selectedRow"
                              : ""
                          }
                        >
                          {/* <td>{data.RecdPvSrl}</td> */}
                          <td>{index + 1}</td>

                          <td>{data.Inv_No}</td>

                          <td>
                            {new Date(data.Inv_date)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")}
                          </td>

                          <td>{data.Inv_Type}</td>
                          <td>{formatAmount(data.Inv_Amount)}</td>
                          <td>{formatAmount(data.Amt_received)}</td>
                          <td>
                            <input
                              //type="number"
                              // onBlur={onBlurr}
                              name="Receive_Now"
                              value={data.Receive_Now}
                              onChange={(e) =>
                                handleInputChange(e, data.Inv_No, data)
                              }
                              disabled={
                                rvData &&
                                rvData.postData.ReceiptStatus !== "Draft"
                                  ? rvData.postData.ReceiptStatus
                                  : ""
                              }
                              onKeyPress={(e) => {
                                // Allow only numbers (0-9) and backspace
                                const isNumber = /^[0-9\b]+$/;
                                if (!isNumber.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </td>
                          <td>{data.RefNo}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={
                                rvData.postData.InvUpdated === 1
                                  ? rvData.postData.InvUpdated
                                  : ""
                              }
                              // onChange={(e) => handlesaveChange(rv.Inv_No)}
                            />
                          </td>
                        </tr>
                      </>
                    ))
                  : ""}
              </tbody>
            </Table>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row mt-2">
            <button
              className={
                rvData.postData.ReceiptStatus != "Draft"
                  ? "disabled-button"
                  : "button-style  group-button"
              }
              style={{ width: "150px", marginLeft: "0px" }}
              onClick={addToVoucher}
              disabled={
                rvData.postData.ReceiptStatus != "Draft"
                  ? rvData.postData.ReceiptStatus
                  : ""
              }
            >
              Add To Voucher
            </button>
          </div>

          <div className="mt-3">
            <div
              style={{
                height: "220px",
                overflowY: "scroll",
                overflowX: "scroll",
              }}
            >
              <Table
                className="table-data border"
                style={{ border: "1px solid grey" }}
              >
                <thead
                  className="tableHeaderBGColor"
                  style={{ textAlign: "center" }}
                >
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>Select</th>
                    <th style={{ whiteSpace: "nowrap" }}>Inv Type</th>
                    <th style={{ whiteSpace: "nowrap" }}>Inv No</th>
                    <th style={{ whiteSpace: "nowrap" }}>Date</th>
                    <th style={{ whiteSpace: "nowrap" }}>Amount</th>
                    <th style={{ whiteSpace: "nowrap" }}>Received</th>
                    <th style={{ whiteSpace: "nowrap" }}>Balance</th>
                  </tr>
                </thead>

                <tbody className="tablebody">
                  {rvData.data.inv_data?.map((row, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: row.isSelected ? "#3498db" : "inherit",
                        whiteSpace: "nowrap",
                        textAlign:'center'
                      }}
                      // onDoubleClick={addToVoucher}
                      onDoubleClick={() => {
                        // Set the doubleClickSignal to true when a double click occurs
                        setDoubleClickSignal(true);

                        // Call handleCheckboxChange
                        handleCheckboxChange(
                          { target: { checked: !row.isSelected } },
                          row
                        );
                      }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          className="mt-1"
                          id={`checkbox_${index}`}
                          checked={row.isSelected}
                          onChange={(e) => handleCheckboxChange(e, row)}
                        />
                      </td>
                      <td>{row.DC_InvType}</td>
                      <td>{row.Inv_No}</td>
                      <td>
                        {new Date(row.Inv_Date)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                      </td>
                      <td>{row.GrandTotal}</td>
                      <td>{row.PymtAmtRecd}</td>
                      <td>{row.Balance}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {deleteDraft && (
        <DeleteDraftModal
          deleteDraft={deleteDraft}
          setDeleteDraft={setDeleteDraft}
          deleteSubmit={deleteSubmit}
        />
      )}

      {open && (
        <SaveAlert open={open} setOpen={setOpen} onYesClick={handleYesClick} />
      )}
    </>
  );
}

export default Create_New;