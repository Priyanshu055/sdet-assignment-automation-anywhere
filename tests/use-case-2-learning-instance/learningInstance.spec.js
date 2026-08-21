require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { getAuthDetails } = require('../../api/authHelper');
const { createLearningInstance } = require('../../api/learningInstanceApi');

test.describe('Use Case 2: Learning Instance API Flow (API Automation)', () => {
  let token;
  let domainId;

  test.beforeAll(async ({ playwright }) => {
    const requestContext = await playwright.request.newContext({
      baseURL: process.env.BASE_URL,
    });
    const auth = await getAuthDetails(requestContext);
    token = auth.token;
    domainId = process.env.AA_DOMAIN_ID || auth.domainId;
    expect(token).toBeTruthy();
    expect(domainId).toBeTruthy();
    await requestContext.dispose();
  });

  test('should create a Learning Instance of type Invoice and validate the response', async ({ request }) => {
    const instanceName = `InvoiceLearningInstance_${Date.now()}`;

    const response = await createLearningInstance(
      request,
      token,
      instanceName,
      'Invoice',
      domainId,
      process.env.AA_PROVIDER_ID,
      process.env.AA_DOMAIN_LANGUAGE_PROVIDER_ID
    );

    expect([200, 201]).toContain(response.status());

    const body = await response.json();

    expect(body).toHaveProperty('name', instanceName);
    expect(body).toHaveProperty('domainId', domainId);
    expect(body).toHaveProperty('providerId');
  });

  test('response time should be within an acceptable threshold', async ({ request }) => {
    const start = Date.now();
    const response = await createLearningInstance(
      request,
      token,
      `PerfCheck_${Date.now()}`,
      'Invoice',
      domainId,
      process.env.AA_PROVIDER_ID,
      process.env.AA_DOMAIN_LANGUAGE_PROVIDER_ID
    );
    const duration = Date.now() - start;

    expect([200, 201]).toContain(response.status());
    expect(duration).toBeLessThan(8000);
  });
});