var Util = require( 'findhit-util' ),
    IOClient = require( 'socket.io-client' ),

    server = require( './assets/server' ),

    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect;

describe( "Client", function () {

    // Client socket connection
    before(function ( done ) {

        this.client = IOClient( 'ws://localhost:'+ server.options.port +'/client' );

        this.client.on( 'connect', function () {
            process.nextTick( done );
        });

    });

    describe( "instance check", function () {

        it( "Client instance has been created and linked to Server", function () {
            expect( server.Clients ).to.have.length( 1 );
        });

    });



});
