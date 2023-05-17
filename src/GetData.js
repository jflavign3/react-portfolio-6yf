import { holdings } from "./data.js";

const url = "/.netlify/functions/getStock?symbol=";

export const GetData = async () => {
  var updatedHoldings = [];
  //'for of' works with await inside, not foreach (for better way see https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971)
  for (const holding of holdings) {
    try {
      const response = await fetch(url + holding.symbol); //coudl remove await and add promises to array, then wait all
      const { price, change } = await response.json();

      //console.log(`price of ${holding.symbol} = ${price}`);
      var currentdate = new Date();
      holding.lastUpdate =
        currentdate.getHours() + ":" + currentdate.getMinutes();
      holding.currentPrice = Number(price).toFixed(2);
      holding.currentValue = Number(price * holding.qty).toFixed(2);
      holding.dayChange = Number(change * 100).toFixed(2);
      holding.change = Number(
        (holding.currentValue / holding.investment - 1) * 100
      ).toFixed(2);

      updatedHoldings.push(holding);

      // console.log(stateHoldings);
    } catch (error) {
      console.log(error);
    }
  }
  return updatedHoldings;
};
