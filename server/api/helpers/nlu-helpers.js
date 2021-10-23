const { MODELS } = require('./constants');
const { catchAndPrintError } = require('./error-helper');

const nluAResponse = require('./mocks/nlu_a_response.json');
const nluBResponse = require('./mocks/nlu_b_response.json');

const mockServiceResponse = (requestBody, responseBody, responseDelayMs) =>
  new Promise(resolve => setTimeout(() => resolve(responseBody), responseDelayMs));

const processNluA = async text => {
  const body = {
    text,
    model: MODELS.NLU_A
  };
  const result = await mockServiceResponse(body, nluAResponse, 300);
  return result;
};

const processNluB = async text => {
  const body = {
    utterance: text,
    model: MODELS.NLU_B
  };
  const { intent, entity, confidence } = await mockServiceResponse(body, nluBResponse, 250);
  return {
    intents: [intent],
    entities: [entity],
    confidence
  };
};

const getBestNluResult = async (text, processors = [processNluA, processNluB]) => {
  const promises = processors.map(processor => processor(text).catch(catchAndPrintError));
  const results = await Promise.all(promises);

  const bestConfidence = Math.max(...results.map(result => result?.confidence || 0));

  const bestResult = {
    intents: [],
    entities: []
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const result of results) {
    if (result && result?.confidence === bestConfidence) {
      bestResult.intents = [...bestResult.intents, ...result.intents];
      bestResult.entities = [...bestResult.entities, ...result.entities];
    }
  }

  if (bestResult.intents.length || bestResult.entities.length) {
    return {
      intents: [...new Set(bestResult.intents)],
      entities: [...new Set(bestResult.entities)],
      confidence: bestConfidence
    };
  }

  throw new Error('Error on NLU requests');
};

module.exports = {
  processNluA,
  processNluB,
  getBestNluResult
};
