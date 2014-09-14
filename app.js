var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('superagent');

mongoose.connect(JSON.parse(process.env.VCAP_SERVICES).mongolab[0].credentials.uri || 'mongodb://localhost:27017');

var Notification = mongoose.model('Notification', new mongoose.Schema({
  id: String,
  text: String,
  image: String,
  callback: String, // url
  user: String,
  date: Date,
  reactions: [new mongoose.Schema({
    text: String,
    redirection: String
  })]
}));

var port = process.env.VCAP_APP_PORT || 3000;
var app = express();
var server = require('http').createServer(app).listen(port);
var io = require('socket.io').listen(server);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + '/public'));

app.route('/notify/:user').post(function(req, res) {
  var notification = new Notification({
    id: req.body.text + new Date() + Math.random(),
    text: req.body.text,
    image: req.body.image,
    callback: req.body.callback,
    user: req.params.user,
    date: new Date(),
    reactions: req.body.reactions
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

app.route('/callback/:callbackId').post(function(req, res) {
  io.emit('cbcalled', {
    name: req.body.name,
    action: req.body.action,
    callbackId: req.params.callbackId
  });
  res.send('OK');
});

app.route('/read/:user').post(function(req, res) {
  Notification.findOne({
    user: req.params.user,
    id: req.body.id
  }).exec(function(err, doc) {
    doc.remove(function() {
      res.send('OK');
    });
  });
});

app.route('/bloomberg').post(function(req, res) {
  request.post('http://www.buddhabrudda.com/notify/4699553379')
    .send({
      text: 'The price of AAPL stock is ' + require('./bloomberg/AAPL.json').values.PX_CLOSE,
      image: 'http://www.buddhabrudda.com/img/money.png'
    })
    .end(function(data) {
      res.send('OK');
    });
});

app.route('/votenotif').post(function(req, res){
  request.post('http://www.buddhabrudda.com/notify/4699553379')
    .send({
      text: 'Vote!',
      image: 'http://www.buddhabrudda.com/img/vote-for-me.gif',
      callback: 'http://www.buddhabrudda.com/callback/VOTE',
      reactions: [{
        text: 'Upvote'
      }, {
        text: 'Downvote'
      }]
    })
    .end(function(data) {
      res.send('OK');
    });
});

