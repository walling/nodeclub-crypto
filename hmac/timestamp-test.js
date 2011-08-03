#!/usr/bin/env node

var timestamp = require('./timestamp');

console.log('Timestamp   Unix time [ms]   Text representation');

setInterval(function() {

	var stamp = timestamp.ttl(0);
	var unix_time = timestamp.parse(stamp);
	var time_object = new Date(unix_time);
	console.log(stamp + '    ' + unix_time + '    ' + time_object);

}, 500);
