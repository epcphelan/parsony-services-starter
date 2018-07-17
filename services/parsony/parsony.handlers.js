const {
  services,
  errors : apiErrors
} = parsony.getBundle();

const errors = require("../../lib/errors.json");

exports.helloWorld = async function() {
  return {
    message: "Hello World"
  };
};

exports.getAPIDocumentation = async function() {
  const contracts = _immutable(services.getJSONMasterObj().contracts);
  return _mixinErrorResponses(contracts);

  function _mixinErrorResponses(contracts) {
    const errorsByType = _getErrors();
    const out = _immutable(contracts);
    Object.keys(out).map(k => {
      const endpoint = out[k];
      const errors = endpoint["errors"];
      if (errors) {
        out[k].errors = errors.map(e => {
          return errorsByType[e];
        });
      } else {
        out[k].errors = [];
      }
    });
    return out;
  }

  function _getErrors() {
    return Object.keys(errors).reduce((o, k) => {
      const err = errors[k];
      o[err.type] = err;
      return o;
    }, {});
  }
};

exports.errors = async function() {
  const errors =_immutable(apiErrors);
  const errorsArray = [];
  _flatten(errors);
  errorsArray.sort((a,b)=>{
    return parseInt(a.code) - parseInt(b.code);
  });
  return errorsArray;

  function _flatten(obj){
    if(obj.hasOwnProperty('code')){
      return errorsArray.push(obj);
    } else{
      return Object.keys(obj).map(k=>{
        _flatten(obj[k]);
      });
    }
  }
};



function _immutable(obj) {
  return JSON.parse(JSON.stringify(obj));
}
