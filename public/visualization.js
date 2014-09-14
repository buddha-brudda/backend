var socket = io.connect('http://localhost');
socket.on('cbcalled', function(data) {
  console.log(data);
});
