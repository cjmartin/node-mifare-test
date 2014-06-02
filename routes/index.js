var express = require('express'),
	mifare= require('mifare-classic'),
	ndef = require('ndef'),
	router = express.Router(),
	message,
	bytes;

/* GET home page. */
router.get('/', function(req, res) {
	message = [
		ndef.uriRecord("http://nfc-tools.org"),
		ndef.textRecord("Hello from nodejs"),
		ndef.emptyRecord()
	];

	bytes = ndef.encodeMessage(message);

	mifare.write(bytes, function(err) {
		if (err) {
			console.log("Write failed ");
			console.log(err);
		} else {
			console.log("Write OK");

			mifare.read(function(err, buffer) {
				if (err) {
					console.log("Read failed ");
					console.log(err);
				} else {
					// TODO handle empty buffer!
					var message = ndef.decodeMessage(buffer.toJSON());
					console.log("Found NDEF message with " + message.length +
						(message.length === 1 ? " record" : " records" ));
					console.log(ndef.stringify(message));            
				}
			});
		}
	});
	
	res.render('index', { title: 'Express' });
});

module.exports = router;
