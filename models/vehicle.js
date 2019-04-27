var dbConn = require('../db');
var redis = require('../rdsCache');

module.exports = {
    getAllCached: function (req, result) {
        redis.get('*', function (err, reply) {
            if (err) {
                result(err, null);
            }
            else if (reply) {
                console.log('from redis');
                result(null,{ data: JSON.parse(reply) });
            }
            else {
                var _db = dbConn.getDb();
                _db.collection('vehicles').find().toArray(function (err, docs) {
                    if (err) {
                        result(err, null);
                    } else {
                        redis.set('*', JSON.stringify(docs), function () {
                            result(null,{ data: docs });
                        });
                    }
                });
            }
        })            
    },
    getAllByUserCache: function (req, result) {
        var q = req.userName;
        redis.get(q, function (err, reply) {
            if (err) {
                result(err, null);
            }
            else if (reply) {
                console.log('from redis');
                result(null,{ data: JSON.parse(reply) });
            }
            else {
                var _db = dbConn.getDb();
                _db.collection('vehicles').find(
                    {
                        userName: req.userName
                    }
                ).toArray(function (err, docs) {
                    if (err) {
                        result(err, null);
                    } else {
                        redis.set(q, JSON.stringify(docs), function () {
                            result(null, {data: docs} );
                        });
                    }
                });
                
            }
        })            
    },
    getAllByUserAndTypeCache: function (req, result) {
        var q = req.userName+'##'+req.vehicleType;
        redis.get(q, function (err, reply) {
            if (err) {
                result(err, null);
            }
            else if (reply) {
                console.log('from redis');
                result(null,{data: JSON.parse(reply) });
            }
            else {
                var _db = dbConn.getDb();
                _db.collection('vehicles').find(
                    {
                        userName: req.userName,
                        vehicleType: req.vehicleType
                    }
                ).toArray(function (err, docs) {
                    if (err) {
                        result(err, null);
                    } else {
                        redis.set(q, JSON.stringify(docs), function () {
                            result(null, {data: docs} );
                        });
                    }
                }) ;
            }
        })            
    },
    save: function (req, result) {
        var _db = dbConn.getDb();
        _db.collection("vehicles").insertOne(req,
            function (err, res) {
                if (err) {
                    result(err, null);
                } else {
                    syncToRedis(_db,req);
                    result(null, res.message.documents[0].ok);
                }
            }
        );
    },
    update: function (req, result) {
        var _db = dbConn.getDb();
        _db.collection("vehicles").updateOne(
            {
                userName: req.userName,
                vehicleType: req.vehicleType
            },
            { $set: req },
            function (err, res) {
                if (err) {
                    result(err, null);
                } else {
                    syncToRedis(_db,req);
                    result(null, res.message.documents[0].ok);
                }
            }
        );
    },
    deleteByUser: function (req, result) {
        var _db = dbConn.getDb();
        _db.collection("vehicles").deleteMany(
            { userName: req.userName },
            function (err, res) {
                if (err) {
                    result(err, null);
                } else {
                    syncToRedis(_db,req);
                    result(null, res.message.documents[0].ok);
                }
            }
        );
    },
    deleteOne: function (req, result) {
        var _db = dbConn.getDb();
        _db.collection("vehicles").deleteOne(
            {
                userName: req.userName,
                vehicleType: req.vehicleType
            },
            function (err, res) {
                if (err) {
                    result(err, null);
                } else {
                    syncToRedis(_db,req);
                    result(null, res.message.documents[0].ok);
                }
            }
        );
    },
    countVehicle: function (req, result) {
        var _db = dbConn.getDb();
        _db.collection('vehicles').find(
            {
                userName: req.userName,
                vehicleType: req.vehicleType
            }
        ).count(function (e, count) {
            result(e, count);
        });
    }

}

async function syncToRedis(_db,req){
    _db.collection('vehicles').find().toArray(function (err, docs) {
        if (err) {
            result(err, null);
        } else {
            redis.set('*', JSON.stringify(docs));
        }
    });
    _db.collection('vehicles').find(
        {
            userName: req.userName
        }
    ).toArray(function (err, docs) {
        if (err) {
            result(err, null);
        } else {
            var q=req.userName;
            redis.set(q, JSON.stringify(docs));
        }
    });
    _db.collection('vehicles').find(
        {
            userName: req.userName,
            vehicleType: req.vehicleType
        }
    ).toArray(function (err, docs) {
        if (err) {
            result(err, null);
        } else {
            var q= req.userName+'##'+req.vehicleType;
            redis.set(q, JSON.stringify(docs));
        }
    }) ;
}