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

    createWindow: function () {
        var window = new Window();

        window.Device = this;

        return window;
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
module.exports = require( '../interface.wrapper' )( Device );
