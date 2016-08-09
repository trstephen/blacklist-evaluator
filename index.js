#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const _ = require('lodash');
const classifierEval = require('./lib/classifierEval');
const lineParsers = require('./lib/lineParsers');
const { parseArgs } = require('./lib/parseArgs');

const parsedArgs = parseArgs(process.argv);
const dataFileRelPath = parsedArgs.dataFileRelPath;
const dataFile = path.join(__dirname, dataFileRelPath);
const crossValidationSize = parsedArgs.crossValidationSize;
const classifiers = parsedArgs.classifiers;
const parsedComments = [];

const rl = readline.createInterface({
  input: fs.createReadStream(dataFile, 'utf8'),
});

let lineParser = null;
if (_.includes(dataFile, 'kaggle')) {
  lineParser = lineParsers.kaggle;
} else {
  lineParser = lineParsers.defaultParser;
}

rl.on('line', line => lineParser(line, parsedComments));

rl.on('close', () => {
  const [header, ...classifiedComments] = parsedComments;
  console.log(`Running evaluation for ${dataFileRelPath} (${classifiedComments.length} comments)`);
  if (crossValidationSize > 1) {
    const groupSize = Math.floor(classifiedComments.length / crossValidationSize);
    console.log(`Using ${crossValidationSize}-fold validation`);
    console.log(`Validations using sets of ${groupSize} comments (${classifiedComments.length % groupSize} comments omitted)`); // eslint-disable-line max-len
  }
  classifierEval.evaluateClassifiers(classifiedComments, classifiers, crossValidationSize);
});
