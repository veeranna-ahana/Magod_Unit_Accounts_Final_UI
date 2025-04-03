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
  
  const [unitDetails, setunitDetails] = useState([]);
  useEffect(()=>{
    const handleUnitName = () => {
      axios
        .get(baseURL + `/customerOutstanding/unitNames`)
        .then((res) => {
          console.log("firstTable", res.data);
          setunitDetails(res.data.Result);
        })
        .catch((err) => {
          console.log("err in table", err);
        });
    };

    handleUnitName();
  },[])

console.log("unit details in context", unitDetails);

  return (
    <AppContext.Provider
      value={{
        setunitDetails,unitDetails
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
