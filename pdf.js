"use strict";
const chromium = require("chrome-aws-lambda");
const fs = require("fs");
const path = require("path");

module.exports.generatepdf = async (event, context) => {
  let baseUrl =
    "https://securecosmic.azurewebsites.net/api/AstroBasicNumbers/GetHtmlByReport?";

    let reqBody = new Buffer.from(event.body, 'base64');
    console.log(reqBody);

  const { htmlBody, emailId, customerId } =JSON.parse(reqBody);

 //const htmlBody="PCFkb2N0eXBlIGh0bWw+CjxodG1sPgo8aGVhZD4KPHRpdGxlPk91ciBGdW5reSBIVE1MIFBhZ2U8L3RpdGxlPgo8bWV0YSBuYW1lPSJkZXNjcmlwdGlvbiIgY29udGVudD0iT3VyIGZpcnN0IHBhZ2UiPgo8bWV0YSBuYW1lPSJrZXl3b3JkcyIgY29udGVudD0iaHRtbCB0dXRvcmlhbCB0ZW1wbGF0ZSI+CjwvaGVhZD4KPGJvZHk+CkNvbnRlbnQgZ29lcyBoZXJlLgo8L2JvZHk+CjwvaHRtbA==";
 console.log(htmlBody);
  let browser = null;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    let buff = new Buffer.from(htmlBody, 'base64');
    page.setDefaultNavigationTimeout(0); 
  
    page.setContent(buff.toString());

    page.setDefaultTimeout(70 * 1000);

    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

   // await page.emulateMedia("screen");

    // await page.waitFor(60000);

   // await page.setContent((await htmlResp.buffer()).toString("utf8"));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    });

    // TODO: Response with PDF (or error if something went wrong )
    const response = {
      headers: {
        "Content-type": "application/pdf",
        'content-disposition': 'attachment; filename=test.pdf'
      },
      statusCode: 200,
      body: pdf.toString("base64"),
      isBase64Encoded: true,
    };
    context.succeed(response);
  } catch (error) {
    console.log(error);
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
