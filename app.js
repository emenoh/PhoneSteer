
    // Initialialize express app
    var express  = require('express'),
        app      = express(),
        server   = require('http').createServer(app),
        socketIO = require('socket.io').listen(server);

    // Set EJS as template engine, and configure static paths
    app.engine('.html', require('ejs').__express);
    app.use(express.static(__dirname + '/static'));
    app.set('views', process.cwd() + '/views');
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
        res.render('index.html', {
            some: 'thing'
        });
    });

    // phone route
    app.get('/phone', function(req, res){
        res.render('phone');
    });


    ///////////////////////////// SOCKET.IO STUFF /////////////////////////////
    var _index = socketIO.of('/index').on('connection', function(socket){});

    var _phone = socketIO.of('/phone').on('connection', function(socket){
        socket.on('movement', function(data){
            _index.emit('update', data);
        })
    });