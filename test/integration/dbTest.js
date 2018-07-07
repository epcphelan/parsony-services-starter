const {expect} = require('chai');

function _getDB(){
  return parsony.getBundle().db;
}

const random = Math.round(Math.random()*100000);

const create = `CREATE TABLE TESTING_${random} (name VARCHAR(20), owner VARCHAR(20));`;

const drop = `DROP TABLE TESTING_${random};`;

const insert = `INSERT INTO TESTING_${random} VALUES(?,?);`;

const query = `SELECT * FROM TESTING_${random} WHERE name = ? AND owner = ?;`;

describe('DB: Integration', function(){
  describe('.execute()',function(){

    it(`should create new table: TESTING_${random}`,async function(){
      const results = await _getDB().execute(create,[]);
      expect(results).to.not.equal(null);
    });

    it('should insert records into table',async function(){
      const results = await _getDB().execute(insert,['john','mary']);
      expect(results).to.not.equal(null);
    });

    it('should fail to insert records into table',async function(){
      return _getDB().execute(insert,['john']).then().catch((e)=>{
        expect(e.code).to.equal(500);
      });
    });
  });

  describe('.query()', function(){
    it('should query records from table', async function(){
      const results = await _getDB().query(query,['john','mary']);
      expect(results[0]).to.deep.equal({name:'john',owner:'mary'});
    });

    it('should fail to query records from table', async function(){
      return _getDB().query(query,['john']).then().catch((e)=>{
        expect(e.code).to.equal(500);
      });
    });
  });

  describe('.createPool()', function(){
    const props = {
      host: 'localhost',
      user: 'username',
      port: 4000,
      password: 'invalidPassword',
      database: 'db',
      connectionLimit: 100
    };

    it('should create pool', async function(){
      const results = _getDB().createPool(props);
      expect(results).to.not.equal(null);
    });
  });

  describe('tear down table', function(){
    it(`should drop table: TESTING_${random}`, async function(){
      const results = await _getDB().execute(drop,[]);
      expect(results).to.not.equal(null);
    });

  });
});