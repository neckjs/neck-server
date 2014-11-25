var Hotplug = require( 'findhit-hotplug' ),
	http = require( 'http' ),
	io = require( 'socket.io' ),
	debug = require( 'debug' )( 'neck-server:lib/server' ),
	Express = require( 'express' ),
	Server = Hotplug( 'Neck.Server' );

Server.mergeOptions({

	host: '0.0.0.0',
	port: 5000

});

Server.mixin({

	destroy: function () {
		if ( this._destroyHooksCalled ) { return; }

		debug( 'destroying server' );

		this.callDestroyHooks();
		this.close();

		delete server.http;
		delete server.io;

		debug( 'server destroyed' );

	},

	close: function () {
		debug( 'closing port' );
		this.http.close();
	},

});

// Implement http and io
Server.addInitHook(function () {
	var server = this,
		o = this.options;

	debug( 'creating a server instance' );

	server.on( 'starting', function () {

		debug( 'starting server listening at port '+o.port );
		server.http = http.createServer().listen( o.port, o.host );
		server.io = io( server.http );
		server.express = Express();

	});

	server.on( 'stopping', function () {

		debug( 'stopping server' );
		server.close();

	});

});

// Export it
module.exports = Server;

var Client = require( './client' ),
	Target = require( './target' ),
	Head = require( './interface/head' );

// Associate
Server.hasMany( 'Clients', Client );
Server.hasMany( 'Targets', Target );

Server.hasMany( 'Heads', Head );
