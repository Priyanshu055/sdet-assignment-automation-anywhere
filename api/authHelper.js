/**
 * Gets an API token from the configured environment or login endpoint.
 *
 * @param {import('@playwright/test').APIRequestContext} request
 * @returns {Promise<string>} auth token
 */
async function getAuthToken(request) {
  const details = await getAuthDetails(request);
  return details.token;
}

async function getAuthDetails(request) {
  if (process.env.AA_API_TOKEN) {
    return {
      token: process.env.AA_API_TOKEN,
      domainId: process.env.AA_DOMAIN_ID,
    };
  }

  if (!process.env.AA_AUTH_ENDPOINT) {
    throw new Error('Set AA_API_TOKEN or AA_AUTH_ENDPOINT from the browser Network request');
  }

  const response = await request.post(process.env.AA_AUTH_ENDPOINT, {
    data: {
      username: process.env.AA_USERNAME,
      password: process.env.AA_PASSWORD,
    },
  });

  if (!response.ok()) {
    throw new Error(`Login failed with status ${response.status()}: ${await response.text()}`);
  }

  const body = await response.json();
  return {
    token: body.token || body.access_token || body.value,
    domainId: body.domainId || body.tenantUuid,
  };
}

module.exports = { getAuthToken, getAuthDetails };