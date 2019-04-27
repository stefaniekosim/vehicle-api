var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Vehicle=require('../models/vehicle');
const uuidv4 = require('uuid/v4');
var ValidateToken = require('./ValidateToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var vhc;
function setVehicle(req){
    vhc = {
        userName: req.body.userName,
        vehicleType: req.body.vehicleType,
        vehicleId: req.body.vehicleId
    };
}

// SELECT (with REDIS)
router.post('/findAll',ValidateToken,function(req,res,next){
    Vehicle.getAllCached(req ,function(err,result){
        if(err){
            res.status(500).send({ respCode: '99', message: 'Internal Server Error.' });
        }else{
            res.status(200).send({ respCode: '0', data: result.data });
        }
    });    
});
router.post('/findVhcByUser',ValidateToken,function(req,res,next){
    setVehicle(req);
    Vehicle.getAllByUserCache(vhc ,function(err,result){
        if(err){
            res.status(500).send({ respCode: '99', message: 'Internal Server Error.' });
        }else{
            res.status(200).send({ respCode: '0', data: result.data });
        }
    });    
});
router.post('/findVhcByUserAndType',ValidateToken,function(req,res,next){
    setVehicle(req);
    Vehicle.getAllByUserAndTypeCache(vhc ,function(err,result){
        if(err){
            res.status(500).send({ respCode: '99', message: 'Internal Server Error.' });
        }else{
            res.status(200).send({ respCode: '0', data: result.data });
        }
    });    
});

// ADD, UPDATE, DELETE (SYNC to REDIS)
router.post('/addVehicle',ValidateToken,function(req,res,next){  
    Vehicle.countVehicle(
        {
            userName: req.body.userName,
            vehicleType: req.body.vehicleType
        }, 
        function(err,result){
            if(err){
                res.status(500).send({ respCode: '99', message: 'Internal Server Error.' });
            }
            cnt = result;
            if(cnt == 0){
                setVehicle(req);
                vhc.id = uuidv4();
                Vehicle.save(vhc, function(err,result){
                    if(err){
                        res.status(500).send({ respCode: '99', message: 'Internal Server Error.' });
                    }else{
                        if(result == 1){
                            res.status(200).send({ respCode:'0', message: "Data succesfully saved." });
                        }else{
                            res.status(200).send({ respCode: '5', message: "Error Saving Data." });
                        }
                    }
                });
            }else{
                res.status(200).send({ respCode: '5', message:  "Data Already Exists." });
            }
        }
    );  
});

router.post('/editVehicle',ValidateToken,function(req,res,next){  
    Vehicle.countVehicle(
        {
            userName: req.body.userName,
            vehicleType: req.body.vehicleType
        }, 
        function(err,result){
            if(err){
                res.status(500).send({ respCode: '99', message: 'Internal Server Error.' });
            }
            cnt = result;
            if(cnt != 0){
                setVehicle(req);
                Vehicle.update(vhc, function(err,result){
                    if(err){
                        res.status(500).send({ respCode: '99', message: 'Internal Server Error.' });
                    }else{
                        if(result == 1){
                            res.status(200).send({ respCode:'0', message: "Data Succesfully Updated." });
                        }else{
                            res.status(200).send({ respCode: '5', message: "Error Update Data." });
                        }
                    }
                });
            }else{
                res.status(200).send({ respCode: '5', message:  "Data Not Found." });
            }
        }
    );  
});


router.post('/removeVehicle',ValidateToken,function(req,res,next){  
    Vehicle.countVehicle(
        {
            userName: req.body.userName,
            vehicleType: req.body.vehicleType
        }, 
        function(err,result){
            if(err){
                res.status(500).send({ respCode: '99', message: 'Internal Server Error.' });
            }
            cnt = result;
            if(cnt != 0){
                setVehicle(req);
                Vehicle.deleteOne(vhc, function(err,result){
                    if(err){
                        res.status(500).send({ respCode: '99', message: 'Internal Server Error.' });
                    }else{
                        if(result == 1){
                            res.status(200).send({ respCode:'0', message: "Data Succesfully Deleted." });
                        }else{
                            res.status(200).send({ respCode: '5', message: "Error Delete Data." });
                        }
                    }
                });
            }else{
                res.status(200).send({ respCode: '5', message:  "Data Not Exists." });
            }
        }
    );  
});

router.post('/removeVehicleByUser',ValidateToken,function(req,res,next){  
    Vehicle.countVehicle(
        {
            userName: req.body.userName,
            vehicleType: req.body.vehicleType
        }, 
        function(err,result){
            if(err){
                res.status(500).send({ respCode: '99', message: 'Internal Server Error.' });
            }
            cnt = result;
            if(cnt != 0){
                setVehicle(req);
                Vehicle.deleteByUser(vhc, function(err,result){
                    if(err){
                        res.status(500).send({ respCode: '99', message: 'Internal Server Error.' });
                    }else{
                        if(result == 1){
                            res.status(200).send({ respCode:'0', message: "Data Succesfully Deleted." });
                        }else{
                            res.status(200).send({ respCode: '5', message: "Error Deleting Data." });
                        }
                    }
                });
            }else{
                res.status(200).send({ respCode: '5', message:  "Data Not Found" });
            }
        }
    );  
});

module.exports=router;