//to test, run: netlify functions:serve
exports.handler = async (event, context) => {
  //import fetch module (ESM dont use require))
  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

  const symbol = event.queryStringParameters.symbol;
  //console.log(`symbole:${symbol}`);
  //const url = `https://www.google.com/finance/quote/${symbol}`;
  const url = `https://finance.yahoo.com/quote/${symbol}`;

  const stock = {
    price: 0,
    change: 0,
  };

  try {
    const pageStream = await fetch(url);
    const body = await pageStream.text();
    var lookupStartString = body.indexOf(`data-symbol="${symbol}"`); //where to start the document
    //console.log(`index:${lookupStartString}`);
    var startPos = body.indexOf("value=", lookupStartString) + 7;
    //console.log(`startPos:${startPos}`);
    var endPos = body.indexOf(" ", startPos) - 1;
    //console.log(`endPos:${endPos}`);
    var price = body.substring(startPos, endPos);
    console.log(`price:${price}`);
    stock.price = price;

    lookupStartString = body.indexOf(
      `data-field="regularMarketChangePercent"`,
      lookupStartString
    ); //where to start the document
    startPos = body.indexOf("value=", lookupStartString) + 7;
    //console.log(`startPos:${startPos}`);
    endPos = body.indexOf(" ", startPos) - 1;
    //console.log(`endPos:${endPos}`);
    var change = body.substring(startPos, endPos);
    //console.log(`change:${change}`);
    stock.change = change;

    return {
      statusCode: 200,
      body: JSON.stringify(stock),
    };
  } catch (err) {
    return { statusCode: 422, body: err.stack };
  }
};

//how to set an env variable, like a api key : https://www.youtube.com/watch?v=J7RKx8f4Frs
