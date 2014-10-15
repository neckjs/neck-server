var Class = require( 'findhit-class' ),
    Promise = require( 'bluebird' ),

    Device = require( './device' ),
    Task = require( './task' );

var Window = Class.extend({

    type: 'default',

    destroy: function () {
        if ( this._destroyHooksCalled ) { return; }

        this.callDestroyHooks();

        this.setTasks( [] );
        this.setDevice( null );

        return true;
    },

});

// Export it
module.exports = require( './interface.wrapper' )( Window );
