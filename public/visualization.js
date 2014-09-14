var socket = io.connect('http://www.buddhabrudda.com/');
socket.on('cbcalled', function(data) {
  document.getElementById('message').innerHTML = 'Received cb from ' + data.query.action;
  console.log(data);
});
