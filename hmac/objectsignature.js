var urlsafe   = require('./urlsafe');
var timestamp = require('./timestamp');
var signature = require('./signature');

// Signs an object including a timestamp to reduce the period where it's valid.
// Optional context can be provided, ie. the clients User-Agent, remote IP
// address, allowed HTTP method, etc. TTL is provided in seconds, default 10s.
exports.create = function(object, ttl, context) {
	ttl = (ttl || 10) | 0;

	// Make object in JSON Base64 encoded representation safe for URLs.
	var json = JSON.stringify(object);
	var base64 = new Buffer(json, 'utf8').toString('base64');
	var msg = urlsafe.create(base64);

	// Include timestamp in signature.
	msg += timestamp.ttl(ttl * 1000);

	// Sign object.
	return signature.sign(msg, context);
};

// Parses and verifies a signed object. Remember to include the same context as
// when you signed it. If the signature is invalid, null is returned.
exports.parse = function(signed_object, context) {
	// Parse signed object.
	matches = signed_object.match( /^([0-9A-Za-z_-]+)([0-9A-Za-z_-]{8})[0-9A-Za-z_-]{27}$/ );

	// The object is not valid if the format is unknown.
	if (!matches) return null;

	// The object is not valid if it expired.
	if (timestamp.parse(matches[2]) < Date.now()) return null;

	// Verify the signature.
	if (!signature.verify(signed_object, context)) return null;

	// Parse object representation and return literal object.
	var base64 = urlsafe.parse(matches[1]);
	var json = new Buffer(base64, 'base64').toString('utf8');
	return JSON.parse(json);
};
