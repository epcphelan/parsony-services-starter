const {expect} = require('chai');
const parsony = global.parsony;


const requestWithInvalidToken= {
  get: (token) => token === 'Session-Token' ? '54321' : null
};

describe('Session Token Gate', ()=>{
  const sessionTokenGate = parsony.getBundle().api.sessionTokenGate;
  it('should reject request with invalid token',()=>{
    return sessionTokenGate(requestWithInvalidToken).then().catch((e)=>{
      expect(e.type).is.equal('invalid_token');
    });
  });
});