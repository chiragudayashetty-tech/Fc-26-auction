const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');

const extractPlayers = async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    executablePath: 'C:\\Users\\chira\\.cache\\puppeteer\\chrome\\win64-152.0.7930.0\\chrome-win64\\chrome.exe'
  });
  const page = await browser.newPage();
  
  let allPlayers = [];

  for (let p = 1; p <= 9; p++) {
    const url = `https://www.fut.gg/players/?page=${p}&quality_id=%5B1%5D&gender=%5B1%5D`;
    console.log("Visiting:", url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for the grid to render
    await new Promise(r => setTimeout(r, 5000));
    
    const domData = await page.evaluate(() => {
      // Find the player rows. fut.gg has a structure.
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
  
  fs.writeFileSync('dom_dump_stealth.txt', allPlayers.join('\n'));
  console.log("Done scraping 9 pages with Stealth.");
  await browser.close();
};

extractPlayers().catch(console.error);
