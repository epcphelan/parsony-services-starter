const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const {expect, request} = chai;


function getApp(){
  return parsony.getBundle().app;
}

function _getAuth(){
  return parsony.getBundle().auth;
}

function _getModels(){
  return parsony.getBundle().models;
}

function _getApiKey(){
  return API_KEY.key;
}

function _getApiSecret(){
  return API_KEY.secret;
}

function _signedPayload(payload){
  const secret = _getApiSecret();
  const { sign } = _getAuth();
  return sign(payload,secret);
}

describe('API End-to-End', function(){
  describe('API Test: Integration',function(){
    it('GET /api/test',function(done){
      const app = getApp();
      request(app)
        .get('/api/doc')
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        })
    });

    it('GET /api/helloworld',function(done){
      const app = getApp();
      request(app)
        .get('/api/helloworld')
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        })
    });

    it('GET /path/to/nowhere',function(done){
      const app = getApp();
      request(app)
        .get('/path/to/nowhere')
        .end((err,res)=>{
          expect(res.status).to.equal(404);
          done();
        })
    });

    it('GET /api/test',function(done){
      const app = getApp();
      request(app)
        .get('/api/test')
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        })
    });

    it('POST /api/test',function(done){
      const app = getApp();
      request(app)
        .post('/api/test')
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        })
    });

    it('PUT /api/test',function(done){
      const app = getApp();
      request(app)
        .put('/api/test')
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        })
    });

    it('DELETE /api/test',function(done){
      const app = getApp();
      request(app)
        .delete('/api/test')
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        })
    });

    it('JSON RPC api.test.get',function(done){
      const app = getApp();
      request(app)
        .post('/json-api')
        .send({
          "method":"api.test.get",
          "args":{},
        })
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        })
    });

    it('JSON RPC hint for api.test.get',function(done){
      const app = getApp();
      request(app)
        .post('/json-api')
        .send({
          "method":"api.test.get",
          "hint":true,
        })
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.api_expects.json_api).to.equal('api.test.get');
          done();
        })
    });

    it('should reject no method supplied',function(done){
      const app = getApp();
      request(app)
        .post('/json-api')
        .send({
          "args":{},
        })
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(false);
          expect(res.body.error.code).to.equal(400);
          expect(res.body.error.type).to.equal('method_required');
          done();
        })
    });

    it('should reject no method found',function(done){
      const app = getApp();
      request(app)
        .post('/json-api')
        .send({
          "method":"method.certain.to.not.exist",
          "args":{},
        })
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(false);
          expect(res.body.error.code).to.equal(501);
          expect(res.body.error.type).to.equal('method_not_found');
          done();
        })
    });

    it('should reject no method implemented',function(done){
      const app = getApp();
      request(app)
        .post('/json-api')
        .send({
          "method":"api.test.unimplemented",
          "args":{},
        })
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(false);
          done();
        })
    });

    it('should fail NOT_JSON PRC request',function(done){
      const app = getApp();
      request(app)
        .post('/json-api')
        .send({
          "method":"api.test.error",
          "args":{},
        })
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(false);
          expect(res.body.error.code).to.equal(500);
          expect(res.body.error.type).to.equal('internal_error');
          done();
        })
    });

    it('should fail REST POST request with generic error',function(done){
      const app = getApp();
      request(app)
        .post('/api/test/error')
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(false);
          expect(res.body.error.code).to.equal(500);
          expect(res.body.error.type).to.equal('internal_error');
          done();
        })
    });

    it('should fail REST POST request with generic error',function(done){
      const app = getApp();
      request(app)
        .post('/api/test/error')
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(false);
          expect(res.body.error.code).to.equal(500);
          expect(res.body.error.type).to.equal('internal_error');
          done();
        })
    });

    it('should reject no args supplied',function(done){
      const app = getApp();
      request(app)
        .post('/json-api')
        .send({
          "method":"api.test.get"
        })
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(false);
          expect(res.body.error.code).to.equal(400);
          expect(res.body.error.type).to.equal('missing_args');
          done();
        })
    });

    it('should fail auth test for api.test.get with no apiKey',function(done){
      const app = getApp();
      request(app)
        .post('/json-api')
        .set('Session-Token','123456789')
        .send({
          "method":"api.test.auth",
          "args":{},
        })
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(false);
          expect(res.body.error.code).to.equal(400);
          expect(res.body.error.type).to.equal('missing_api_key');
          done();
        })
    });

    it('should fail auth test for api.test.get with invalid apiKey',function(done){
      const app = getApp();
      request(app)
        .post('/json-api')
        .set('Api-Key', 'no.a.valid.key')
        .set('Session-Token', '123456789')
        .send({
          "method":"api.test.auth",
          "args":{},
        })
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(false);
          expect(res.body.error.code).to.equal(401);
          expect(res.body.error.type).to.equal('invalid_api_key');
          done();
        })
    });

    it('should fail auth test for api.test.get with missing session token',function(done){
      const key = _getApiKey();
      const app = getApp();
      const signedPackage =_signedPayload(
        {
          "method":"api.test.auth",
          "args":{},
        }
      );
      request(app)
        .post('/json-api')
        .set('Api-Key', key)
        .send(signedPackage)
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(false);
          expect(res.body.error.code).to.equal(401);
          expect(res.body.error.type).to.equal('missing_token');
          done();
        })
    });

    it('should fail auth test for api.test.get with invalid session token',function(done){
      const key = _getApiKey();
      const app = getApp();
      const signedPackage =_signedPayload(
        {
          "method":"api.test.auth",
          "args":{},
        }
      );
      request(app)
        .post('/json-api')
        .set('Api-Key', key)
        .set('Session-Token', 'not.a.valid.session.token')
        .send(signedPackage)
        .end((err,res)=>{
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(false);
          expect(res.body.error.code).to.equal(403);
          expect(res.body.error.type).to.equal('invalid_token');
          done();
        })
    });

  });

  describe('Service: USER End-to-End', function(){
    let session = {};
    const USER_ERRORS  =  require('../../lib/errors.json');
    const SYSTEM_ERRORS = require('../../node_modules/parsony/lib/errors/errors.json');
    const NEW_USER = {
      username:`test_user_${Math.round(Math.random()*1000000)}@parsony.com`,
      password: `test_password_${Math.round(Math.random()*1000000)}`,
    };
    function _setSession(newSession){
      session = newSession;
    }
    function _getSession(){
      return session;
    }
    describe('user.create', function(){
      it('should create new user', (done) => {
        const key = _getApiKey();
        const app = getApp();
        const payload = _signedPayload(
          {
            method:'user.create',
            args:{
              username:NEW_USER.username,
              password:NEW_USER.password
            }
          }
        );
        request(app)
          .post('/json-api')
          .set('Api-Key', key)
          .send(payload)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(true);
            expect(res.body.data).to.have.property('userId');
            _setSession(res.body.data);
            done();
          })
      });

      it('should fail to create duplicate user', (done) => {
        const key = _getApiKey();
        const app = getApp();
        const payload = _signedPayload(
          {
            method:'user.create',
            args:{
              username:NEW_USER.username,
              password:NEW_USER.password
            }
          }
        );
        request(app)
          .post('/json-api')
          .set('Api-Key', key)
          .send(payload)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(false);
            expect(res.body.error.type).to.equal(USER_ERRORS.DUPLICATE_ENTITY.type);
            done();
          })
      });
    });

    describe('user.login', function(){
      it('should log in new user', (done) => {
        const key = _getApiKey();
        const app = getApp();
        const payload = _signedPayload(
          {
            method:'user.login',
            args:{
              username:NEW_USER.username,
              password:NEW_USER.password
            }
          }
        );
        request(app)
          .post('/json-api')
          .set('Api-Key', key)
          .send(payload)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(true);
            expect(res.body.data).to.have.property('sessionToken');
            _setSession(res.body.data);
            done();
          })
      });
    });

    describe('user.login', function(){
      it('should fail to log in with invalid username', (done) => {
        const key = _getApiKey();
        const app = getApp();
        const payload = _signedPayload({
          method:'user.login',
          args:{
            username:`invalid_${NEW_USER.username}`,
            password:`NEW_USER.password`
          }
        });
        request(app)
          .post('/json-api')
          .set('Api-Key', key)
          .send(payload)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(false);
            expect(res.body.error.type).to.equal(USER_ERRORS.AUTHENTICATION_ERROR.type);
            done();
          })
      });
    });

    describe('user.login', function(){
      it('should fail to log in with invalid password', (done) => {
        const key = _getApiKey();
        const app = getApp();
        const payload = _signedPayload({
          method:'user.login',
          args:{
            username:NEW_USER.username,
            password:`${NEW_USER.password}_invalid`
          }
        });
        request(app)
          .post('/json-api')
          .set('Api-Key', key)
          .send(payload)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(false);
            expect(res.body.error.type).to.equal(USER_ERRORS.AUTHENTICATION_ERROR.type);
            done();
          })
      });
    });

    describe('user.loadSession', function(){
      it('should return session', (done) => {
        const key = _getApiKey();
        const app = getApp();
        const session = _getSession();
        const payload = _signedPayload({
          method:'user.loadSession',
          args:{}
        });
        request(app)
          .post('/json-api')
          .set('Api-Key', key)
          .set('Session-Token',session.sessionToken)
          .send(payload)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(true);
            expect(res.body.data).to.deep.equal(_getSession());
            done();
          })
      });
    });

    describe('user.updateEmail', function(){
      it('should return session', (done) => {
        const key = _getApiKey();
        const app = getApp();
        const session = _getSession();
        const payload = _signedPayload({
          method:'user.updateEmail',
          args:{
            email:NEW_USER.username
          }
        });
        request(app)
          .post('/json-api')
          .set('Api-Key', key)
          .set('Session-Token',session.sessionToken)
          .send(payload)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(true);
            done();
          })
      });
    });

    describe('user.sendConfirmEmail', function(){
      it('should return session', (done) => {
        const key = _getApiKey();
        const app = getApp();
        const session = _getSession();
        const payload = _signedPayload({
          method:'user.sendConfirmEmail',
          args:{}
        });
        request(app)
          .post('/json-api')
          .set('Api-Key', key)
          .set('Session-Token',session.sessionToken)
          .send(payload)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(true);
            done();
          })
      });
    });

    describe('user.confirmEmailWithCode', function(){
      it('should return session', (done) => {
        const key = _getApiKey();
        const app = getApp();
        const payload = _signedPayload({
          method:'user.confirmEmailWithCode',
          args:{
            email:NEW_USER.username,
            confirmationCode:'123456789'
          }
        });
        request(app)
          .post('/json-api')
          .set('Api-Key', key)
          .send(payload)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(true);
            done();
          })
      });
    });

    describe('user.logout', function(){
      it('should log out user', (done) => {
        const key = _getApiKey();
        const app = getApp();
        const session = _getSession();
        const payload = _signedPayload({
          method:'user.logout',
          args:{}
        });
        request(app)
          .post('/json-api')
          .set('Api-Key', key)
          .set('Session-Token',session.sessionToken)
          .send(payload)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.equal(true);
            _setSession({});
            done();
          })
      });
    });

    describe('user.something',function(){

    })

    after(async function(){
      const models = _getModels();
      await models['User'].destroy({
        where:{
          id: _getSession().userId
        },
        force:true
      });
    });
  });
});


