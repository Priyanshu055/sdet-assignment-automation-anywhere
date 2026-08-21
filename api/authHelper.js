/**
 * Logs in via API and returns the auth token.
 * Check the real login response shape and update the field name below
 * (token / access_token / value) once confirmed against the actual API.
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
  return body.token || body.access_token || body.value;
}

module.exports = { getAuthToken };