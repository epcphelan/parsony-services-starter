const {expect} = require('chai');
const {bindRESTEndpointsToRoutes, combineInterfaceContracts} = require('../../node_modules/parsony/lib/api/api.js');

const app = {
  get : (url, fn) => setResult(result.get,url,fn),
  post: (url, fn) => setResult(result.post,url,fn),
  put: (url, fn) => setResult(result.put,url,fn),
  delete: (url, fn) => setResult(result.delete,url,fn),
};

function setResult(obj, url, fn){
  obj.url = url;
  obj.fn = typeof fn === 'function';
}

const result = {
  get: {
    url: null,
    fn: null,
  },
  post: {
    url: null,
    fn: null,
  },
  put: {
    url: null,
    fn: null,
  },
  delete: {
    url: null,
    fn: null,
  }
};

const service = {
  interface: [
    {
      method:'get',
      RESTUrl:'/get/me',
      json_api: 'get.me'
    },
    {
      method:'post',
      RESTUrl:'/post/me',
      json_api: 'post.me'
    },
    {
      method:'put',
      RESTUrl:'/put/me',
      json_api: 'put.me'
    },
    {
      method:'delete',
      RESTUrl:'/delete/me',
      json_api: 'delete.me'
    },
  ]
};

const JSON_MASTER_OBJ = {
  contracts:{},
  mappings:{}
};

describe('API composition functions',()=>{
  describe('.bindRESTEndpointsToRoutes()',()=>{

    it('should handle empty service',()=>{
      bindRESTEndpointsToRoutes(app,{});
      expect(result.get.url).to.equal(null);
    });

    it('should properly bind service contracts to app',()=>{
      bindRESTEndpointsToRoutes(app,service);
      expect(result.get.url).to.equal('/get/me');
      expect(result.get.fn).to.equal(true);
      expect(result.post.url).to.equal('/post/me');
      expect(result.post.fn).to.equal(true);
      expect(result.put.url).to.equal('/put/me');
      expect(result.put.fn).to.equal(true);
      expect(result.delete.url).to.equal('/delete/me');
      expect(result.delete.fn).to.equal(true);
    })
  })
  describe('.combineInterfaceContracts()',()=>{

    it('should handle empty service',()=>{
      combineInterfaceContracts(JSON_MASTER_OBJ,{});
      expect(JSON_MASTER_OBJ.contracts).to.deep.equal({});
      expect(JSON_MASTER_OBJ.mappings).to.deep.equal({});
    });

    it('should properly bind service contracts to app',()=>{
      combineInterfaceContracts(JSON_MASTER_OBJ,service);
      const contracts = JSON_MASTER_OBJ.contracts;
      expect(contracts['get.me']).to.deep.equal(service.interface[0]);
      expect(contracts['post.me']).to.deep.equal(service.interface[1]);
      expect(contracts['put.me']).to.deep.equal(service.interface[2]);
      expect(contracts['delete.me']).to.deep.equal(service.interface[3]);
    })
  })
});