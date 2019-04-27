var app = require('./app');
var port = process.env.PORT || 14103;

var server = app.listen(port, function() {
  console.log('Vehicle server listening on port ' + port);
});