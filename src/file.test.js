const { file } = require('shellshot');

file.setup();

it(
    'tests if file.setup registers correctly in expect',
    () => {
        expect(expect.file).toBeDefined();
    },
);

it(
    'tests if expect.file reads file properly',
    async () => {
        expect.file('package.json', 'utf-8').toContain('shellshot');
    },
);
