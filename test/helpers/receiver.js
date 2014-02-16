module.exports = {


	/**
	 * Build a mock readable stream that emits incoming files.
	 * (used for file downloads)
	 * 
	 * @return {Stream.Readable}
	 */
	newEmitterStream: function newEmitterStream () {
		// TODO: 
	},



	/**
	 * Build a mock writable stream that handles incoming files.
	 * (used for file uploads)
	 * 
	 * @return {Stream.Writable}
	 */
	
	newReceiverStream: function newReceiverStream (options) {

		// Keep track of files we've written
		var files = [];

		var Writable = require('stream').Writable;
		var receiver__ = Writable({objectMode: true});

		receiver__._write = function onFile (__newFile, encoding, next) {

			console.log('Receiver: Received file `'+__newFile.filename+'` from an Upstream.');

			// Listen for errors on the incoming side of this file stream
			// (i.e. if the user cancelled the upload)
			__newFile.on('error', function (err) {
				console.error('Receiver: Error on incoming stream received for `'+__newFile.filename+'`::', err, ' :: Cancelling upload and cleaning up already-written bytes...');
				//
				// TODO:
				// In a real receiver, this is where the already-written bytes
				// for this file would be garbage collected.
				// 
			});

			var outs = __newFile.pipe(require('fs').createWriteStream('/dev/null'));
			outs.on('finish', function () {
				console.log('Receiver: Finished writing `'+__newFile.filename+'`');
				next();
			});
			outs.on('error', function (err) {
				console.error('Receiver: Error writing `'+__newFile.filename+'`::', err, ' :: Cancelling upload and cleaning up already-written bytes...');
				//
				// TODO:
				// In a real receiver, this is where the already-written bytes
				// for this file would be garbage collected.
				// 
				next(err);
			});
		};
		
		return receiver__;
	}
};