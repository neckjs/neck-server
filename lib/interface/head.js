var Class = require( 'findhit-class' ),
    Promise = require( 'bluebird' ),
    Util = require( 'findhit-util' ),

    Server = require( '../server' ),
    Device = require( './device' );

var Head = Class.extend({

    type: 'default',

    initialize: function () {
        return this;
    },

    destroy: function () {
        if ( this._destroyHooksCalled ) { return; }

        this.callDestroyHooks();

        this.setDevices( [] );

        return true;
    },

});

Head.addInitHook(function () {
    var self = this;
    process.nextTick(function () {
        self.fire('initialized');
    });
});

// Associations
Head.belongsTo( 'Server', Server );
Head.hasMany( 'Devices', Device );

// Export it
module.exports = require( '../interface.wrapper' )( 'Head', Head );


// Client API

// Target API
