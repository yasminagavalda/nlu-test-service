const express = require('express');

const router = express.Router();

const process = require('./handlers/process-text');

/**
 * @swagger
 * /process/{text}:
 *   get:
 *     description: Process input text with third party NLUs and return the best result
 *     parameters:
 *       - name: text
 *         in: path
 *         description: Text to process
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: NLU result
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                intents:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: Intent with the best confidence
 *                    example: greetings
 *                entities:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: Entity with the best confidence
 *                    example: name
 *                confidence:
 *                  type: number
 *                  description: The confidence for the intents/entities returned
 *                  example: 0.9
 *       500:
 *         description: Internal server error
 */
router.get('/process/:text', process);

module.exports = router;
