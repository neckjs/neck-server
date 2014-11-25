var Class = require( 'findhit-class' ),
    Promise = require( 'bluebird' ),
    Util = require( 'findhit-util' ),

    Device = require( './device' ),
    Task = require( './task' );

var Window = Class.extend({

    type: 'default',

    initialize: function ( data, server ) {
        return this;
    },

    destroy: function () {
        if ( this._destroyHooksCalled ) { return; }

        this.callDestroyHooks();

        this.setTasks( [] );
        this.setDevice( null );

        return true;
    },

});

Window.addInitHook(function () {
    var self = this;
    process.nextTick(function () {
        self.fire('initialized');
    });
});

// Associations
Window.belongsTo( 'Device', Device );
Window.hasMany( 'Tasks', Task );

// Export it
module.exports = require( '../interface.wrapper' )( 'Window', Window );


// Client API

// Target API
