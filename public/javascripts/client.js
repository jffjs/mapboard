define(function() {
  var socket = io.connect('http://localhost');
  var uid = window.location.pathname.replace(/\//, '') || null;

  function showJoinLink() {
    $('#join').append($('<a href="/' + uid + '">mapboard.com/' + uid + '</a>'));
  }
  if (uid) showJoinLink();

  socket.on('handshake', function (data) {
    if (typeof data === 'undefined') {
      socket.emit('handshake', { uid: uid });
    } else {
      uid = data.uid;
      showJoinLink();
      console.log(uid);
    }
  });

  var getChannel = function() {
    return uid;
  }
  var send = function(event, data) {
    socket.emit(event, { uid: uid, data: data });
  }
  var on = function(event, callback) {
    socket.on(event, callback);
  }

  return {
    send: send,
    on: on,
    getChannel: getChannel
  };
});


