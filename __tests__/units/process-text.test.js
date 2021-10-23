/* global jest, expect, describe, test */

const { getBestNluResult } = require('../../server/api/helpers/nlu-helpers');

const {
  nluResponseBestConfidence,
  nluResponseWorstConfidence,
  nluResponseBestConfidence2,
  nluResponseBestConfidence3,
  nluBestResultMerged,
  nluBestResultMergedFiltered
} = require('../fixtures/nlu-responses.json');

describe('getBestNluResult helper', () => {
  test('Should return the response from NLU_A if the confidence is greater than NLU_B', async () => {
    const processNluA = jest.fn(() => new Promise(resolve => resolve(nluResponseBestConfidence)));
    const processNluB = jest.fn(() => new Promise(resolve => resolve(nluResponseWorstConfidence)));
    const result = await getBestNluResult('text', [processNluA, processNluB]);
    expect(result).toEqual(nluResponseBestConfidence);
  });

  test('Should return the response from NLU_A if NLU_B request fails', async () => {
    const processNluA = jest.fn(() => new Promise(resolve => resolve(nluResponseWorstConfidence)));
    const processNluB = jest.fn(() => new Promise((resolve, reject) => reject(new Error('Test'))));
    const result = await getBestNluResult('text', [processNluA, processNluB]);
    expect(result).toEqual(nluResponseWorstConfidence);
  });

  test('Should return the response from NLU_B if the confidence is greater than NLU_A', async () => {
    const processNluA = jest.fn(() => new Promise(resolve => resolve(nluResponseWorstConfidence)));
    const processNluB = jest.fn(() => new Promise(resolve => resolve(nluResponseBestConfidence)));
    const result = await getBestNluResult('text', [processNluA, processNluB]);
    expect(result).toEqual(nluResponseBestConfidence);
  });

  test('Should return the response from NLU_B if NLU_A request fails', async () => {
    const processNluA = jest.fn(() => new Promise((resolve, reject) => reject(new Error('Test'))));
    const processNluB = jest.fn(() => new Promise(resolve => resolve(nluResponseWorstConfidence)));
    const result = await getBestNluResult('text', [processNluA, processNluB]);
    expect(result).toEqual(nluResponseWorstConfidence);
  });

  test('Should return the merged intents and entities from NLU_A and NLU_B if the confidence is the same for both responses', async () => {
    const processNluA = jest.fn(() => new Promise(resolve => resolve(nluResponseBestConfidence)));
    const processNluB = jest.fn(() => new Promise(resolve => resolve(nluResponseBestConfidence2)));
    const result = await getBestNluResult('text', [processNluA, processNluB]);
    expect(result).toEqual(nluBestResultMerged);
  });

  test('Should return the merged intents and entities from NLU_A and NLU_B, filterng repeated values, if the confidence is the same for both responses', async () => {
    const processNluA = jest.fn(() => new Promise(resolve => resolve(nluResponseBestConfidence)));
    const processNluB = jest.fn(() => new Promise(resolve => resolve(nluResponseBestConfidence3)));
    const result = await getBestNluResult('text', [processNluA, processNluB]);
    expect(result).toEqual(nluBestResultMergedFiltered);
  });

  test('Should throw an error if both requests fails', async () => {
    const processNluA = jest.fn(() => new Promise((resolve, reject) => reject(new Error('Test'))));
    const processNluB = jest.fn(() => new Promise((resolve, reject) => reject(new Error('Test'))));
    let error;
    try {
      await getBestNluResult('text', [processNluA, processNluB]);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
