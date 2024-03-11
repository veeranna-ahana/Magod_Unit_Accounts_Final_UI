import Axios from "axios";
import React, { useContext, useState,useEffect } from "react";
import axios from "axios";
import { baseURL } from "../api/baseUrl";

const AppContext = React.createContext();

const SnackbarContext = React.createContext({
  isDisplayed: false,
  displayMsg: (msg) => {},
  onClose: () => {},
});

const AuthProvider = ({ children }) => {
  //Machine Setup
  const [post, setPost] = React.useState([]);

  //Schedulelist Profile
  const [schedulelistdata,setSchedulelistdata]=useState([])
  const [schedulelistdatas,setSchedulelistdatas]=useState([])

  //Schedulelist Service
  const [schedulelistservicedata,setSchedulelistservicedata]=useState([])
  const [schedulelistservicedatas,setSchedulelistservicedatas]=useState([])

  // Schedulelist fabrication
  const [schedulelistfabricationdata,setSchedulelistfabricationdata]=useState([])
  const [schedulelistfabricationdatas,setSchedulelistfabricationdatas]=useState([])

  //Profile
  const getSchedulistdata=()=>{
    axios.get(baseURL + "/scheduleListProfile/schedulesList").then((response) => {
                console.log(response.data)
        for(let i =0;i<response.data.length;i++) { 
          // FOR TgtDelDate
          let dateSplit = response.data[i].schTgtDate.split(" ");
          let date =dateSplit[0].split("-")
          let year = date[0];
          let month = date[1];
          let day = date[2];
          let finalDay = day+"-"+month+"-"+year
          response.data[i].schTgtDate = finalDay;
        }
        for(let i =0;i<response.data.length;i++) { 
          // Delivery_date
          let dateSplit1 = response.data[i].Delivery_Date.split(" ");
          let date1 =dateSplit1[0].split("-")
          let year1 = date1[0];
          let month1 = date1[1];
          let day1 = date1[2];
          let finalDay1 = day1+"-"+month1+"-"+year1
          response.data[i].Delivery_Date = finalDay1;
        }
         console.log(response.data)
          setSchedulelistdata(response.data); 
          setSchedulelistdatas(response.data);
        });
  }

  //fabrication
  const getSchedulistfabricationdata=()=>{
    axios.get(baseURL + "/scheduleListFabrication/schedulesList").then((response) => {
      for(let i =0;i<response.data.length;i++) { 
        // FOR TgtDelDate
        let dateSplit = response.data[i].schTgtDate.split(" ");
        let date =dateSplit[0].split("-")
        let year = date[0];
        let month = date[1];
        let day = date[2];
        let finalDay = day+"-"+month+"-"+year
        // console.log(finalDay , 'shift Information 1')
        response.data[i].schTgtDate = finalDay;
      }

      for(let i =0;i<response.data.length;i++) { 
        // Delivery_date
        let dateSplit1 = response.data[i].Delivery_Date.split(" ");
        let date1 =dateSplit1[0].split("-")
        let year1 = date1[0];
        let month1 = date1[1];
        let day1 = date1[2];
        let finalDay1 = day1+"-"+month1+"-"+year1
        // console.log(finalDay1, 'shift Information 1')
        response.data[i].Delivery_Date = finalDay1;
      }
      setSchedulelistfabricationdata(response.data); 
      setSchedulelistfabricationdatas(response.data);
            // console.log(response.data)
        });
  }

  //service
  const getSchedulistservicedata=()=>{
    axios.get(baseURL + "/scheduleListService/schedulesList").then((response) => {
      for(let i =0;i<response.data.length;i++) { 
        // FOR TgtDelDate
        let dateSplit = response.data[i].schTgtDate.split(" ");
        let date =dateSplit[0].split("-")
        let year = date[0];
        let month = date[1];
        let day = date[2];
        let finalDay = day+"-"+month+"-"+year
        // console.log(finalDay , 'shift Information 1')
        response.data[i].schTgtDate = finalDay;
      }

      for(let i =0;i<response.data.length;i++) { 
        // Delivery_date
        let dateSplit1 = response.data[i].Delivery_Date.split(" ");
        let date1 =dateSplit1[0].split("-")
        let year1 = date1[0];
        let month1 = date1[1];
        let day1 = date1[2];
        let finalDay1 = day1+"-"+month1+"-"+year1
        // console.log(finalDay1, 'shift Information 1')
        response.data[i].Delivery_Date = finalDay1;
      }
          setSchedulelistservicedata(response.data);
          setSchedulelistservicedatas(response.data); 
          // console.log(response.data)
        });
  }

//Machine Setup
  const MachineTabledata=()=>{
    axios.get(baseURL + "/productionSetup/getallmachines").then((response) => {
      setPost(response.data);
      // console.log(response.data)
    });
  }

  return (
    <AppContext.Provider
      value={{
        post,setPost,MachineTabledata,schedulelistdata,setSchedulelistdata,
        getSchedulistdata,schedulelistdatas,setSchedulelistdatas,
        schedulelistservicedata,setSchedulelistservicedata,getSchedulistservicedata,
        schedulelistfabricationdata,setSchedulelistfabricationdata,getSchedulistfabricationdata,
        schedulelistfabricationdatas,setSchedulelistfabricationdatas,schedulelistservicedatas,setSchedulelistservicedatas
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AuthProvider, SnackbarContext };
