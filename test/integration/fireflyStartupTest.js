const fs = require('fs');
const path = require('path');
const _dir = __dirname.toString().replace('/test/integration','');
const parsony = require('../../node_modules/parsony');
const {expect} = require('chai');

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

const settingsMissingConfigs = {
  files:{
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

const settingsMissingFiles = {
  directories:{
    models:       _dir + '/models',
    services:     _dir + '/services',
    scheduled:    _dir + '/scheduled',
    www:          _dir + '/static',
    templates:    _dir + '/templates'
  }
};

const settingsMissingDirectories = {
  files:{
    configs:      _dir + '/config.json',
    _404:         _dir +'/static/404.html'
  }
};

const settingsMissingWWW = {
  files:{
    configs:      _dir + '/config.json',
    _404:         _dir +'/static/404.html'
  },
  directories:{
    models:       _dir + '/models',
    services:     _dir + '/services',
    templates:    _dir + '/templates'
  }
};

const settingsMissingServices = {
  files:{
    configs:      _dir + '/config.json',
    _404:         _dir +'/static/404.html'
  },
  directories:{
    models:       _dir + '/models',
    scheduled:    _dir + '/scheduled',
    www:          _dir + '/static',
    templates:    _dir + '/templates'
  }
};

const settingsWithMissingModels = {
  files:{
    configs:      _dir + '/config.json',
    _404:         _dir +'/static/404.html'
  },
  directories:{
    services:     _dir + '/services',
    scheduled:    _dir + '/scheduled',
    www:          _dir + '/static',
    templates:    _dir + '/templates'
  }
};

describe('Parsony Startup: Integration', function(){
  describe('.init()',function(){
    it('should fail init with missing services directory', function(){
      try{
        parsony.init(settingsMissingServices)
      }
      catch(e){
        expect(e).to.not.equal(null);
        expect(e.message).to.include('Settings missing a services directory')
      }
    });

    it('should fail init with missing www directory', function(){
      try{
        parsony.init(settingsMissingWWW)
      }
      catch(e){
        expect(e).to.not.equal(null);
        expect(e.message).to.include('Settings missing a www directory')
      }
    });

    it('should fail init with missing directories', function(){
      try{
        parsony.init(settingsMissingDirectories)
      }
      catch(e){
        expect(e).to.not.equal(null);
        expect(e.message).to.include('Settings does not contain a directories listing')
      }
    });

    it('should fail init with missing configs', function(){
      try{
        parsony.init(settingsMissingConfigs)
      }
      catch(e){
        expect(e).to.not.equal(null);
        expect(e.message).to.include('Settings does not contain a configs file.')
      }
    });

    it('should fail init with missing models', function(){
      try{
        parsony.init(settingsWithMissingModels)
      }
      catch(e){
        expect(e).to.not.equal(null);
        expect(e.message).to.include('Settings missing a models directory')
      }
    });

    it('should fail with missing files settings', function(){
      try{
        parsony.init(settingsMissingFiles);
      }
      catch(e){
        expect(e).to.not.equal(null);
        expect(e.message).to.include('Settings does not contain a files object.')
      }
    });

    it('should succeed with missing scheduled dir ', function(){
      delete settings['directories']['scheduled'];
      try{
        parsony.init(settings);
      }
      catch(e){
        expect(e).to.equal(null);
      }
    });

    it('should succeed with missing templates dir ', function(){
      delete settings['directories']['templates'];
      try{
        parsony.init(settings);
      }
      catch(e){
        expect(e).to.equal(null);
      }
    });

    it('should succeed with missing 404 ', function(){
      delete settings['files']['_404'];
      try{
        parsony.init(settings);
      }
      catch(e){
        expect(e).to.equal(null);
      }
    });
  })
});



/*
 Settings does not contain a files object.
 */