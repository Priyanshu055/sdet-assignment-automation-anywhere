// debug-canvas.js
require('dotenv').config();
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Login
    await page.goto(process.env.BASE_URL || 'https://community.cloud.automationanywhere.digital');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    console.log('Current URL:', page.url());
    await page.screenshot({ path: 'debug-step1-login.png' });

    // Fill login form
    const usernameField = page.locator('input[name="username"], input[type="email"], input[name="email"]').first();
    const passwordField = page.locator('input[name="password"], input[type="password"]').first();
    const submitBtn = page.locator('button[type="submit"], button:has-text("Log in"), button:has-text("Sign in"), button:has-text("Login")').first();

    await usernameField.waitFor({ state: 'visible', timeout: 15000 });
    await usernameField.fill(process.env.AA_USERNAME);
    await passwordField.fill(process.env.AA_PASSWORD);
    await submitBtn.click();

    await page.waitForTimeout(6000);
    await page.screenshot({ path: 'debug-step2-after-login.png' });
    console.log('After login URL:', page.url());

    // Step 2: Navigate to Form Builder
    await page.locator('a[name="automations"]').click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-step3-automations.png' });

    await page.locator('span[data-text="Create"]').click();
    await page.waitForTimeout(1000);

    await page.locator('button[name="create-attended-form"]').click();
    await page.waitForTimeout(1000);

    await page.locator('input[name="name"]').fill(`Debug_Form_${Date.now()}`);
    await page.waitForTimeout(2000);

    await page.locator('button:has-text("Create & edit")').click();
    await page.waitForTimeout(6000);

    await page.screenshot({ path: 'debug-step4-form-builder.png' });
    console.log('Form Builder URL:', page.url());

    // Step 3: Find Canvas Elements
    const canvasInfo = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('*').forEach(el => {
        const cls = el.className;
        if (typeof cls === 'string' && (
          cls.includes('canvas') ||
          cls.includes('drop') ||
          cls.includes('pane') ||
          cls.includes('builder') ||
          cls.includes('editor') ||
          cls.includes('form')
        )) {
          results.push({
            tag: el.tagName,
            class: cls.substring(0, 120),
            id: el.id || '-'
          });
        }
      });
      return results;
    });

    console.log('\n===== CANVAS ELEMENTS FOUND =====');
    if (canvasInfo.length === 0) {
      console.log('NONE FOUND - Form Builder did not load!');
    } else {
      canvasInfo.forEach(el => {
        console.log(`[${el.tag}] class="${el.class}" id="${el.id}"`);
      });
    }
    console.log('=================================\n');

  } catch (err) {
    console.error('ERROR:', err.message);
    await page.screenshot({ path: 'debug-error.png' });
  }

  // Keep browser open for inspection
  console.log('Browser open hai — inspect karo. 60 sec baad band hoga.');
  await new Promise(resolve => setTimeout(resolve, 60000));
  await browser.close();
})();