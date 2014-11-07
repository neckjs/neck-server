var Util = require( 'findhit-util' ),
    Promise = require( 'bluebird' ),

    Server = require( './server' );

var defaultFn = {

    register: function ( data ) {
        return new Promise(function ( fulfill, reject ) {

            if(
                Util.isnt.Object( data )
            ) {
                reject( new TypeError("please provide an object with data") );
                return;
            }

            // At lease we should have id and type
            if( ! data.type ) {
                reject( new TypeError("please provide an object type") );
                return;
            }

            if( ! this.TYPES[ data.type ] ) {
                reject( new TypeError("please provide a valid object type") );
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
                reject( new TypeError("instance wasn't found") );
                return;
            }

            fulfill(
                this.instances[ id ].export()
            );

        });
    },

    list: function ( options ) {
        return new Promise(function ( fulfill, reject ) {
            // Always fulfill keys of TYPES object
            fulfill(
                Object.keys( this.TYPES )
            );
        });
    },

    types: function () {
        return new Promise(function ( fulfill, reject ) {

        });
    },

    remove: function ( id ) {
        return new Promise(function ( fulfill, reject ) {

            if( ! this.instances[ id ] ) {
                reject( new TypeError("instance wasn't found") );
                return;
            }

            this.instances[ id ].destroy();
            delete this.instances[ id ];

            fulfill( true );
        });
    },

};

module.exports = function ( className, Class, fns ) {

    var types = { default: Class };
    var interface = {};

    var origExtend = Class.extend;
    Class.extend = function ( props ) {

        if( Util.isnt.Object( props ) || ! props.type || ! types[ props.type ] ) {
            throw new TypeError( "You must specify a valid type" );
        }

        var type = props.type;
        delete props.type;

        var NewClass = origExtend.apply( this, arguments ),
            proto = NewClass.prototype,
            parentProto = NewClass.parent.prototype;

        if( typeof NewClass !== 'function' ) {
            return NewClass;
        }

        // Inject class on types
        types[ type ] = NewClass;

        return NewClass;
    };

    fns = Util.extend( {}, defaultFn, fns );

    // bind them on interface
    Util.each( fns, function ( fn, key ) {
        if( Util.isnt.function( fn ) ) return;

        // Bind it to internal API: interface
        interface[ key ] = fn;
    });

    // Give access to classes and instances available by _ (downdoor)
    interface.TYPES = types;

    // On each server initializer, add routes!
    Server.addInitHook(function () {
        var server = this;
        var interface = server.interface = Object.create( interface );
        var instances = interface.INSTANCES = {};

        server.on( 'starting', function () {
            var express = server.express;

            Util.each( interface, function ( fn, methodName ) {
                if( Util.isnt.Function( fn ) ) return;

                var params = Util.Function.getParamNames( fn ),
                    path = '/api/' + Util.String.decapitalize( className ) + '/' + methodName;

                express.get( path, function ( req, res ) {
                    var params = Util.Function.getParamNames( fn );

                    // Gather variables into args array
                    var array = Util.Array.map( params, function ( param ) {
                        // Gather from POST or even from QueryString (GET)
                        return res.body[ param ] || res.query[ param ];
                    });

                    // Methods should ALWAYS return a promise :)
                    return fn.apply( interface, args )
                        .done( function ( err, data ) {
                            res.send({
                                err: JSON.stringify( err ),
                                data: JSON.stringify( data )
                            });
                        });

                });
            });
        });
    });

    return interface;
};
