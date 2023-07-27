const {MongoClient} = require("mongodb");

exports.handler = async (event, context) => {
  
  try {

    
  console.log('asdasdas '+ event.queryStringParameters.id);


  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  const clientPromise = mongoClient.connect();
  const database = (await clientPromise).db("PORTFOLIO");
  const collection = database.collection("HOLDINGS");
  
  let holdingId = Number(event.queryStringParameters.id);
  //i = 10;
  const query = { id: holdingId };
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

