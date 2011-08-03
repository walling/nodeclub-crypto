var crypto  = require('crypto');
var urlsafe = require('./urlsafe');

// Calculates SHA-1 HMAC for short messages. The result can be digested as:
// hex, binary, base64, urlsafe, buffer. Default is to return a URL safe string.
//
// Properties of different digests:
//  *  hex: 40 characters using 0-9 a-f.
//  *  binary: 20 characters using codepoint 0-255.
//  *  base64: 28 characters using 0-9 A-F a-f / + =.
//  *  urlsafe: 27 characters using 0-9 A-F a-f _ -.
//  *  buffer: 20 bytes Buffer object.
module.exports = function(message, key, digest) {
	digest = digest || 'urlsafe';

	var hmac = crypto.createHmac('sha1', key).update(message);
	if (digest === 'urlsafe') {
		return urlsafe.create(hmac.digest('base64'));
	} else if (digest === 'buffer') {
		return new Buffer(hmac.digest('binary'), 'binary');
	} else {
		return hmac.digest(digest);
	}
};
