'use strict';

const Async = require('neo-async');
const Boom = require('boom');
const Type = require('basic-utils');
const Utils = require('../utils.js');


module.exports = {

    getRecords: function (request, reply) {

        const records = request.server.app.dataStore.records;
        const recordName = Object.keys(records).map((e) => {

            return e;
        }).indexOf(request.params.record);

        if (recordName === -1 ) {
            return reply(Boom.badRequest('Invalid record name ' + request.params.record));
        }
        const Model = records[request.params.record];
        const query = {};
        const findFlds = {};
        const returnFlds = {};

        if (request.query.distinct) {

            const key = request.query.distinct;
            const options = {};
            Model.distinct(key, query, options, (err, docs) => {

                // $lab:coverage:off$
                if (err) {
                    return reply(Boom.badRequest(err), 'occurred while making distinct query');
                }
                // $lab:coverage:on$
                return reply(docs);

            });
        }

        if (request.query.not) {
            const fields = request.query.not.split(',');
            fields.forEach((field) => {

                returnFlds[field] = 0;
            });

            Model.find(findFlds, returnFlds, (err, docs) => {

                // $lab:coverage:off$
                if (err) {
                    return reply(Boom.badRequest(err), 'occurred while making not query');
                }
                // $lab:coverage:on$
                return reply(docs);
            });
        }

        if (request.query.return) {
            const flds = request.query.return.split(',');
            flds.forEach((fld) => {

                returnFlds[fld] = 1;
            });
            Model.find(findFlds, returnFlds, (err, docs) => {

                // $lab:coverage:off$
                if (err) {
                    return reply(Boom.badRequest(err), 'occurred while making return query');
                }
                // $lab:coverage:on$
                return reply(docs);
            });
        }



        if (Object.keys(request.query).length === 0) {

        //Returns all records
            Model.find((err, docs) => {

                // $lab:coverage:off$
                if (err) {
                    return reply(Boom.badRequest(err), 'occurred while returning find all docs');
                }
                // $lab:coverage:on$
                return reply(docs);

            });
        }
        if (request.query.q) {

            Model.find(findFlds, request.query.q, (err, docs) => {

                // $lab:coverage:off$
                if (err) {
                    return reply(Boom.badRequest(err), 'occurred while making find query');
                }
                // $lab:coverage:on$
                return reply(docs);
            });
        }

    },

    getCount: function (request, reply) {

        // TODO add options paramter for mongodb count method
        const records = request.server.app.dataStore.records;
        const recordName = Object.keys(records).map((e) => {

            return e;
        }).indexOf(request.params.record);

        if (recordName === -1 ) {
            return reply(Boom.badRequest('Invalid record name ' + request.params.record));
        }
        const Model = records[request.params.record];
        const query = request.query;
        Model.count(query, {}, (err, count) => {

            // $lab:coverage:off$
            if (err) {
                return reply(Boom.badRequest(err), 'occurred while making count query');
            }
            // $lab:coverage:on$
            return reply(count);
        });
    },

    getKeys: function (request, reply) {

        const records = request.server.app.dataStore.records;
        const recordName = Object.keys(records).map((e) => {

            return e;
        }).indexOf(request.params.record);

        if (recordName === -1 ) {
            return reply(Boom.badRequest('Invalid record name ' + request.params.record));
        }
        const Model = records[request.params.record];
        const selector = {
            '_id': 1
        };
        Model.find({}, selector, (err, docs) => {

            // $lab:coverage:off$
            if (err) {
                return reply(Boom.badRequest(err), 'occurred while making getKeys query');
            }
            // $lab:coverage:on$
            return reply(docs);
        });

    },

    getRecordByID: function (request, reply) {

        const records = request.server.app.dataStore.records;
        const recordName = Object.keys(records).map((e) => {

            return e;
        }).indexOf(request.params.record);

        if (recordName === -1 ) {
            return reply(Boom.badRequest('Invalid record name ' + request.params.record));
        }
        const Model = records[request.params.record];
        const id = request.params.record + Utils.SID_DIVIDER + request.params.id;
        const returnFlds = {};
        const model = new Model({ _id: id });
        if (request.query.not) {
            const fields = request.query.not.split(',');
            fields.forEach((field) => {

                returnFlds[field] = 0;
            });
            model.findOne(returnFlds, (err, doc) => {

                // $lab:coverage:off$
                if (err) {
                    return reply(Boom.badRequest(err), 'occurred while getting record id ' + request.params.id);
                }
                 // $lab:coverage:on$
                if (doc) {
                    return reply(doc);
                }
                return reply(Boom.badRequest('No matching documents found for that id'));
            });
        }

        if (request.query.return) {
            const flds = request.query.return.split(',');
            flds.forEach((fld) => {

                returnFlds[fld] = 1;
            });
            model.findOne(returnFlds, (err, doc) => {

                // $lab:coverage:off$
                if (err) {
                    return reply(Boom.badRequest(err), 'occurred while using return query for record id ' + request.params.id);
                }
                // $lab:coverage:on$
                if (doc) {
                    return reply(doc);
                }
                return reply(Boom.badRequest('No matching documents found for that id'));
            });
        }
        if (Object.keys(request.query).length === 0) {
            model.findOne((err, doc) => {

                // $lab:coverage:off$
                if (err) {
                    return reply(Boom.badRequest(err), 'occurred while querying record id ' + request.params.id);
                }
                // $lab:coverage:on$
                if (doc) {
                    return reply(doc);
                }
                return reply(Boom.badRequest('No matching documents found for that id'));
            });
        }

    },


    deleteAllRecords: function (request, reply) {

        const records = request.server.app.dataStore.records;
        const recordName = Object.keys(records).map((e) => {

            return e;
        }).indexOf(request.params.record);

        if (recordName === -1 ) {
            return reply(Boom.badRequest('Invalid record name ' + request.params.record));
        }
        const Model = records[request.params.record];
        Model.deleteMany({ recType: request.params.record }, (err, deleted) => {

            // $lab:coverage:off$
            if (err) {
                return reply(Boom.badRequest(err), 'occurred while deleting many records');
            }
            // $lab:coverage:on$
            const msg = 'Removed ' + deleted.result.n + ' of record type: ' + request.params.record;
            return reply({ delete: msg });

        });

    },

    deleteRecordbyID: function (request, reply) {

        const records = request.server.app.dataStore.records;
        const recordName = Object.keys(records).map((e) => {

            return e;
        }).indexOf(request.params.record);

        if (recordName === -1 ) {
            return reply(Boom.badRequest('Invalid record name ' + request.params.record));
        }
        const Model = records[request.params.record];
        const id = request.params.record + Utils.SID_DIVIDER + request.params.id;
        const model = new Model({ _id: id });
        model.deleteOne((err, deleted) => {

            // $lab:coverage:off$
            if (err) {
                return reply(Boom.badRequest(err), 'occurred while deleting record id ' + request.params.id);
            }
            // $lab:coverage:on$
            if (deleted.result.n === 1) {
                return reply({ delete: 'Successfully deleted id:' + id });
            }
            return reply(Boom.badRequest('No documents match id ' + id));
        });

    },

    deleteByQuery: function (request, reply) {

    // Delete by query TODO need to handle request query being passed to MongoDb

        const records = request.server.app.dataStore.records;
        const recordName = Object.keys(records).map((e) => {

            return e;
        }).indexOf(request.params.record);

        if (recordName === -1 ) {
            return reply(Boom.badRequest('Invalid record name ' + request.params.record));
        }
        const Model = records[request.params.record];
        const query = request.query;
        const options = {};
        if (Object.keys(request.query).length) {
            Model.deleteMany(query, options, (err, deleted) => {

                // $lab:coverage:off$
                if (err) {
                    return reply(Boom.badRequest(err), 'occurred while deleting by query ' + request.query);
                }
                // $lab:coverage:on$
                if (deleted.result.n > 0) {
                    return reply({ delete: 'Successfully deleted: ' + deleted.result.n + ' records' });
                }
                return reply(Boom.badRequest('No documents match this query: ' + JSON.stringify(request.query)));
            });
        }
        else {
            return reply(Boom.badRequest('No query supplied to delete by query method'));
        }
    },

    addRecord: function (request, reply) {

        const records = request.server.app.dataStore.records;
        const recordName = Object.keys(records).map((e) => {

            return e;
        }).indexOf(request.params.record);

        if (recordName === -1 ) {
            return reply(Boom.badRequest('Invalid record name ' + request.params.record));
        }
        const Model = records[request.params.record];
        const rids = request.server.dataStore.schema.records[request.params.record].metaSchema.rids;
        const rid = Utils.createRID(request.payload, rids);
        if (!rid) {
            return reply(Boom.badRequest('Unable to construct _id from rid fields'));
        }
        request.payload._id = rid;
        const doc = new Model(request.payload);
        doc.save((err, rec) => {

            if (err) {
                const error = Boom.badRequest(err);
                error.output.statusCode = 422;    // Assign a custom error code
                error.reformat();
                error.output.payload.details = err.details; // Add custom key
                return reply(error);
            }
            return reply(rec.ops[0]);
        });
    },


    replaceRecordByID: function (request, reply) {

        const records = request.server.app.dataStore.records;
        const recordName = Object.keys(records).map((e) => {

            return e;
        }).indexOf(request.params.record);

        if (recordName === -1 ) {
            return reply(Boom.badRequest('Invalid record name ' + request.params.record));
        }
        const Model = records[request.params.record];
        const id = request.params.record + Utils.SID_DIVIDER + request.params.id;
        request.payload._id = id;
        const doc = request.payload;
        const model = new Model(doc);
        model.replaceOne((err, rec) => {

            if (err) {
                const error = Boom.badRequest(err);
                error.output.statusCode = 422;    // Assign a custom error code
                error.reformat();
                error.output.payload.details = err.details; // Add custom key
                return reply(error);
            }
            if (rec.modifiedCount === 0) {
                return reply(Boom.badRequest('No matching document to update record id ' + id));
            }
            return reply('Document updated ' + rec.ops[0]._id);
        });
    },

    updateRecordByID: function (request, reply) {

        const definitions = request.server.app.dataStore.definitions;
        const records = request.server.app.dataStore.records;
        const recordName = Object.keys(records).map((e) => {

            return e;
        }).indexOf(request.params.record);

        if (recordName === -1 ) {
            return reply(Boom.badRequest('Invalid record name ' + request.params.record));
        }
        const Model = records[request.params.record];
        const id = request.params.record + Utils.SID_DIVIDER + request.params.id;
        request.payload._id = id;
        const doc = request.payload;

        Async.each(Object.keys(doc), (key, done) => {

            if (definitions[key]) {

                if (Type.isObj(doc[key])) {

                    const Definition = definitions[key];
                    const definition = new Definition(doc[key]);
                    definition.validate((err, valid) => {


                        if (err) {
                            const error = Boom.badRequest(err);
                            error.output.statusCode = 422;    // Assign a custom error code
                            error.reformat();
                            error.output.payload.details = err.details; // Add custom key
                            return done(error);
                        }
                        return done();
                    });
                }
                else {
                    const schema = request.server.dataStore.schema.definitions[key].schema;
                    const validator = request.server.dataStore.validator;

                    validator.validate(doc[key], schema, (err, valid) => {

                        if (err) {
                            const ZSchemaError = new Error('JSON schema validation has failed for definition ' + key);
                            ZSchemaError.details = err;
                            const error = Boom.badRequest(ZSchemaError);
                            error.output.statusCode = 422;    // Assign a custom error code
                            error.reformat();
                            error.output.payload.details = err.details; // Add custom key
                            return done(error);
                        }
                        return done();
                    });
                }
            }
            else {
                return done(Boom.badData('Invalid key in payload, key ' + key + ' is not valid for record ' + request.params.record));
            }

        }, (err) => {

            if (err) {
                return reply(err);
            }
            const model = new Model(doc);
            model.updateOne((err, rec) => {

                // $lab:coverage:off$
                if (err) {
                    return reply(Boom.badRequest('Error ' + err + ' has occurred when updating record id:' + id));
                }
                // $lab:coverage:on$
                if (rec.modifiedCount === 0) {
                    return reply(Boom.badRequest('No matching document to update record id ' + id));
                }
                return reply('Document updated id: ' + id);
            });
        });
    },

    insertMany: function (request, reply) {

        // Array of records, validate objects and return of any are invalid, then insert as an array.  When validating each object the rid must be constructed for each of the _id field
        const docs = request.payload;
        const records = request.server.app.dataStore.records;
        const recordName = Object.keys(records).map((e) => {

            return e;
        }).indexOf(request.params.record);
        if (recordName === -1 ) {
            return reply(Boom.badRequest('Invalid record name ' + request.params.record));
        }
        const Model = records[request.params.record];
        const RIDS = request.server.dataStore.schema.records[request.params.record].metaSchema.rids;
        Async.each(docs, (doc, done) => {

            const id = Utils.createRID(doc, RIDS);
            if (!id) {
                return done(Boom.badData('Unable to build _id due to missing fields'));
            }
            doc._id = id;
            const model = new Model(doc);
            model.validate((err, valid) => {

                if (err) {
                    const error = Boom.badRequest(err);
                    error.output.statusCode = 422;    // Assign a custom error code
                    error.reformat();
                    error.output.payload.details = err.details; // Add custom key
                    return done(error);
                }
                return done();
            });
        }, (err) => {

            if (err) {
                return reply(err);
            }
            Model.insertMany(docs, (err, result) => {

                if (err) {
                    return reply(Boom.badRequest('Error code ' + err.code + ' has occurred when inserting a batch of records due to message ' + err.errmsg));
                }
                return reply(result);
            });
        });
    }
};
