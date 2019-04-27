var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
var _db;

module.exports = {
    connectToServer: function() {
        MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
            if(err){
                console.log("can't connect to stefanieDB");   
            }else{
                console.log("connected to stefanieDB");   
                _db = client.db('stefanieDB');  
                // if table already created, this code unused
                _db.createCollection("vehicle", function(err, res) {
                    if (err) throw err;
                    console.log("Collection created!");
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