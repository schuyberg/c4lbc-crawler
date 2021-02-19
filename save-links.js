const puppeteer = require('puppeteer');
const fs = require('fs');
const crawlPage = "https://www.library.ubc.ca/";
const outputPath = __dirname + "/output.json";

async function crawl (url, output) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    let urls = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll('a');
        items.forEach((item) => {
            results.push({
                url:  item.getAttribute('href'),
                text: item.innerText,
            });
        });
        return results; 
    })
    browser.close();
    fs.writeFileSync(output, JSON.stringify(urls, null, 2));  // stringify to JSON with 2-space indent and write to output
    return urls;
}

crawl(crawlPage, outputPath).then(urls => {
    console.log(urls);
}).catch(err => console.error(err));

