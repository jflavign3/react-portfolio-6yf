import { holdings } from "../data.js";
import { ToastContainer, toast } from "react-toastify";

//dialog box   https://mui.com/material-ui/react-dialog/
import * as React from 'react';


export const GetDbData = async () => {

  const getHoldings_url = "/.netlify/functions/getHoldings";
  
  let result = await fetch(getHoldings_url).then(response => response.json());   
 
  return result;
};

export const DeleteHolding = async (id) => {
    
  const deleteHoldings_url = `/.netlify/functions/deleteHolding?id=${id}`;
  
  let result = await fetch(deleteHoldings_url).then(response => response.json());   
 
  toast.success(
    `Deleted`
   );

  return result;
};
