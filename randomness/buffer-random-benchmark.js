#!/usr/bin/env node

require('./buffer-random'); // Extend Buffer with randomize method.

var size       = process.argv[2] | 0;
var iterations = process.argv[3] | 0;

// Display help message if user didn't provide any arguments.
if (size <= 0 || iterations <= 0) {
	console.log('Usage: buffer-random-benchmark.js size iterations');
	process.exit(1);
	return;
}

// Create buffer to randomize the content of.
var buffer = new Buffer(size);

// Perform the benchmark.
var start_time = Date.now();
for (var i = 0; i < iterations; i++) {
	buffer.randomize();
}
var end_time = Date.now();

// Calculate the time it took.
var time = end_time - start_time;
if (time < 1) time = 1;

// Calculate the throughput, ie. how many random bytes we created each second.
var throughput = (size * iterations / (time / 1000)) | 0;
var throughput_unit = 'B/s';
if (throughput > 900) {
	throughput /= 1024;
	throughput_unit = 'KiB/s';
}
if (throughput > 900) {
	throughput /= 1024;
	throughput_unit = 'MiB/s';
}

// Print benchmark statistics.
console.log('Created ' + size + ' bytes of random data ' + iterations +
            ' times in ' + time + ' ms. Throughput: ' + throughput.toFixed(2) +
            ' ' + throughput_unit + '.');
