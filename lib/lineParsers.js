const _ = require('lodash');

function defaultParser(line, parsedComments) {
  const [isAbusive, ...comment] = _.map(line.split(','));

  parsedComments.push([
    _.toNumber(isAbusive),
    comment.join().replace(/"""/g, ''),
  ]);
}

function kaggle(line, parsedComments) {
  const [isAbusive, date, ...comment] = _.map(line.split(','));

  parsedComments.push([
    _.toNumber(isAbusive),
    comment.join().replace(/"""/g, ''),
  ]);
}

module.exports = {
  defaultParser,
  kaggle,
};
