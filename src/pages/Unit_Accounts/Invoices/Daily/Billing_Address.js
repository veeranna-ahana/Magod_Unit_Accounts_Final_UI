import React, { useState } from 'react';

import TabsTwo from './TabsTwo';


import { useNavigate, } from 'react-router-dom';

export default function Billing_Address() {
    
 const [selectedDate, setSelectedDate] = useState('2017-08-09');
    const customDateFormat = "MM-dd-yy";

    const handleChange = (e) => {


        setSelectedDate(e.target.value);
    }

   
const navigate = useNavigate();
    return (
        <div>
            <div className='col-md-12'>
                <div className='row'>
                    <div className='title '><h4> Invoices Information </h4></div>
                </div>
            </div>
            <div className='row  mb-4 '>

                <div className="col-md-4 col-sm-6  row  mt-3"   >

                    <label className="form-label col-md-4  mt-1" style={{ whiteSpace: 'nowrap' }}>Select Date</label>
                    <input className='in-field mt-1 col-md-5' type='date' name='date' 
                     onChange={handleChange}
                        value={selectedDate} 
                        
                    />
                </div >
                <button className="button-style mt-4 group-button" type='button'
                    style={{ width: "70px", marginLeft: '640px' }}
                    onClick={e => navigate("/UnitAccounts")}
                >
                    Close
                </button>

                <div>

                </div>

               

            </div>
            <hr className="horizontal-line" />
            <TabsTwo selectedDate={selectedDate} />
       
        </div>
    );
}


