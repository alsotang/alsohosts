var dns = require('dns');
var async = require('async');
var express = require('express');

var domains = require('./domains.json');


function getIPs(domains, callback) {
  async.mapLimit(
    domains,
    10,
    function (domain, callback) {
      dns.lookup(domain, 4, function (err, addr) {
        callback(err, [domain, addr]);
      });
    },
    function (err, ips) {
      if (err) {
        console.error('get ip err', err);
        return callback(err);
      }
      callback(null, ips);
    });
}

// callback(err, fileContent)
function makeHosts(domains, callback) {
  getIPs(domains, function (err, ips) {
    if (err) {
      return callback(err);
    }
    var hosts = ips.map(function (pair) {
      var domain = pair[0];
      var ip = pair[1];
      return ip + '  ' + domain;
    }).join('\n');

    var fileContent = ['# alsohosts START', hosts, '# alsohosts END'].join('\n');

    callback(null, fileContent);
  });
}


var app = express();

var gHosts;

app.get('/', function (req, res, next) {
  res.type('txt');
  if (gHosts) {
    return res.send(gHosts);
  }

  makeHosts(domains, function (err, content) {
    gHosts = content;
    res.send(gHosts);
  });
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function () {
  console.log('listening on ' + port);
});

