import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../../../../../../api/baseUrl';



export default function HeadBar({ onCustomerSelect }) {
  const nav = useNavigate();
  const [custdata, setcustData] = useState();
  const [receiptdetail, setReceiptDetail] = useState([])

  const handleCustomerSelect = (e) => {
    console.log(e.target)
    const selectedCustomer = e.target.value;
    const selectedValue = e.target.options[e.target.selectedIndex].text;
    getReceipt(e.target.value,selectedCustomer, selectedValue )
    console.log(selectedCustomer, selectedValue)
  };

  const getReceipt = async (cust_code, selectedCustomer, selectedValue) => {
    try {
      const [receipt_data, invoice_data] = await Promise.all([
        fetch(baseURL+`/Payment_Receipts/getreceiptdata?customercode=${cust_code}`).then(response => response.json()),
        fetch(baseURL+`/Payment_Receipts/getinvlist?customercode=${cust_code}`).then(response => response.json())
      ]);
        console.log(receipt_data, receipt_data.Result, receipt_data.Result.length,invoice_data, 'jhhjhkkh')
        if(receipt_data.Result.length>0){
        const response = await axios.get(baseURL+`/Payment_Receipts/getrvdata?receipt_id=${receipt_data.Result[0].RecdPVID}`); // Replace this URL with your API endpoint
        console.log(response.data.Result, 'response')
        setReceiptDetail(response.data.Result)
        onCustomerSelect(selectedCustomer, selectedValue, receipt_data.Result,invoice_data.Result, response.data.Result );
        }
        else{
          console.log(receiptdetail, 'receiptdetail')
      //const response = await axios.get(`http://localhost:3001/getreceiptdata?customercode=${cust_code}`); // Replace this URL with your API endpoint
        onCustomerSelect(selectedCustomer, selectedValue, receipt_data.Result,invoice_data.Result, receiptdetail );
        }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const custDetails = async () => {
    try {
      const response = await axios.get(baseURL+'/Payment_Receipts/getcustomerdata'); // Replace this URL with your API endpoint
      setcustData(response.data.Result);
      console.log(response.data.Result)
      let optionItems = response.data.Result.map((item) =>
            <option value={item.Cust_Code}>{item.Cust_name}</option>
        );
      setcustData(optionItems)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    // Call the API function when the component mounts
    custDetails();
  }, []); // Empty dependency array ensures it runs only once, equivalent to componentDidMount
    
  return (
    <>
      <div className='row mt-1 col-md-12'>
        <label className="form-label">Unit Payment Receipt</label>
        <div className="col-md-5 mt-2">
          <label className="form-label">Select Customer</label>
          <select className="ip-select" onChange={handleCustomerSelect}>
            {/* <option value="option 1"> Name1</option>
            <option value="option 2">Name2</option>
            <option value="option 3">Name3</option> */}
            {custdata}
          </select>
        </div>
        <div className='col-md-6'>
          <button className="button-style group-button col-md-1" style={{float:'right', width:95}} onClick={e => nav('/home')}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
