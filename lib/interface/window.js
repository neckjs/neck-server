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

    createTask: function () {
        var task = new Task();

        task.Window = this;

        return task;
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
