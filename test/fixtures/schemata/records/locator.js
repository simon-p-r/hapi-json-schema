'use strict';

module.exports = {

    metaSchema: {
        description: 'example record',
        type: 'record',
        base: 'lookup',
        jsonSchema: 'v4',
        name: 'locator',
        version: 1,
        rids: ['recType', 'lookup.value']
    },
    schema: {
        type: 'object',
        additionalProperties: false,
        properties: {

            '$ref.recType': 'recType',
            '$ref._id': '_id',
            '$ref.lookup': 'lookup'
        },
        required: ['recType', 'lookup', '_id']
    }
};
