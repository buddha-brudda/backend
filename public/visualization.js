var socket = io.connect('http://www.buddhabrudda.com/');
socket.on('cbcalled', function(data) {
  console.log(data);
});
