'use strict';

const definition = {

    metaSchema: {
        description: 'example definition',
        type: 'definition',
        jsonSchema: 'v4',
        name: 'exampleDefinition',
        version: 1
    },
    schema: {
        type: 'object',
        additionalProperties: false,
        properties: {

            someOtherField: {
                type: 'string',
                maxLength: 50
            }
        },
        required: ['someOtherField']
    }
};

const record = {

    metaSchema: {
        description: 'example record',
        type: 'record',
        base: 'exampleCollection',
        jsonSchema: 'v4',
        name: 'exampleRec',
        version: 1,
        keys: [{
            name: 'sid',
            flds: {
                'test': 1
            }
        }]
    },
    schema: {
        type: 'object',
        additionalProperties: false,
        properties: {

            mainField: {
                type: 'string',
                maxLength: 50
            },
            test: {
                type: 'string',
                maxLength: 50,
                format: 'key'
            }
        },
        required: ['mainField', 'test']
    }
};

module.exports = [

    definition,
    record
];
