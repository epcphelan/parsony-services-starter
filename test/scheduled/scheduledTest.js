const {expect} = require('chai');
const path = require('path');
const fs = require('fs');

const _dir = __dirname.toString().replace('/test/scheduled','');
const {setScheduledDirectory,
  getScheduledDirectory,
  createScheduledTasks,
  start,
  stop} = require('../../node_modules/parsony/lib/scheduled');

const TEST_SCHEDULED_DIR = path.join(__dirname,`test_scheduled_${Math.round(Math.random()*100000)}`);

const basicCron = 'const cron = require("node-cron"); exports.schedule="* * * * *"; exports.execute = () => {};';
const cronWithRunOnStartup = 'const cron = require("node-cron"); exports.runOnStartUp = true; exports.schedule="* * * * *"; exports.execute = () => {};';
const cronMissingSchedule = 'const cron = require("node-cron");  exports.execute = () => {};';

const basicCronFilename = `scheduled_${Math.round(Math.random()*10000)}.js`;
const cronWithRunOnStartupFilename = `scheduled_${Math.round(Math.random()*10000)}.js`;
const cronMissingScheduleFilename = `scheduled_${Math.round(Math.random()*10000)}.js`;

let taskCount;

function _setTaskCount(count){
  taskCount = count;
}

function _getTaskCount(){
  return taskCount;
}

before(function(done){
  fs.mkdirSync(TEST_SCHEDULED_DIR);
  fs.writeFileSync(path.join(TEST_SCHEDULED_DIR, basicCronFilename),basicCron);
  fs.writeFileSync(path.join(TEST_SCHEDULED_DIR, cronWithRunOnStartupFilename),cronWithRunOnStartup);
  fs.writeFileSync(path.join(TEST_SCHEDULED_DIR, cronMissingScheduleFilename),cronMissingSchedule);
  done()
});

describe('Scheduled: Unit', function(){

  describe('.setScheduledDirectory() / .getScheduledDirectory()',function(){
    it('should set/get directory', function(){
      setScheduledDirectory(TEST_SCHEDULED_DIR);
      const directory = getScheduledDirectory();
      expect(directory).to.equal(TEST_SCHEDULED_DIR)
    });

    it('should bind all tasks', function(){
      const scheduled = createScheduledTasks();
      expect(scheduled['created']).to.be.greaterThan(1);
      _setTaskCount(scheduled['created']);
    });

    it('should have at least one failed', function(){
      const scheduled = createScheduledTasks();
      expect(scheduled['failed']).to.be.greaterThan(0);
      _setTaskCount(scheduled['created']);
    });

    it('should have at least one executed', function(){
      const scheduled = createScheduledTasks();
      expect(scheduled['executed']).to.be.greaterThan(0);
      _setTaskCount(scheduled['created']);
    });

    it('should start all tasks', function(){
      const countStarted = start();
      expect(countStarted).to.equal(_getTaskCount());
    });

    it('should stop all tasks', function(){
      const countStopped = stop();
      expect(countStopped).to.equal(_getTaskCount());
    })

  });
});

after(function(done){
  fs.unlinkSync(path.join(TEST_SCHEDULED_DIR, basicCronFilename));
  fs.unlinkSync(path.join(TEST_SCHEDULED_DIR, cronWithRunOnStartupFilename));
  fs.unlinkSync(path.join(TEST_SCHEDULED_DIR, cronMissingScheduleFilename));
  fs.rmdirSync(TEST_SCHEDULED_DIR);
  done()
});

