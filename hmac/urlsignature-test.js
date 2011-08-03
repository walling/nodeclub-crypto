#!/usr/bin/env node

var urlsignature = require('./urlsignature');

// Print help message if user didn't provide any arguments.
if (process.argv.length !== 4) {
	console.log('Usage: urlsignature-test.js {sign|verify} url');
	process.exit(1);
	return;
}

var command = process.argv[2];
var url     = process.argv[3];

// Sign or verify an URL.
if (command === 'sign') {
	console.log(urlsignature.sign(url));
} else if (command === 'verify') {
	console.log(urlsignature.verify(url));
} else {
	console.error('Unknown command. Please either sign or verify.');
	process.exit(1);
	return;
}
