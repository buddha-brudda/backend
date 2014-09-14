var socket = io.connect('http://www.buddhabrudda.com/');
socket.on('cbcalled', function(data) {
  $('#message').prepend('<p>Recieved ' + data.callbackId + ' from ' + data.query.name + ' with action ' + data.query.action + '.');
  if (data.callbackId === 'VOTE') {
    var votesUp = parseInt($('#votesUp').html());
    var votesDown = parseInt($('#votesDown').html());

    if (data.query.action === 'Up') {
      $('#votesUp').html(votesUp + 1);
    } else {
      $('#votesDown').html(votesDown + 1);
    }
  }
});
