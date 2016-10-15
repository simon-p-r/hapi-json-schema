# hapi-json-schema 
[![build status](https://travis-ci.org/simon-p-r/hapi-json-schema.svg?branch=master)](https://travis-ci.org/simon-p-r/hapi-json-schema)
[![Current Version](https://img.shields.io/npm/v/hapi-json-schema.svg?maxAge=1000)](https://www.npmjs.org/package/hapi-json-schema)
[![dependency Status](https://img.shields.io/david/simon-p-r/hapi-json-schema.svg?maxAge=1000)](https://david-dm.org/simon-p-r/hapi-json-schema)
[![devDependency Status](https://img.shields.io/david/dev/simon-p-r/hapi-json-schema.svg?maxAge=1000)](https://david-dm.org/simon-p-r/hapi-json-schema)
[![Coveralls](https://img.shields.io/coveralls/simon-p-r/hapi-json-schema.svg?maxAge=1000)](https://coveralls.io/github/simon-p-r/hapi-json-schema)

Hapi plugin for [json-schema-models](https://github.com/simon-p-r/json-schema-models)



options object must contain the following properties
+ indexes - boolean to confirm whether indexes should be built or not
+ mongo
   + name - mongodb name
   + url - mongodb url string (host and port)
   + options - mongodb connection options
   + collections - array of objects with following properties
       + name - string name of collection
       + indexes - array of indexes to create
       + options - valid options object for mongodb driver createCollection method
+ schemata - directory containing schemas
+ formats - path to formats file

Plugin exposes 2 methods

##### addSchemas via server.dataStore.schema.addSchemas

##### addFormats via server.dataStore.schema.addFormats

These methods can be used by other plugins to dynamically load more internal schema / models

##### Todo

+ Improve interface to z-schema
+ Manage plugin dependencies better
