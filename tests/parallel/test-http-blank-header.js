'use strict';
require('../common');
var assert = require('assert');
var http = require('http');
var net = require('net');

var gotReq = false;

var server = http.createServer(function(req, res) {
  gotReq = true;
  assert.equal('GET', req.method);
  assert.equal('/blah', req.url);
  assert.deepStrictEqual({
    host: 'mapdevel.trolologames.ru:443',
    origin: 'http://mapdevel.trolologames.ru',
    cookie: ''
  }, req.headers);
});


server.listen(0, function() {
  var c = net.createConnection(this.address().port);

  c.on('connect', function() {
    c.write('GET /blah HTTP/1.1\r\n' +
            'Host: mapdevel.trolologames.ru:443\r\n' +
            'Cookie:\r\n' +
            'Origin: http://mapdevel.trolologames.ru\r\n' +
            '\r\n\r\nhello world\r\n' //need \r\n at end for http-parser-js to fail
    );
  });
  
  c.on('data', function () {
  });

  c.on('end', function() {
    c.end();
  });

  c.on('close', function() {
    server.close();
  });
});


process.on('exit', function() {
  assert.ok(gotReq);
});
