#!/usr/bin/env node

var util = require('util');
var urlsignature = require('./urlsignature');
var objectsignature = require('./objectsignature');


var ttl = 1;
var context = 'ip=127.0.0.1';

// Sign URL and verify it.
var url = urlsignature.sign('http://google.com/', ttl, context);

console.log('Signed URL: ' + url);
console.log('Valid now: ' + urlsignature.verify(url, context));
console.log('Valid without context: ' + urlsignature.verify(url));
setTimeout(function() {
	console.log('Valid in one second: ' + urlsignature.verify(url, context));
	console.log();
}, 1100);


// After that, sign an object and verify it.
setTimeout(function() {

	var obj = objectsignature.create({ user:'john' }, ttl, context);

	console.log('Signed object: ' + obj);
	console.log('Parsed now: ' + util.inspect(objectsignature.parse(obj, context)));
	console.log('Parsed without context: ' + util.inspect(objectsignature.parse(obj)));
	setTimeout(function() {
		console.log('Parsed in one second: ' + util.inspect(objectsignature.parse(obj, context)));
	}, 1100);

}, 1500);
