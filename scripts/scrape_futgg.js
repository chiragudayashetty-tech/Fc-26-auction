const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");

  // Go to page 1
  const url = "https://www.fut.gg/players/?page=1&quality_id=%5B1%5D&gender=%5B1%5D";
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // Grab the JSON payload from the script tag containing $_TSR
  const extractedJson = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script'));
    for (const s of scripts) {
      if (s.innerText.includes('$_TSR.router')) {
        return s.innerText;
      }
    }
    return null;
  });

  // If we can't find it easily in JSON, we can scrape the DOM
  const domData = await page.evaluate(() => {
    const grid = document.querySelector('div[class*="grid"]') || document.body;
    return grid.innerText.substring(0, 1000);
  });

  console.log("JSON script found:", !!extractedJson);
  console.log("DOM Data:\n", domData);
  
  await browser.close();
})();
