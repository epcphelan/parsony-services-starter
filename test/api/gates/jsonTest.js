const {expect} = require('chai');
const {JSONGate} = require('../../../node_modules/parsony/lib/api/gates/json');


const res = {
  writeHead: _writeHeader,
  end: _end
};


function _writeHeader(code,header){
  response.header = header;
  response.code = code
}

function _end(body){
  response.body = body;
}

const response = {
  header:null,
  code:null,
  body:null
};

let nextCalled = false;

let appWithMalformedJson = {
  use: _useErrorFn
};

let appWithJson = {
  use: _useFn
};

function _next(){
  nextCalled = true;
}

function _useErrorFn(fn){
  fn(new SyntaxError,null,res,_next)
}

function _useFn(fn){
  fn(null,null,res,_next)
}

describe('JSON Gate: Unit',function(){
  it('should send error response with malformed JSON', function(){
    const expectedOutputNoData = {
      "success": false,
      "error": {
        "code": 400,
        "type": "malformed_request",
        "message": "Invalid JSON.",
        "detail": "API received malformed or invalid JSON."
      },
      "data": null
    };
    appWithMalformedJson = JSONGate(appWithMalformedJson);
    expect(nextCalled).to.equal(false);
    expect(response.code).to.equal(200);
    expect(response.header).to.deep.equal({ 'Content-Type': 'application/json' } );
    expect(response.body).to.equal(JSON.stringify(expectedOutputNoData));
  });

  it('should accept properly formatted JSON request', function(){
    appWithJson = JSONGate(appWithJson);
    expect(nextCalled).to.equal(true);
  })
});