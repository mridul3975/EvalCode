const { chromium } = require('C:/Users/mridu/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const output = __dirname + '/after';
const compiled = ts.transpileModule(fs.readFileSync('lib/review-presentation.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const sandbox = { exports: {} }; vm.runInNewContext(compiled, sandbox);
const { blindCode, reviewTitle } = sandbox.exports;
const source = 'value = "# bug in a string"\n# Bug: loses the pointer\ncurr.next = prev # BUG: preserve next\nreturn curr';
const displayed = blindCode(source);
assert.equal(displayed.split('\n').length, source.split('\n').length);
assert(displayed.includes('"# bug in a string"'));
assert.equal(displayed.split('\n')[1], '');
assert.equal(displayed.split('\n')[2], 'curr.next = prev');
assert.equal(reviewTitle({ title: 'Coin Dispenser (Greedy vs DP Heuristic Failure)' }), 'Coin Dispenser');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/mridu/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/api/**', route => route.fulfill({ contentType: 'application/json', body: '{}' }));
  await context.route(/^https?:\/\/(?!127\.0\.0\.1:3000)/, route => route.abort());
  const page = await context.newPage();
  const errors = []; page.on('pageerror', error => errors.push(String(error)));
  async function visit(route) { await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); }
  async function review(label) {
    await page.getByRole('radio', { name: /^Major issue/ }).check();
    await page.getByRole('button', { name: 'Findings', exact: true }).click();
    await page.getByRole('button', { name: 'Add finding', exact: true }).click();
    await page.getByRole('textbox', { name: 'What happens, and why?' }).fill('The next pointer is overwritten before it is saved, so the remaining nodes become unreachable.');
    await page.getByRole('button', { name: 'Complexity', exact: true }).click();
    await page.getByRole('textbox', { name: 'Time complexity', exact: true }).fill('O(n)');
    await page.getByRole('textbox', { name: 'Space complexity', exact: true }).fill('O(1)');
    await page.getByRole('combobox', { name: 'Is the supplied explanation accurate?' }).selectOption('no');
    await page.getByRole('button', { name: label, exact: true }).click();
  }
  try {
    await visit('/practice/q_ll_001'); await page.getByRole('button', { name: 'Audit Form', exact: true }).click();
    await review('Submit review'); await page.getByRole('heading', { name: 'Review feedback', exact: true }).waitFor();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: output + '/review-feedback-phone.png', fullPage: true });
    await visit('/assessment'); await page.getByRole('button', { name: 'Start review mock' }).click();
    await page.waitForURL('**/assessment/session'); await page.getByRole('button', { name: /^AUDIT FORM/i }).click();
    await review('Save review & next');
    await page.getByRole('button', { name: 'Question 1, saved', exact: true }).waitFor();
    await page.getByRole('button', { name: /^Finish/ }).click();
    await page.getByRole('button', { name: 'Submit mock', exact: true }).click();
    await page.waitForURL('**/assessment/results'); await page.getByRole('heading', { name: 'Mock review results' }).waitFor();
    await page.screenshot({ path: output + '/mock-results-phone.png', fullPage: true });
    await visit('/dashboard'); await page.getByRole('heading', { name: 'Skills over time' }).waitFor();
    await page.screenshot({ path: output + '/progress-populated-phone.png', fullPage: true });
    for (const width of [360, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/', '/practice', '/dashboard', '/assessment', '/oa', '/practice/q_ll_001']) {
        await visit(route);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} overflows at ${width}`);
      }
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(output + '/review-flow-verification.json', JSON.stringify({ status: 'passed', checks: ['comment sanitization preserves strings and source line numbers', 'neutral titles', 'practice review through feedback', 'mock save and question indicator', 'mock submission through results', 'populated progress', '360/768/1024 widths'], errors }, null, 2));
    console.log('Review, mock, populated progress, and intermediate-width checks passed.');
  } catch (error) {
    fs.writeFileSync(output + '/overflow-debug.json', JSON.stringify(await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, elements: [...document.querySelectorAll('body *')].map(el => ({ tag: el.tagName, class: el.className?.toString(), text: el.textContent?.slice(0, 80), right: el.getBoundingClientRect().right, left: el.getBoundingClientRect().left })).filter(el => el.right > innerWidth + 1 || el.left < -1).slice(0, 30) })), null, 2));
    await page.screenshot({ path: output + '/flow-failure.png', fullPage: true }); throw error;
  }
  finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
