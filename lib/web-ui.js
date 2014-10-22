var Server = require( './server' ),
    Express = require( 'express' ),
    debug = require( 'debug' )( 'neck-server:lib/web-ui' );

Server.addInitHook(function () {
    var server = this;

    debug( 'creating an express instance' );

    server.app = Express();

});
