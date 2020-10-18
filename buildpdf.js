"use strict";
const chromium = require("chrome-aws-lambda");
const fs = require("fs");
const path = require("path");

module.exports.buildpdf = async (event, context) => {

   
  const { htmlBody, emailId, customerId } =JSON.parse(event.body);
  console.log(htmlBody);
  const response = {
    headers: {
      "Content-type": "application/pdf",
      // 'content-disposition': 'attachment; filename=test.pdf'
    },
    statusCode: 200,
    body:"Hello",
    isBase64Encoded: true,
  };

}