var urlsafe = require('./urlsafe');

exports.ttl = function(milliseconds) {
	return exports.create(Date.now() + milliseconds);
};

exports.create = function(timeout, digest) {
	digest = digest || 'urlsafe';

	if (typeof timeout !== 'number') {
		timeout = timeout.getTime();
	}

	var timestamp = new Buffer(6);
	for (var i = 0; i <= 5; i++) {
		timestamp[i] = (timeout % 256) | 0;
		timeout /= 256;
	}

	if (digest === 'urlsafe') {
		return urlsafe.create(timestamp.toString('base64'));
	} else if (digest === 'buffer') {
		return timestamp;
	} else {
		return timestamp.toString(digest);
	}
};

exports.parse = function(timestamp) {
	if (typeof timestamp === 'string') {
		if (timestamp.length === 8) {
			timestamp = new Buffer(urlsafe.parse(timestamp), 'base64');
		} else if (timestamp.length === 6) {
			timestamp = new Buffer(timestamp, 'binary');
		} else {
			throw new Error('unknown type of timestamp');
		}
	}

	var timeout = 0;
	for (var i = 5; i >= 0; i--) {
		timeout = 256 * timeout + timestamp[i];
	}
	return timeout;
};
