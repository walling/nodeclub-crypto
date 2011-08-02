#!/usr/bin/env node

var crypto = require('crypto');
var fs     = require('fs');

// Create SHA-1 hashing function and open this file for reading.
var sha1 = crypto.createHash('sha1');
var stream = fs.ReadStream(__filename);

// Hash contents of script.
stream.on('data', function(data) {
	sha1.update(data);
});

// Print the hash of this file, when done reading.
stream.on('end', function() {
	console.log(sha1.digest('hex'));
});
