'use strict';

var collection = {

    metaSchema: {
        description: 'example collection',
        type: 'collection',
        jsonSchema: 'v4',
        name: 'exampleCollection',
        version: 1
    },
    schema: {
        type: 'object',
        additionalProperties: false,
        properties: {

            someField: {
                type: 'string',
                maxLength: 50
            },
            '$ref.anotherField': 'exampleDefinition'
        },
        required: ['someField']
    }
};


var definition = {

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

var record = {

    metaSchema: {
        description: 'example record',
        type: 'record',
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

    collection,
    definition,
    record
];
