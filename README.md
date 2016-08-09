Blacklist Evaluator
======
Evaluates the [precision, recall](https://en.wikipedia.org/wiki/Precision_and_recall) and [F1 score](https://en.wikipedia.org/wiki/F1_score) of profanity classifiers.

## Usage
```
./index.js [--data data/my_data.csv] [--classifier foo.js][--cross [n]]

  --data:       If unspecified, uses data/default.csv
  --classifier: Specify a single classifier for evaluation in lib/classifiers
  --cross:      Use cross validation
                  Default, no cross validation.
                  3-fold default if n unspecified.
```

## Adding new classifiers
Add a module in `lib/classifiers/` that contains an `evaluate` function that will take an array of strings and return a same-sized array of classifications where `0: not abusive; 1: abusive`. e.g.
```
['abusive', 'not abusive', 'abusive'] -> [1, 0, 1]
```

## Data sources
The TOU of certain datasets restrict their distribution via Github, etc. Download them and use them for testing by specifying the `--data ${path}` argument.

1. [Detecting Insults in Social Commentary (Kaggle.com)](https://www.kaggle.com/c/detecting-insults-in-social-commentary/data)

Custom line parsers can be added in `lib/lineParsers.js` and then called in `index.js` based on keys in the filename. e.g. `data/_kaggle-train.csv` will use `lineParsers.kaggle` because the `'kaggle'` substring is in the filename.

### Adding data
Include a `.csv` formatted as:
```
isAbusive, comment (include header in file)
0 or 1, """text comment for classification in triple quotes"""
```
