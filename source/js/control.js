
    /*!
     * Noderize application handler.
     */
    window.Noderize = (function( socketIO ){

        var _wsPath   = document.getElementsByTagName('body')[0].getAttribute('data-ws'),
            _socket   = socketIO.connect(_wsPath + '/controller'),
            _emitting = false;


        _socket.on('connect', function(){
            document.getElementById('sync-code-in').addEventListener('keyup', function(event){
                if( this.value.length === 6 ){
                    _socket.emit('synchronize', {key: this.value.toLowerCase()});
                }
            });
        });


        _socket.on('paired', function(data){
            if( data.status === true ){
                document.getElementById('sync-code-in').blur();
                toggleMotionEmitting(true);
                document.getElementById('cL1').className = 'show-controls';
            }
        });


        document.getElementById('broadcast').addEventListener('click', function(e){
            toggleMotionEmitting(!_emitting);
            this.getElementsByClassName('inner')[0].innerText = _emitting ? 'Broadcasting' : 'Restart';
        });


        function onDeviceMotion(event){
            _socket.emit('movement', event.accelerationIncludingGravity);
        }


        function toggleMotionEmitting( _to ){
            _emitting = _to;

            if( _emitting === true ){
                window.addEventListener('devicemotion', onDeviceMotion, false);
                return;
            }

            window.removeEventListener('devicemotion', onDeviceMotion, false);
        }


        return {

        }
    })( io );