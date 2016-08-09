const _ = require('lodash');

function arrayAvg(arr) {
  if (!arr || arr.length === 0) return undefined;

  const sum = _.reduce(arr, (prev, curr) => curr += prev, 0);
  return sum / arr.length;
}

function chunkify(arr, numChunks) {
  const chunks = [];
  const chunkSize = Math.floor(arr.length / numChunks);

  while (arr.length >= chunkSize) {
    chunks.push(arr.splice(0, chunkSize));
  }

  return chunks;
}

function score(actualClass, evaluatedClass) {
  const pairs = _.zip(actualClass, evaluatedClass);
  let truePos = 0; let trueNeg = 0; let falsePos = 0; let falseNeg = 0;

  _.forEach(pairs, pair => {
    if (_.isEqual(pair, [0, 0])) {
      trueNeg++;
    } else if (_.isEqual(pair, [0, 1])) {
      falsePos++;
    } else if (_.isEqual(pair, [1, 0])) {
      falseNeg++;
    } else if (_.isEqual(pair, [1, 1])) {
      truePos++;
    }
  });

  const precision = truePos / (truePos + falsePos) || 0;
  const recall = truePos / (truePos + falseNeg) || 0;
  const f1 = (precision * recall) / (precision + recall) || 0;

  return [precision, recall, f1];
}

function useCrossValidation(crossValidationSize) {
  return crossValidationSize > 1;
}

function printScore(scores, classifierName) {
  const [precision, recall, f1] = scores;

  console.log(`
    Results for ${classifierName}
    ==========
    Precision: ${precision.toFixed(4)}
    Recall:    ${recall.toFixed(4)}
    F1:        ${f1.toFixed(4)}
    `);
}

function evaluateClassifiers(testData, classifiers, crossValidationSize) {
  const shuffledTestData = _.shuffle(testData);
  const [actualClass, comments] = _.unzip(shuffledTestData); // [[0, 'a'], [1, 'b']] -> [[0, 1], ['a', 'b']]
  let scores = [];

  let actualClassChunks = [];
  let commentChunks = [];
  if (useCrossValidation(crossValidationSize)) {
    actualClassChunks = chunkify(actualClass, crossValidationSize);
    commentChunks = chunkify(comments, crossValidationSize);
  }

  _.forEach(classifiers, classifierName => {
    const classifier = require(`${__dirname}/classifiers/${classifierName}`);
    if (useCrossValidation(crossValidationSize)) {
      const evaluatedClassChunks = _.map(commentChunks, classifier.evaluate);
      const scoreChunks = _.map(actualClassChunks, (actualClassChunk, chunkIndex) =>
        score(actualClassChunk, evaluatedClassChunks[chunkIndex])
      );
      scores = _.map(_.zip(...scoreChunks), arrayAvg);
    } else {
      const evaluatedClass = classifier.evaluate(comments);
      scores = score(actualClass, evaluatedClass);
    }
    printScore(scores, classifierName);
  });
}

module.exports = {
  evaluateClassifiers,
};
