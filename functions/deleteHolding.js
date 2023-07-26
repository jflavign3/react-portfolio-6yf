const {MongoClient} = require("mongodb");

exports.handler = async (event, context, id) => {
  
  try {
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  const clientPromise = mongoClient.connect();
  const database = (await clientPromise).db("PORTFOLIO");
  const collection = database.collection("HOLDINGS");
  
  const query = { id: 9 };
  const result = await collection.deleteOne(query);

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

