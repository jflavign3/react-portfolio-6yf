//const bodyParser = require("body-parser");

exports.handler = async (event, context) => {
  //import fetch module (ESM dont use require))
  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

  const url = `https://icanhazdadjoke.com/`;
  try {
    const pageStream = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
    const jsonStock = await pageStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(jsonStock),
    };
  } catch (err) {
    return { statusCode: 422, body: err.stack };
  }
};

//how to set an env variable, like a api key : https://www.youtube.com/watch?v=J7RKx8f4Frs
