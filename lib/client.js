var Evented = require( 'findhit-evented' ),
	Server = require( './server.js' );

var Client = Evented.extend({

	initialize: function ( socket, server ) {

		this.socket = socket;
		this.server = server;

	},

	close: function () {
		socket.close();
	},

});

Server.addInitHook(function () {
	var server = this;

	server.on( 'started', function () {

		server.io.on( 'connection', function ( socket ) {

			var client = new Client( socket, server );
			server.fire( 'client', { client: client });

		});

	});

});

// Export it
module.exports = Client;