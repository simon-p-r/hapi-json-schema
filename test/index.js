'use strict';

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const SchemaPlugin = require('../lib/index.js');

// Fixtures
const Collections = require('./fixtures/collections.js');
const Formats = require('./fixtures/formats.js');
const Schemas = require('./fixtures/schemas.js');

// Set-up lab
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const beforeEach = lab.beforeEach;
const expect = Code.expect;


describe('Plugin', () => {

    let server;
    let Plugin;

    beforeEach((done) => {

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

                    },
                    collections: Collections
                }
            }
        };
        done();
    });


    it('should fail to connect to mongodb due to invalid port', (done) => {

        Plugin.options.mongo.url = 'mongodb://localhost:27018';
        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.exist();
                server.stop(done);
            });

        });

    });

    it('should connect to mongodb and decorate dataStore to server object', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            expect(server.dataStore).to.be.an.object();
            expect(server.dataStore.schema).to.be.an.object();
            expect(server.dataStore.schema.addSchemas).to.be.a.function();
            expect(server.dataStore.schema.addFormats).to.be.a.function();
            server.dataStore.schema.addSchemas(Schemas);
            server.dataStore.schema.addFormats(Formats);

            server.start((err) => {

                expect(err).to.not.exist();
                server.stop(done);
            });
        });
    });

    it('should run buildIndexes successfully when passed within options to plugin', (done) => {

        Plugin.options.indexes = true;
        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.dataStore.schema.addSchemas(Schemas);
            server.dataStore.schema.addFormats(Formats);
            server.start((err) => {

                expect(err).to.not.exist();
                server.stop(done);

            });
        });
    });
});
