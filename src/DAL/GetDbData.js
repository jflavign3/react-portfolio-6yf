import { holdings } from "../data.js";


export const GetDbData = async () => {

  //return holdings;

  const getHoldings_url = "/.netlify/functions/getHoldings";
  
  let result = await fetch(getHoldings_url).then(response => response.json());   
 // console.log("HHHH:" + JSON.stringify(result));
 
  return result;
};
