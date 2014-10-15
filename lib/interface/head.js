var Class = require( 'findhit-class' ),
    Promise = require( 'bluebird' ),

    Device = require( './device' );

var Head = Class.extend({

    type: 'default',

    destroy: function () {
        if ( this._destroyHooksCalled ) { return; }

        this.callDestroyHooks();

        this.setDevices( [] );

        return true;
    },

});

// Export it
module.exports = require( './interface.wrapper' )( Head );
