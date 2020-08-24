'use strict'
const chromium = require('chrome-aws-lambda')
const fs = require('fs')
const path = require('path')



module.exports.pdf = async (event, context) => {

  let baseUrl ="https://securecosmic.azurewebsites.net/api/AstroBasicNumbers/GetHtmlByReport?";

  const { reportId,selectedFiled,langs } = event.queryStringParameters;
  // const {  } = event.queryStringParameters;
  // const {  } = event.queryStringParameters;

  let navURL = baseUrl+ "reportId="+reportId+"&langs="+langs+"&selectedFiled="+ selectedFiled;


  let browser = null
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    })

    const page = await browser.newPage();

    page.setDefaultTimeout (70*1000) ;

    await page.setViewport({width:1440 , height:900 , deviceScaleFactor:2  });

    
    //await page.goto("https://authserviceastrobasic.azurewebsites.net/api/AstroBasicNumbers/GetHtmlByReport?reportId=15512a46-b33a-44be-aa5a-2f43264bad2c&langs=2&selectedFiled=XXX,LPN");

    navURL= 'https://appav.azurewebsites.net/#/numerology-matching-full-html?ReportId=ABNumMatchb20d4e824dd44cac989167140c55b636&Lang=2';
  
    // const htmlResp =await page.goto(navURL,{
    //   waitUntil: ["networkidle0"]
    // });

    const htmlResp =await page.goto(navURL) ;

    await page.emulateMedia('screen');

    await page.waitFor(60000);

    await page.setContent((await htmlResp.buffer()).toString('utf8'));

    // const html = await page.content();
    // console.log(html);
// var csb = [];

// csb.push

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    })

   

    // TODO: Response with PDF (or error if something went wrong )
    const response = {
      headers: {
        'Content-type': 'application/pdf',
        // 'content-disposition': 'attachment; filename=test.pdf'
      },
      statusCode: 200,
      body: pdf.toString('base64'),
      isBase64Encoded: true
    }
    context.succeed(response)
  } catch (error) {
    return context.fail(error)
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }
}
