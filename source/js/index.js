
    /*!
     * Noderize application handler.
     */
    window.Noderize = (function( socketIO ){

        var _wsPath  = document.getElementsByTagName('body')[0].getAttribute('data-ws'),
            _socket  = socketIO.connect(_wsPath + '/monitor');

        // Instructions for connection sync
        _socket.on('connect', function(){
            document.getElementById('sync-code').innerText = _socket.socket.sessionid.substr(0,6).toLowerCase();
            console.log('Websockets connected: initializing...', _socket);
        });

        _socket.on('paired', function(data){
            console.log(data);
        });

        _socket.on('motion', function(data){
            console.log(data);
        });

        // Receive event updates from the connected mobile device
        /*var _x = 0, _y = 0, _z = 0;
        _socket.on('update', function(data){
            _x += Math.round(data.x, 2);
            _y += Math.round(data.y, 2);
            _z += Math.round(data.z, 2);
            _circle.style.cssText = 'top:' + Math.round(_y, 2) + 'px;left:' + Math.round(_x, 2) + 'px;';
        });*/

        return {

        }
    })( io );