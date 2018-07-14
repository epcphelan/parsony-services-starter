# Parsony Web Services Framework

Parsony WebServices framework allows for rapid development of web-services
based application in conjunction with Parsony WebApp. 

Parsony allows developers to define an API endpoint via contracts and handlers 
The contracts ensure robust validation, client authorization and end-user authentication.
Contracts automagically generates rich documentation, ensures API response formats
and provides endpoint-level documentation hinting when run in debug mode.
 
Parsony extracts method variables as well as a session object which are passed to the 
supplied handler. Instead of worrying about routing, error handling, argument checking and validation, 
a developer can focus purely on business logic.

Parsony also adds API security by implementing encrypted request payload signatures.
The client libraries for implement complimentary signing and works
out-of-the-box with Parsony WebServices


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

####Configs:
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


#### Configs:

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



