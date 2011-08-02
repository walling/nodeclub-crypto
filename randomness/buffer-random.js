var fs     = require('fs');
var Buffer = require('buffer').Buffer;

// Extend Buffer with method that randomizes all bytes.
Buffer.prototype.randomize = function() {
	// Usually /dev/urandom ('u' for user) is non-blocking, so it should be safe
	// to read from it. Hopefully this is only used for small buffers.
	var urandom = fs.openSync('/dev/urandom', 'r');
	fs.readSync(urandom, this, 0, this.length, null);
	fs.closeSync(urandom);
	return this;
};
