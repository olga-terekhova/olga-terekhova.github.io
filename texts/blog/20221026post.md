Timeout, promises - https://stackoverflow.com/questions/46919013/puppeteer-wait-n-seconds-before-continuing-to-the-next-line  

Don't sleep, wait for criteria to become true.

```
await page.goto(url, {
    waitUntil: 'networkidle2'
});
```

$eval - https://pptr.dev/api/puppeteer.page._eval/  

https://stackoverflow.com/questions/48448586/how-to-use-xpath-in-chrome-headlesspuppeteer-evaluate  
https://stackoverflow.com/questions/52045947/nodejs-puppeteer-how-to-use-page-evaluate  
https://pptr.dev/api/puppeteer.page.evaluate/  
https://github.com/puppeteer/puppeteer/issues/2004  
https://stackoverflow.com/questions/53032903/get-elements-from-page-evaluate-in-puppeteer  
https://stackoverflow.com/questions/61866042/get-the-children-of-an-element-in-puppeteer  
https://stackoverflow.com/questions/55659097/how-to-get-children-of-elements-by-puppeteer  

Mastering JS - Puppeteer - https://masteringjs.io/tutorials/fundamentals/puppeteer  

Interesting knowldege base https://github.com/sonyarianto/sony-ak-knowledge-center  

https://oxylabs.io/blog/puppeteer-tutorial  

Puppeteer screenshot - https://pocketadmin.tech/en/puppeteer-screenshot-page-or-element/  

Puppeteer save pages - https://stackoverflow.com/questions/53640405/puppeteer-save-webpage-and-images  
