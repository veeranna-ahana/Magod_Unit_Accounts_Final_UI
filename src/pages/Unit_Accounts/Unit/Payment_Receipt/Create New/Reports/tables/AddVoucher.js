import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RemoveVoucher from './RemoveVoucher';
import { baseURL } from '../../../../../../../api/baseUrl';



export default function AddVoucher(props) {
  const [rvdata, setRVData] = useState(props.data)
  const [selected, setSelectedItems] = useState(rvdata.receipt_details);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  

  // const handleCheckboxChange = (itemId) => {
  //   if (data.inv_data && Array.isArray(data.inv_data)) { // Check if data is not undefined and is an array
  //     if (selectedItems.includes(itemId)) {
  //       // Item is already selected, so remove it from selectedItems
  //       setSelectedItems((prevSelectedItems) =>
  //         prevSelectedItems.filter((DC_Inv_No) => DC_Inv_No !== itemId)
  //       );
  //     } else {
  //       // Item is not selected, so add it to selectedItems
  //       setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemId]);
  //     }
  //   }
  //   handleSelect()
  // };

  const selectedItems = [];

const handleCheckboxChange = (itemId) => {

  if (rvdata.inv_data && Array.isArray(rvdata.inv_data)) {
    const index = selectedItems.indexOf(itemId);

    if (index !== -1) {
      // Item is already selected, so remove it from selectedItems
      selectedItems.splice(index, 1);
    } else {
      // Item is not selected, so add it to selectedItems
      selectedItems.push(itemId);
    }
  }
  const selectedData = rvdata? rvdata.inv_data.filter((item) => selectedItems.includes(item.DC_Inv_No)): [];
    handleTransformData(selectedData);
  
};
  
  

  // Get the selected data based on selectedItems
  const RecdPvSrl = rvdata.receipt_details.length>0?rvdata.receipt_details[rvdata.receipt_details.length - 1].RecdPvSrl:0;
  const handleTransformData = (selectedData) => {
  const transformedArray = selectedData.map(obj => {
    const invDate = new Date(obj.Inv_Date);
    const year1 = invDate.getFullYear();
    const firstTwoDigits = Math.floor(year1 / 100);
    const year2 =invDate.getFullYear().toString().slice(-2);
    return {
      RecdPvSrl: RecdPvSrl + 1,
      RefNo: `${obj.Inv_No}/${firstTwoDigits}/${year2}`,
      Inv_No: obj.Inv_No,
      Inv_date: obj.Inv_Date,
      Inv_Type: obj.DC_InvType,
      Inv_Amount: obj.GrandTotal,
      Amt_received: obj.PymtAmtRecd,
      Receive_Now: obj.Balance,
      Dc_inv_no: obj.DC_Inv_No,
      Sync_HOId: 0,
      RecdPVID: props.data.receipt_id,
      PVSrlID: "",
      InvUpdated: 0
    };
    // setRVData({...rvdata,
    //   receipt_details: [...data.receipt_details,{
    //   RecdPvSrl: RecdPvSrl += 1,
    //   RefNo: `${obj.Inv_No}/${firstTwoDigits}/${year2}`,
    //   Inv_No:obj.Inv_No,
    //   Inv_date:obj.Inv_Date,
    //    Inv_Type:obj.DC_InvType,
    //    Inv_Amount:obj.GrandTotal,
    //    Amt_received: obj.PymtAmtRecd,
    //   Receive_Now:obj.Balance,
    //   Dc_inv_no:obj.DC_Inv_No,
    //   Sync_HOId:0,
    //   RecdPVID:data.receipt_id,
    //   PVSrlID:"",
    //   InvUpdated:1
    //   }
    //   ]
  //});
})
setSelectedItems(transformedArray)
//updateReceiptDetails(transformedArray);

  }
  // const updateReceiptDetails = (newReceiptDetails) => {
  //   setRVData(prevData => ({
  //     ...prevData,
  //     receipt_details: [...prevData.receipt_details,...newReceiptDetails]
  //   }));
  // };




  // const handleNavigate = () => {
  //   navigate('/UnitAccounts/Unit/CreateNew', { state: { selectedItems: transformedArray?transformedArray:[]} ||''});
  // };

const handleSave = () =>{
  if(parseInt(props.data.receipt_data.Amount) === 0){
    console.log('amount is 0')
  }
  else{
  axios.put(baseURL+'/Payment_Receipts/saveVoucherReceipt/'+props.data.receipt_id,selected)
  .then((res)=>{
    if(res.data.status==='fail'){
      alert('Threading Error:Column Unit_Name is constrained  to be Unique value unit_Name is already present');
    }
    else if(res.data.status==='query'){
      alert('sql err');
    }
    else{
    openVoucherReceipts(rvdata,'fetch' )
      console.log('res in frontend', res.data.result);
    }
  }).catch((err)=>{
    console.log('eroor in fromntend',err);
  })
}
}

const openVoucherReceipts = async (receipt_details, type) => {
  if(type==='fetch'){
  try {
    const response = await axios.get(baseURL+`/Payment_Receipts/getrvdata?receipt_id=${props.data.receipt_id}`); // Replace this URL with your API endpoint
    setRVData({...rvdata, receipt_details:response.data.Result});
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  props.onDataReturn(rvdata.receipt_details,'fetch')
  }
  else{
    console.log(receipt_details)
    setRVData({...rvdata, receipt_details:receipt_details})
    console.log(rvdata)
    props.onDataReturn(receipt_details)
    //handleSave();
  }
};
console.log(rvdata)
//   const handleNavigate = () => {
//     const newState = { selectedItems: transformedArray };
//     navigate('/UnitAccounts/Unit/CreateNew', { state: newState });
//   };
//   const initialState = { selectedItems: [] };
// const storedState = JSON.parse(localStorage.getItem('pageState'));

// if (!storedState || !storedState.selectedItems) {
//   // If no stored state or selectedItems in stored state, set the initial state
//   localStorage.setItem('pageState', JSON.stringify(initialState));
// } else {
//   // If selectedItems exist in stored state, update the state
//   localStorage.setItem('pageState', JSON.stringify({ selectedItems: [] }));
//}
useEffect(() => {
  setRVData(props.data);
  setSelectedItems(props.data.receipt_details)
}, [props.data]);
useEffect(() => {
 props.onDataReturn(rvdata.receipt_details, 'update')
}, [rvdata.receipt_details]);
  return (
    <div className='row'>
      <div className="table01 col-md-6">
          <RemoveVoucher data={rvdata.receipt_details} onReturn={openVoucherReceipts} />
      </div>
      <div className="table01 col-md-6">
      <div className="row mt-2">
        <button
          className="button-style mt-2 group-button"
          style={{ width: "200px", marginLeft: "20px" }}
          onClick={handleSave}>
          Add To Voucher
        </button>
      </div>

      <div className="mt-3">
        <div className="">
          <div style={{ height: "200px", overflowY: "scroll", overflowX: "scroll" }}>
            <Table className="table-data border" style={{ border: '1px solid grey' }}>
              <thead className="tableHeaderBGColor" style={{ textAlign: "center" }}>
                <tr>
                  <th>Select</th>
                  <th>Inv Type</th>
                  <th>Inv No</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Recived</th>
                  <th>Balance</th>
                </tr>
              </thead>

              <tbody className="tablebody">
                {rvdata.inv_data ? rvdata.inv_data.map((rv) => (
                  <tr className="" key={rv.DC_Inv_No}>
                    <td>
                      <input
                        type='checkbox'
                        checked={rvdata.receipt_details.length>0 || selected ?  rvdata.receipt_details.some((item) => item.Dc_inv_no===rv.DC_Inv_No)||selected.some((item)=>item.Dc_inv_no===rv.DC_Inv_No) :''}
                        onChange={() => handleCheckboxChange(rv.DC_Inv_No)}
                      />
                    </td>
                    <td>{rv.DC_InvType}</td>
                    <td>{rv.Inv_No}</td>
                    <td>{rv.Inv_Date}</td>
                    <td>{rv.GrandTotal}</td>
                    <td>{rv.PymtAmtRecd}</td>
                    <td>{rv.Balance}</td>
                  </tr>
                )) : ''}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      </div>
      {/* Display the selected data
      {selectedData.length > 0 && (
        <div>
          <h4>Selected Data:</h4>
          <pre>{JSON.stringify(selectedData, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
}
