const { Cluster } = require('puppeteer-cluster');

const fs = require('fs');
const { url } = require('inspector');
const crawlPath = 'https://www.library.ubc.ca';
const outputPath = __dirname + "/output.json";

const dataObj = {};
maxDepth = 2;

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
  });

  const getLinks = async ({page, data}) => {
    const { url, depth } = data;
    if (depth > maxDepth) { return; }
    console.log(url, depth);
    await page.goto(url);

    // does it contain repository?
    const content = await page.content();
    if(content.match(/repository/gi)){
      console.log('Page mentions a RePoSiTorY! --- DRINK!');
    }

    const links = await page.$$eval('a', a => a.map(l => l.href));
    // console.log(links)

    links.forEach(l => {
      if (l.includes(crawlPath)) {
        cluster.queue({url: l, depth: depth + 1}, getLinks)
      }
    })
  }
  
  cluster.queue({url: crawlPath, depth: 0}, getLinks);

  await cluster.idle();
  await cluster.close();

})()



