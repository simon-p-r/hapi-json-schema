'use strict';

const Datastore = require('json-schema-models');
const Pkg = require('../package.json');
const ZSchema = require('z-schema');


exports.register = function (server, options, next) {

    let index;
    if (options.indexes) {
        index = options.indexes;
        delete options.indexes;
    }
    options.zSchema = ZSchema;
    options.validator = new ZSchema();

    const dataStore = new Datastore(options);
    server.decorate('server', 'dataStore', dataStore);
    server.ext('onPreStart', (srv, cb) => {

        dataStore.start((err, result) => {

            if (err) {
                return cb(err);
            }
            if (index) {
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
