const { chromium } = require('C:/Users/mridu/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, 'screenshots');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/mridu/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const evidence = { errors: [] };
  page.on('pageerror', e => evidence.errors.push({ url: page.url(), message: e.message }));
  async function go(url) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1800);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  }
  async function shot(name, fullPage = false) {
    await page.screenshot({ path: path.join(output, name + '.png'), fullPage });
    console.log('Captured ' + name);
  }
  try {
    await go('https://whitebox.ac/');
    await page.getByRole('tab', { name: 'Go to White Room', exact: true }).click();
    await page.waitForTimeout(800);
    evidence.tourAfter = await page.locator('section.tour').innerText();
    await page.locator('section.tour').screenshot({ path: path.join(output, '20-product-tour-white-room.png') });
    await page.getByRole('button').filter({ hasText: 'Hashring' }).click();
    await page.waitForTimeout(250);
    evidence.selectedIntel = (await page.locator('.problem-preview-card').innerText()).slice(0,500);
    await shot('21-selected-problem-preview');
    await go('https://whitebox.ac/algorithms');
    evidence.roadmapUrl = page.url();
    evidence.roadmapHeading = await page.locator('h1').allTextContents();
    await shot('15-roadmap-desktop');
    evidence.roadmapControls = await page.getByRole('button').evaluateAll(els => els.filter(el => el.getBoundingClientRect().height).map(el => ({ text: el.textContent.trim().slice(0,80), label: el.getAttribute('aria-label') })));
    const scroller = page.locator('.roadmap-scroll-container').first();
    if (await scroller.count()) {
      evidence.roadmapScrollBefore = await scroller.evaluate(el => el.scrollLeft);
      const box = await scroller.boundingBox();
      await page.mouse.move(box.x + box.width * .75, box.y + 80);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * .25, box.y + 80, { steps: 12 });
      await page.mouse.up();
      evidence.roadmapScrollAfter = await scroller.evaluate(el => el.scrollLeft);
      await shot('22-roadmap-panned');
    }
    const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const mobile = await phone.newPage();
    await mobile.goto('https://whitebox.ac/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await mobile.evaluate(() => document.fonts.ready);
    await mobile.waitForTimeout(2200);
    await mobile.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await mobile.screenshot({ path: path.join(output, '12-home-mobile.png') });
    evidence.mobileHero = await mobile.locator('section.hero').innerText();
    await mobile.getByRole('button', { name: 'Toggle menu', exact: true }).click();
    await mobile.waitForTimeout(500);
    evidence.mobileMenu = await mobile.locator('header[data-site-navbar]').innerText();
    await mobile.screenshot({ path: path.join(output, '23-mobile-navigation.png') });
    await mobile.goto('https://whitebox.ac/problems', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await mobile.waitForTimeout(1600);
    await mobile.screenshot({ path: path.join(output, '24-mobile-catalog.png') });
    evidence.mobileCatalogOverflow = await mobile.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    await go('http://127.0.0.1:3100/');
    await page.getByRole('button', { name: 'Sign in', exact: true }).waitFor({ timeout: 20000 });
    await shot('18-evalforge-current-desktop', true);
    await page.setViewportSize({ width: 390, height: 844 });
    await shot('19-evalforge-current-mobile', true);
    fs.writeFileSync(path.join(__dirname, 'interaction-evidence.json'), JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify(evidence, null, 2));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
