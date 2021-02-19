const { Cluster } = require('puppeteer-cluster');

const startUrl = 'https://www.library.ubc.ca';

// const fs = require('fs');
// const outputPath = __dirname + "/output.json";

const dataObj = {};
maxDepth = 2;

(async () => {
  // setup cluster
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,  // max 5 instances at a time
  });

  const getLinks = async ({page, data}) => {
    const { url, depth } = data;
    if (depth > maxDepth) { return; } // don't navigate deeper than maxDepth
    console.log(url, depth);

    // go to page
    await page.goto(url);

    // does it contain repository?
    const content = await page.content();
    if(content.match(/repository/gi)){
      console.log('Page mentions a RePoSiTorY! --- DRINK!');
    }

    // get links from page
    const links = await page.$$eval('a', a => a.map(l => l.href));
    
    // if link includes the startPath, crawl it (add to cluster queue)
    links.forEach(l => {
      if (link.includes(startUrl)) {
        cluster.queue({url: link, depth: depth + 1}, getLinks)
      }
    })
  }
  
  // start by queueing crawlPath (base domain)
  cluster.queue({url: startUrl, depth: 0}, getLinks);

  await cluster.idle();
  await cluster.close();

})()



