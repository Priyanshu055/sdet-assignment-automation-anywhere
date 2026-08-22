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
    (response) => response.url().includes('/v2/authentication') && response.request().method() === 'POST'
  );

  await page.goto(process.env.BASE_URL);
  await page.locator('input[name="username"]').fill(process.env.AA_USERNAME);
  await page.locator('input[name="password"]').fill(process.env.AA_PASSWORD);
  await page.locator('button[name="submitLogin"]').click();

  const authResponse = await authResponsePromise;
  const body = await authResponse.json();

  await browser.close();

  return body.token;
}

module.exports = { getAuthToken };