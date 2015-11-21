'use strict';

const Collection = require( '../handlers/collections.js' );
const Joi = require('joi');

module.exports = [

    {
        method: 'GET',
        path: '/ds/collection/{collection}',
        config: {
            handler: Collection.getRecords,
            validate: {
                query: {
                    not: Joi.string().optional(),
                    return: Joi.string().optional(),
                    distinct: Joi.string().optional(),
                    q: Joi.string().optional()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/ds/collection/{collection}/count',
        config: {
            handler: Collection.getCount
        }
    },
    {
        method: 'GET',
        path: '/ds/collection/{collection}/keys',
        config: {
            handler: Collection.getKeys
        }
    }
];
