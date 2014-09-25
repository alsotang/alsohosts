var express = require('express');

var domains = require('./domains');
var lib = require('./lib');

var app = express();

var gHosts; // hosts 的缓存

// 一天更新一次缓存
setInterval(function () {
  lib.makeHosts(domains, function (err, content) {
    if (err) {
      console.log('makeHosts err', err);
      return;
    }
    gHosts = content;
  });
}, 1000 * 60 * 60 * 24);

app.get('/', function (req, res, next) {
  res.type('txt');
  if (gHosts) {
    return res.send(gHosts);
  }

  lib.makeHosts(domains, function (err, content) {
    if (err) {
      console.log('makeHosts err', err);
      return next(err);
    }
    gHosts = content;
    res.send(gHosts);
  });
});

var port = Number(process.env.PORT || 5001);
app.listen(port, function () {
  console.log('listening on ' + port);
});

exports = module.exports = app;

