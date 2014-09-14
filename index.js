/**
 * @class Neck.Server
 * returns Server
 */
var Server = require( './lib/server' );

// Give access to Server Classes
Server.Client = require( './lib/client.js' );
Server.Task = require( './lib/task.js' );

module.exports = Server;
