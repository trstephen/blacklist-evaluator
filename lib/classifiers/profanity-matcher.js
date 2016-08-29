const _ = require('lodash');
const ProfanityMatcher = require('profanity-matcher');

function evaluate(comments) {
  const pm = new ProfanityMatcher();
  const classification = [];

  _.forEach(comments, comment => {
    const result = pm.scan(comment);
    _.size(result) > 0
      ? classification.push(1)
      : classification.push(0);
  });

  return classification;
}

module.exports = {
  evaluate,
};
