const { setup } = require('shellshot');

setup();

it(
    'runs cat --help and matches snapshot',
    async () => {
        await expect.command('cat --help')
            .forStdout(expectation => expectation.toMatchSnapshot());
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
