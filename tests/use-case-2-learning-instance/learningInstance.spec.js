// tests/use-case-2-learning-instance/learningInstance.spec.js
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
    // Step 1: authenticate and capture the token
    token = await getAuthToken(requestContext);
    expect(token).toBeTruthy();
    await requestContext.dispose();
  });

  test('should create a Learning Instance of type Invoice and validate the response', async ({ request }) => {
    const instanceName = `InvoiceLearningInstance_${Date.now()}`;

    // Step 3: create the Learning Instance via API
    const response = await createLearningInstance(request, token, instanceName, 'Invoices');

    // Assert HTTP status code
    expect(response.status()).toBe(200); // or 201, confirm against real API response

    const body = await response.json();

    // Assert response body schema / field-level checks
    expect(body).toHaveProperty('name', instanceName);
    expect(body).toHaveProperty('domainId');
    // expect(body).toHaveProperty('id'); // uncomment once confirmed the field exists

    // Functional accuracy: correct document type
    // expect(body.documentType).toBe('Invoices');
  });

  test('response time should be within an acceptable threshold', async ({ request }) => {
    const start = Date.now();
    const response = await createLearningInstance(request, token, `PerfCheck_${Date.now()}`, 'Invoices');
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(8000); // 8s threshold, adjust as needed
  });
});
