'use strict';

const Collections = require('./endpoints/collections.js');
const Datastore = require('json-schema-models');
const Joi = require('joi');
const Path = require('path');
const Pkg = require('../package.json');
const Plus = require('require-plus');
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
        }).required(),
        schemata: Joi.string().required(),
        formats: Joi.string().required()
    }).required()
};

const parentDir = Path.dirname(module.parent.filename);
delete require.cache[__filename];

exports.register = function (server, options, next) {

    const result = Joi.validate(options, internals.schema);
    if (result.error) {
        return next(`Invalid options passed to plugin ${Pkg.name} result.error`);
    }

    const moduleSet = Plus({
        directory: Path.resolve(parentDir, options.schemata)
    });

    const formats = require(Path.resolve(parentDir, options.formats));

    const settings = {
        mongo: options.mongo,
        schema: {
            formats
        }
    };

    const dataStore = new Datastore(settings);
    dataStore.addSchemas(moduleSet);
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
    name: Pkg.name,
    version: Pkg.version
};
