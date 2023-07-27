const {MongoClient} = require("mongodb");

exports.handler = async (event, context) => {
  
  try {
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  const clientPromise = mongoClient.connect();
  const database = (await clientPromise).db("PORTFOLIO");
  const collection = database.collection("HOLDINGS");
   
  const {
    id,
    name,
    symbol,
    currentPrice,
    investment,
    currentValue,
    dayChange,
    change,
    stopLossPrice,
    qty,
    currency,
    lastUpdate,
  } = JSON.parse(event.body); //deconstruct*/
  
/*
  console.log('body:' + event.body);
  console.log('id:' + id);
  console.log('name:' + name);*/

  const filter = { id: id };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      id: id,
      name: name,
      symbol: symbol,
      currentPrice: currentPrice,
      investment: investment,
      currentValue: currentValue,
      dayChange: dayChange,
      change: change,
      stopLossPrice: stopLossPrice,
      qty: qty,
      currency: currency,
      lastUpdate: lastUpdate
    },
  };

  const result = await collection.updateOne(filter, updateDoc, options);

  /*
   if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
    */
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
} catch (err) {
    return { statusCode: 422, body: err.stack };
  }
};

