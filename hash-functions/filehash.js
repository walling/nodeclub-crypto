#!/usr/bin/env node

var crypto = require('crypto');
var path   = require('path');
var fs     = require('fs');

var script_name = path.basename(__filename);
process.title = script_name;

// Print help if user doesn't provide any arguments.
var hash_function = process.argv[2];
if (!hash_function) {
	console.log('Usage: ' + script_name + ' hash-function files...');
	console.log();
	console.log('Possible hash functions: md5, sha1, sha512, etc.');
	return;
}

// If hash_function is unknown fail faster.
try {
	crypto.createHash(hash_function).update('').digest('hex');
} catch (err) {
	console.error(script_name + ': Unknown hash function ' + hash_function);
	process.exit(1);
	return;
}

// Run through files in parallel and calculate the hash of each of them.
var filenames = process.argv.slice(3);
filenames.forEach(function(filename) {
	var stream = fs.ReadStream(filename);
	var hash = crypto.createHash(hash_function);

	stream.on('data', function(data) {
		hash.update(data);
	});

	stream.on('error', function(err) {
		console.error(script_name + ': ' + filename + ': ' + err.message);
	});

	stream.on('end', function() {
		console.log(hash.digest('hex') + '  ' + filename);
	});
});
