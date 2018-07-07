const fs = require('fs');
const path = require('path');
const _dir = __dirname.toString().replace('/test/integration','');
global.base =  _dir +"/";
global.parsony = require('parsony');

const settings = {
  files:{
    configs:      _dir + '/config.json',
    _404:         _dir +'/static/404.html'
  },
  directories:{
    models:       _dir + '/models',
    services:     _dir + '/services',
    scheduled:    _dir + '/scheduled',
    www:          _dir + '/static',
    templates:    _dir + '/templates'
  }
};

global.API_KEY = {
  key:'',
  secret:''
};

const TEST_SERVICE = `testing_service_${Math.round(Math.random()*1000000)}`;

beforeEach((done)=>{
  if(!parsony.isLive()){
    _createTempTestService(TEST_SERVICE);
    try{
      parsony.init(settings);
      parsony.start().then(() => {
        _getTempApiKey().then(keyPair=>{
          API_KEY.key = keyPair.key;
          API_KEY.secret = keyPair.secret;
          done();
        });
      });
    }
    catch(e){
      console.log(e);
      process.exit();
    }
  }
  else{
    done();
  }
});

after(function(done){
  try{
    _removeTempTestService(TEST_SERVICE);
    _delTempApiKey().then(done).catch(e =>{
      console.log(e);
      done();
    });
  } catch(e){
    console.log(e);
    process.exit();
  }
});

async function _getTempApiKey() {
  const auth = parsony.getBundle().auth;
  return await auth.createAPIKeyPair();
}

async function _delTempApiKey(){
  const auth = parsony.getBundle().auth;
  await auth.deleteAPIKey(API_KEY.key);
}


function _createTempTestService(testServiceDir){
  const servicesDir = path.join(settings.directories.services,testServiceDir);
  const interfacePath = path.join(servicesDir, 'test.interface.json');
  const handlersPath = path.join(servicesDir, 'test.handlers.js');

  fs.mkdirSync(servicesDir);
  fs.writeFileSync(interfacePath, API_TEST_INTERFACE);
  fs.writeFileSync(handlersPath, API_TEST_HANDLERS);
}

function _removeTempTestService(testServiceDir){
  const servicesDir = path.join(settings.directories.services,testServiceDir);
  const interfacePath = path.join(servicesDir, 'test.interface.json');
  const handlersPath = path.join(servicesDir, 'test.handlers.js');
  fs.unlinkSync(handlersPath);
  fs.unlinkSync(interfacePath);
  fs.rmdirSync(servicesDir);
}


const API_TEST_INTERFACE = `{
"handlers": "test.handlers.js",
  "endpoints": [
  {
    "method": "put",
    "RESTUrl": "/api/test",
    "json_api": "api.test.put",
    "handler": "apiEndpointTest",
    "returns": {
      "data": [
        {
          "message": "Hello World"
        }
      ]
    }
  },
  {
    "method": "delete",
    "RESTUrl": "/api/test",
    "json_api": "api.test.delete",
    "handler": "apiEndpointTest",
    "returns": {
      "data": [
        {
          "message": "Hello World"
        }
      ]
    }
  },
  {
    "method": "get",
    "RESTUrl": "/api/test",
    "json_api": "api.test.get",
    "handler": "apiEndpointTest",
    "returns": {
      "data": [
        {
          "message": "Hello World"
        }
      ]
    }
  },
  {
    "method": "post",
    "RESTUrl": "/api/test",
    "json_api": "api.test.post",
    "handler": "apiEndpointTest",
    "returns": {
      "data": [
        {
          "message": "Hello World"
        }
      ]
    }
  },
  {
    "method": "post",
    "RESTUrl": "/api/test/auth",
    "json_api": "api.test.auth",
    "handler": "apiEndpointTest",
    "authentication": {
      "api_key": true,
      "session_token": true
    },
    "returns": {
      "data": [
        {
          "message": "Hello World"
        }
      ]
    }
  },
  {
    "method": "post",
    "RESTUrl": "/api/test/error",
    "json_api": "api.test.error",
    "handler": "apiEndpointFailureTest"
  },
  {
    "method": "post",
    "RESTUrl": "/api/test/error",
    "json_api": "api.test.unimplemented"
  }
]
}`;

const API_TEST_HANDLERS = `
exports.apiEndpointTest = async function () {
  return {
    message: 'testing 123'
  }
};

exports.apiEndpointFailureTest = async function (){
  throw new Error();
};`;