'use strict';

const Async = require('neo-async');
const Boom = require('boom');
const Compact = require('deep-compact');
const Type = require('basic-utils');
const Utils = require('../utils.js');


module.exports = {

    getRecords: function (request, reply) {

        const collections = request.server.app.dataStore.collections;
        const collectionName = Object.keys(collections).map((e) => {

            return e;
        }).indexOf(request.params.collection);

        if (collectionName === -1 ) {
            return reply(Boom.badRequest('Invalid collection name ' + request.params.collection));
        }
        const Collection = collections[request.params.collection];
        const query = {};
        const findFlds = {};
        const returnFlds = {};

        if (request.query.distinct) {

            const key = request.query.distinct;
            const options = {};
            Collection.distinct(key, query, options, (err, docs) => {

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

            Collection.find(findFlds, returnFlds).toArray((err, docs) => {

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
            Collection.find(findFlds, returnFlds).toArray((err, docs) => {

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
            Collection.find().toArray((err, docs) => {

                // $lab:coverage:off$
                if (err) {
                    return reply(Boom.badRequest(err), 'occurred while returning find all docs');
                }
                // $lab:coverage:on$
                return reply(docs);

            });
        }
        if (request.query.q) {
            const fields = request.query.q.split(',');
            fields.forEach((field) => {

                returnFlds[field] = 1;
            });

            Collection.find(findFlds, fields).toArray((err, docs) => {

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

        const collections = request.server.app.dataStore.collections;
        const collectionName = Object.keys(collections).map((e) => {

            return e;
        }).indexOf(request.params.collection);

        if (collectionName === -1 ) {
            return reply(Boom.badRequest('Invalid collection name ' + request.params.collection));
        }
        const Collection = collections[request.params.collection];
        const query = request.query;
        Collection.count(query, {}, (err, count) => {

            // $lab:coverage:off$
            if (err) {
                return reply(Boom.badRequest(err), 'occurred while making count query');
            }
            // $lab:coverage:on$
            return reply(count);
        });
    },

    getKeys: function (request, reply) {

        const collections = request.server.app.dataStore.collections;
        const collectionName = Object.keys(collections).map((e) => {

            return e;
        }).indexOf(request.params.collection);

        if (collectionName === -1 ) {
            return reply(Boom.badRequest('Invalid collection name ' + request.params.collection));
        }
        const Collection = collections[request.params.collection];
        const selector = {
            '_id': 1
        };
        Collection.find({}, selector).toArray((err, docs) => {

            // $lab:coverage:off$
            if (err) {
                return reply(Boom.badRequest(err), 'occurred while making getKeys query');
            }
            // $lab:coverage:on$
            return reply(docs);
        });

    }
};
