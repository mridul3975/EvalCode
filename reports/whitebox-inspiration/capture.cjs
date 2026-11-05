const { chromium } = require('C:/Users/mridu/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, 'screenshots');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/mridu/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push({ url: page.url(), message: e.message }));
  const evidence = { captured: '2026-11-04', errors };
  async function capture(name, fullPage = false) {
    await page.screenshot({ path: path.join(output, name + '.png'), fullPage });
  }
  try {
    const response = await page.goto('https://whitebox.ac/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.locator('h1').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3500);
    evidence.status = response.status();
    evidence.theme = await page.locator('html').getAttribute('data-theme');
    evidence.palette = await page.locator('html').getAttribute('data-palette');
    evidence.headings = await page.locator('h1,h2,h3').allTextContents();
    evidence.buttons = await page.getByRole('button').evaluateAll(els => els.filter(el => el.getBoundingClientRect().height).map(el => ({ text: el.textContent.trim().slice(0,100), label: el.getAttribute('aria-label'), title: el.getAttribute('title') })));
    evidence.sections = await page.locator('section').evaluateAll(els => els.map(el => ({ class: el.className, y: Math.round(el.getBoundingClientRect().top + scrollY), height: Math.round(el.getBoundingClientRect().height), heading: el.querySelector('h1,h2,h3')?.textContent })));
    await capture('01-home-desktop');
    await capture('00-home-desktop-full', true);
    evidence.overflow = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    const heroCard = page.locator('.showcase-card').first();
    evidence.heroTransformBefore = await heroCard.evaluate(el => getComputedStyle(el).transform);
    await heroCard.hover({ position: { x: 80, y: 100 } });
    await page.waitForTimeout(450);
    evidence.heroTransformAfter = await heroCard.evaluate(el => getComputedStyle(el).transform);
    await capture('01b-home-hero-hover');
    await page.getByRole('button', { name: 'Learn', exact: true }).hover();
    await page.waitForTimeout(400);
    evidence.navigationOpen = await page.locator('header[data-site-navbar]').innerText();
    await capture('02-desktop-navigation');
    await page.mouse.move(20, 200);
    await page.getByRole('button', { name: 'Search Ctrl K', exact: true }).click();
    await page.waitForTimeout(300);
    evidence.searchOpen = (await page.locator('body').innerText()).slice(-4500);
    await capture('03-command-search');
    await page.keyboard.press('Escape');
    for (const [selector, name] of [
      ['section.tour', '04-product-tour'],
      ['section.dsa-section', '05-roadmap-home'],
      ['section.why-section', '06-feature-modules'],
      ['section.sourcing', '07-interview-intel'],
      ['section.resume-section', '08-sample-results'],
      ['section.learning', '09-learning-evidence'],
      ['section.pricing', '10-pricing'],
      ['footer.footer', '11-illustrated-footer'],
    ]) {
      const section = page.locator(selector).first();
      await section.evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.waitForTimeout(900);
      await capture(name);
      if (selector === 'section.tour') evidence.tourControls = await section.locator('button,a,[role=tab]').evaluateAll(els => els.map(el => ({ tag: el.tagName, role: el.getAttribute('role'), text: el.textContent.trim().slice(0,80), label: el.getAttribute('aria-label') })));
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('https://whitebox.ac/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1800);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(400);
    await capture('12-home-mobile');
    evidence.mobile = {
      overflow: await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth })),
      headerControls: await page.locator('header button').evaluateAll(els => els.filter(el => el.getBoundingClientRect().height).map(el => ({ text: el.textContent.trim(), label: el.getAttribute('aria-label') }))),
    };
    await page.locator('section.dsa-section').evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.waitForTimeout(900);
    await capture('13-roadmap-mobile');
    await page.setViewportSize({ width: 1440, height: 1000 });
    evidence.pages = [];
    for (const [route, name] of [['/problems', '14-catalog-desktop'], ['/algorithms', '15-roadmap-desktop'], ['/guides', '16-guides-desktop'], ['/white-room/about', '17-white-room-desktop']]) {
      await page.goto('https://whitebox.ac' + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1800);
      await capture(name);
      evidence.pages.push({ route, url: page.url(), title: await page.title(), headings: await page.locator('h1,h2').allTextContents(), buttons: await page.locator('button').evaluateAll(els => els.filter(el => el.getBoundingClientRect().height).slice(0,30).map(el => ({ text: el.textContent.trim().slice(0,80), label: el.getAttribute('aria-label') }))) });
    }
    await page.goto('http://127.0.0.1:3100/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole('button', { name: 'Sign in', exact: true }).waitFor({ timeout: 20000 });
    await capture('18-evalforge-current-desktop', true);
    await page.setViewportSize({ width: 390, height: 844 });
    await capture('19-evalforge-current-mobile', true);
    fs.writeFileSync(path.join(__dirname, 'capture-evidence.json'), JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify({ ...evidence, buttons: undefined, sections: undefined, headings: undefined, searchOpen: evidence.searchOpen?.slice(0,1400) }, null, 2));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
