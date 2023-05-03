//to test, run: netlify functions:serve
exports.handler = async (event, context) => {
  //import fetch module (ESM dont use require))
  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

  const symbol = event.queryStringParameters.symbol;
  console.log(`symbole:${symbol}`);
  const url = `https://www.google.com/finance/quote/${symbol}`;

  try {
    const pageStream = await fetch(url);
    const body = await pageStream.text();
    var lookupString = "data-last-price";
    var posValueStart = body.indexOf(lookupString) + lookupString.length + 2;
    console.log(`index:${posValueStart}`);
    var posValueEnd = body.indexOf(" ", posValueStart) - 1;
    var price = body.substring(posValueStart, posValueEnd);

    return {
      statusCode: 200,
      body: price,
    };
  } catch (err) {
    return { statusCode: 422, body: err.stack };
  }
  // let body = [];
  /*  var req = https.request(url, (res) => {
    console.log("connected");
    /*res.on("data", function (chunk) {
      body.push(chunk);
    });
    res.on("end", function () {
      body = Buffer.concat(body).toString();
      var lookupString = "data-last-price";
      var posValueStart = body.indexOf(lookupString) + lookupString.length + 2;
      var posValueEnd = body.indexOf(" ", posValueStart) - 1;
      var price = body.substring(posValueStart, posValueEnd);
      // resParent.json({ ok: true, price });
    });
  });
  req.end();*/
};

//how to set an env variable, like a api key : https://www.youtube.com/watch?v=J7RKx8f4Frs
