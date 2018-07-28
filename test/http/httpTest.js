const {expect} = require('chai');
const {makeError, modelError, makeStandardError, sendSuccess, sendFailure} = require('../../node_modules/parsony/lib/http');
const ERRORS = require('../../node_modules/parsony/lib/errors/errors.json');

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

describe('HTTP Library: Unit',()=>{
  it('.makeError()',()=>{
    const error = makeError(404,'not_found','resource not found','more detail');
    expect(error).to.be.a('Error');
    expect(error['code']).to.equal(404);
    expect(error['type']).to.equal('not_found');
    expect(error['msg']).to.equal('resource not found');
    expect(error['detail']).to.equal('more detail');
  });

  it('.modelError()',()=>{
    const error = modelError({message:'model unknown'});
    expect(error).to.be.a('Error');
    expect(error['code']).to.equal(ERRORS.MODEL_ERROR.code);
    expect(error['type']).to.equal(ERRORS.MODEL_ERROR.type);
    expect(error['msg']).to.equal(ERRORS.MODEL_ERROR.msg);
    expect(error['detail']).to.equal('model unknown');
  });

  it('.makeStandardError()',()=>{
    const errorObj = {
      code: 501,
      type: 'server_error',
      msg: 'An error has occurred.',
      detail: 'Server Error.'
    };

    const error_1 = makeStandardError(errorObj,'Added info.');
    expect(error_1).to.be.a('Error');
    expect(error_1['code']).to.equal(501);
    expect(error_1['type']).to.equal('server_error');
    expect(error_1['msg']).to.equal('An error has occurred.');
    expect(error_1['detail']).to.equal('Added info.');

    const error_2 = makeStandardError({});
    expect(error_2).to.be.a('Error');
    expect(error_2['code']).to.equal(ERRORS.SERVER_ERROR.code);
    expect(error_2['type']).to.equal(ERRORS.SERVER_ERROR.type);
    expect(error_2['msg']).to.equal(ERRORS.SERVER_ERROR.msg);
    expect(error_2['detail']).to.equal(undefined);
  });

  it('.sendSuccess()',()=>{
    const expectedOutput = {
      requested: 'some.Request',
      success: true,
      error: null,
      data: 'some data'
    };
    sendSuccess(res,'some data','some.Request');
    expect(response.header).to.deep.equal({"Content-Type": "application/json"});
    expect(response.code).to.equal(200);
    expect(response.body).to.equal(JSON.stringify(expectedOutput));
  });

  it('.sendFailure()',()=>{
    const expectedOutput = {
      requested: 'some.Request',
      success: false,
      error: {
        code: 501,
        type: 'server_error',
        message: 'An error has occurred.',
        detail: 'Server Error.'
      },
      data: {
        received:{
          param: 'arg'
        }
      }
    };

    const expectedOutputNoData = {
      requested: 'some.Request',
      success: false,
      error: {
        code: 501,
        type: 'server_error',
        message: 'An error has occurred.',
        detail: 'Server Error.'
      },
      data: null
    };

    const errorObj = {
      code: 501,
      type: 'server_error',
      msg: 'An error has occurred.',
      detail: 'Server Error.'
    };

    const data = {
      param: 'arg',
      sessionObj: 'secret info'
    };

    sendFailure(res,errorObj,data,'some.Request');
    expect(response.header).to.deep.equal({"Content-Type": "application/json"});
    expect(response.code).to.equal(200);
    expect(response.body).to.equal(JSON.stringify(expectedOutput));

    sendFailure(res,errorObj,null,'some.Request');
    expect(response.header).to.deep.equal({"Content-Type": "application/json"});
    expect(response.code).to.equal(200);
    expect(response.body).to.equal(JSON.stringify(expectedOutputNoData));
  })
});