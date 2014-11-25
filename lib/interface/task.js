var Evented = require( 'findhit-evented' ),
    Promise = require( 'bluebird' ),
    Util = require( 'findhit-util' ),

    Window = require( './window' );

var Task = Evented.extend({

    type: 'default',

    statics: {
        STATE: {
            PENDING: 0,
            SUCCESS: 1,
            FAILED: -1,
        },
    },

    initialize: function ( data ) {

        this.id = Util.uniqId();
        this.status = Task.STATE.PENDING;
        this.value = undefined;

        this.fire( 'initialized' );

    },

    complete: function ( status, value ) {

        this.status = status;
        this.value = value;

        this.fire( 'completed' );

    },

    destroy: function () {
        if ( this._destroyHooksCalled ) { return; }

        this.callDestroyHooks();

        this.setWindow( null );
        delete this.status;
        delete this.value;

        this.fire( 'destructed' );

    },

});

Task.addInitHook(function () {
    var self = this;
    process.nextTick(function () {
        self.fire( 'initialized' );
    });
});

// Associations
Task.belongsTo( 'Window', Window );

// Export it
module.exports = require( '../interface.wrapper' )( 'Task', Task );


// Client API

// Target API
