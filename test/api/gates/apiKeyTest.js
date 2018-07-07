const {expect} = require('chai');
const {apiKeyGateAsync} = require('../../../node_modules/parsony/lib/api/gates/apiKey');

const emptyRequest = {
  get: () => false
};

const requestWithKeyNoHost = {
  get: () => 'definitely.invalid.key'
};

describe('API Key Gate: Unit', ()=>{

  it('should reject empty request', ()=>{
    return apiKeyGateAsync(emptyRequest).then().catch((e)=>{
      expect(e.type).is.equal('missing_api_key');
    });
  });

  it('should reject request with invalid key',()=>{
    return apiKeyGateAsync(requestWithKeyNoHost).then().catch((e)=>{
      expect(e.type).is.equal('invalid_api_key');
    });
  });
});