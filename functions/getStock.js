//to test, run: netlify functions:serve

//tried: marketapi  (tsx doesnt seem to work)
//yahoo scraping, seems to get blocked!
//yahu  (500 per month)

async function getStockQuote(symbol) {
  const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?symbols=${symbol}`;
  const apiKey = "9d8db15919mshd551fc13dfda4e3p197becjsn098b24b7aecc"; // Replace with your actual API key

  try {
    //import fetch module (ESM dont use require))
    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "x-rapidapi-key": "9d8db15919mshd551fc13dfda4e3p197becjsn098b24b7aecc", // Replace with your RapidAPI key if needed
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const quote = data.quoteResponse.result[0];
    // const regularMarketPrice = quote.regularMarketPrice;
    // const regularMarketChange = quote.regularMarketChange;
    //console.log("Regular Market Price:", regularMarketPrice);

    return quote;
  } catch (error) {
    console.error("Error fetching the stock data:", error);
  }
}

exports.handler = async (event, context) => {
  const symbol = event.queryStringParameters.symbol.toUpperCase();

  const stock = {
    price: 0,
    change: 0,
  };

  try {
    const quote = await getStockQuote(symbol);
    if (quote !== undefined) {
      stock.price = quote.regularMarketPrice;
      stock.change = quote.regularMarketChange;
    }

    console.log("stick details:", stock);

    /* const pageStream = await fetch(url);
    const body = await pageStream.text();
    var lookupStartString = body.indexOf(`data-symbol="${symbol}"`); //where to start the document
    console.log(`start:${lookupStartString}  data-symbol="${symbol}"`);
    console.log(body.substring(lookupStartString, lookupStartString + 50));
   
    var startPos = body.indexOf("value=", lookupStartString) + 7;

    var endPos = body.indexOf(" ", startPos) - 1;
    //console.log(`endPos:${endPos}`);
    var price = body.substring(startPos, endPos);
    console.log(`price:${price}`);
    stock.price = price;

    lookupStartString = body.indexOf(
      `data-field="regularMarketChangePercent"`,
      lookupStartString
    ); 
    startPos = body.indexOf("value=", lookupStartString) + 7;
    endPos = body.indexOf(" ", startPos) - 1;
    var change = body.substring(startPos, endPos);
    stock.change = change;*/

    return {
      statusCode: 200,
      body: JSON.stringify(stock),
    };
  } catch (err) {
    return { statusCode: 422, body: err.stack };
  }
};

//how to set an env variable, like a api key : https://www.youtube.com/watch?v=J7RKx8f4Frs
