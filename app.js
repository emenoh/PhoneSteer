    /**
     * Initialize express app. To run with supervisor for reloading on code change:
     * $: supervisor -w 'app.js' app.js
     * @type {*}
     */
    var express  = require('express'),
        app      = express(),
        server   = require('http').createServer(app),
        socketIO = require('socket.io').listen(server);

    // Set EJS as template engine, and configure static paths
    app.use(express.static(__dirname + '/public/assets'));
    app.engine('.html', require('ejs').__express);
    app.set('views', process.cwd() + '/public');
    app.set('view engine', 'html');

    // Init listening port
    server.listen( 3000 );

    // Create css/js include helpers, with host prefix from the request
    app.use(function(req, res, next){
        var _protocol = 'http://';
        res.locals = {
            hostUrl: _protocol + req.headers.host,
            cssInclude: function(path){
                return '<link rel="stylesheet" type="text/css" href="'+_protocol+req.headers.host+'/css/'+path+'" />';
            },
            jsInclude: function(path, skipStaticPath){
                if( skipStaticPath ){
                    return '<script src="'+_protocol+req.headers.host+path+'"></script>';
                }
                return '<script src="'+_protocol+req.headers.host+'/js/'+path+'"></script>';
            }
        }
        next();
    });

    // default route {domain}/
    app.get('/', function(req, res){
        res.render('index.html');
    });

    // control route
    app.get('/control', function(req, res){
        res.render('control');
    });


    ///////////////////////////// SOCKET.IO STUFF /////////////////////////////
    var pairInstances = {};

    /**
     * Accessed first, cache the socket for the "monitor" to allow the
     * device/controller to sync up to later.
     */
    socketIO.of('/monitor').on('connection', function(socket){});

    /**
     * When the /control page is accessed, and the user types in the
     * sync code, this handles the basic pairing.
     */
    socketIO.of('/controller').on('connection', function(_controlSocket){
        _controlSocket.on('synchronize', function(data){
            var _monitorSockets = socketIO.of('/monitor').clients();
            for( var _i = 0; _i < _monitorSockets.length; _i++ ){
                var _shortKey = _monitorSockets[_i].id.substring(0,6).toLowerCase();
                if( _shortKey === data.key && (!pairInstances[_shortKey]) ){
                    pairInstances[_shortKey] = new SyncedPair(_monitorSockets[_i], _controlSocket);
                }
            }
        });
    });


    function SyncedPair(monitorSocket, controlSocket){
        // emit "syncd" true message to both clients
        monitorSocket.emit('paired', {status: true});
        controlSocket.emit('paired', {status: true});

        // setup listener on the control socket
        controlSocket.on('movement', function(data){
            monitorSocket.emit('motion', data);
        });
    }