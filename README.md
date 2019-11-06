# shellshot

[![build status](https://travis-ci.org/fin-ger/shellshot.svg?branch=master)](https://travis-ci.org/fin-ger/shellshot) [![code coverage](https://codecov.io/gh/fin-ger/shellshot/branch/master/graph/badge.svg)](https://codecov.io/gh/fin-ger/shellshot) [![maintainability](https://api.codeclimate.com/v1/badges/02eaa1983c17f56bb942/maintainability)](https://codeclimate.com/github/fin-ger/shellshot/maintainability) ![code size](https://img.shields.io/github/languages/code-size/fin-ger/shellshot.svg?style=flat) ![npm minified size](https://img.shields.io/bundlephobia/min/shellshot.svg?style=flat) [![](https://img.shields.io/npm/v/shellshot.svg?style=flat)](https://www.npmjs.com/package/shellshot) [![gitter](https://img.shields.io/gitter/room/fin-ger/shellshot.svg?style=flat)](https://gitter.im/shellshot/community) [![donate](https://img.shields.io/liberapay/receives/fin-ger.svg?logo=liberapay&style=flat)](https://liberapay.com/fin-ger/donate) [![Built with Spacemacs](https://cdn.rawgit.com/syl20bnr/spacemacs/442d025779da2f62fc86c2082703697714db6514/assets/spacemacs-badge.svg)](http://spacemacs.org)

A command-line interface testing extension for jest.

---

## What is `shellshot`?

The main purpose of `shellshot` is running end2end tests for command-line applications. By providing a speaking API, it is also suited for non-javascript applications and is actually meant to be used for all types of command-line applications.

## Features

 * Run any given command and test for `stdout`, `stderr`, and the `exit code` of the application
 * By integrating into `jest` all of the well known [testing API](https://jestjs.io/docs/en/api) can be used with `shellshot`
 * Checking content of files and streams
 * Using [snapshot testing](https://jestjs.io/docs/en/snapshot-testing) of `jest`

## Getting started

### Install `shellshot` in your current directory

```
$ npm install shellshot
```

This will create a `node_modules` folder containing all dependencies for `shellshot` including `jest`. Make sure to add `node_modules` to your `.gitignore`. The `package-lock.json` file should also be added to your `.gitignore`.

### Creating your first test

To run `jest` tests in your current folder you need to create a `jest` configuration:

```
$ touch jest.config.js
```

You can leave the config empty for now.

Now create a new file `awesome.test.js` with the following content:

```js
const { setup } = require('shellshot');

setup();

it(
    'should run my first shellshot test',
    async () => {
        await expect.command('ls -l')
            .forStdout(expectation => expectation.toContain('jest.config.js'))
            .forExitCode(expectation => expectation.toBe(0));
    },
);
```

Now run lets run your first test:

```
$ ./node_modules/.bin/jest
 PASS  ./awesome.test.js
  ✓ should run my first shellshot test (12ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.863s
Ran all test suites.
```

Have a look at the examples folder for more examples.
