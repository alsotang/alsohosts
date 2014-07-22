var should = require('should');
var mm = require('mm');
var lib = require('../lib');
var dns = require('dns');
var domains = require('../domains.json');

describe('test/lib.test.js', function () {
  before(function () {
    mm(dns, 'lookup', function (ip, family, callback) {
      var rInt = ~~(Math.random() * 1000000);
      if (rInt % 2 === 0) {
        callback(null, 'im a ip');
      } else {
        callback(new Error('domain not exists'));
      }
    });
  });
  after(function () {
    mm.restore();
  });

  it('should work: #getIPs', function (done) {
    lib.getIPs(domains, function (err, ips) {
      ips.length.should.equal(domains.length);
      ips.forEach(function (pair) {
        pair[0].should.String;
        if (pair[1]) {
          pair[1].should.String;
        } else {
          (pair[1] === null).should.ok;
        }
      });
      done(err);
    });
  });

  it('should work: #makeHosts', function (done) {
    lib.makeHosts(domains, function (err, content) {
      content.split('\n').forEach(function (line) {
        line.should.not.startWith('null');
      });
      content.should.startWith('# alsohosts START');
      content.should.endWith('# alsohosts END');
      done(err);
    });
  });
});