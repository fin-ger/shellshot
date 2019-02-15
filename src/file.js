const { readFileSync } = require('fs');

/**
 * Registers the file extension in expect.
 */
function setup() {
    /**
     * Expect the content of a file with an optional encoding.
     */
    expect.file = (filename, encoding) => {
        return expect(readFileSync(filename, encoding));
    };
}

module.exports = {
    setup,
};
