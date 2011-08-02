#!/usr/bin/env node

require('./buffer-random'); // Extend Buffer with randomize method.

// Get some random bytes and show them.
randomness = new Buffer(30).randomize();
console.log('Random bytes (Base64): ' + randomness.toString('base64'));
