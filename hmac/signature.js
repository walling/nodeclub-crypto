var hmac = require('./hmac');

var shared_secret_key = 'F/bUuxkopcmfMxQYSw8d2K7HUUIBTjOs25oLaNjjAWNWbVEbLI70KwRf7h+94rlnCMgFEFdiXtUxeN/h3dPw4A';

// Signs a string (extended 27 characters) or buffer (extended 20 bytes). The
// signature can depend on an optional context, which is not part of the
// message. Use this feature with care.
exports.sign = function(message, context) {
	context = context || '';
	context = context + '\n' + context.length + '\n';

	var to_be_signed;
	if (typeof message === 'string') {
		to_be_signed = context + message;
		return message + hmac(message, shared_secret_key, 'urlsafe');
	} else {
		to_be_signed = context + message.toString('base64');
		signed = new Buffer(message.length + 20);
		message.copy(signed);
		hmac(to_be_signed, shared_secret_key, 'buffer').copy(signed, message.length);
		return signed;
	}
};

// Verifies a signed string or buffer. Remember to pass the same context as
// when you signed the message.
exports.verify = function(message, context) {
	context = context || '';

	if (typeof message === 'string') {
		unsigned = message.substring(0, message.length - 27);
		signed = exports.sign(unsigned, context)
		return signed === message;
	} else {
		unsigned = message.slice(0, message.length - 20);
		signed = exports.sign(unsigned, context)
		return signed.toString('base64') === message.toString('base64');
	}
};
