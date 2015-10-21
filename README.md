# hapi-json-schema [![build status](https://travis-ci.org/simon-p-r/hapi-json-schema.svg?branch=master)](https://travis-ci.org/simon-p-r/hapi-json-schema)

Hapi plugin for [json-schema-models](https://github.com/simon-p-r/json-schema-models)

### Warning unstable api


options object must contain the following properties
+ mongo
   + name - mongodb name
   + url - mongodb url string (host and port)
   + options - mongodb connection options

+ schema
   + formats - an object with keys being name of format to register and value being the custom function to register for z-schema validation
+ validator - an object created by z-schema constructor function
+ zSchema - z-schema exported function

Plugin exposes 2 methods

##### addSchemas via server.dataStore.schema.addSchemas

##### addFormats via server.dataStore.schema.addFormats

These methods can be used by other plugins to dynamically load more internal schema / models

##### Todo

+ Improve interface to z-schema
+ Manage plugin dependencies better
