'use strict';


const _id = {

    metaSchema: {
        description: 'example definition',
        type: 'definition',
        jsonSchema: 'v4',
        name: '_id',
        version: 1
    },
    schema: {
        type: 'string'
    }
};


const recType = {

    metaSchema: {
        description: 'example definition',
        type: 'definition',
        jsonSchema: 'v4',
        name: 'recType',
        version: 1
    },
    schema: {
        type: 'string'
    }
};


const lookup = {

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

const salutation = {

    metaSchema: {
        description: 'example record',
        type: 'record',
        base: 'lookup',
        jsonSchema: 'v4',
        name: 'salutation',
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

const locator = {

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

module.exports = [

    _id,
    locator,
    lookup,
    recType,
    salutation
];
