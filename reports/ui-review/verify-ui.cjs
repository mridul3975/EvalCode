const { chromium } = require('C:/Users/mridu/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const output = path.join(__dirname, 'after');
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/mridu/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('**/api/**', route => route.fulfill({ contentType: 'application/json', body: '{}' }));
  await context.route(/^https?:\/\/(?!127\.0\.0\.1:3000)/, route => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  async function visit(url) {
    const response = await page.goto('http://127.0.0.1:3000' + url, { waitUntil: 'networkidle', timeout: 90000 });
    assert(response.status() < 400, `${url} returned ${response.status()}`);
    await page.evaluate(() => document.fonts.ready);
  }
  async function shot(name) {
    if (!name.includes('failure')) assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: page overflows horizontally`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(output, name + '.png'), fullPage: true });
  }
  try {
    for (const [route, name] of [['/', 'home'], ['/practice', 'practice'], ['/dashboard', 'progress'], ['/assessment', 'mock-entry'], ['/oa', 'coding-tests']]) {
      await visit(route); await shot(name + '-desktop');
    }
    await visit('/practice/q_ll_001');
    assert.equal(await page.locator('input[type=radio]:checked').count(), 0, 'Fresh review must not select a verdict');
    assert.equal(await page.getByText('Bugs (1)', { exact: true }).count(), 0);
    await shot('review-desktop');
    await page.getByRole('button', { name: 'Submit review', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'Choose a verdict' }).waitFor();
    await page.getByRole('button', { name: 'Complexity', exact: true }).click();
    await page.getByRole('textbox', { name: 'Time complexity', exact: true }).fill('O(n)');
    await page.waitForTimeout(350);
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Complexity', exact: true }).click();
    assert.equal(await page.getByRole('textbox', { name: 'Time complexity', exact: true }).inputValue(), 'O(n)', 'Draft survives reload');
    await page.goto('http://127.0.0.1:3000/practice/q_ll_001?mode=attempt', { waitUntil: 'networkidle' });
    await page.locator('.monaco-editor').waitFor({ timeout: 25000 });
    await shot('editor-desktop');
    await page.setViewportSize({ width: 390, height: 844 });
    await visit('/'); await shot('home-phone');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    const dialog = page.getByRole('dialog'); await dialog.waitFor();
    const rect = await dialog.boundingBox();
    assert(rect.y >= 0 && rect.y + rect.height <= 845, 'Sign-in dialog stays in viewport');
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      assert(await dialog.evaluate(el => el.contains(document.activeElement)), 'Modal traps focus');
    }
    await shot('sign-in-phone');
    await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog').count(), 0, 'Escape closes sign-in');
    for (const [route, name] of [['/practice', 'practice'], ['/dashboard', 'progress'], ['/oa', 'coding-tests']]) { await visit(route); await shot(name + '-phone'); }
    await visit('/practice/q_ll_001');
    await page.getByRole('button', { name: 'Audit Form', exact: true }).click();
    await page.getByRole('heading', { name: 'Your review', exact: true }).waitFor();
    await shot('review-phone');
    await visit('/assessment');
    await page.getByRole('button', { name: 'Start review mock' }).click();
    await page.waitForURL('**/assessment/session');
    await page.getByRole('button', { name: /^AUDIT FORM/i }).click();
    await page.getByRole('heading', { name: 'Your review', exact: true }).waitFor();
    await shot('mock-phone');
    await page.getByRole('button', { name: /^Finish/ }).click();
    await page.getByRole('dialog').waitFor(); await shot('mock-submit-phone');
    await page.keyboard.press('Escape');
    await visit('/oa/stripe-payments-swe');
    await page.getByRole('button', { name: 'Editor & tests', exact: true }).click();
    await page.locator('.monaco-editor').waitFor({ timeout: 25000 });
    assert.equal(await page.getByRole('button', { name: 'Run tests', exact: true }).count(), 1);
    await shot('coding-workspace-phone');
    await page.getByRole('button', { name: 'Finish', exact: true }).click();
    await page.getByRole('dialog').waitFor(); await shot('coding-submit-phone');
    await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog').count(), 0);
    assert.deepEqual(errors, [], 'No browser exceptions');
    fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify({ status: 'passed', errors, checks: ['routes', 'neutral verdict', 'review validation', 'draft persistence', 'self-hosted Monaco with external network blocked', 'phone dialog geometry', 'keyboard focus and Escape', 'phone mock form pointer access', 'named coding actions'] }, null, 2));
    console.log('UI regression checks passed; screenshots in ' + output);
  } catch (error) {
    await shot('failure'); fs.writeFileSync(path.join(output, 'failure.txt'), String(error)); throw error;
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
