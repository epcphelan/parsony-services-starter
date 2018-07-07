const {expect} = require('chai');
const crypto = require('crypto');
const errors = require('../../node_modules/parsony/lib/errors/errors.json');
const cache = require('../../node_modules/parsony/lib/cache');
const {randomString} = require('../../node_modules/parsony/lib/utils');
let session = {};
const user = {
  id: null,
  username:`testUser_${Math.round(Math.random()*100000)}`,
  password:`password_${Math.round(Math.random()*100000)}`
};

const invalidUserId = -1;

const invalidUserName = `INVALID_testUser_${Math.round(Math.random()*1000000000)}`;

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

function _saveSession(newSession){
  session = newSession;
}

function _hash(password) {
  const salt = randomString(16);
  const hash = crypto.createHmac('sha256', salt);
  hash.update(password);
  return {
    hash : hash.digest('hex'),
    salt
  }
}

describe('Auth: Integration', function(){
  before(async function(){
    const models = _getModels();
    const {hash,salt} = _hash(user.password);
    const newUser = await models['User'].create({
      username: user.username,
      UserAuth: {
        passwordHash: hash,
        salt:salt
      }
    }, {
      include: [{
        model: models['UserAuth']
      }]
    });
    user.id = newUser.id;
  });


  describe('.checkCredentials()',function(){
    it('should accept valid credentials', async function(){
      const auth = _getAuth();
      let userId = await auth.checkCredentials(user.username, user.password);
      expect(userId).to.equal(user.id);
    });

    it('should reject invalid credentials', async function(){
      const auth = _getAuth();
      return auth.checkCredentials(user.username, 'a wrong password').then((userId)=>{
        }).catch((e)=>{
          expect(e.code).to.equal(errors.INVALID_CREDENTIALS.code);
          expect(e.type).to.equal(errors.INVALID_CREDENTIALS.type);
        });
    });

    it('should reject user not found with invalid credentials', async function(){
      const auth = _getAuth();
      return auth.checkCredentials(invalidUserName, user.password).then((userId)=>{
        }).catch((e)=>{
          expect(e.code).to.equal(errors.INVALID_CREDENTIALS.code);
          expect(e.type).to.equal(errors.INVALID_CREDENTIALS.type);
        });
    });

    it('should reject with internal error', async function(){
      const auth = _getAuth();
      return auth.checkCredentials(user.username, new Error()).then((userId)=>{
        }).catch((e)=>{
          expect(e.code).to.equal(errors.SERVER_ERROR.code);
          expect(e.type).to.equal(errors.SERVER_ERROR.type);
        });
    });
  });
  describe('.getSession()', function(){
    it('should reject invalid session token', async function(){
      const auth = _getAuth();
      return auth.getSession(session.sessionToken).then((session)=>{
        expect(session).to.equal(null);
      }).catch((e)=>{
        expect(e.code).to.equal(errors.SESSION.INVALID.code);
        expect(e.type).to.equal(errors.SESSION.INVALID.type);
      });
    });
  });

  describe('.createSession()', function(){
    it('should create new session', async function(){
      const auth = _getAuth();
      const session = await auth.createSession(user.id);
      expect(session).to.not.equal(null);
      expect(session.sessionToken).to.have.length(40);
      _saveSession(session);
    });

    it('should fail to create new session', function(){
      const auth = _getAuth();
      return auth.createSession(invalidUserId).then().catch((e)=>{
        expect(e.code).to.equal(errors.SESSION.DB_WRITE_ERROR.code);
        expect(e.type).to.equal(errors.SESSION.DB_WRITE_ERROR.type);
      });
    });
  });

  describe('.getSession() with valid session', function(){
    it('should return userId for valid token from Cache', async function(){
      const auth = _getAuth();
      const confSession = await auth.getSession(session.sessionToken);
      expect(confSession.sessionToken).to.equal(session.sessionToken);
      expect(confSession.userId).to.equal(session.userId);
    });
  });

  describe('.destroySession()', function(){
    it('should destroy session', async function(){
      const auth = _getAuth();
      const destroyedSession = await auth.destroySession(session.sessionToken);
      expect(destroyedSession).to.equal(null);
    });
    it('should fail to destroy invalid session', async function(){
      const auth = _getAuth();
      return auth.destroySession(null)
        .then()
        .catch((e)=>{
          expect(e.code).to.equal(errors.SESSION.FLUSH_CACHE_ERROR.code);
          expect(e.type).to.equal(errors.SESSION.FLUSH_CACHE_ERROR.type);
      })
    });
  });

  describe('api keys', function(){
    let key;
    describe('.createApiKey()', function(){
      it('should created new key', async function(){
        const auth = _getAuth();
        const keyPair = await auth.createAPIKeyPair();
        key = keyPair.key;
        expect(key).to.have.length(44);
        const validKey = await auth.validAPIKey(key);
        expect(validKey).to.equal(true);
      });
    });
    describe('.disableApiKey()', function(){
      it('should disable key', async function(){
        const auth = _getAuth();
        await auth.disableAPIKey(key);
        auth.validAPIKey(key).then().catch(e =>{
          expect(e.code).to.equal(errors.API_KEY.INVALID.code);
          expect(e.type).to.equal(errors.API_KEY.INVALID.type);
        });
      });
    });
    describe('.enableApiKey()', function(){
      it('should enable key', async function(){
        const auth = _getAuth();
        await auth.enableAPIKey(key);
        const validKey = await auth.validAPIKey(key);
        expect(validKey).to.equal(true);
      });
    });
    describe('.deleteApiKey()', function(){
      it('should delete key', async function(){
        const auth = _getAuth();
        await auth.deleteAPIKey(key);
        auth.validAPIKey(key).then().catch(e =>{
          expect(e.code).to.equal(errors.API_KEY.INVALID.code);
          expect(e.type).to.equal(errors.API_KEY.INVALID.type);
        });
      });
    });
  });

  describe('signed payloads',function(){
    describe('intact cache', function(){
      it('should verify signed payload', async function(){
        const key = _getApiKey();
        const secret = _getApiSecret();
        const {sign, verifySignedByKeyHolder} = _getAuth();
        const payload = {
          method:"hello.world",
          arg:{
            superSecretValue:"high value"
          }
        };
        let signedPayload = sign(payload,secret);
        return verifySignedByKeyHolder(key, signedPayload)
          .then(bool=>{
            expect(bool).to.equal(true);
          })
          .catch(e =>{
            expect(e).to.equal(null);
          })
      });
      it('should fail to find secret for invalid key (cache)', async function(){
        const key = 'some.nonsense.key';
        const secret = _getApiSecret();
        const {sign, verifySignedByKeyHolder} = _getAuth();
        const payload = {
          method:"hello.world",
          arg:{
            superSecretValue:"high value"
          }
        };
        let signedPayload = sign(payload,secret);
        return verifySignedByKeyHolder(key, signedPayload)
          .then(bool=>{
            expect(bool).to.equal(null);
          })
          .catch(e =>{
            expect(e.code).to.equal(errors.SIGNED.NO_SECRET.code);
            expect(e.type).to.equal(errors.SIGNED.NO_SECRET.type);
          })
      })
    });
    before(function(done){
      cache.flushAll().then(done);
    });
    describe('flushed cache', function(){
      it('should fail to find secret for invalid key (db)', async function(){
        const key = 'some.nonsense.key';
        const secret = _getApiSecret();
        const {sign, verifySignedByKeyHolder} = _getAuth();
        const payload = {
          method:"hello.world",
          arg:{
            superSecretValue:"high value"
          }
        };
        let signedPayload = sign(payload,secret);
        return verifySignedByKeyHolder(key, signedPayload)
          .then(bool=>{
            expect(bool).to.equal(null);
          })
          .catch(e =>{
            expect(e.code).to.equal(errors.SIGNED.NO_SECRET.code);
            expect(e.type).to.equal(errors.SIGNED.NO_SECRET.type);
          })
      });
      it('should verify signed payload (db)', async function(){
        const key = _getApiKey();
        const secret = _getApiSecret();
        const {sign, verifySignedByKeyHolder} = _getAuth();
        const payload = {
          method:"hello.world",
          arg:{
            superSecretValue:"high value"
          }
        };
        let signedPayload = sign(payload,secret);
        return verifySignedByKeyHolder(key, signedPayload)
          .then(bool=>{
            expect(bool).to.equal(true);
          })
          .catch(e =>{
            expect(e).to.equal(null);
          })
      });
      it('should verify signed payload (cache)', async function(){
        const key = _getApiKey();
        const secret = _getApiSecret();
        const {sign, verifySignedByKeyHolder} = _getAuth();
        const payload = {
          method:"hello.world",
          arg:{
            superSecretValue:"high value"
          }
        };
        let signedPayload = sign(payload,secret);
        return verifySignedByKeyHolder(key, signedPayload)
          .then(bool=>{
            expect(bool).to.equal(true);
          })
          .catch(e =>{
            expect(e).to.equal(null);
          })
      });
    })

  });
  after(async function(){
    const models = _getModels();
    await models['User'].destroy({
      where:{
        id: user.id
      },
      force:true
    });
  });

});