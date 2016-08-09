const _ = require('lodash');
const swearjar = require('swearjar');

function evaluate(comments) {
  const classification = [];
  _.forEach(comments, comment => {
    swearjar.profane(comment)
      ? classification.push(1)
      : classification.push(0);
  });

  return classification;
}


module.exports = {
  evaluate,
};
