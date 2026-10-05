const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Full page screenshot
  await page.screenshot({ path: 'baseline-full.png', fullPage: true });
  
  // Hero section screenshot
  const hero = await page.$('.ui-element-14c27e9');
  if (hero) {
    await hero.screenshot({ path: 'baseline-hero.png' });
  }
  
  // Header screenshot
  const header = await page.$('.header');
  if (header) {
    await header.screenshot({ path: 'baseline-header.png' });
  }
  
  await browser.close();
})();