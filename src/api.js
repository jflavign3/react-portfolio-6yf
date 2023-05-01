const express = require("express");
const serverless = require("serverless-http"); //for netlify to run as a serverless lambda
const bodyParser = require("body-parser");
const https = require("https");
const cors = require("cors");

const app = express();
//const port = process.env.PORT || 4041;   //local
const router = express.Router(); //netlify

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://prtflio23.netlify.app",
    origin: "http://localhsot:3000",
  })
);

const users = [{ name: "todsny", email: "tony@gmail.com" }];
/*local
app.get("/", (_, res) => {
  res.send("my prtflio app");
});
*/

router.get("/stock/:symbol", (req, resParent) => {
  const { symbol } = req.params;

  var url = `https://www.google.com/finance/quote/${symbol}`;
  let body = [];
  var req = https.request(url, (res) => {
    console.log("connected");
    res.on("data", function (chunk) {
      body.push(chunk);
    });
    res.on("end", function () {
      body = Buffer.concat(body).toString();
      var lookupString = "data-last-price";
      var posValueStart = body.indexOf(lookupString) + lookupString.length + 2;
      var posValueEnd = body.indexOf(" ", posValueStart) - 1;
      var price = body.substring(posValueStart, posValueEnd);
      resParent.json({ ok: true, price });
    });
  });
  req.end();
});

router.get("/users", (_, res) => {
  res.json({ ok: true, users });
});

router.get("/users/:name", () => {
  //const { name } = req.params;
  //const user = users.filter((x) => x.name === name)[0];
  res.json({ ok: true, user });
});

router.post("/adduser", (req, res) => {
  const { name, email } = req.body;
  if (name && email) {
    users.push({ name, email });
    res.json({ ok: true, users });
  }
});

//local
/*app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});*/

//netlify
app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
////
