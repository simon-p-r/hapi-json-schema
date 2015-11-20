# hapi-json-schema [![build status](https://travis-ci.org/simon-p-r/hapi-json-schema.svg?branch=master)](https://travis-ci.org/simon-p-r/hapi-json-schema)

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


Plugin exposes 2 methods

##### addSchemas via server.dataStore.schema.addSchemas

##### addFormats via server.dataStore.schema.addFormats

These methods can be used by other plugins to dynamically load more internal schema / models

##### Todo

+ Improve interface to z-schema
+ Manage plugin dependencies better
