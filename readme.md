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
    "logging": true,                // true, print all req, res to console.log
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

## API Requests
Parsony exposes two interfaces for every service method:

**JSON/RPC**
The JSON/RPC expands the range of verbs and actions that can be described
via API. All requests are made to a single endpoint via HTTP POST, and the
requested method is part of the request body.

**REST**
A more standard RESTful approach, each method also has it's own
URL endpoint and requests are made using the corresponding HTTP method.

The response to requests made to either interface are identical.

Example:
Consider a hypothetical method of a User service that logs a user into a system.

Service: USER
Method: login

The standard RESTful approach allows a user to make a POST request to /user/auth
```
POST https://my.api/user/auth
Body:
{
    "username": "john.doe"
    "password": ""*******"
}
```


The JSON/RPC approach requires the user to make all requests to the same endpoint
Let's pretend the JSON/RPC endpoint is /json-rpc

```
POST https://my.api/json-rpc
Body:
{
    "method":"user.login"
    "args" : {
        "username": "john.doe"
        "password": ""*******"
    }
}
```


### JSON/RPC

Let's breakdown a typical request to a JSON/RPC endpoint:

```
-H "Content-Type:application/json"
-H "Api-Key : <API Key>"
-H "Session-Token : <Session Token>"

{
    "method":"service.method",
    "args": {
        "arg1":"param1",
        "arg2":"param1
    }
    "signed":"3598hhh3924908jweliur2098342="
}
```

#### Headers
**-H API Key**
If an api key is required by the endpoint, provide your key in the header.
In addition, the request body most be signed. See **Signing** below.

**-H Session Token**
If endpoint requires a session token, pass in the header as well. Session 
tokens are generated by the auth service our via ```user.login(u,p)```


### API Credentials
Upon initial startup, an API Key-Pair will be generated and outputted in the 
console startup message. Additionally, it will be saved in ```.parsony.json```
in your WebServices root directory. 
```$xslt
  "init": {
    "key": "bb224fb48eb71479d533982a34d479bc1e9b8200.key",
    "secret": "9701bcccb27693b1268c7c6d3dcbf4666e5ea7e2.secret"
  }
```

#### Signing
All Parsony requests to endpoints that require an API Key must also have a signed
payload. Parsony-Web handles this automatically. A signature can is generated by
first _stringifying_ the payload, then hashing it along with the secret using
sha256. The hash signature must be hex, or base 16, encoded.

Example in Node.js:

```js
const crypto = require('crypto');

function sign(payload){
    const src = JSON.stringify(payload);
    const signature = _hash(src);
    return Object.assign(
      {},
      payload,
      { signed:signature }
    );
}

function _hash(src){
    const hash = crypto.createHash('sha256');
    hash.update(src);
    hash.update(this.secret);
    return hash.digest('hex');
}
```

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
        email,          // emailer
        sms,            // sms sender
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

### DB Pool & DB
Get a connection from the DB pool to perform DB queries directly.
* getConnection(fn(err,callback){})
```js
const { dbPool } = parsony.getBundle();

exports.getUser = async(id)=>{
  const stmt = 'SELECT * FROM Users WHERE id=?';
  
  return new Promise((resolve, reject) => {
    dbPool.getConnection((err, conn) => {
      if (err) {
        conn.release();
        reject(err);
      } else {
        conn.query(stmt, [id], (err, rows, fields) => {
          conn.release();
          if (err) {
            reject(err);
          } else {
            resolve(rows, fields);
          }
        });
      }
    });
  });
}
```

Alternatively, **DB** provides an execute and query method which accepts a stmt and arguments.
* execute(stmt,[args]) [async]
* query(stmt, [args]) [async]

```js
const { db } = parsony.getBundle();

exports.getUser = async (id) => {
  const stmt = 'SELECT * FROM Users WHERE id=?';
  return await db.query(stmt,[id]);
}

exports.updateUserProfile = async(id, firstName, lastName) => {
  const stmt = 'UPDATE Users SET firstName = ?, lastName = ? WHERE id = ?';
  return await db.execute(stmt,[firstName, lastName, id]);
}
```

### HTTP
Provides makeStandardError() - See above.

### Auth
Authentication and session methods:
* checkCredentials(username, password) [async]
* getSession(sessionToken) [async]
* createSession(userId) [async]
* destroySession(sessionToken) [async]

API access methods:
*  createAPIKeyPair() [async]
*  disableAPIKey(key) [async]
*  deleteAPIKey(key) [async]
*  enableAPIKey(key) [async]

### EMail
Parsony Emailer - send HTML transactional emails using 
* sendTemplateEmail(recipient, subject, mergeData, template [, sender]) [async]

Add HTML templates to ```templates/```.
Optional argument _sender_ is an object, and defaults to sender in configs: 
```
{
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
```

Example: templates/hello.html
```html
<html>
    <body>
        Hello {{firstName}},
        Welcome!
    </body>
</html>
```

```js
const { email:{ sendTemplateEmail } } = parsony.getBundle();

const recipient = "john.doe@gmail.com";
const subject = "Welcome to Parsony.";
const data = {firstName:'John'};
const template = 'hello.html';

sendTemplateEmail(recipient,subject,data,template)

```

### SMS
Send SMS messages using Twilio. To send SMS you must have a Twilio account configured.
If in debug mode, a failed SMS will be sent as an email
to the debug email address. This allows for SMS development before connecting
a Twilio account.
```js
const { sms:{ send } } = parsony.getBundle();

const recipient = "+15551234321";
const message = "Welcome to Parsony.";

send(recipient,message);
```

### Errors
Parsony-core provides a large collection of standard errors related to API validation,
authentication and server failures. 
In addition, standard handler errors are provided in ```libs/errors.json```

```
{
  USER_NOT_FOUND,
  INVALID_CREDENTIALS,
  API_KEY:{
    CACHE_ERROR,
    INVALID
  },
  SIGNED:{
    NO_SECRET,
    INVALID_SIGNATURE
  },
  SESSION:{
    INVALID,
    CREATION_ERROR,
    DB_WRITE_ERROR,
    FLUSH_CACHE_ERROR,
    NO_TOKEN
  },
  REQUEST{
    NO_ARGS,
    NO_METHOD_FOUND,
    NO_METHOD_SUPPLIED,
    MALFORMED_VALIDATION,
    MALFORMED_JSON
  },
  SERVER_ERROR,
  DB_ERROR,
  MODEL_ERROR,
  EMAIL:{
    TRANSPORT,
    TEMPLATE,
    NOT_SENT,
    NO_SENDER
  }
}
```