import { toast } from "react-toastify";

//dialog box   https://mui.com/material-ui/react-dialog/

export const GetDbData = async (forceRefresh) => {
  const getHoldings_url = "/.netlify/functions/getHoldings";

  const USD_TO_CAD_RATE = 1.38;

  var result;
  //debugger;
  if (
    forceRefresh ||
    sessionStorage["data"] === null ||
    typeof sessionStorage["data"] === "undefined"
  ) {
    console.log("Storage empty. Getting data from db");
    result = await fetch(getHoldings_url).then((response) => response.json());

    //debugger;
    const res = result.map((item) => ({
      ...item,
      value:
        (item.currency == "USD"
          ? item.currentPrice * USD_TO_CAD_RATE
          : item.currentPrice) * item.qty,
    }));

    sessionStorage["data"] = JSON.stringify(res);
  } else {
    console.log("Storage full. Getting data from storage");
    result = JSON.parse(sessionStorage["data"]);
  }

  return result;
};

export const DeleteHolding = async (id) => {
  const deleteHoldings_url = `/.netlify/functions/deleteHolding?id=${id}`;

  console.log(`Deleting ${id}`);
  let result = await fetch(deleteHoldings_url).then((response) =>
    response.json()
  );

  console.log(`delete status of ${id}. modified:${result.modifiedCount}`);
  toast.success(`Deleted`);

  return result;
};
/*
export const UpsertHolding = async (holding) => {
    
  const url = `/.netlify/functions/UpsertHolding`;  

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(holding)
  });
  //debugger;

  // Awaiting response.json()
  const result = await response.json();
  console.log(`update status of ${holding.name}. modified:${result.modifiedCount}`)
  toast.success(
    `Updated ${holding.name}`
   );

  return result;
};*/
