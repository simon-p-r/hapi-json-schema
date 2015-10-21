'use strict';

var Dummy = require('./dummy.js');

exports.register = function (server, options, next) {

    var addSchemas = server.dataStore.schema.addSchemas();
    addSchemas([Dummy]);
    next();

};

exports.register.attributes = {

    name: 'dummy',
    version: '0.0.0',
    dependencies: ['hapi-json-schema']
};
