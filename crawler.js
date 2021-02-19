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
  let drinks = 0;
  let linksCount = 0;
  let allLinks = [];
  const getLinks = async ({page, data}) => {
    const { url, depth } = data;
    if (depth > maxDepth) { return; } // don't navigate deeper than maxDepth
    // console.log(url, depth);

    // go to page
    await page.goto(url);
    linksCount++;
    // does it contain repository?
    const content = await page.content();
    if(content.match(/repository/gi)){
      drinks++;
      console.log(`${url} mentions a RePoSiTorY! --- ${drinks} DRINKS!`);
    }

    // get links from page
    const links = await page.$$eval('a', a => a.map(l => l.href));
    const uniqueLinks = [...new Set(links)];  // .. well isn't that a neat trick?
-    // if link includes 'libary.ubc.ca', crawl it (add to cluster queue)
    uniqueLinks.forEach(link => {
      if (link.includes('library.ubc.ca') && allLinks.indexOf(link) === -1) {
        allLinks.push(link); // this strategy is so-so at preventing duplicate links because the cluster queue is asynchronous
        cluster.queue({url: link, depth: depth + 1}, getLinks)
      }
    })
  }
  
  // start by queueing startPath
  cluster.queue({url: startUrl, depth: 0}, getLinks);

  await cluster.idle();
  await cluster.close();

  console.log(`${linksCount} links followed and ${drinks} mentioned the word "repository," how do you feel?`)

})()



