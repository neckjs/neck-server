/**
 * @class Server
 * returns Server
 */
var Server = require( './lib/server' );

// Give access to Server Classes
Server.Interface = {
    Head: require( './lib/interface/head' ),
    Device: require( './lib/interface/device' ),
    Window: require( './lib/interface/window' ),
    Task: require( './lib/interface/Task' ),
};

// Associate all things here :)
require( './lib/web-ui.js' );

module.exports = Server;
