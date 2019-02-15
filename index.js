const command = require('./src/command.js');
const file = require('./src/file.js');

/**
 * Registers file and command extensions in expect.
 */
function setup() {
    command.setup();
    file.setup();
}

module.exports = {
    command,
    file,
    setup,
};
