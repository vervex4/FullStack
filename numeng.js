"use strict";
const { MongoClient } = require("mongodb");
module.exports.numeng = async (event, context) => {

  const url =
    "mongodb+srv://abuser:Astro@1234@cluster0-1asmv.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();

    const result = await client
      .db("AstroBasic")
      .collection("NumberDetailsEnglish")
      .find();
    const data = await result.toArray();

    const response = {
      statusCode: 200,
      body: JSON.stringify(data),
    };
    context.succeed(response);
    client.close();
  } catch (e) {
    console.error(e);
  } finally {
    // client.close();
  }
};

