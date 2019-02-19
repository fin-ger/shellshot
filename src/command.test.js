const { command } = require('shellshot');

command.setup();

it(
    'tests if command.setup registers correctly in expect',
    () => {
        expect(expect.command).toBeDefined();
    },
);

it(
    'tests if forExitCode reads the correct exit code',
    async () => {
        await expect.command('./scripts/exitcode.sh 7')
            .forExitCode(expectation => expectation.toBe(7));
    },
);

it(
    'tests if forStdout captures the right output',
    async () => {
        await expect.command('./scripts/stdout.sh Hello, world!')
            .forStdout(expectation => expectation.toBe('Hello, world!\n'));
    },
);

it(
    'tests if forStderr captures the right output',
    async () => {
        await expect.command('./scripts/stderr.sh Hello, world!')
            .forStderr(expectation => expectation.toBe('Hello, world!\n'));
    },
);

it(
    'tests if withStdin passes the right input',
    async () => {
        await expect.command('./scripts/stdin.sh 2')
            .withStdin('Hello', 'World')
            .forStdout(expectation => expectation.toBe('line: Hello\nline: World\n'));
    },
);

it(
    'tests if withStdin succeeds when passing not enough lines',
    async () => {
        await expect.command('./scripts/stdin.sh 3')
            .withStdin('Hello', 'World')
            .forStdout(expectation => expectation.toBe('line: Hello\nline: World\nline: \n'));
    },
);

it(
    'tests if withStdin succeeds when passing too many lines',
    async () => {
        await expect.command('./scripts/stdin.sh 1')
            .withStdin('Hello', 'World')
            .forStdout(expectation => expectation.toBe('line: Hello\n'));
    },
);

it(
    'tests if withEnv sets the correct environment variable',
    async () => {
        await expect.command('./scripts/environment.sh TEST_VARIABLE')
            .withEnv({ TEST_VARIABLE: 'Hello, world!' })
            .forStdout(expectation => expectation.toBe('Hello, world!\n'));
    }
);

it(
    'tests if withCwd sets the correct working directory',
    async () => {
        await expect.command('pwd')
            .withCwd('./src/')
            .forStdout(expectation => expectation.toContain('src'));
    }
);

it(
    'tests if CommandExpectation can handle invalid constructor arguments',
    () => {
        expect(new command.CommandExpectation(null)).rejects.toBeInstanceOf(Error);
    }
);
