$('#sendNotification').submit(function(e) {
  e.preventDefault();

  var name = $('#name').val();
  var text = $('#text').val();
  var image = $('#image').val();
  var callback = $('#callback').val();

  $.post('/notify/' + name, {
    text: text,
    image: image,
    callback: callback
  }, function(err, data) {
    alert('Posted');
  });
});

$('#bloomberg').click(function() {
  $.post('/bloomberg', {}, function(err, data) {
    alert('Posted');
  });
});
