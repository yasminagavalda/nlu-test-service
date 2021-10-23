const { getBestNluResult } = require('../helpers/nlu-helpers');

const process = async (req, res) => {
  const { text } = req.params;
  try {
    const result = await getBestNluResult(text);
    return res.send(result);
  } catch (err) {
    return res.status(500).send({
      error: 'Internal server error'
    });
  }
};

module.exports = process;
