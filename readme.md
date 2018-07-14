# Parsony Web Services Framework

Parsony WebServices framework allows for rapid development of web-services
based application in conjunction with Parsony WebApp automatically
exposing both a **REST-ish** endpoint for each method as well as access via 
**JSON/RPC** calls to a single endpoint.

#### Parsony allows developers to implement an API endpoint via _contracts_ and _handlers_.
 
Contracts ensure robust validation, client authorization and end-user authentication.
They _automagically_ generate rich documentation, ensure API response formats
and provide endpoint-level documentation hinting when run in debug mode.
 
Parsony extracts method variables as well as a session object which are passed to the 
handler function. 

When implementing a handler a developer can focus purely on business logic 
instead of worrying about routing, error handling, argument checking and validation.

Parsony also adds API security by implementing encrypted request payload signatures.
The client libraries for implement complimentary signing and works out-of-the-box with 
Parsony WebServices


## Installation


The best way to get started is using the Parsony CLI which 
be installed using NPM

```$xslt
$ [sudo] npm i -g parsony-cli

```

Alternatively, clone or download this repository.

To install run:
```$xslt
$ npm install

```

### Dependencies

#### Databases
Parsony uses Sequelize ORM (V4) which supports multiple databases. 

* PostgreSQL
* MySQL
* SQLite
* MSSQL


The default and most tested implementation uses MySQL. You will be
able to pass connection parameters via the configs file.

#### DB Configs:
```$xslt
 "db":{
      "host": "localhost",
      "port": 8889,
      "username": "",
      "password": "",
      "database": "",
      "dialect": "mysql",
      "max_connections" : 5,
      "operatorsAliases": false,
      "logging":false
    }
```

#### Cache
Parsony requires Redis for caching. By default Parsony attempts to connect
to a local instance of Redis, though a remote Redis server, for example, via AWS 
ElastiCache can also be configured via configs.


#### Cache Configs:

```$xslt
    "redis":{
      "host": "127.0.0.1",
      "port": 6379,
      "path": null,
      "url": null
    }
```

To install a Redis locally:
``` $xslt
$ [sudo] npm i -g redis
```

Before starting Parsony, make sure Redis is running:
```$xslt
$ redis-server
```

## Run
The web services starter entry point is app.js. To start a local server, which
defaults to using the local environment configuration, simply run:
```$xslt
$ npm start
```

Parsony accepts two additional startup variables:
* PARSONY_ENV={environment} // where environment refers to a configuration object
* DROB_DB={boolean} // if true, Sequelize will drop all tables and recreate models
* API_DEBUG={boolean} // if true, hint available and emails/sms diverted to debug recipient

```

$ DROP_DB=true PARSONY_ENV=staging npm start
```

### Forever
Use a tool like forever to keep Parsony running.
```$xslt
$ [sudo] npm install forever -g
```

## Tests
Parsony uses mocha and chai for testing. As you develop your services, 
add any additional tests to the test directory.

To run all tests:
```$xslt
$ npm run test
```

## Configuration

The shipped configuration has all of the fields required to use the full features
of Parsony WebServices.

Email and Twilio are optional. Email tends to be useful for most WebApps, however,
by default WebServices does not make use of it, so it is possible to omit this configuration.
This may be the case if you use a third-party mail service such as Mailchimp

```$xslt
{
  // defaults to local, add configs for any other environment. Will not fallback
  // on missing entries; all other environmental configs must contain a complete configuration.
  
  "local": {
    "api_endpoint": "json-api",     // single endpoint for RPC-based requests
    "http_port": 8070,
    "api_debug": true,              // true, passing hint:true with no args returns method doc
    "db": {
      "host": "localhost",
      "port": 8889,
      "username": "parsony",
      "password": "password",
      "database": "parsony",
      "dialect": "mysql",           // mysql, postgres, mssql
      "max_connections": 5,         // maximum db pool connections
      "operatorsAliases": false,     
      "logging": false              // output DB activity to console.log
    },
    "redis":{
      "host": "127.0.0.1",
      "port": 6379,
      "path": null,
      "url": null
    },
    "emails": {
      "debugRecipient": "@gmail.com",   // in debug mode send all emails to this
      "system": {
        "sender": {
          "from": "John Doe <name@gmail.com>",
          "service": "Gmail",
          "host": "smtp.gmail.com",
          "port": 465,
          "secure": true,
          "auth": {
            "user": "",
            "pass": ""
          }
        }
      }
    },
    "twilio": {
      "phoneNumber": "+15554561111",
      "sid": "",
      "token": "",
      "debugRecipient": "+15554561111" // in debug mode send all sms to this
    }
  }
}
```

# Usage

## Models
Add new models to the ```models/``` directory. These will be automatically
synchronized on Parsony startup. 

Models in Parsony are generated by functions that take an instance of sequelize and sequelize
DataTypes and return an instance of Sequelize.define(). Associations can be created by 
adding an associate method to the model instance.

Advanced documentation on defining models can be found at [sequelize](http://docs.sequelizejs.com/manual/tutorial/models-definition.html).

An example model definition:
```js
"use strict";

module.exports = (sequelize, DataTypes) => {
  
  const UserProfile = sequelize.define("UserProfile", {
    firstName:    DataTypes.STRING,
    lastName:     DataTypes.STRING,
    profileImage: DataTypes.STRING
  });
  
  UserProfile.associate = models => {
    UserProfile.belongsTo(models.User);
  };
  
  return UserProfile;
};
```
To create a basic model stub, use the Parsony CLI and run

```$xslt
$ parsony +m
```

## Services

Services help you organize your endpoints into related functionality. To
create a new service, and a new directory to ```services/```.

A service requires two files:
* {service}.interface.js
* {service}.handlers.js

##### Use Command-line Tools
Create a new service with Parsony-CLI. In the root directory of your WebServices, run :
```$xslt
$ parsony +s
```

## Interface Definitions
An interface file defines the API contract as well as the method handler associated
with each endpoint.

Example:
```$xslt
{
  "handlers": "user.handlers.js",
  "endpoints": [
    {
      "json_api": "user.create",
      "rest_url": "/user/create",
      "method": "post",
      "desc": "Create a new user account with email address.",
      "handler": "create",
      "authentication": {
        "api_key": true,
        "session_token": false
      },
      "params": [
        {
          "param": "username",
          "required": true,
          "validation": {
            "is_type": "string",
            "valid_email": true
          }
        },
        {
          "param": "password",
          "required": true,
          "validation": {
            "is_type": "string",
            "min_length": 6
          }
        }
      ],
      "errors":[
        "record_not_created",
        "duplicate_email"
      ],
      "returns": {
        userId: 12345
      }
    },
    ...
  ]
}
```
##### Definitions
```$xslt
handlers                // Name of handlers file in same directory
json_api                // method name passed in request to JSON/RPC
rest_url                // REST-ish API endpoint
method                  // HTTP method: post, get, put, delete
desc                    // Short method description
handler                 // Name of handler function
api_key                 // If required to access endpoint. If true, payload must be signed.
session_token           // If required to access endpoint.
errors                  // Array of error types. See errors for more info.
returns                 // A sample response object.

```

##### Available Validations
Any combination of the following rules can be applied to an endpoint parameter.
Be careful: certain combinations cannot be satisfied, meaning that all
requests will be rejected!

Key | Value(s) 
--- | ---
is_type | {string} in (string, number, boolean, date)
is_array | {bool}
is_json | {bool}
is_url | {bool}
in_set | ["values", "as", "array"]
valid_email | {bool}
regex | {string} (RegEx pattern)
min_length / max_length | {int}


##### Use Command-line Tools
Parsony CLI can help you create a new contract and handler stub (as seen below) through a series
of questions. In the root directory of your WebServices, run :
```$xslt
$ parsony +
```


## Handlers
Each endpoint contract specifies a handler. In theory, it would be possible
to point multiple contracts to a single contract. This could be useful
for defaulting responses.

A handler is an ```async``` function that either returns either an object 
or throws an Error. 

Example:
```js
const { http: { makeStandardError } } = parsony.getBundle();

const ERROR = {
  code:500,
  type:'internal_error',
  message:'A server error has occurred.'
};

exports.addFollower = async data => {
  // * = required
  const { 
    userToFollowId, // type: number *
    privateRelationship, // type: boolean *
    sessionObj: { userId } // from session 
  } = data;

  try{
    /**
     * @todo Implement method
     */
  } catch(e){
    throw makeStandardError(ERROR)
  }
  
  return {
   userToFollowId,
   privateRelationship,
   userId
  };
};
```

Handlers should always throw an augmented error object containing a code, msg, type and detail properties.

```js
  const e = new Error('Oops');
  e.msg = 'Oh no.';
  e.code = '500';
  e.type = 'internal_error';
  e.detail = 'A strange thing has happened.';
```

Parsony provides a convenience method of the http module called makeStandardError.
It is accessible via:
```js
const { http:{makeStandardError}} = parsony.getBundle();

// Pass an object to makeStandardError(error[,detail])

const errorObj = {
        "code": 401,
        "type": "authentication_failed",
        "message": "Email or password were incorrect."
      }

throw new makeStandardError(errorObj,"Some extra details can go here.")
```

Parsony WebServer starter provides many standard errors in ```lib/errors.json```


## Parsony Modules
Parsony exposes it's models, helper functions, cache and other modules in a bundle
which is available via getBundle()

```
    {
        env             // current env. default 'local'
        models          // models accessible by name
        debugMode       // bool
        configs         // initial configs
        dbPool          // db pool for making raw sql queries
        db              // all db methods
        http,           // contains makeStandardError
        auth,           // auth functions
        utils,          // utilities
        email,          // emailer
        sms,            // sms sender
        app,            // express app (req, res)
        api,            // compiled contracts
        errors          // core error objects
    }
```

### Models
Models are best used by destructuring the models object retrieved via .getBundle()

```js
const { models } = parsony.getBundle();

exports.getUser = async (id) =>{
  const { User } = models;
  return await User.find({
    where:{
      id
    }
  });
}
```

### DB Pool
Get a connection from the DB pool to perform DB queries directly.

```js
const {dbPool} = parsony.getBundle();

exports.getUser = async(id)=>{
  return new Promise((resolve, reject) => {
    dbPool.getConnection((err, conn) => {
      if (err) {
        conn.release();
        reject(err);
      } else {
        const stmt = 'SELECT * FROM Users WHERE id=?';
        conn.query(stmt, [id], (err, rows, fields) => {
          if (err) {
            conn.release();
            reject(err);
          } else {
            conn.release();
            resolve(rows, fields);
          }
        });
      }
    });
  });
}
```