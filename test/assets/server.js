var Server = require( '../../index' ),
    Util = require( 'findhit-util' ),

	sinon = require('sinon'),
	chai = require('chai'),
	expect = chai.expect;

var port = Util.uniqId();

// Create server
var server = new Server();

// Start server
server.start({
    port: port,
});

module.exports = server;
