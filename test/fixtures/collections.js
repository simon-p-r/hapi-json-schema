'use strict';

module.exports = [

    {
        name: 'test',
        indexes: [{
            key: {
                test: 1
            },
            options: {
                name: 'test_test',
                background: true,
                unique: true
            }

        }],
        options: {}
    },
    {
        name: 'example',
        indexes: [{
            key: {
                example: 1
            },
            options: {
                name: 'example_example',
                background: true,
                unique: true
            }
        }],
        options: {}
    }

];
