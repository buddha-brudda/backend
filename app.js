var express = require('express');
var bodyParser = require('body-parser');
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
var server = app.listen(process.env.VCAP_APP_PORT || 3000);
var io = require('socket.io')(server);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + '/public'));

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
  Notification.find({
    user: req.params.user
  }).exec(function(err, docs) {
    res.json(docs);
  });
});

app.route('/callback/:callbackId').get(function(req, res) {
  io.emit('cbcalled', req.query);
});
