var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://mongo:27017';
var _db;

module.exports = {
    connectToServer: function() {
        MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
            if(err){
                console.log("can't connect to stefanie-vehicleDB, "+err);   
            }else{
                console.log("connected to stefanie-vehicleDB");   
                _db = client.db('stefanie-vehicleDB');  
                // if table already created, this code unused
                _db.createCollection("vehicle", function(err, res) {
                    if (err) throw err;
                });
                _db.createIndex("vehicle", {userName:1,vehicleType:1},function(err, res) {
                    if (err) throw err;
                });
            }
        } );
    },
    getDb: function() {
        return _db;
    },
    disconnectDB: function() {
        _db.close();
    } 

}