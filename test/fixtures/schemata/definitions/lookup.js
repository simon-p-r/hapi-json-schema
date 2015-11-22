'use strict';

module.exports = {

    metaSchema: {
        description: 'example definition',
        type: 'definition',
        jsonSchema: 'v4',
        name: 'lookup',
        version: 1
    },
    schema: {
        type: 'object',
        properties: {
            value: {
                type: 'string'
            }
        },
        required: ['value'],
        additionalProperties: false
    }
};
