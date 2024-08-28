import { toast } from "react-toastify";

//dialog box   https://mui.com/material-ui/react-dialog/

export const UpsertHolding = async (holding) => {
  const url = `/.netlify/functions/UpsertHolding`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(holding),
  });
  //debugger;

  // Awaiting response.json()
  const result = await response.json();
  console.log(
    `update status of ${holding.name}. modified:${result.modifiedCount}`
  );
  toast.success(`Updated ${holding.name}`);

  return result;
};
