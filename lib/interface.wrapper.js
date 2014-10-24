var Util = require( 'findhit-util' ),
    Promise = require( 'bluebird' ),

    Server = require( './server' );

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

module.exports = function ( className, Class, fns ) {

    var instances = {};
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
    interface._ = {
        types: types,
        instances: instances,
    };

    // On each server initializer, add routes!
    Server.addInitHook(function () {
        var server = this;

        server.on( 'starting', function () {
            var express = server.express;

            Util.each( interface, function ( fn, key ) {
                if( Util.isnt.Function( fn ) ) return;

                var params = Util.Function.getParamNames( fn ),
                    path = '/api/' + Util.String.decapitalize( className ) + '/' + key;

                express.get( path, function ( req, res ) {

                    // Gather arguments from req
                    // TODO

                    new Promise(function ( fulfill, reject ) {
                        var result = fn.apply( interface, args );

                        fulfill( result );
                    })
                        .then(
                            function ( value ) {
                                res.send( value );
                                res.end();
                            },
                            function ( err ) {
                                res.send( false );
                                res.end();
                            }
                        );

                });
            });
        });
    });

    return interface;
};
