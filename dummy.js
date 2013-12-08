/**
 * A dummy server for proxy testing
 */

var http = require('http'),
	url = require('url');

var server = http.createServer(function(req, res) {
	console.log(url.parse(req.url).pathname);
	res.end();
}).listen('8081');