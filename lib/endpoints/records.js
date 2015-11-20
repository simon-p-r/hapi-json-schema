'use strict';

const DataStore = require( '../handlers/records.js' );
const Joi = require('joi');
const Schema = Joi.object().keys({
    recType: Joi.string().required()
}).required();

module.exports = [

    {
        method: 'GET',
        path: '/ds/record/{record}',
        config: {
            handler: DataStore.getRecords,
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
        path: '/ds/record/{record}/count',
        config: {
            handler: DataStore.getCount
        }
    },
    {
        method: 'GET',
        path: '/ds/record/{record}/keys',
        config: {
            handler: DataStore.getKeys
        }
    },
    {
        method: 'GET',
        path: '/ds/record/{record}/{id}',
        config: {
            handler: DataStore.getRecordByID
        }
    },
    {
        method: 'DELETE',
        path: '/ds/record/{record}/drop',
        config: {
            handler: DataStore.deleteAllRecords
        }
    },
    {
        method: 'DELETE',
        path: '/ds/record/{record}/{id}',
        config: {
            handler: DataStore.deleteRecordbyID
        }
    },
    {
        method: 'DELETE',
        path: '/ds/record/{record}',
        config: {
            handler: DataStore.deleteByQuery,
            validate: {
                query: Joi.object().required()
            }
        }
    },

    {
        method: 'POST',
        path: '/ds/record/{record}',
        config: {
            handler: DataStore.addRecord,
            validate: {
                payload: {
                    recType: Joi.string().required()
                },
                options: {
                    allowUnknown: true
                }
            }
        }
    },
    {
        method: 'PUT',
        path: '/ds/record/{record}/{id}',
        config: {
            handler: DataStore.replaceRecordByID,
            validate: {
                payload: {
                    recType: Joi.string().required()
                },
                options: {
                    allowUnknown: true
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/ds/record/{record}/{id}',
        config: {
            handler: DataStore.updateRecordByID,
            validate: {
                payload: {
                    recType: Joi.string().required()
                },
                options: {
                    allowUnknown: true
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/ds/record/{record}/batch',
        config: {
            handler: DataStore.insertMany,
            validate: {
                payload: Joi.array().items(Schema),
                options: {
                    allowUnknown: true
                }
            }
        }
    }


];
