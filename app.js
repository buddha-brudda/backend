var express = require('express');
var mongoose = require('mongoose');

var app = express();

app.route('/').get(function(req, res) {
  res.send('No home page.');
});

app.listen(process.env.VCAP_APP_PORT || 3000);
