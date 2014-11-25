var Server = require( './server' ),
    Evented = require( 'findhit-evented' ),
    debug = require( 'debug' )( 'neck-server:lib/target' );

var Target = Evented.extend({

    initialize: function ( socket, server ) {
        debug( 'target being created' );
    },

    destroy: function () {
        if ( this._destroyHooksCalled ) { return; }

        this.callDestroyHooks();
        this.close();
        this.Socket = null;
        this.Server = null;

        debug( 'target destroyed' );
    },

    close: function () {
        debug( 'closing socket' );
        this.Socket.close();
    },

});

Target.belongsTo( 'Server', Server );

Server.addInitHook(function () {
    var server = this;

    server.on( 'started', function () {
        var targetIO = server.targetIO = server.io.of('/target');

        targetIO.on( 'connection', function ( socket ) {
            debug( 'target connected' );

            var target = new Target( socket, server );

            target.Socket = socket;
            target.Server = server;

            socket.on( 'disconnect', function() {
                debug( 'target disconnected' );
                target.destroy();
            });

        });

    });

});

// Export it
module.exports = Target;
