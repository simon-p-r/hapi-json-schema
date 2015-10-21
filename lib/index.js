'use strict';

var Datastore = require('json-schema-models');
var Pkg = require('../package.json');


exports.register = function (server, options, next) {

    var index;
    if (options.indexes) {
        index = options.indexes;
        delete options.indexes;
    }
    var dataStore = new Datastore(options);
    server.decorate('server', 'dataStore', dataStore);
    server.ext('onPreStart', function (srv, cb) {

        dataStore.start(function (err, result) {

            if (err) {
                return cb(err);
            }
            if (index) {
                dataStore.buildIndexes(function (err) {

                    return cb(err);
                });
            } else {
                return cb();
            }

        });
    });
    return next();

};


exports.register.attributes = {
    pkg: Pkg
};
