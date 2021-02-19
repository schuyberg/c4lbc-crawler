# Puppeteer Web Crawler Example - Code4Lib BC 2021

Example scripts for crawling web pages using Node.js, puppeteer, and puppeteer-cluster. Built for Code4Lib BC, 2021. 

*If a page mentions the word 'repository,' you have to drink more coffee!*

## Usage:

1. Install node dependencies:

`npm install`

2. Run script(s) with node:

`node ./crawler.js`


## Documentation:

### Puppeteer

Documentation : https://pptr.dev/

GitHub (with examples):  https://github.com/puppeteer/puppeteer


### Puppeteer-cluster

Github: https://github.com/thomasdondorf/puppeteer-cluster


### Note:

This crawler.js is a simplified example and still has some issues that should probably be ironed out. For example, it does nothing to handle query strings differently, and does not check whether it has crawled a particular url already. In this way, drinks counts are probably maximized.



