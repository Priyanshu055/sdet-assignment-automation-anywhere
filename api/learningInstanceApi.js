const LEARNING_INSTANCE_ENDPOINT = '/cognitive/v3/learninginstances';
const payloadTemplate = require('../fixtures/learningInstancePayload.json');

/**
 * Creates a Learning Instance with the given name.
 * Uses the exact payload structure captured from the real UI (see
 * fixtures/learningInstancePayload.json), just overriding the name so each
 * test run creates a uniquely-named instance.
 *
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} token - value captured from authHelper.getAuthToken()
 * @param {string} name
 */
async function createLearningInstance(request, token, name) {
  const payload = {
    ...payloadTemplate,
    name,
  };

  const response = await request.post(LEARNING_INSTANCE_ENDPOINT, {
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token,
    },
    data: payload,
  });

  if (!response.ok()) {
    throw new Error(`Learning Instance creation failed with status ${response.status()}: ${await response.text()}`);
  }

  return response;
}

module.exports = { createLearningInstance, LEARNING_INSTANCE_ENDPOINT };