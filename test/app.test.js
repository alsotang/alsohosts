var app = require('../app');
var supertest = require('supertest')(app);
var should = require('should');
var mm = require('mm');
var lib = require('../lib');

describe('test/app.test.js', function () {
  before(function () {
    mm.data(lib, 'getIPs', [['googledns', '8.8.8.8'],]);
  });
  after(function () {
    mm.restore();
  });

  it('#index should show hosts', function (done) {
    supertest.get('/')
      .expect(200)
      .end(function (err, res) {
        res.text.should.containEql('# alsohosts START\n8.8.8.8  googledns\n# alsohosts END');
        done(err);
      });
  });
});