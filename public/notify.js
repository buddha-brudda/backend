$('#sendNotification').submit(function(e) {
  e.preventDefault();

  var name = $('#name').val();
  var text = $('#text').val();

  $.post('/notify/' + name, {
    text: text
  }, function(err, data) {
    alert('Posted');
  });
});
