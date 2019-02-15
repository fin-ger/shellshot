const { setup } = require('shellshot');

setup();

it(
    'checks if the content of the file myfile is still the same',
    async () => {
        await expect.file('./res/myfile').toMatchSnapshot();
    },
);
