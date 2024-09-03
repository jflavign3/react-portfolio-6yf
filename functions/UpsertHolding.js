const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  let mongoClient;
  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect(); // Await the connection
    const database = mongoClient.db("PORTFOLIO");
    const collection = database.collection("HOLDINGS");

    const {
      id,
      name,
      symbol,
      currentPrice,
      dayChange,
      stopLossPrice,
      qty,
      currency,
      initialPrice,
      lastUpdate,
      typeId,
    } = JSON.parse(event.body); //deconstruct

    console.log("body:", event.body);
    console.log("id:", id);
    console.log("name:", name);

    const filter = { id: id };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        id: id,
        name: name,
        symbol: symbol,
        currentPrice: currentPrice,
        dayChange: dayChange,
        stopLossPrice: stopLossPrice,
        qty: qty,
        currency: currency,
        initialPrice: initialPrice,
        lastUpdate: lastUpdate,
        typeId: typeId,
      },
    };

    const result = await collection.updateOne(filter, updateDoc, options);

    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }

    console.log("success:", JSON.stringify(result));
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("Error:", err);
    return { statusCode: 422, body: err.stack };
  } finally {
    if (mongoClient) {
      await mongoClient.close(); // Ensure the client connection is closed
      console.log("MongoDB client connection closed.");
    }
  }
};
