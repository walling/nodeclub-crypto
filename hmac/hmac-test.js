#!/usr/bin/env node

var hmac = require('./hmac');
var util = require('util');

var msg = process.argv.slice(3).join(' ');
var key = process.argv[2] || 'secret';

console.log('SHA-1 HMAC of ' + JSON.stringify(msg) + ' using ' + JSON.stringify(key) + ' as key:');
console.log();
console.log('Hex:     ' + hmac(msg, key, 'hex'));
console.log('Base64:  ' + hmac(msg, key, 'base64'));
console.log('URLSafe: ' + hmac(msg, key, 'urlsafe'));
console.log('Buffer:  ' + util.inspect(hmac(msg, key, 'buffer')));
