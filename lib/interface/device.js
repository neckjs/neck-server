var Class = require( 'findhit-class' ),
    Promise = require( 'bluebird' ),
    Util = require( 'findhit-util' ),

    Head = require( './head' ),
    Window = require( './window' );

var Device = Class.extend({

    type: 'default',

    initialize: function () {
        return this;
    },

    destroy: function () {
        if ( this._destroyHooksCalled ) { return; }

        this.callDestroyHooks();

        this.setWindows( [] ); // Windows, HA HA
        this.setHead( null );
    },

});

Device.addInitHook(function () {
    var self = this;
    process.nextTick(function () {
        self.fire('initialized');
    });
});

// Associations
Device.belongsTo( 'Head', Head );
Device.hasMany( 'Windows', Window ); // sorry, i can stop laughing

// Export it
module.exports = require( '../interface.wrapper' )( 'Device', Device );


// Client API

// Target API
