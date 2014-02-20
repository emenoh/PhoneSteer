
    /*!
     * Noderize application handler.
     */
    window.Noderize = (function( socketIO ){

        var _wsPath       = document.getElementsByTagName('body')[0].getAttribute('data-ws'),
            _socket       = socketIO.connect(_wsPath + '/phone'),
            _btnBroadcast = document.getElementById('broadcast'),
            _btnPause     = document.getElementById('pauseBroadcast'),
            _paused       = false,
            _broadcasting = false;


        _btnPause.addEventListener('click', function(e){
            _paused = !_paused;
            _btnPause.innerHTML = _paused ? 'Restart' : 'Pause';
            _btnPause.style.cssText = _paused ? 'background-color:#cc9900;display:block;' : 'display:block;';
        });


        _btnBroadcast.addEventListener('click', function(e){
            if( ! _broadcasting ){
                // on device motion handler
                function onDeviceMotion(event){
                    if( ! _paused ){
                        _socket.emit('movement', event.accelerationIncludingGravity);
                    }
                }
                // event listener for device motion
                window.addEventListener('devicemotion', onDeviceMotion, false);
                // set broadcasting
                _btnBroadcast.innerText = 'Broadcasting Motion...';
                _btnPause.style.cssText = 'display:block;';
                _broadcasting = true;
            }
        });


        return {

        }
    })( io );