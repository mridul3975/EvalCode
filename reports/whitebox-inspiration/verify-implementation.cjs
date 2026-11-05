const { chromium } = require('C:/Users/mridu/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3100';
const output = path.join(__dirname, 'implementation');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/mridu/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push({ url: page.url(), message: e.message }));
  const results = { widths: [], errors };
  const shot = (name, fullPage = true) => page.screenshot({ path: path.join(output, name + '.png'), fullPage });
  async function visit(route) {
    const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
    assert(response.status() < 400, route + ' responds successfully');
    await page.evaluate(() => document.fonts.ready);
  }
  async function noOverflow(label) {
    const geometry = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    assert(geometry.document <= geometry.viewport + 1, label + ': document overflows ' + JSON.stringify(geometry));
    return geometry;
  }
  try {
    await visit('/');
    await page.getByRole('button', { name: 'Sign in', exact: true }).waitFor();
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await page.locator('footer img').evaluate(async img => {
      await img.decode();
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    });
    await page.evaluate(() => scrollTo(0, 0));
    const demo = page.locator('[data-review-demo]');
    assert.equal(await demo.locator('[data-highlighted="true"]').count(), 0, 'Fresh example has no answer highlight');
    assert.equal(await demo.locator('[aria-pressed="true"]').count(), 0, 'Fresh example has no selected verdict');
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
      await page.evaluate(() => scrollTo(0, 0));
      results.widths.push(await noOverflow('Homepage at ' + width));
      await shot('home-' + width);
    }
    await shot('hero-desktop', false);
    const firstReview = page.getByRole('link', { name: 'Try your first review', exact: true });
    assert.equal(await firstReview.getAttribute('href'), '/practice/q_ll_001');
    assert.equal(await page.getByRole('link', { name: 'See how it works', exact: true }).getAttribute('href'), '#how-it-works');
    await page.getByRole('button', { name: 'Looks correct', exact: true }).click();
    await demo.getByText('Look again at line 4.', { exact: true }).waitFor();
    assert.equal(await demo.locator('[data-highlighted="true"]').count(), 1);
    await demo.getByRole('button', { name: 'Try again', exact: true }).click();
    assert.equal(await demo.locator('[data-highlighted="true"]').count(), 0);
    assert(await page.getByRole('button', { name: 'Looks correct', exact: true }).evaluate(el => el === document.activeElement), 'Reset restores verdict focus');
    await page.keyboard.press('Tab');
    assert(await page.getByRole('button', { name: 'There’s an issue', exact: true }).evaluate(el => el === document.activeElement), 'Verdict buttons are keyboard reachable');
    await page.keyboard.press('Enter');
    await demo.getByText('Good catch. The next node is lost.', { exact: true }).waitFor();
    await demo.getByText('[3, 2, 1]', { exact: true }).waitFor();
    await shot('demo-feedback-desktop', false);
    await demo.getByRole('button', { name: 'Try again', exact: true }).click();
    await page.getByRole('button', { name: /^Make your case/ }).click();
    await page.getByRole('heading', { name: 'One input can make the case.', exact: true }).waitFor();
    await page.getByRole('table', { name: 'Trace the loop', exact: true }).waitFor();
    await shot('workflow-evidence-desktop', false);
    await page.getByRole('button', { name: /^Compare and improve/ }).click();
    await page.getByRole('heading', { name: 'The last candidate is never checked.', exact: true }).waitFor();
    await page.getByText('while left <= right:', { exact: true }).waitFor();
    await shot('workflow-feedback-desktop', false);
    await page.setViewportSize({ width: 360, height: 844 });
    await noOverflow('360px reference feedback');
    await shot('workflow-feedback-mobile');
    await page.getByRole('button', { name: /^Make your case/ }).click();
    await noOverflow('360px counterexample');
    await page.getByRole('button', { name: 'There’s an issue', exact: true }).click();
    await noOverflow('360px verdict feedback');
    await shot('demo-feedback-mobile');
    await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'Close navigation', exact: true }).getAttribute('aria-expanded'), 'true');
    await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).getByRole('link', { name: 'Practice', exact: true }).waitFor();
    await noOverflow('Mobile menu');
    await shot('navigation-mobile', false);
    await page.getByRole('button', { name: 'Close navigation', exact: true }).click();
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await page.locator('footer img').evaluate(img => img.decode());
    await shot('footer-mobile', false);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await shot('footer-desktop', false);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await visit('/');
    results.reducedMotion = await page.evaluate(() => ({ visible: getComputedStyle(document.querySelector('h1')).opacity, animations: document.getAnimations().filter(a => a.playState === 'running').length }));
    assert.equal(results.reducedMotion.visible, '1');
    assert.equal(results.reducedMotion.animations, 0);
    await visit('/practice');
    assert.equal(await page.locator('footer img').count(), 0, 'Non-home footer stays compact');
    await page.getByRole('heading', { name: 'Code review practice', exact: true }).waitFor();
    await noOverflow('Practice catalog');
    await visit('/practice/q_ll_001');
    assert.equal(await page.locator('footer').count(), 0, 'Workspace has no marketing footer');
    assert.equal(await page.getByRole('navigation', { name: 'Main navigation', exact: true }).count(), 0, 'Workspace has no marketing navbar');
    assert.equal(errors.length, 0, JSON.stringify(errors));
    fs.writeFileSync(path.join(output, 'validation.json'), JSON.stringify({ ...results, passed: true }, null, 2));
    console.log(JSON.stringify({ ...results, passed: true }, null, 2));
  } catch (error) {
    await shot('failure');
    fs.writeFileSync(path.join(output, 'validation.json'), JSON.stringify({ ...results, passed: false, failure: error.message }, null, 2));
    throw error;
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
