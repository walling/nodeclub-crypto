#!/usr/bin/env node

var crypto  = require('crypto');
var mongojs = require('mongojs');


var method    = process.argv[2];
var max_count = process.argv[3] | 0;

if (!(method === 'mac' || method === 'db' || method === 'init')) {
	console.log('Usage: ./benchmark.js method max_count');
	console.log('');
	console.log('Benchmark various authentication methods.');
	console.log('');
	console.log('Methods:');
	console.log('  mac  - Using Message Authentication Codes (MACs)');
	console.log('  db   - Using MongoDB');
	console.log('  init - Initialize MongoDB [Warning: Destroys your data!]');
	process.exit(1);
	return;
}


var db = mongojs.connect('localhost', ['auth_benchmark']);

function show_result(count, time) {
	db.close();

	if (time < 1) time = 1;
	var throughput = (count / (time / 1000)) | 0;

	console.log('Authenticated ' + count + ' within ' + time + ' ms. Throughput: ' + throughput + ' per second.');
}


if (method === 'init') {

	var user = {
		username: 'example',
		password: 'some-very-secret-phrase',
		email: 'example@example.org',
		fullname: 'Mr. Example',
	};

	db.auth_benchmark.remove({}, function(err) {
		if (err) throw err;

		db.auth_benchmark.insert(user, {safe:true}, function(err, new_user) {
			if (err) throw err;

			db.close();
			console.log('Created user in MongoDB:');
			console.log(new_user);
		});
	});
	return;

}


var authenticate;

if (method === 'db') {
	authenticate = function(callback) {
		db.auth_benchmark.find({ username: 'example' }, callback);
	};
}


if (method === 'mac') {

	var auth_string = JSON.stringify({
		username: 'example',
		timeout: Date.now() + 60*60*1000
	});

	var create_token = function(auth_string) {
		return auth_string + crypto.createHmac('sha1', 'server-shared-secret').update(auth_string).digest('hex');
	};

	var verify_token = function(token, callback) {
		var auth_string = token.substring(0, token.length - 40);
		var user = JSON.parse(auth_string);
		if (Date.now() > user.timeout) {
			return callback(new Error('token timeout'));
		}
		if (create_token(auth_string) === token) {
			callback(null, user);
		} else {
			callback(null, null);
		}
	};

	var access_token = create_token(auth_string);
	authenticate = function(callback) {
		verify_token(access_token, callback);
	};
}


var start_time;
var count = 0;

benchmark = function(err, users) {
	if (err) throw err;

	count += 1;
	if (count >= max_count) {
		var stop_time = Date.now();
		show_result(count, stop_time - start_time);
	} else {
		authenticate(benchmark);
	}
};

start_time = Date.now();
authenticate(benchmark);
