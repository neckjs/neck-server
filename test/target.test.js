var Util = require( 'findhit-util' ),
    IOClient = require( 'socket.io-client' ),

    server = require( './assets/server' ),

    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect;

describe( "Target", function () {

    // Target socket connection
    before(function ( done ) {

        this.target = IOClient( 'ws://localhost:'+ server.options.port +'/target' );

        this.target.on( 'connect', function () {
            process.nextTick( done );
        });

    });

    describe( "basic instance checks", function () {

        it( "Target instance has been created and linked to Server", function () {
            expect( server.Clients ).to.have.length( 1 );
        });

    });

    it( "Create a Head for testing", function ( done ) {
        var head = new server.Head({
            id: 'test'
        });
    });

    it( "Register a Device into a Head", function ( done ) {
        this.target.emit(

            // API Name
            'Device.create',

            // Head data
            {
                id: 'test',
                type: 'default',
                head: 'test',

                os: {
                    family: 'Apple Mac OS',
                    version: '10.10.1'
                },

                browser: {
                    family: 'Google Chrome',
                    version: '36.0.0.1235213'
                },

            },

            // Callback
            function ( err, id ) {
                expect( err ).to.be.equal( null );
                expect( id ).to.be.ok();


                done();
            }

        );
    });

    it( "Receive a Window creation", function ( done ) {

        this.target.once( 'Window.create', function ( device_id, window, cb ) {



        });

    });

});
