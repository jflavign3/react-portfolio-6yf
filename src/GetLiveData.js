import React from "react";
import { holdings } from "./data.js";
import { ToastContainer, toast } from "react-toastify";

const url = "/.netlify/functions/getStock?symbol=";

export const GetLiveData = async (props) => {
  /*var test = "1";
  const toastId = React.useRef(null);
  const notify = () =>
    (toastId.current = toast.success(`Hello ${test}`, { autoClose: false }));
  const update = () =>
    toast.update(toastId.current, { type: toast.TYPE.INFO, autoClose: 5000 });*/

  var updatedHoldings = [];
  var totalHoldings = holdings.length;
  let i = 0;
  //'for of' works with await inside, not foreach (for better way see https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971)
  //notify();
  for (const holding of holdings) {
    try {
      i++;
      console.log(`getting ${holding.symbol} (${i} out of ${totalHoldings})`);
      const response = await fetch(url + holding.symbol); //coudl remove await and add promises to array, then wait all
      const { price, change } = await response.json();

      var currentdate = new Date();
      holding.lastUpdate =
        currentdate.getHours() + ":" + currentdate.getMinutes();
      holding.currentPrice = Number(price).toFixed(2);
      holding.currentValue = Number(price * holding.qty).toFixed(2);
      holding.dayChange = Number(change * 100).toFixed(2);
      holding.change = Number(
        (holding.currentValue / holding.investment - 1) * 100
      ).toFixed(2);

      //  test = 2;
      /*  toast.success(
        `Received ${holding.symbol} (${i} out of ${totalHoldings})`
      );*/
      // debugger;
      /* if (toastId.current == null) {
        notify();
      }*/
      //toastId.current = toast.success("Hello", { autoClose: false });
      //toast.success("Hello", { autoClose: false });
      /*   } else {
        toast.update(toastId.current, {
          type: toast.TYPE.INFO,
          autoClose: 5000,
        });
        //update();
      }*/

      updatedHoldings.push(holding);

      // console.log(stateHoldings);
    } catch (error) {
      console.log(error);
    }
  }
  return updatedHoldings;
};
