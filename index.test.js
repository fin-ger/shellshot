const { setup } = require('shellshot');

it(
    'tests if setup registers correctly in expect',
    () => {
        setup();

        expect(expect.command).toBeDefined();
        expect(expect.file).toBeDefined();
    },
);
