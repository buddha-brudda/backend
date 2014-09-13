var express = require('express');
var mongoose = require('mongoose');
mongoose.connect(JSON.parse(process.env.VCAP_SERVICES).mongolab[0].credentials.uri || 'mongodb://localhost:27017');

var Notification = mongoose.model('Notification', new mongoose.Schema({
  text: String,
  image: String,
  actions: [String],
  callback: String, // url
  user: String,
  date: Date
}));

var app = express();
app.use(require('body-parser').json());

app.route('/').get(function(req, res) {
  res.send('No home page.');
});

app.route('/notify/:user').post(function(req, res) {
  var notification = new Notification({
    text: req.body.text,
    image: req.body.image,
    actions: req.body.actions,
    callback: req.body.callback,
    user: req.params.user,
    date: new Date()
  });
  notification.save(function(err) {
    if (err) {
      return res.status(500).send('ERROR');
    }
    res.send('OK');
  });
});

app.route('/notifications/:user').get(function(req, res) {
  User.find({
    user: req.params.user
  }).exec(function(err, docs) {
    res.json(docs);
  });
});

app.listen(process.env.VCAP_APP_PORT || 3000);
