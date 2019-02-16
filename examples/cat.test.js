const { setup } = require('shellshot');

setup();

it(
    'runs cat --help and checks if cat is contained',
    async () => {
        await expect.command('cat --help')
            .forStdout(expectation => expectation.toContain(' cat '));
    },
);

it(
    'runs cat and matches snapshot for given input',
    async () => {
        await expect.command('cat')
            .withStdin('hello')
            .forStdout(expectation => expectation.toBe('hello\n'));
    },
);
