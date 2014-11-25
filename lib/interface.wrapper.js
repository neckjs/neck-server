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
                this.INSTANCES[ id ].export()
            );

        });
    },

    get: function ( id ) {
        return new Promise(function ( fulfill, reject ) {

            if( ! this.INSTANCES[ id ] ) {
                reject( new TypeError( "instance wasn't found" ) );
                return;
            }

            fulfill(
                this.INSTANCES[ id ].export()
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

            if( ! this.INSTANCES[ id ] ) {
                reject( new TypeError( "instance wasn't found" ) );
                return;
            }

            this.INSTANCES[ id ].destroy();
            delete this.INSTANCES[ id ];

            fulfill( true );
        });
    },

};

module.exports = function ( className, Class, fns ) {

    var types = { default: Class };
    var _interface = {};

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

    // bind them on _interface
    Util.each( fns, function ( fn, key ) {
        if( Util.isnt.function( fn ) ) return;

        // Bind it to internal API: _interface
        _interface[ key ] = fn;
    });

    // Give access to classes and instances available by _ (downdoor)
    _interface.TYPES = types;

    // On each server initializer, add routes!
    Server.addInitHook(function () {
        var server = this;

        var interface = server[ className ] = Object.create( _interface );
        var instances = interface.INSTANCES = {};

        var APIfier = function ( fn, methodName ) {

            var params = Util.Function.getParamNames( fn ),
                path = '/client/' + Util.String.decapitalize( className ) + '/' + methodName;

            // REST
            server.express.get( path, function ( req, res ) {

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

        };

        server.on( 'starting', function () {
            for ( var k in interface ) {
                if( Util.is.Function( interface[ k ] ) ) {
                    APIfier( interface[ k ], k );
                }
            }
        });
    });

    return _interface;
};
