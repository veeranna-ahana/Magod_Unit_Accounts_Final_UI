import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../../../../../../api/baseUrl';



export default function RemoveVoucher(props) {
    const [rows, setRows] = useState(props.data);
  const [selectedRows, setSelectedRows] = useState([]);
    // const [selectedItems, setSelectedItems] = useState([]);
    // const [selected, setSelected] = useState([]);
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    
  
    // const handleCheckboxChange = (itemId) => {
    //   if (data && Array.isArray(data)) { // Check if data is not undefined and is an array
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
    // };
    // const SelectRow = (itemId) => {
    //   if (data && Array.isArray(data)) { // Check if data is not undefined and is an array
    //     if (selectedItems.includes(itemId)) {
    //       // Item is already selected, so remove it from selectedItems
    //       setSelected((prevSelectedItems) =>
    //         prevSelectedItems.filter((RecdPvSrl) => RecdPvSrl !== itemId)
    //       );
    //     } else {
    //       // Item is not selected, so add it to selectedItems
    //       setSelected((prevSelectedItems) => [...prevSelectedItems, itemId]);
    //     }
    //   }
    // };
    // const removeSelectedRow = () => {
    //   const filteredData = data.filter(item => !selected.includes(item.RecdPvSrl));
    //   return filteredData
    // };

    const toggleRowSelection = (id) => {
      setSelectedRows(id);
    };

    const handlesaveChange = (id) => {

      const updatedData = rows.map(item => {
        if (item.Inv_No === id) {
          let test = { ...item, InvUpdated: 1};
          return test;
        }
        return item;
      });
      setRows(updatedData);
    };


    const deleteSelectedRows = () => {
      //const updatedRows = data.filter(row => selectedRows.includes(row.PVSrlID));
        axios.delete(baseURL+'/Payment_Receipts/deleteRecepitdetail/'+selectedRows)
          .then((res) => {
            if (res.data.Status === 'Success') {
              alert("deleted successful")
              const filteredData = rows.filter(item => item.PVSrlID!=selectedRows);
              setRows(filteredData)
              props.onReturn(rows, 'fetch')
            } else {
              alert("error");
            }
    
          })
          .catch(err => (console.log("select unit")));
        };

        useEffect(() => {
          // This will run whenever the props.initialData changes
          setRows(props.data);
        }, [props.data]);

        const handleEdit = (id, field, value) => {
          const updatedData = rows.map(item => {
            if (item.Inv_No === id) {
              let test = { ...item, [field]: value };
              return test;
            }
            return item;
          });
          setRows(updatedData);
        }
  

  useEffect(()=>{
    props.onReturn(rows)
  },[rows])
  return (
    <div>
       <div className="row mt-2">
        <button className="button-style mt-2 group-button"
            style={{ width: "200px",marginLeft:"20px" }} onClick={deleteSelectedRows}>
            Remove From Voucher
        </button>
       </div>

      <div className='mt-3'>
            <div className=''>
            <div style={{height:"200px",overflowY: "scroll",overflowX:'scroll'}}>
                <Table className='table-data border' style={{border:'1px solid grey'}}>
                    <thead className='tableHeaderBGColor' style={{textAlign:"center"}}>
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
                    <tbody className='tablebody'>
                    {rows ? rows.map((rv) => (
                  <tr
                  onClick={() => toggleRowSelection(rv.PVSrlID)}>
                    <td>{rv.RecdPvSrl}</td>
                    <td>{rv.Inv_No}</td>
                    <td>{rv.Inv_date}</td>
                    <td>{rv.Inv_Type}</td>
                    <td>{rv.Inv_Amount}</td>
                    <td>{rv.Amt_received}</td>
                    <td><input
                  type="number"
                  value={rv.Receive_Now}
                  onChange={e => handleEdit(rv.Inv_No, 'Receive_Now', parseInt(e.target.value))}
                /></td>
                    <td>{rv.RefNo}</td>
                    <td>
                      <input
                        type='checkbox'
                        checked={rv.InvUpdated===1? rv.InvUpdated :''}
                        onChange={(e) => handlesaveChange(rv.Inv_No)}
                      />
                    </td>

                  </tr>
                )) : ''}
                    </tbody>
                </Table>
        </div>
        </div>
    </div>
</div>
  )
}
