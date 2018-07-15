const path = require('path');

global.base = __dirname + path.sep;
global.parsony = require('parsony');


const settings = {
  files:{
    configs:      path.join(__dirname, 'config.json'),
    _404:         path.join(__dirname, 'static','404.html')
  },
  directories:{
    models:       path.join(__dirname, 'models'),
    services:     path.join(__dirname, 'services'),
    scheduled:    path.join(__dirname, 'scheduled'),
    www:          path.join(__dirname, 'static'),
    templates:    path.join(__dirname, 'templates')
  }
};

try{
  parsony.init(settings);
  parsony.start()
    .then(app =>{})
    .catch(e => {
      console.error(e.message);
      process.exit();
    });
}
catch(e){
  console.error(e.message);
  process.exit();
}




