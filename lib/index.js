'use strict';

const Collections = require('./endpoints/collections.js');
const Datastore = require('json-schema-models');
const Joi = require('joi');
const Pkg = require('../package.json');
const Records = require('./endpoints/records.js');

const internals = {
    schema: Joi.object({
        indexes: Joi.boolean(),
        mongo: Joi.object({
            name: Joi.string().required(),
            url: Joi.string().default('mongodb://localhost:27017'),
            options:  Joi.object(),
            collections: Joi.array().items(Joi.object({
                name: Joi.string().required(),
                indexes: Joi.array(),
                options: Joi.object()
            })).required()
        })
    })
};

exports.register = function (server, options, next) {

    const result = Joi.validate(options, internals.schema);
    if (result.error) {
        return next('Invalid options passed to plugin ' + Pkg.name + ' ' + result.error);
    }
    delete options.indexes;
    const dataStore = new Datastore(options);
    server.route(Records);
    server.route(Collections);
    server.decorate('server', 'dataStore', dataStore);
    server.ext('onPreStart', (srv, cb) => {

        dataStore.start((err, results) => {

            if (err) {
                return cb(err);
            }
            srv.app.dataStore = results;
            if (result.value.indexes) {
                dataStore.buildIndexes((err) => {

                    return cb(err);
                });
            }
            else {
                return cb();
            }

        });
    });
    return next();

};


exports.register.attributes = {
    pkg: Pkg
};
