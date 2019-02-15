const { spawn } = require('child_process');
const toString = require('stream-to-string');

/**
 * A custom promise to make chaining of expectations possible.
 */
class CommandExpectation extends Promise {
    /**
     * Create a new chainable expectation promise.
     * @param value Either an executor function or another promise.
     */
    constructor(value) {
        if (value instanceof Function) {
            super(value);
        } else {
            super((resolve, reject) => {
                if (value instanceof Promise) {
                    value.then(resolve, reject);
                } else {
                    reject(new Error('value is neither an executor nor a promise!'));
                }
            });
        }
    }

    _wrap(matcher, action) {
        return this.then(([stdout, stderr, exitCode]) => {
            matcher(action(stdout, stderr, exitCode));
            return [ stdout, stderr, exitCode ];
        });
    }

    /**
     * Apply the given matcher for the commands stdout.
     *
     * ## Example:
     * ```js
     * expect.command('echo hello')
     *     .forStdout(expectation => expectation.toBe('hello\n'));
     * ```
     *
     * @param matcher A function taking the stdout expectation (an object produced by jest's expect)
     *                as its first argument.
     * @returns Another CommandExpectation for chaining.
     */
    forStdout(matcher) {
        return this._wrap(matcher, (stdout, stderr, exitCode) => expect(stdout));
    }

    /**
     * Apply the given matcher for the commands stderr.
     *
     * ## Example:
     * ```js
     * expect.command('myerrprinter hello')
     *     .forStderr(expectation => expectation.toBe('hello\n'));
     * ```
     *
     * @param matcher A function taking the stderr expectation (an object produced by jest's expect)
     *                as its first argument.
     * @returns Another CommandExpectation for chaining.
     */
    forStderr(matcher) {
        return this._wrap(matcher, (stdout, stderr, exitCode) => expect(stderr));
    }

    /**
     * Apply the given matcher for the commands exit code.
     *
     * ## Example:
     * ```js
     * expect.command('false')
     *     .forExitCode(expectation => expectation.toBe(1));
     * ```
     *
     * @param matcher A function taking the exit code expectation (an object produced by jest's expect)
     *                as its first argument.
     * @returns Another CommandExpectation for chaining.
     */
    forExitCode(matcher) {
        return this._wrap(matcher, (stdout, stderr, exitCode) => expect(exitCode));
    }
}

/**
 * A builder class for a chainable CommandExpectation
 */
class CommandExpectationBuilder {
    /**
     * Create a new builder for a CommandExpectation.
     * @param commandLine The command line that should be spawned.
     */
    constructor(commandLine) {
        this._commandLine = commandLine;
        this._cwd = '.';
        this._env = {};
        this._stdinLines = [];
    }

    /**
     * Set the current working directory for the command that will be executed.
     * @param cwd The directory as a string.
     * @returns An instance of this builder for chaining.
     */
    withCwd(cwd) {
        this._cwd = cwd;

        return this;
    }

    /**
     * Set environment variables with a key-value object for the command that
     * will be executed.
     * @param environment The key-value environment object (e.g. `{ MY_VAR: 'true' }`).
     * @returns An instance of this builder for chaining.
     */
    withEnv(environment) {
        this._env = environment;

        return this;
    }

    /**
     * Set the input lines that will be passed to the command that will be executed.
     * @param stdinLines All lines that will passed on stdin as a parameter list.
     * @returns An instance of this builder for chaining.
     */
    withStdin(...stdinLines) {
        this._stdinLines = stdinLines;

        return this;
    }

    /**
     * Execute the command with the previously build up configuration.
     * @returns A new CommandExpectation that can be used to match for
     *          stdout, stderr, and the exit code.
     */
    _build() {
        const args = this._commandLine.split(' ');
        const command = args.shift();
        const proc = spawn(command, args, {
            cwd: this._cwd,
            env: this._env,
        });

        const onExit = new Promise((resolve, reject) => {
            proc.on('exit', resolve);
        });
        const onStdout = toString(proc.stdout);
        const onStderr = toString(proc.stderr);

        for (const line of this._stdinLines) {
            proc.stdin.write(line + '\n');
        }
        proc.stdin.end();

        this._commandLine = null;
        this._cwd = null;
        this._env = null;
        this._stdinLines = null;

        return new CommandExpectation(Promise.all([onStdout, onStderr, onExit]));
    }

    /**
     * Apply the given matcher for the commands exit code.
     *
     * ## Example:
     * ```js
     * expect.command('false')
     *     .forExitCode(expectation => expectation.toBe(1));
     * ```
     *
     * @param matcher A function taking the exit code expectation (an object produced by jest's expect)
     *                as its first argument.
     * @returns A CommandExpectation for chaining.
     */
    forExitCode(matcher) {
        return this._build().forExitCode(matcher);
    }

    /**
     * Apply the given matcher for the commands stdout.
     *
     * ## Example:
     * ```js
     * expect.command('echo hello')
     *     .forStdout(expectation => expectation.toBe('hello\n'));
     * ```
     *
     * @param matcher A function taking the stdout expectation (an object produced by jest's expect)
     *                as its first argument.
     * @returns A CommandExpectation for chaining.
     */
    forStdout(matcher) {
        return this._build().forStdout(matcher);
    }

    /**
     * Apply the given matcher for the commands stderr.
     *
     * ## Example:
     * ```js
     * expect.command('myerrprinter hello')
     *     .forStderr(expectation => expectation.toBe('hello\n'));
     * ```
     *
     * @param matcher A function taking the stderr expectation (an object produced by jest's expect)
     *                as its first argument.
     * @returns A CommandExpectation for chaining.
     */
    forStderr(matcher) {
        return this._build().forStderr(matcher);
    }
}

/**
 * Registers the command extension in expect.
 */
function setup() {
    /**
     * Runs the given command line (command and arguments) and provides produced
     * stdout, stderr, and exit code for matching.
     */
    expect.command = (commandLine) => {
        return new CommandExpectationBuilder(commandLine);
    };
}

module.exports = {
    CommandExpectation,
    CommandExpectationBuilder,
    setup,
};
