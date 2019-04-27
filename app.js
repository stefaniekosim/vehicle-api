var express = require('express');
var app = express();
var dbConn=require('./db');
var redisClient = require('./rdsCache');

dbConn.connectToServer( function( err, client ) {
  if (err) console.log(err);
} );

redisClient.on('connect', function() {
  console.log('Redis client connected');
});
redisClient.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

app.get('/api', function (req, res) {
  res.status(200).send('VEHICLE API.');
});

var VehicleController = require('./routes/VehicleController');
app.use('/api/vehicle', VehicleController);

module.exports = app;