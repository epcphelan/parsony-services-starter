const {
  http: { makeStandardError },
  services
} = parsony.getBundle();
const { NOT_FOUND } = require("../../lib/errors.json");
const errors = require("../../lib/errors.json");

exports.helloWorld = async function() {
  return {
    message: "Hello World"
  };
};

exports.getAPIDocumentation = async function() {
  const contracts = _immutable(services.getJSONMasterObj().contracts);
  return _mixinErrorResponses(contracts);
};

exports.error = async function() {
  throw makeStandardError(NOT_FOUND, "This is a demo error response.");
};

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

function _immutable(obj) {
  return JSON.parse(JSON.stringify(obj));
}
