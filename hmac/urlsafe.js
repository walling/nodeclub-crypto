// Creates URL safe representation of some Base64 encoded content.
exports.create = function(base64) {
	return base64.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
};

// Creates Base64 representation of some URL safe encoded content.
exports.parse = function(urlsafe) {
	return urlsafe.replace(/-/g, '+').replace(/_/g, '/');
};
