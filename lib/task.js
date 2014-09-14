var Evented = require( 'findhit-evented' ),
	Util = require( 'findhit-util' ),
	Client = require( './client.js' );

var Task = Evented.extend({

	statics: {
		STATE: {
			PENDING: 0,
			SUCCESS: 1,
			FAILED: -1,
		},
	},

	initialize: function ( type, request, client ) {

		this.id = Util.uniqId();
		this.request = request;
		this.client = client;
		this.response = undefined;

	},

});

// State handler
Task.addInitHook(function () {
	var task = this,
		state = Task.STATE.PENDING;

	Object.defineProperty( this, 'state', {

		enumerable: true,
		configurable: false,

		get: function() {
			return state;
		},
		set: function( v ) {
			state = v;
			task.fire( 'state-change' );
		},

	});
});

// Task creator
Client.addInitHook(function () {
	var client = this;

	client.socket.on( 'task', function ( type, request, done ) {

		var task = new Task( type, request, client );

		task.on( 'state-change', function () {
			client.socket.emit( 'task', task.id, task.state, task.response );
		});

	});
});

// Export it
module.exports = Task;