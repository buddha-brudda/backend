var socket = io.connect('http://www.buddhabrudda.com/');
socket.on('cbcalled', function(data) {
  $('#message').prepend('<p>Recieved ' + data.callbackId + ' from ' + data.query.name + ' with action ' + data.query.action + '.');
});
