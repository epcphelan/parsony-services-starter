const {expect} = require('chai');


const {sign, verify, unsign} = require('../../node_modules/parsony/lib/auth');
describe('auth/signed', function(){
  const secret = '098765431';
  const payload = {
    method:"hello.world",
    arg:{
      superSecretValue:"high value"
    }
  };
  let signedPayload;
  let forgedPayload;
  describe('.sign()',function() {
    it('should append signature to payload', function () {
      signedPayload = sign(payload, secret);
      expect(signedPayload).to.have.property('signed');
      const {signed} = signedPayload;
      expect(signed).to.have.length(64);
    });
    it('should append forged signature to payload', function () {
      const badSecret = '908765432';
      forgedPayload = sign(payload, badSecret);
      expect(signedPayload).to.have.property('signed');
      const {signed} = signedPayload;
      expect(signed).to.have.length(64);
    });
  });
  describe('.verify()', function(){
    it('should verify signed payload', function(){
      const verified = verify(signedPayload,secret);
      expect(verified).to.equal(true);
    });
    it('should fail to verify forged payload', function(){
      const verified = verify(forgedPayload,secret);
      expect(verified).to.equal(false);
    });
  });

  describe('.unsign()',function(){
    it('should remove signature from payload', function(){
      const unsigned = unsign(signedPayload);
      expect(unsigned).to.not.have.property('signed');
    })
  })
});