/**
 * Gets a fresh auth token by performing a real UI login in a background
 * browser and capturing the token from the /v2/authentication response.
 * This avoids needing to replicate the app's password encryption, since the
 * real browser handles it exactly the way the app expects.
 *
 * @param {import('@playwright/test').PlaywrightWorkerArgs['playwright']} playwrightInstance
 * @returns {Promise<string>} auth token
 */
async function getAuthToken(playwrightInstance) {
  const browser = await playwrightInstance.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const authResponsePromise = page.waitForResponse(
    (response) => response.url().includes('/authentication') && response.request().method() === 'POST',
    { timeout: 45000 }
  );

  await page.goto(process.env.BASE_URL, { waitUntil: 'domcontentloaded' });

  await page.locator('input[name="username"]').waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('input[name="username"]').fill(process.env.AA_USERNAME);
  await page.locator('input[name="password"]').fill(process.env.AA_PASSWORD);
  await page.locator('button[name="submitLogin"]').click();

  const authResponse = await authResponsePromise;
  const body = await authResponse.json();

  await browser.close();

  if (!body.token) {
    throw new Error(`Login response did not contain a token: ${JSON.stringify(body)}`);
  }

  return body.token;
}

module.exports = { getAuthToken };