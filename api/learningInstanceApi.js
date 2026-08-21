// api/learningInstanceApi.js
// Wraps calls to the Learning Instance API, confirmed from the Network tab:
//   POST https://community.cloud.automationanywhere.digital/cognitive/v3/learninginstances

const LEARNING_INSTANCE_ENDPOINT = '/cognitive/v3/learninginstances';

/**
 * Creates a Learning Instance with the given name and document type.
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} token - value captured from authHelper.getAuthToken()
 * @param {string} name
 * @param {string} documentType - e.g. "Invoices"
 */
async function createLearningInstance(request, token, name, documentType = 'Invoices') {
  const response = await request.post(LEARNING_INSTANCE_ENDPOINT, {
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token,
    },
    data: {
      name,
      description: '',
      documentType,
      // NOTE: the real payload you captured is much larger (fields[], tables[], etc.)
      // Copy the exact JSON body from the "Payload" tab you saved and paste it here
      // (minus the sensitive parts), so the request matches what the UI actually sends.
    },
  });

  return response;
}

module.exports = { createLearningInstance, LEARNING_INSTANCE_ENDPOINT };
