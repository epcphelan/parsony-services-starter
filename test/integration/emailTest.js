const {expect} = require('chai');
const errors = require('../../node_modules/parsony/lib/errors/errors.json');
const fs = require('fs');
const path = require('path');

function _getMailer(){
  return parsony.getBundle().email;
}

const testTemplate = '<!DOCTYPE html><body>{{test_data}}</body></html>';

const testData = {
  test_data:`test_${Math.round(Math.random()*100000)}`
};

const testTemplateFile = `test_template_${testData.test_data}.html`;



describe('Email: Integration', function(){
  describe('.sendTemplateEmail', function(){
    before(function(done){
      const mailer = _getMailer();
      const templateDirectory = mailer.getTemplatesDir();
      fs.writeFileSync(path.join(templateDirectory,testTemplateFile), testTemplate);
      done();
    });



    it('should fail to send email with invalid sender', async function(){
      const mailer = _getMailer();
      const debugRecipient = mailer.getDebugRecipient();
      return mailer.sendTemplateEmail(debugRecipient,'Parsony Test', testData,testTemplateFile,{})
        .then((sent)=>{
          expect(sent).to.be(undefined);
        })
        .catch((e)=>{
          expect(e.code).to.equal(500);
          expect(e.type).to.equal(errors.EMAIL.NO_SENDER.type);
        });
    });

    it('should fail to send email with invalid template', async function(){
      const mailer = _getMailer();
      const debugRecipient = mailer.getDebugRecipient();
      return mailer.sendTemplateEmail(debugRecipient,'Parsony Test', testData,'thisFileDoesNotExist.html', null)
        .then((sent)=>{
          expect(sent).to.be(undefined);
        })
        .catch((e)=>{
          expect(e.code).to.equal(500);
          expect(e.type).to.equal(errors.EMAIL.TEMPLATE.type);
        });
    });

    it('should fail to send email with invalid template data', async function(){
      const mailer = _getMailer();
      const debugRecipient = mailer.getDebugRecipient();
      return mailer.sendTemplateEmail(debugRecipient,'Parsony Test', {},'thisFileDoesNotExist.html',null)
        .then((sent)=>{
            expect(sent).to.be(undefined);
          }
        )
        .catch((e)=>{
          expect(e.code).to.equal(500);
          expect(e.type).to.equal(errors.EMAIL.TEMPLATE.type);
        });
    });

    /*it('should send email', async function(){
      const mailer = _getMailer();
      const debugRecipient = mailer.getDebugRecipient();
      const sent = await mailer.sendTemplateEmail(debugRecipient,'Parsony Test', testData,testTemplateFile, null);
      expect(sent.accepted).to.deep.equal([debugRecipient]);
    });*/

    after(function(done){
      const mailer = _getMailer();
      const templateDirectory = mailer.getTemplatesDir();
      fs.unlinkSync(path.join(templateDirectory,testTemplateFile));
      done()
    })
  })
});

