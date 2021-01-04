"use strict";
const { MongoClient } = require("mongodb");

module.exports.getbycontentid = async (event, context) => {
  let result = "";
  try {
    console.log("input params");
    console.log(event.pathParameters.contentid);

    let selectedLang = "NumberDetailsEnglish";
    if (event.pathParameters.lang == 1) selectedLang = "NumberDetailsHindi";

    const url =
      "mongodb+srv://abuser:Astro@1234@cluster0-1asmv.mongodb.net/test?retryWrites=true&w=majority";

    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (event.pathParameters.contentid.includes(",")) {
      const newsearchWord = event.pathParameters.contentid.split(",");

      await client.connect();
      var resultSet = await client
        .db("AstroBasic")
        .collection(selectedLang)
        .find({
          ContentID: {
            $in: newsearchWord,
          },
        })
        .toArray();

      await client.close();

      const resp = {
        Description: "",
      };

      if (resultSet) {
        resultSet.forEach((doc, idx, array) => {
          resp.Description +=
            doc.Title + "<br>" + doc.Description + "<br><br><hr>";

          console.log(doc.Description);
        });

        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify(resp),
        };
        context.succeed(response);
      } else {
        const response = {
          statusCode: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          },
          body: JSON.stringify("{ errorMessage: 'No Description found!'}"),
        };
        context.succeed(response);
      }
    } else {
      await client.connect();
      const result1 = await client
        .db("AstroBasic")
        .collection(selectedLang)
        .findOne({
          ContentID: event.pathParameters.contentid,
        });
      result = result1;
      await client.close();
      if (result) {
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify(result),
        };
        context.succeed(response);
      } else {
        const response = {
          statusCode: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          },
          body: JSON.stringify("{ errorMessage: 'No Description found!'}"),
        };
        context.succeed(response);
      }
    }
  } catch (e) {
    console.error(e);
    const response = {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify("{ errorMessage: 'No Description found!'}"),
    };
    context.succeed(response);
  } finally {
    // client.close();
  }
};
