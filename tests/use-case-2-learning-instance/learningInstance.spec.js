require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { getAuthToken } = require('../../api/authHelper');
const { createLearningInstance } = require('../../api/learningInstanceApi');

test.describe('Use Case 2: Learning Instance API Flow (API Automation)', () => {
  let token;

  test.beforeAll(async ({ playwright }) => {
    const requestContext = await playwright.request.newContext({
      baseURL: process.env.BASE_URL,
    });
    token = await getAuthToken(requestContext);
    expect(token).toBeTruthy();
    await requestContext.dispose();
  });

  test('should create a Learning Instance of type Invoice and validate the response', async ({ request }) => {
    const instanceName = `InvoiceLearningInstance_${Date.now()}`;

    const response = await createLearningInstance(request, token, instanceName, 'Invoices');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('name', instanceName);
    expect(body).toHaveProperty('domainId');
  });

  test('response time should be within an acceptable threshold', async ({ request }) => {
    const start = Date.now();
    const response = await createLearningInstance(request, token, `PerfCheck_${Date.now()}`, 'Invoices');
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(8000);
  });
});