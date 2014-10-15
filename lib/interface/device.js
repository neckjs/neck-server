var Class = require( 'findhit-class' ),
    Promise = require( 'bluebird' ),

    Head = require( './head' ),
    Window = require( './window' );

var Device = Class.extend({

    type: 'default',

    destroy: function () {
        if ( this._destroyHooksCalled ) { return; }

        this.callDestroyHooks();

        this.setWindows( [] ); // Windows, HA HA
        this.setHead( null );
    },

});

// Export it
module.exports = require( './interface.wrapper' )( Device );
