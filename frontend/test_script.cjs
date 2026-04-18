const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', request => {
     console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  console.log('Navigating to http://localhost:5175/patient/dashboard...');
  await page.goto('http://localhost:5175/patient/dashboard', { waitUntil: 'networkidle2' });
  
  console.log('Clicking About link...');
  // Find a link containing "About"
  const links = await page.$$('a');
  let clicked = false;
  for (const link of links) {
     const text = await page.evaluate(el => el.textContent, link);
     if (text && text.includes('About')) {
         await link.click();
         clicked = true;
         console.log('Clicked!', text.trim());
         break;
     }
  }

  // Wait a moment for rendering/redirecting
  await new Promise(r => setTimeout(r, 2000));
  
  const currentUrl = page.url();
  console.log('Current URL after click:', currentUrl);
  
  const bodyHandle = await page.$('body');
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);
  console.log('Body length:', html.length);
  if (html.length < 500) {
      console.log('BODY TOO SHORT. CRASHED?');
  }
  
  await browser.close();
})();
