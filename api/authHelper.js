// api/authHelper.js
// Handles authenticating via the Automation Anywhere API and returning the token
// to use in subsequent requests (X-Authorization header, as seen in the Network tab).

/**
 * Logs in via API and returns the auth token.
 * NOTE: Confirm the exact login endpoint + payload shape by watching the
 * Network tab during a real login (Network tab -> Preserve log -> log out -> log in).
 *
 * @param {import('@playwright/test').APIRequestContext} request
 * @returns {Promise<string>} auth token
 */
async function getAuthToken(request) {
  const response = await request.post('/v3/authentication', {
    data: {
      username: process.env.AA_USERNAME,
      password: process.env.AA_PASSWORD,
    },
  });

  if (!response.ok()) {
    throw new Error(`Login failed with status ${response.status()}: ${await response.text()}`);
  }

  const body = await response.json();
  // The exact field name may differ (token / access_token / value) -
  // check the real response JSON and update this line.
  return body.token || body.access_token || body.value;
}

module.exports = { getAuthToken };
