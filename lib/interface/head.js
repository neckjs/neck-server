var Class = require( 'findhit-class' ),
    Promise = require( 'bluebird' ),

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

    createDevice: function () {
        var device = new Device();

        device.Head = this;

        return device;
    },

});

Head.addInitHook(function () {
    var self = this;
    process.nextTick(function () {
        self.fire('initialized');
    });
});

// Associations
Head.hasMany( 'Devices', Device );

// Export it
module.exports = require( '../interface.wrapper' )( 'Head', Head );
