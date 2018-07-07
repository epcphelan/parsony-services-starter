const {expect} = require('chai');
const {sessionAuthenticationGateAsync} = require('../../../node_modules/parsony/lib/api/gates/sessionAuthentication');

const emptyRequest = {
  get: () => false
};

describe('Session Authentication: Unit', ()=>{

  it('should reject empty request', ()=>{
    return sessionAuthenticationGateAsync(emptyRequest).then().catch((e)=>{
      expect(e.type).is.equal('missing_token');
    });
  });
});