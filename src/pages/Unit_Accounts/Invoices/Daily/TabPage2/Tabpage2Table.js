import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { baseURL } from '../../../../../api/baseUrl';



export default function Tabpage2Table({ selectedDate }) {


  const [tabPage2Data, setTabPage2Data] = useState([]);


  const [expandedGroup, setExpandedGroup] = useState(null);

  const handleRowClick = (index) => {
    // setExpandedGroup(index === expandedGroup ? null : index);
    if (expandedGroup === index) {

      setExpandedGroup(null);

    } else {

      setExpandedGroup(index);

    }
  };
  const tabData2 = async () => {

    const response = await axios.get(baseURL + '/billingDetails/getTab2Data', {
      params: {
        date: selectedDate,
      },
    });
    setTabPage2Data(response.data.Result)
    console.log("ressssss", response.data.Result)
  }

  //console.log(data, 'syncpage')

  const groupedData = tabPage2Data.reduce((groups, item) => {
    console.log("grops", item);
    const key = `${item.DC_InvType}`;

    if (!groups[key]) {
      groups[key] = {
        DC_InvType: item.DC_InvType,
        InvTypeCount: item.InvTypeCount,
        totalOnAccount: 0,
        items: [],
      };
    }

    groups[key].items.push(item);
    groups[key].totalOnAccount += parseFloat(item.Net_Total);

    return groups;
  }, {});

  // Convert the groupedData map into an array
  const groupedArray = Object.values(groupedData);


  useEffect(() => {

    tabData2();
    // tabData1();


  }, [selectedDate]);


  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
 
    return formattedAmount;
}

const [selectRow, setSelectRow] = useState("");
const selectedRowFun = (item, index) => {
  let list = { ...item, index: index };
  //  setSelectRow(initial)

  setSelectRow(list);
  // setState(true);
};

  return (
    <div className='col-md-6' style={{ height: '300px', overflowY: 'scroll', overflowX: 'scroll', }}>

      <Table striped className="table-data border">

        <thead className="tableHeaderBGColor">
          <tr>

            <th></th>
            <th>Invoice Type</th>
            <th style={{textAlign:'center'}} >Count</th>
            <th style={{textAlign:'right'}}>Total</th>
          </tr>
        </thead>

        <tbody className='tablebody'>

          {groupedArray.map((group, index) => (
            <React.Fragment key={index}>
              <tr >
                <td onClick={() => handleRowClick(index)} style={{ cursor: 'pointer' }}>{expandedGroup === index ? "-" : "+"}</td>
                <td>{group.DC_InvType}</td>
                <td style={{textAlign:'center'}}>{group.InvTypeCount}</td>
                <td style={{textAlign:'right'}}>{formatAmount(group.totalOnAccount)}</td>

              </tr>
              {expandedGroup === index && (
                <React.Fragment>
                  <tr style={{ backgroundColor: 'AliceBlue' }}>
                    <th></th>
                    <th></th>
                    <th>Invoice No</th>
                    <th style={{textAlign:'right'}}>Invoice Total</th>


                  </tr>
                  {group.items.map((item, key) => (
                    <tr 
                    
                    onClick={() => selectedRowFun(item, key)}

                    className={key === selectRow?.index ? 'selcted-row-clr' : ''}
                    >
                      <td></td>
                      <td></td>
                      <td>{item.Inv_No}</td>
                      <td style={{textAlign:'right'}}>{formatAmount(item.Net_Total)}</td>

                    </tr>

                  ))}

                </React.Fragment>
              )}
            </React.Fragment>
          ))}
        </tbody>

      </Table>


    </div>
  );
}
























