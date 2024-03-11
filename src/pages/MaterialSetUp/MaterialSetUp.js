import React, { useEffect, useState } from "react";
import { Tab, Table, Tabs } from "react-bootstrap";
import MaterialGradeCreator from "./MaterialGradeCreator";
import MaterialCodeCreator from "./MaterialCodeCreator";
import Axios from "axios";

export default function MaterialSetUp() {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    Axios
      .get("http://localhost:4001/getCustData")

      .then((res) => {
        if (res.data.status === "success") {
          setCategory(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
 
  const [mtrlData, setMtrlData]=useState({});
  const [selectRow, setSelectRow] = useState({});
 
  const selectedRowFun = (item, index) => {
    console.log("item", item.Material)
    console.log("index", index)
    Axios.post("http://localhost:4001/getData",  {material: item.Material})
      .then((res) => {
        console.log("wertyu", res.data)
        setMtrlData(res.data)  
      }
      )
    .catch((err) => {
      console.log("eroor in fromntend", err);
    });
  };
  

 
  return (
    <div>
      
      <div className="col-md-12">
        <h4 className="title">Material Grade Creator</h4>
      </div>
      <div className="row mt-4">
        <div className="col-md-5 col-sm-12">
          <div style={{ overflowX: "scroll", overflowY: "scroll" }}>
            <Table
              striped
              className="table-data border"
              style={{ border: "1px" }}
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>Material</th>
                  <th style={{ whiteSpace: "nowrap" }}>Short Name</th>
                  <th style={{ whiteSpace: "nowrap" }}>Excise Class</th>
                  <th style={{ whiteSpace: "nowrap" }}>Specific Weight</th>
                </tr>
              </thead>
              <tbody className="tablebody">
                {category.map((cat, key) => (
                  <tr
                    onClick={() => selectedRowFun(cat, key)}
                    
                   
                  >
                    <td>{cat.Material} </td>
                    <td>{cat.Short_Name}</td>
                    <td>{cat.Excise_Class}</td>
                    <td>{cat.Specific_weight}</td>
                  </tr>
                ))}

                
              </tbody>
            </Table>
          </div>
        </div>
        {/* {mtrlData.map((val, i)=(
          <span>
            {val.MG_id}
          </span>
        ))} */}
        <div className="col-md-7 col-sm-12">
          <Tabs>
            <Tab eventKey="materialGradeCreator" title="Material Grade Creator">
              <MaterialGradeCreator  mtrlData={mtrlData} setMtrlData={setMtrlData}  />
            </Tab>
            <Tab eventKey="materialCodeCreator" title="Material Code Creator">
              <MaterialCodeCreator />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
