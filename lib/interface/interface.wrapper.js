var Util = require( 'findhit-util' ),
    Promise = require( 'bluebird' );

var defaultFn = {

    register: function ( data ) {
        return new Promise(function ( fulfill, reject ) {

            if(
                Util.isnt.Object( data )
            ) {
                reject( new Error("please provide an object with data") );
                return;
            }

            // At lease we should have id and type
            if( ! data.type ) {
                reject( new Error("please provide an object type") );
                return;
            }

            if( ! this.TYPES[ data.type ] ) {
                reject( new Error("please provide a valid object type") );
                return;
            }

            if( ! data.id ) {
                data.id = Util.uniqId();
            }

            var instance = new this.TYPES[ data.type ]();

            Util.extend( instance, data );

            fulfill(
                this.instances[ id ].export()
            );

        });
    },

    get: function ( id ) {
        return new Promise(function ( fulfill, reject ) {

            if( ! this.instances[ id ] ) {
                reject( new Error("instance wasn't found") );
                return;
            }

            fulfill(
                this.instances[ id ].export()
            );

        });
    },

    list: function ( options ) {
        return new Promise(function ( fulfill, reject ) {

            

        });
    },

    remove: function ( id ) {
        return new Promise(function ( fulfill, reject ) {

            if( ! this.instances[ id ] ) {
                reject( new Error("instance wasn't found") );
                return;
            }

            this.instances[ id ].destroy();
            delete this.instances[ id ];

            fulfill( true );
        });
    },

};

module.exports = function ( Class, fns ) {

    var instances = {},
        $ = {
            CLASS: Class,
            TYPES: {
                default: Class,
            },

            instances: instances,
        };

    fns = Util.extend( {}, defaultFn, fns );

    // bind them on $
    Util.each( fns, function ( fn, key ) {
        if( Util.isnt.function( fn ) ) return;

        // Bind it to internal API: $
        $[ key ] = fn.bind( $ );

        // TODO:
        // Get needed variables of this function
        // Add route to this

    });

    return $;
};
