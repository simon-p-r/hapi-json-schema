'use strict';

var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var SchemaPlugin = require('../lib/index.js');

// Fixtures
var Formats = require('./fixtures/formats.js');
var Schemas = require('./fixtures/schemas.js');

// Set-up lab
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var expect = Code.expect;


describe('Plugin', function () {

    var server;
    var Plugin;

    beforeEach(function (done) {

        server = new Hapi.Server();
        server.connection({
            port: 3000,
            host: 'localhost'
        });
        Plugin =  {
            register: SchemaPlugin,
            options: {
                mongo: {
                    name: 'test_db',
                    url: 'mongodb://localhost:27017',
                    options: {

                    }
                }
            }
        };
        done();
    });


    it('should fail to connect to mongodb due to invalid port', function (done) {

        Plugin.options.mongo.url = 'mongodb://localhost:27018';
        server.register(Plugin, function (err) {

            expect(err).to.not.exist();
            server.start(function (err) {

                expect(err).to.exist();
                server.stop(done);
            });

        });

    });

    it('should connect to mongodb and decorate dataStore to server object', function (done) {

        server.register(Plugin, function (err) {

            expect(err).to.not.exist();
            expect(server.dataStore).to.be.an.object();
            expect(server.dataStore.schema).to.be.an.object();
            expect(server.dataStore.schema.addSchemas).to.be.a.function();
            expect(server.dataStore.schema.addFormats).to.be.a.function();
            server.dataStore.schema.addSchemas(Schemas);
            server.dataStore.schema.addFormats(Formats);

            server.start(function (err) {

                expect(err).to.not.exist();
                server.stop(done);
            });
        });
    });

    it('should run buildIndexes successfully when passed within options to plugin', function (done) {

        Plugin.options.indexes = true;
        server.register(Plugin, function (err) {

            expect(err).to.not.exist();
            server.dataStore.schema.addSchemas(Schemas);
            server.dataStore.schema.addFormats(Formats);
            server.start(function (err) {

                expect(err).to.not.exist();
                server.stop(done);

            });
        });
    });
});
