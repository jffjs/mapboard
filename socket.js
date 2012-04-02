exports.listen = function(app) {
  var io = require('socket.io').listen(app)
    , uuid = require('node-uuid');
  var Packet = function(uid, data) {
    this.uid = uid;
    this.data = data;
  }

  io.sockets.on('connection', function(socket) {
    console.log("New user");
    socket.emit('handshake');
    socket.emit('name', { name: 'new_user' });

    socket.on('message', function(packet) {
      console.log(packet);
      socket.broadcast.to(packet.uid).emit('message', packet.data);
    });

    socket.on('map', function(packet) {
      console.log(packet);
      socket.broadcast.to(packet.uid).emit('map', packet.data);
    });

    socket.on('handshake', function(packet) {
      console.log(packet);
      if (packet.uid === null) {
        packet.uid = uuid.v4().replace(/-/g, '');
        console.log("UID: " + packet.uid);
        socket.emit('handshake', packet);
      }
      socket.join(packet.uid);
      socket.broadcast.to(packet.uid).emit('map init');
      socket.broadcast.to(packet.uid).emit('message', {
        type: 'announcement',
        text: 'A new user has joined.'
      });

      console.log(packet);
    });
  });
}
