const puppeteer = require('puppeteer');
const fs = require('fs');

const extractPlayers = async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    executablePath: 'C:\\Users\\chira\\.cache\\puppeteer\\chrome\\win64-152.0.7930.0\\chrome-win64\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");

  let allPlayers = [];

  for (let p = 1; p <= 9; p++) {
    const url = `https://www.fut.gg/players/?page=${p}&quality_id=%5B1%5D&gender=%5B1%5D`;
    console.log("Visiting:", url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for players to load
    await new Promise(r => setTimeout(r, 4000));
    
    // Scrape DOM
    const domData = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href^="/players/"]'));
      return links.map(link => {
        const parent = link.closest('div[class*="w-full"]') || link.parentElement;
        return parent ? parent.innerText.replace(/\n/g, ' | ') : '';
      }).filter(text => text.length > 30);
    });
    
    const unique = [...new Set(domData)];
    allPlayers.push(...unique);
    console.log(`Page ${p} DOM players found:`, unique.length);
  }
  
  fs.writeFileSync('dom_dump.txt', allPlayers.join('\n'));
  console.log("Done scraping 9 pages.");
  await browser.close();
};

extractPlayers().catch(console.error);
