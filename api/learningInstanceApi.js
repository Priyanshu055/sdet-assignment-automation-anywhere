const LEARNING_INSTANCE_ENDPOINT = '/cognitive/v3/learninginstances';

/**
 * Creates a Learning Instance with the given name and document type.
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} token - value captured from authHelper.getAuthToken()
 * @param {string} name
 * @param {string} documentType - e.g. "Invoice"
 */
async function createLearningInstance(
  request,
  token,
  name,
  documentType = 'Invoice',
  domainId,
  providerId,
  domainLanguageProviderId,
  languageId
) {
  const response = await request.post(LEARNING_INSTANCE_ENDPOINT, {
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token,
    },
    data: {
      name,
      description: '',
      documentType,
      domainId,
      providerId,
      domainLanguageProviderId,
      domainLanguageProvider_id: languageId,
      languageId,
    },
  });

  if (!response.ok()) {
    throw new Error(`Learning Instance creation failed with status ${response.status()}: ${await response.text()}`);
  }

  return response;
}

module.exports = { createLearningInstance, LEARNING_INSTANCE_ENDPOINT };