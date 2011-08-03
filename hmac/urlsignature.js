var timestamp = require('./timestamp');
var signature = require('./signature');

// Signs a URL including a timestamp to reduce the period where it's valid.
// Optional context can be provided, ie. the clients User-Agent, remote IP
// address, allowed HTTP method, etc. TTL is provided in seconds, default 10s.
exports.sign = function(url, ttl, context) {
	ttl = (ttl || 10) | 0;

	// Make URL ready for adding a query string parameter.
	url += (url.indexOf('?') === -1) ? '?' : '&';

	// Include timestamp in signature.
	url += 'sig=' + timestamp.ttl(ttl * 1000);

	// Sign URL.
	return signature.sign(url, context);
};

// Verifies a signed URL. Remember to include the same context as when you
// signed it.
exports.verify = function(signed_url, context) {
	// Parse signed URL.
	matches = signed_url.match( /^.+[?&]sig=([0-9A-Za-z_-]{8})[0-9A-Za-z_-]{27}$/ );

	// The URL is not valid if the format is unknown.
	if (!matches) return false;

	// The URL is not valid if it expired.
	if (timestamp.parse(matches[1]) < Date.now()) return false;

	// Verify the signature.
	return signature.verify(signed_url, context);
};
