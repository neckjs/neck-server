var Hotplug = require( 'findhit-hotplug' ),
	HTTP = require( 'http' ),
	Socket = require( 'socket.io' ),

	Server = Hotplug( 'Neck.Server' );

Server.mergeOptions({

	host: '0.0.0.0',
	port: 5000

});

Server.addInitHook(function () {
	var server = this,
		o = this.options;

	server.on( 'starting', function () {

		server._ = HTTP.createServer().listen(3000);
		server._io = Socket( server._ );

	});

	server.on( 'stopping', function () {

		server._.close();

		delete server._;
		delete server._io;

	});

});

// Export it
module.exports = Server;