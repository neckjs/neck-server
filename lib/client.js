var Server = require( './server' ),
	Evented = require( 'findhit-evented' ),
	debug = require( 'debug' )( 'neck-server:lib/client' );

var Client = Evented.extend({

	initialize: function ( socket, server ) {
		debug( 'client being created' );
	},

	destroy: function () {
		if ( this._destroyHooksCalled ) { return; }

		this.callDestroyHooks();
		this.close();
		this.Socket = null;
		this.Server = null;

		debug( 'client destroyed' );
	},

	close: function () {
		debug( 'closing socket' );
		this.Socket.close();
	},

});

Client.belongsTo( 'Server', Server );

Server.addInitHook(function () {
	var server = this;

	server.on( 'started', function () {
		var clientIO = server.clientIO = server.io.of('/client');

		clientIO.on( 'connection', function ( socket ) {
			debug( 'client connected' );

			var client = new Client( socket, server );

			client.Socket = socket;
			client.Server = server;

			socket.on( 'disconnect', function() {
				debug( 'client disconnected' );
				client.destroy();
			});

		});

	});

});

// Export it
module.exports = Client;
