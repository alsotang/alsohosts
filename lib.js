var dns = require('dns');
var async = require('async');

function getIPs(domains, callback) {
  async.mapLimit(
    domains,
    50,
    function (domain, callback) {
      dns.lookup(domain, 4, function (err, addr) {
        if (err) {
          return callback(null, [domain, null]);
        }
        callback(null, [domain, addr]);
      });
    },
    function (err, ips) {
      if (err) {
        console.error('get ips err', err);
        return callback(err);
      }
      callback(null, ips);
    });
}
exports.getIPs = getIPs;

// callback(err, content)
function makeHosts(domains, callback) {
  exports.getIPs(domains, function (err, ips) {
    if (err) {
      return callback(err);
    }

    // 去除无效的 domain
    ips = ips.filter(function (pair) {
      return pair[1];
    });

    // 将 domain ip 对转成字符串
    var hosts = ips.map(function (pair) {
      var domain = pair[0];
      var ip = pair[1];
      return ip + '  ' + domain;
    }).join('\n');

    // 加 header 和 footer
    var fileContent = ['# alsohosts START', hosts, '# alsohosts END'].join('\n');

    callback(null, fileContent);
  });
}

exports.makeHosts = makeHosts;