const {expect} = require('chai');
const {endpointValidationGateAsync} = require('../../../node_modules/parsony/lib/api/gates/endpointValidation');

const params = {
  email: {
    "param": "email",
    "required": true,
    "validation": {
      "is_type": "string",
      "valid_email": true
    }
  },
  sixCharString: {
    "param": "sixCharString",
    "required": true,
    "validation": {
      "is_type": "string",
      "min_length": 6
    }
  },
  lessThanTen: {
    "param": "lessThanTen",
    "required": true,
    "validation": {
      "is_type": "string",
      "max_length": 10
    }
  },
  optionalShortString: {
    "param": "optionalShortString",
    "required": false,
    "validation": {
      "is_type": "string",
      "max_length": 10
    }
  },
  string:{
    "param": "string",
    "required": true,
    "validation": {
      "is_type": "string"
    }
  },
  number: {
    "param": "number",
    "required": true,
    "validation": {
      "is_type": "number"
    }
  },
  boolean:{
    "param": "boolean",
    "required": true,
    "validation": {
      "is_type": "boolean"
    }
  },
  dateOfBirth:{
    "param": "dateOfBirth",
    "required": true,
    "validation": {
      "is_type": "date"
    }
  },
  isInSet:{
    "param": "isInSet",
    "required": true,
    "validation": {
      "in_set": [1,2,3]
    }
  },
  isUrl:{
    "param": "isUrl",
    "required": true,
    "validation": {
      "is_url": true
    }
  },
  isJson:{
    "param": "isJson",
    "required": true,
    "validation": {
      "is_json": true
    }
  },
  isArray:{
    "param": "isArray",
    "required": true,
    "validation": {
      "is_array": true
    }
  },
  emailInRange: {
    "param": "emailInRange",
    "required": false,
    "validation": {
      "is_type": "string",
      "valid_email":true,
      "max_length": 15,
      "min_length": 5
    }
  },
  regex :{
    "param":"regularExpression",
    "required": true,
    "validation":{
      "regex": "^[a-zA-Z]+$"
    }
  }
};

const validArgs= {
  email: "john_doe@gmail.com",
  sixCharString : "a string of > 6",
  lessThanTen: "short",
  optionalShortString: "short",
  string:"this is a string",
  number: 1234567890,
  boolean: true,
  dateOfBirth: "12/9/1983",
  isInSet:2,
  google:"http://google.com",
  dotIo:"http://vagabond.io",
  https:"https://google.com",
  ftp:"ftp://aws.amazon.com",
  www:"www.google.com",
  subDomain:"api.google.com",
  isJson: '{"hello":"world","happy":true}',
  isArray:[[[0],[1]],[0]],
  emailInRange:'jon@gmail.com',
  regex: 'thisIsValid'
};

const invalidArgs = {
  email: "john_doegmail.com",
  sixCharString : "< 6",
  lessThanTen: "not short enough to pass",
  optionalShortString: "not short enough to pass",
  string: false,
  number:"three",
  boolean: "True",
  boolean_0: 0,
  dateOfBirth: "February 310, 20011",
  notInSet:5,
  notUrl:"thisisnotaurl.",
  httphttp:"http://http://google.com",
  notJson:"{key:value}",
  notArray: "[]",
  isObject: {},
  emailTooLongAndInvalid: 'jon_doe @ america.com',
  regex:'this is not valid !'
};

describe('Endpoint Validation Gate: Unit',()=>{
  describe('.endpointValidationGateAsync()',()=>{
    describe('Missing arguments',()=>{
      it('should reject missing parameter param_1',()=>{
        return endpointValidationGateAsync({}, [params.email])
          .then()
          .catch((e)=>{
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('missing_arg');
            expect(e.detail[0].param).to.equal('email');
            expect(e.code).to.equal(400);
          })
      });

      it('should reject missing multiple missing parameters param_1, param_2',()=>{
        return endpointValidationGateAsync({},[params.email, params.sixCharString])
          .then()
          .catch((e)=>{
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('missing_arg');
            expect(e.detail[0].param).to.equal('email');
            expect(e.detail[1].code).to.equal('missing_arg');
            expect(e.detail[1].param).to.equal('sixCharString');
            expect(e.code).to.equal(400);
          })
      });

      it('should reject 2 missing params of 3 with second param supplied ',()=>{
        return endpointValidationGateAsync(
          {sixCharString: validArgs.sixCharString},
          [params.email,params.sixCharString, params.lessThanTen])
          .then()
          .catch((e)=>{
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('missing_arg');
            expect(e.detail[0].param).to.equal('email');
            expect(e.detail[1].code).to.equal('missing_arg');
            expect(e.detail[1].param).to.equal('lessThanTen');
            expect(e.code).to.equal(400);
          })
      });

      it('should succeed with missing optional parameter',()=>{
        return endpointValidationGateAsync({},[params.optionalShortString])
          .then()
          .catch((e)=>{})
      });
    });
    describe('Argument Validation',()=>{
      it('should accept email',()=> {
        return endpointValidationGateAsync({email: validArgs.email}, [params.email])
          .then(() => {
            expect(true);
          })
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject invalid email',()=> {
        return endpointValidationGateAsync({email: invalidArgs.email}, [params.email])
          .then()
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('invalid_email');
            expect(e.detail[0].param).to.equal('email');
        });
      });

      it('should accept a string longer than 6 characters',()=> {
        return endpointValidationGateAsync({sixCharString: validArgs.sixCharString},
          [params.sixCharString])
          .then(() => {
            expect(true);
          })
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject too short string',()=> {
        return endpointValidationGateAsync({sixCharString: invalidArgs.sixCharString},
          [params.sixCharString])
          .then()
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('min_length_not_met');
            expect(e.detail[0].param).to.equal('sixCharString');
          });
      });

      it('should accept a string shorter than 10 characters',()=> {
        return endpointValidationGateAsync({lessThanTen: validArgs.lessThanTen},
          [params.lessThanTen])
          .then(() => {
            expect(true);
          })
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject too long string',()=> {
        return endpointValidationGateAsync({lessThanTen: invalidArgs.lessThanTen},
          [params.lessThanTen])
          .then()
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('max_length_exceeded');
            expect(e.detail[0].param).to.equal('lessThanTen');
          });
      });

      it('should accept optional string shorter than 10 characters',()=> {
        return endpointValidationGateAsync({optionalShortString: validArgs.optionalShortString},
          [params.optionalShortString])
          .then((data)=>{
            expect(data.optionalShortString).to.equal(validArgs.optionalShortString);
          })
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject optional too long string',()=> {
        return endpointValidationGateAsync({optionalShortString: invalidArgs.optionalShortString},
          [params.optionalShortString])
          .then((data)=>{
            expect(data).to.equal(null)
          })
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('max_length_exceeded');
            expect(e.detail[0].param).to.equal('optionalShortString');
          });
      });

      it('should accept number',()=> {
        return endpointValidationGateAsync({number: validArgs.number},
          [params.number])
          .then((data) => {
              expect(data.number).to.equal(validArgs.number)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject number as string',()=> {
        return endpointValidationGateAsync({number: invalidArgs.number},
          [params.number])
          .then((data)=>{
              expect(data).to.equal(null);
            }
          )
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('argument_type_mismatch');
            expect(e.detail[0].param).to.equal('number');
            expect(e.detail[0].opt_desc.expected_type).to.equal('number');
          });
      });

      it('should accept string',()=> {
        return endpointValidationGateAsync({string: validArgs.string},
          [params.string])
          .then((data) => {
              expect(data.string).to.equal(validArgs.string)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject string as number',()=> {
        return endpointValidationGateAsync({string: invalidArgs.string},
          [params.string])
          .then((data)=>{
              expect(data).to.equal(null);
            }
          )
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('argument_type_mismatch');
            expect(e.detail[0].param).to.equal('string');
            expect(e.detail[0].opt_desc.expected_type).to.equal('string');
          });
      });

      it('should accept boolean',()=> {
        return endpointValidationGateAsync({boolean: validArgs.boolean},
          [params.boolean])
          .then((data) => {
              expect(data.boolean).to.equal(validArgs.boolean)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject boolean int',()=> {
        return endpointValidationGateAsync({boolean: invalidArgs.boolean_0},
          [params.boolean])
          .then((data) => {
              expect(data).to.equal(null);
            }
          )
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('argument_type_mismatch');
            expect(e.detail[0].param).to.equal('boolean');
            expect(e.detail[0].opt_desc.expected_type).to.equal('boolean');
          });
      });

      it('should reject boolean as string',()=> {
        return endpointValidationGateAsync({boolean: invalidArgs.boolean},
          [params.boolean])
          .then((data)=>{
              expect(data).to.equal(null);
            }
          )
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('argument_type_mismatch');
            expect(e.detail[0].param).to.equal('boolean');
            expect(e.detail[0].opt_desc.expected_type).to.equal('boolean');
          });
      });

      it('should accept date',()=> {
        return endpointValidationGateAsync({dateOfBirth: validArgs.dateOfBirth},
          [params.dateOfBirth])
          .then((data) => {
              expect(data.dateOfBirth).to.equal(validArgs.dateOfBirth)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject malformed date',()=> {
        return endpointValidationGateAsync({dateOfBirth: invalidArgs.dateOfBirth},
          [params.dateOfBirth])
          .then((data) => {
              expect(data).to.equal(null);
            }
          )
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('argument_type_mismatch');
            expect(e.detail[0].param).to.equal('dateOfBirth');
            expect(e.detail[0].opt_desc.expected_type).to.equal('date');
          });
      });

      it('should accept value in set [1,2,3]',()=> {
        return endpointValidationGateAsync({isInSet: validArgs.isInSet},
          [params.isInSet])
          .then((data) => {
              expect(data.isInSet).to.equal(validArgs.isInSet)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject value 5 not in set [1,2,3]',()=> {
        return endpointValidationGateAsync({isInSet: invalidArgs.notInSet},
          [params.isInSet])
          .then((data) => {
              expect(data).to.equal(null);
            }
          )
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('argument_out_of_range');
            expect(e.detail[0].param).to.equal('isInSet');
            expect(e.detail[0].opt_desc.acceptable_set[0]).to.equal(1);
          });
      });

      it(`should accept url: ${validArgs.google}`,()=> {
        return endpointValidationGateAsync({isUrl: validArgs.google},
          [params.isUrl])
          .then((data) => {
              expect(data.isUrl).to.equal(validArgs.google)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it(`should accept url: ${validArgs.dotIo}`,()=> {
        return endpointValidationGateAsync({isUrl: validArgs.dotIo},
          [params.isUrl])
          .then((data) => {
              expect(data.isUrl).to.equal(validArgs.dotIo)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it(`should accept url: ${validArgs.https}`,()=> {
        return endpointValidationGateAsync({isUrl: validArgs.https},
          [params.isUrl])
          .then((data) => {
              expect(data.isUrl).to.equal(validArgs.https)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it(`should accept url: ${validArgs.ftp}`,()=> {
        return endpointValidationGateAsync({isUrl: validArgs.ftp},
          [params.isUrl])
          .then((data) => {
              expect(data.isUrl).to.equal(validArgs.ftp)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it(`should accept url: ${validArgs.www}`,()=> {
        return endpointValidationGateAsync({isUrl: validArgs.www},
          [params.isUrl])
          .then((data) => {
              expect(data.isUrl).to.equal(validArgs.www)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it(`should accept url: ${validArgs.subDomain}`,()=> {
        return endpointValidationGateAsync({isUrl: validArgs.subDomain},
          [params.isUrl])
          .then((data) => {
              expect(data.isUrl).to.equal(validArgs.subDomain)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it(`should reject url: ${invalidArgs.notUrl}`,()=> {
        return endpointValidationGateAsync({isUrl: invalidArgs.notUrl},
          [params.isUrl])
          .then((data) => {
              expect(data).to.equal(null);
            }
          )
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('argument_not_url');
            expect(e.detail[0].param).to.equal('isUrl');
          });
      });

      it(`should reject url: ${invalidArgs.httphttp}`,()=> {
        return endpointValidationGateAsync({isUrl: invalidArgs.httphttp},
          [params.isUrl])
          .then((data) => {
              expect(data).to.equal(null);
            }
          )
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('argument_not_url');
            expect(e.detail[0].param).to.equal('isUrl');
          });
      });

      it('should accept valid json',()=> {
        return endpointValidationGateAsync({isJson: validArgs.isJson},
          [params.isJson])
          .then((data) => {
              expect(data.isJson).to.equal(validArgs.isJson)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject value malformed json',()=> {
        return endpointValidationGateAsync({isJson: invalidArgs.isJson},
          [params.isJson])
          .then((data) => {
              expect(data).to.equal(null);
            }
          )
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('argument_not_json');
            expect(e.detail[0].param).to.equal('isJson');
          });
      });

      it('should accept valid array',()=> {
        return endpointValidationGateAsync({isArray: validArgs.isArray},
          [params.isArray])
          .then((data) => {
              expect(data.isArray).to.equal(validArgs.isArray)
            }
          )
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject value malformed array',()=> {
        return endpointValidationGateAsync({isArray: invalidArgs.notArray},
          [params.isArray])
          .then((data) => {
              expect(data).to.equal(null);
            }
          )
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('argument_not_an_array');
            expect(e.detail[0].param).to.equal('isArray');
          });
      });
    });
    describe('Validate Multiple Arguments', ()=>{
      it('should accept email jon@gmail.com between 5 and 10 chars',()=> {
        return endpointValidationGateAsync({emailInRange: validArgs.emailInRange},
          [params.emailInRange])
          .then((data) => {
            expect(data.emailInRange).to.equal(validArgs.emailInRange)
          })
          .catch((e) => {expect(e).to.equal(null)});
      });

      it('should reject invalid email as too long',()=> {
        return endpointValidationGateAsync({emailInRange: validArgs.email},
          [params.emailInRange])
          .then((data) => {
            expect(data).to.equal(null);
          })
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('max_length_exceeded');
            expect(e.detail[0].param).to.equal('emailInRange');
          });
      });

      it('should reject invalid email as too long and invalid',()=> {
        return endpointValidationGateAsync({emailInRange: invalidArgs.emailTooLongAndInvalid},
          [params.emailInRange])
          .then((data) => {
            expect(data).to.equal(null);
          })
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('invalid_email');
            expect(e.detail[0].param).to.equal('emailInRange');
            expect(e.detail[1].code).to.equal('max_length_exceeded');
            expect(e.detail[1].param).to.equal('emailInRange');
          });
      });
      it('should accept valid regex test',()=> {
        return endpointValidationGateAsync({regularExpression: validArgs.regex},
          [params.regex])
          .then((data) => {
            expect(data.regularExpression).to.equal(validArgs.regex)
          })
          .catch((e) => {expect(e).to.equal(null)});
      });
      it('should reject invalid regex test',()=> {
        return endpointValidationGateAsync({regularExpression: invalidArgs.regex},
          [params.regex])
          .then((data) => {
            expect(data).to.equal(null);
          })
          .catch((e) => {
            expect(e.type).to.equal('malformed_request');
            expect(e.detail[0].code).to.equal('argument_invalid_pattern');
            expect(e.detail[0].param).to.equal('regularExpression');
          });
      });
    })
  })
});