const _ = require('lodash');
const filter = require('profanity-analysis');

function evaluate(comments) {
  const classification = [];
  _.forEach(comments, comment => {
    const result = filter.analyzeBlob(comment);
    result.precentage > 0.0 // not a typo :/
      ? classification.push(1)
      : classification.push(0);
  });

  return classification;
}

module.exports = {
  evaluate,
};
