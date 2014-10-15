var Server = require( '../index' ),
    Util = require( 'findhit-util' ),
    ioClient = require( 'engine.io-client' ),

	sinon = require('sinon'),
	chai = require('chai'),
	expect = chai.expect;

var port = Util.uniqId();

// Server set
before(function () {

    // Create server
    this.server = new Server();

    // Start server
    this.server.start({
        port: port,
    });

});

// Socket connection
before(function ( done ) {

    this.client = ioClient( 'ws://localhost:'+ this.server.options.port );

    this.client.on( 'open', function () {
        process.nextTick( done );
    });

});

describe( "Connection", function () {

    it( "Check if Client instance has been created and linked to Server", function () {

        console.log( this.server.Clients );

        expect( this.server.Clients ).to.have.length( 1 );

    });

});
