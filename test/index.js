'use strict';

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const SchemaPlugin = require('../lib/index.js');

// Fixtures
const Collections = require('./fixtures/collections.js');

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

        server = new Hapi.Server({
            connections: {
                router: {
                    isCaseSensitive: false,
                    stripTrailingSlash: true
                },
                routes: {
                    cache: {
                        privacy: 'private'
                    },
                    json: {
                        space: 4
                    },
                    payload: {
                        output: 'data',
                        parse: true
                    }
                }
            }
        });
        server.connection({
            port: 3000,
            host: 'localhost'
        });
        Plugin =  {
            register: SchemaPlugin,
            options: {
                mongo: {
                    name: 'hapi-json-schema',
                    url: 'mongodb://localhost:27017',
                    options: {

                    },
                    collections: Collections
                },
                schemata: './fixtures/schemata',
                formats: './fixtures/formats.js'
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

    it('should fail to connect to mongodb due to invalid port', (done) => {

        delete Plugin.options.mongo.collections;
        server.register(Plugin, (err) => {

            expect(err).to.exist();
            expect(err).to.contain('Invalid options');
            server.start((err) => {

                expect(err).to.not.exist();
                server.stop(done);
            });

        });

    });

    it('should connect to mongodb and decorate dataStore to server object', (done) => {

        Plugin.options.mongo.collections = Collections;
        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            expect(server.dataStore).to.be.an.object();
            expect(server.dataStore.schema).to.be.an.object();
            expect(server.dataStore.schema.addSchemas).to.be.a.function();
            expect(server.dataStore.schema.addFormats).to.be.a.function();

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
            server.start((err) => {

                expect(err).to.not.exist();
                server.stop(done);

            });
        });
    });

    it('should fail to return get records from ds/record endpoint due to invalid record name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/invalid', (res) => {

                    expect(res.statusCode).to.equal(400);
                    server.stop(done);

                });
            });
        });
    });

    it('should return an array of records from ds/record/{record} endpoint by valid record name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation', (res) => {

                    expect(res.statusCode).to.equal(200);
                    // expect(res.result).to.be.an.array().and.have.length(3);
                    server.stop(done);

                });
            });
        });
    });

    it('should return an array of records from ds/record/{record} endpoint by a not query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/?not=lookup,control', (res) => {

                    expect(res.statusCode).to.equal(200);
                    // expect(res.result).to.be.an.array().and.have.length(3);
                    expect(res.result[0]._id).to.exist();
                    expect(res.result[0].recType).to.exist();
                    expect(res.result[0].control).to.not.exist();
                    server.stop(done);

                });
            });
        });
    });

    it('should return an array of records from ds/record/{record} endpoint via a return fields query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/?return=_id,recType', (res) => {

                    expect(res.statusCode).to.equal(200);
                    // expect(res.result).to.be.an.array().and.have.length(3);
                    expect(res.result[0]._id).to.exist();
                    expect(res.result[0].recType).to.exist();
                    expect(res.result[0].control).to.not.exist();
                    server.stop(done);

                });
            });
        });
    });

    it('should return an array of records from ds/record/{record} endpoint via a custom query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/?q=field1,field2', (res) => {

                    expect(res.statusCode).to.equal(200);
                    // expect(res.result).to.be.an.array().and.have.length(3);
                    expect(res.result[0]._id).to.exist();
                    expect(res.result[0].control).to.not.exist();
                    server.stop(done);

                });
            });
        });
    });

    it('should return an array of records from ds/record/{record} endpoint via a distinct query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/?distinct=recType', (res) => {

                    expect(res.statusCode).to.equal(200);
                    // expect(res.result).to.be.an.array().and.have.length(1);
                    expect(res.result[0]).to.contain('salutation');
                    server.stop(done);
                });
            });
        });
    });

    it('should fail to return a count of records for an invalid record name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/invalid/count', (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('Invalid record name invalid');
                    server.stop(done);
                });
            });
        });
    });

    it('should return a count of records for a valid record name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/count', (res) => {

                    expect(res.statusCode).to.equal(200);
                    // expect(res.result).to.equal(3);
                    server.stop(done);
                });
            });
        });
    });

    it('should return a count of records for a valid record name via a field query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/count?lookup.value=Mr', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.equal(1);
                    server.stop(done);
                });
            });
        });
    });


    it('should fail to return records from ds/record/keys endpoint due to an invalid name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/invalid/keys', (res) => {

                    expect(res.statusCode).to.equal(400);
                    server.stop(done);
                });
            });
        });
    });

    it('should return records from ds/record/{record}/keys endpoint', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/keys', (res) => {

                    expect(res.statusCode).to.equal(200);
                    server.stop(done);
                });
            });
        });
    });

    it('should fail the get a record from ds/record/{record}/id endpoint due to an invalid record name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/invalid/id', (res) => {

                    expect(res.statusCode).to.equal(400);
                    server.stop(done);
                });
            });
        });
    });

    it('should fail the get a record from ds/{record}/id endpoint due to an invalid id', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/id', (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('No matching documents');
                    server.stop(done);
                });
            });
        });
    });

    it('should get record from ds/record/{record}/id endpoint by id', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/mr', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result._id).to.equal('salutation::mr');
                    server.stop(done);
                });
            });
        });
    });

    it('should fail to get record from ds/record/{record}/id endpoint not query due to invalid id', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/invalid?not=_id', (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('No matching documents');
                    server.stop(done);
                });
            });
        });
    });

    it('should get record from ds/{record}/id endpoint by id and not query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/mr?not=_id', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.lookup.value).to.equal('Mr');
                    expect(res.result.recType).to.equal('salutation');
                    server.stop(done);
                });
            });
        });
    });

    it('should fail to get record from ds/{record}/id endpoint return query due to invalid id', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/invalid?return=_id', (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('No matching documents');
                    server.stop(done);
                });
            });
        });
    });

    it('should get record from ds/{record}/id endpoint by id and return query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/record/salutation/mr?return=_id', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result._id).to.equal('salutation::mr');
                    expect(res.result.control).to.not.exist();
                    server.stop(done);
                });
            });
        });
    });


    it('should fail to delete all records with ds/{record}/drop endpoint', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'DELETE',
                url: '/ds/record/invalid/drop'
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    server.stop(done);
                });
            });
        });
    });

    it('should successfully delete all records with ds/{record}/drop endpoint', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();

            const request = {
                method: 'DELETE',
                url: '/ds/record/salutation/drop'
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(200);
                    // expect(res.result.delete).to.contain('Removed 3');
                    server.stop(done);
                });
            });
        });
    });

    it('should fail to delete by id with ds/{record}/{id} endpoint due to invalid record name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'DELETE',
                url: '/ds/record/invalid/55d464be70fb3d10131e8283'
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('Invalid record name');
                    server.stop(done);
                });
            });
        });
    });

    it('should fail to delete by id with ds/{record}/{id} endpoint due to invalid id', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'DELETE',
                url: '/ds/record/salutation/id'
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.equal('No documents match id salutation::id');
                    server.stop(done);
                });
            });
        });
    });


    it('should successfully delete by id with ds/record/{record}/{id} endpoint', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'DELETE',
                url: '/ds/record/locator/address'
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.delete).to.contain('locator::address');
                    server.stop(done);
                });
            });
        });
    });


    it('should fail the delete ds/{record}? by query endpoint', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'DELETE',
                url: '/ds/record/invalid'
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    server.stop(done);

                });
            });
        });
    });

    it('should fail to delete via ds/record/{record}? delete by query endpoint due to missing query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'DELETE',
                url: '/ds/record/salutation'
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    server.stop(done);

                });
            });
        });
    });

    it('should fail to delete via ds/record/{record}? delete by query endpoint due to invalid query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'DELETE',
                url: '/ds/record/salutation?key=value'
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.result.message).to.contain('No documents match this query');
                    expect(res.statusCode).to.equal(400);
                    server.stop(done);

                });
            });
        });
    });

    it('should successfully delete via ds/record/{record}? delete by query endpoint', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'DELETE',
                url: '/ds/record/locator?recType=locator'
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {


                    expect(res.statusCode).to.equal(200);
                    expect(res.result.delete).to.contain('Successfully deleted');
                    server.stop(done);

                });
            });
        });
    });

    it('should fail post via ds/record/{record} endpoint due to invalid record name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'POST',
                url: '/ds/record/invalid',
                payload: {
                    recType: 'salutation'
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    server.stop(done);

                });
            });
        });
    });

    it('should fail post via ds/{record} endpoint due to invalid payload', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'POST',
                url: '/ds/record/salutation',
                payload: {
                    recType: 'salutation'
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(422);
                    server.stop(done);

                });
            });
        });
    });

    it('should successfully post via ds/{record} endpoint to create a new record', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'POST',
                url: '/ds/record/salutation',
                payload: {
                    recType: 'salutation',
                    lookup: {
                        value: 'Dr'
                    }
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result._id).to.equal('salutation::dr');
                    expect(res.result.lookup.value).to.equal('Dr');
                    server.stop(done);

                });
            });
        });
    });

    it('should fail put via ds/record/{record}/{id} endpoint due to invalid record name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'PUT',
                url: '/ds/record/invalid/id',
                payload: {
                    recType: 'person'
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('Invalid record name');
                    server.stop(done);

                });
            });
        });
    });

    it('should fail put via ds/record/{record}/{id} endpoint due to invalid payload', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'PUT',
                url: '/ds/record/salutation/id',
                payload: {
                    recType: 'salutation',
                    lookup: {
                        value: {
                            invalid: 'object'
                        }
                    },
                    control: {
                        createdAt: new Date().toString()
                    }
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(422);
                    server.stop(done);

                });
            });
        });
    });

    it('should fail put via ds/{record}/{id} endpoint due to invalid id', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'PUT',
                url: '/ds/record/salutation/id',
                payload: {
                    recType: 'salutation',
                    lookup: {
                        value: 'Captain'
                    }
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('No matching document');
                    server.stop(done);

                });
            });
        });
    });

    it('should successfully put via ds/{record}/{id} endpoint', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'PUT',
                url: '/ds/record/salutation/dr',
                payload: {
                    recType: 'salutation',
                    lookup: {
                        value: 'Captain'
                    }
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.contain('Document updated');
                    server.stop(done);

                });
            });
        });
    });

    it('should fail patch via ds/{record}/{id} endpoint due to invalid record name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'PATCH',
                url: '/ds/record/invalid/id',
                payload: {
                    recType: 'person'
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('Invalid record name');
                    server.stop(done);

                });
            });
        });
    });


    it('should fail patch via ds/{record}/{id} endpoint due to invalid payload', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'PATCH',
                url: '/ds/record/salutation/id',
                payload: {
                    recType: 'person',
                    lookup: {
                        invalid: 'value'
                    }
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(422);
                    expect(res.result.message).to.contain('JSON schema validation');
                    server.stop(done);

                });
            });
        });
    });

    it('should fail patch via ds/record/{record}/{id} endpoint due to invalid payload', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'PATCH',
                url: '/ds/record/salutation/id',
                payload: {
                    recType: 'person',
                    lookup: 12234
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(422);
                    expect(res.result.message).to.contain('JSON schema validation');
                    server.stop(done);

                });
            });
        });
    });


    it('should fail patch via ds/{record}/{id} endpoint due to invalid keys in payload', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'PATCH',
                url: '/ds/record/salutation/id',
                payload: {
                    invalid: 'someValue',
                    recType: 'person'
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(422);
                    expect(res.result.message).to.contain('Invalid key');
                    server.stop(done);

                });
            });
        });
    });

    it('should fail to patch via ds/record/{record}/{id} endpoint due to invalid id', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'PATCH',
                url: '/ds/record/salutation/invalid',
                payload: {
                    recType: 'person'
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('No matching document to update record id');
                    server.stop(done);

                });
            });
        });
    });

    it('should successfully patch via ds/record/{record}/{id} endpoint', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'PATCH',
                url: '/ds/record/salutation/dr',
                payload: {
                    recType: 'person'
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.contain('Document updated');
                    server.stop(done);

                });
            });
        });
    });


    it('should successfully patch an object via ds/record/{record}/{id} endpoint', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'PATCH',
                url: '/ds/record/salutation/dr',
                payload: {
                    recType: 'person',
                    lookup: {
                        value: 'Doctor'
                    }
                }
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.contain('Document updated');
                    server.stop(done);

                });
            });
        });
    });


    it('should fail to insertMany docs via ds/record/{record}/patch endpoint due to invalid record name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'POST',
                url: '/ds/record/invalid/batch',
                payload: [{
                    recType: 'person',
                    lookup: {
                        value: 'Doctor'
                    }
                }]
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('Invalid record name');
                    server.stop(done);

                });
            });
        });
    });


    it('should fail to insertMany docs via ds/record/{record}/patch endpoint due to missing field to construct _id', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'POST',
                url: '/ds/record/salutation/batch',
                payload: [{
                    recType: 'salutation'
                }]
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(422);
                    expect(res.result.message).to.contain('Unable to build _id');
                    server.stop(done);

                });
            });
        });
    });

    it('should fail to insertMany docs via ds/record/{record}/patch endpoint due to invalid schema', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'POST',
                url: '/ds/record/salutation/batch',
                payload: [{
                    recType: 'salutation',
                    lookup: {
                        value: 'Captain',
                        invalid: 'key'
                    }
                }]
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(422);
                    expect(res.result.message).to.contain('JSON schema validation');
                    server.stop(done);

                });
            });
        });
    });


    it('should successfully insertMany docs via ds/record/{record}/patch endpoint', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'POST',
                url: '/ds/record/salutation/batch',
                payload: [{
                    recType: 'salutation',
                    lookup: {
                        value: 'Rabbi'
                    }
                }]
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.insertedCount).to.equal(1);
                    expect(res.result.insertedIds).to.include(['salutation::rabbi']);
                    server.stop(done);

                });
            });
        });
    });



    it('should fail to insertMany docs via ds/record/{record}/patch endpoint due to duplicate keys from mongo', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            const request = {
                method: 'POST',
                url: '/ds/record/salutation/batch',
                payload: [{
                    recType: 'salutation',
                    lookup: {
                        value: 'Rabbi'
                    }
                }]
            };

            server.start((err) => {

                expect(err).to.not.exist();
                server.inject(request, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('Error code 11000');
                    server.stop(done);

                });
            });
        });
    });


    it('should fail to return get records from ds/collection/{collection} endpoint due to invalid collection name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/collection/salutation', (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('Invalid collection name');
                    server.stop(done);

                });
            });
        });
    });

    it('should return an array of records from ds/collection/{collection} endpoint by valid collection name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/collection/lookup', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array().and.have.length(2);
                    server.stop(done);

                });
            });
        });
    });

    it('should return an array of records from ds/collection/{collection} endpoint by a not query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/collection/lookup/?not=recType', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array().and.have.length(2);
                    expect(res.result[0]._id).to.exist();
                    expect(res.result[0].lookup).to.exist();
                    expect(res.result[0].recType).to.not.exist();
                    server.stop(done);

                });
            });
        });
    });

    it('should return an array of records from ds/collection/{collection} endpoint via a return fields query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/collection/lookup/?return=_id,recType', (res) => {

                    expect(res.statusCode).to.equal(200);
                    // expect(res.result).to.be.an.array().and.have.length(1);
                    // expect(res.result[0]._id).to.exist();
                    // expect(res.result[0].recType).to.equal('person');
                    server.stop(done);

                });
            });
        });
    });

    it('should return an array of records from ds/collection/{collection} endpoint via a custom query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/collection/lookup/?q=lookup', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array().and.have.length(2);
                    expect(res.result[0]._id).to.exist();
                    expect(res.result[0].lookup.value).to.equal('Doctor');
                    server.stop(done);

                });
            });
        });
    });

    it('should return an array of records from ds/collection/{collection} endpoint via a distinct query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/collection/lookup/?distinct=recType', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array().and.have.length(2);
                    expect(res.result).to.include('person');
                    server.stop(done);
                });
            });
        });
    });

    it('should fail to return a count of all records within a collection by name due to invalid name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/collection/invalid/count', (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('Invalid collection name invalid');
                    server.stop(done);
                });
            });
        });
    });

    it('should return a count of all records within a collection by name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/collection/lookup/count', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.equal(2);
                    server.stop(done);
                });
            });
        });
    });

    it('should return a count of all records within a collection by query', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/collection/lookup/count?lookup.value=Doctor', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.equal(1);
                    server.stop(done);
                });
            });
        });
    });

    it('should fail to return the _id field from all records within a collection due to invalid name', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/collection/invalid/keys', (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.contain('Invalid collection name invalid');
                    server.stop(done);
                });
            });
        });
    });

    it('should return the _id field of all records within a collection', (done) => {

        server.register(Plugin, (err) => {

            expect(err).to.not.exist();
            server.start((err) => {

                expect(err).to.not.exist();
                server.inject('/ds/collection/lookup/keys', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result[0]._id).to.equal('salutation::dr');
                    server.stop(done);
                });
            });
        });
    });

});
