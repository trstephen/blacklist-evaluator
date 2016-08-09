const fs = require('fs');
const _ = require('lodash');

const DATA_FILE_DEFAULT = 'data/default.csv';
const CROSS_SIZE_DEFAULT = 3;

function parseArgs(args) {
  const parsedArgs = {};

  const dataIndex = _.indexOf(args, '--data');
  parsedArgs.dataFileRelPath = dataIndex >= 0
    ? args[dataIndex + 1]
    : DATA_FILE_DEFAULT;

  const crossIndex = _.indexOf(args, '--cross');
  if (crossIndex === -1) {
    parsedArgs.crossValidationSize = 1;
  } else if (args[crossIndex + 1] && _.isNumber(_.parseInt(args[crossIndex + 1]))) {
    parsedArgs.crossValidationSize = args[crossIndex + 1];
  } else {
    parsedArgs.crossValidationSize = CROSS_SIZE_DEFAULT;
  }

  const classifierIndex = _.indexOf(args, '--classifier');
  parsedArgs.classifiers = classifierIndex >= 0
    ? [args[classifierIndex + 1]]
    : fs.readdirSync(`${__dirname}/classifiers`);

  return parsedArgs;
}

module.exports = {
  parseArgs,
};
