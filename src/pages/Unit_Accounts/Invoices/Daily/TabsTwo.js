import React, { useState } from 'react';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Tabpage2Table from './TabPage2/Tabpage2Table';
import TabPage1Table from './TabPage1/TabPage1Table';

export default function TabsTwo({selectedDate}) {

    const [key, setKey] = useState("TP2");

  return (
    <div>
      <div className='row'>
      <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3 mt-1 tab_font "
    >
      <Tab eventKey="TP2" title="Invoice_Details">
       <Tabpage2Table  selectedDate={selectedDate}/>
      </Tab>

      <Tab eventKey="TP1" title="Payment_Details">
       <TabPage1Table selectedDate={selectedDate}/>
      </Tab>

      

      
    </Tabs>
  </div>
    </div>
  );
}
