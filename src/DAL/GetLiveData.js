import { toast } from "react-toastify";

const url = "/.netlify/functions/getStock?symbol=";

const UpsertHolding = async (holding) => {
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

export const GetLiveData = async (props) => {
  //debugger;
  //const toastId = React.useRef(null);
  /*const notify = () =>
    (toastId.current = toast.success(`Hello ${test}`, { autoClose: false }));
  const update = () =>
    toast.update(toastId.current, { type: toast.TYPE.INFO, autoClose: 5000 });*/

  var updatedHoldings = [];
  var totalHoldings = props.length;
  let i = 0;
  //'for of' works with await inside, not foreach (for better way see https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971)
  //notify();
  for (const holding of props.filter((prop) => prop.typeId !== 2)) {
    try {
      i++;
      console.log(`getting ${holding.symbol} (${i} out of ${totalHoldings})`);
      const response = await fetch(url + holding.symbol); //coudl remove await and add promises to array, then wait all
      //  debugger;
      var { price, change } = await response.json();
      //price = price.replace(/"/g, "");
      console.log(`....received ${holding.symbol} ${price}`);

      if (isNaN(price)) {
        console.log(`Error, not a number`);
        toast.error("Error reading number");
        break;
      }
      var currentdate = new Date();
      holding.lastUpdate =
        currentdate.getHours() + ":" + currentdate.getMinutes();
      holding.currentPrice = Number(price).toFixed(2);
      holding.currentValue = Number(price * holding.qty).toFixed(2);
      holding.dayChange = Number(change).toFixed(2);
      holding.change = Number(
        (holding.currentValue / holding.investment - 1) * 100
      ).toFixed(2);

      updatedHoldings.push(holding);
      UpsertHolding(holding);

      // console.log(stateHoldings);
    } catch (error) {
      console.log(error);
    }
  }
  return updatedHoldings;
};
