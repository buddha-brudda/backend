$('#sendNotification').submit(function(e) {
  e.preventDefault();

  var name = $('#name').val();
  var text = $('#text').val();
  var image = $('#image').val();
  var actions = $('#actions').val();
  var callback = $('#callback').val();

  $.post('/notify/' + name, {
    text: text,
    image: image,
    actions: actions,
    callback: callback
  }, function(err, data) {
    alert('Posted');
  });
});
